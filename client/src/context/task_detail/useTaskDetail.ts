import produce from "immer";
import { create } from "zustand";
import { initColumns } from "../../component/task/actions/columnProcessing";
import {
  OrderIndexInColumn,
  findTheLastOrderIndexInColumn,
} from "../../component/task/actions/createNewTask";
import {
  collectAllTasks,
  getExpectedDueDateFromDueDateColumn,
  getLookUpReorderedColumnTable,
  groupTaskListOnGroupBy,
  initTaskMissingField,
  processTaskList,
} from "../../component/task/actions/taskProcessing";
import { updateTasksPosition } from "../../networkCalls";
import {
  ColumnOptions,
  GroupBy,
  InitTaskStateArgType,
  Task,
  TaskState,
  TaskPositionDTOList,
  TaskStateContext,
  LookUpReorderedColumn,
  UpdateTasksPositionDTO,
  DragTaskArgType,
  UndeterminedColumns,
  AddColumnArgType,
  UpdateEvent,
  UpdateTaskAttributeArgType,
  TaskPositionDTO,
  AddTaskArgType,
  UpdateColumnTitleArgType,
} from "../../types";
import { newEventDTO } from "../../utils/createNewEvent";
import { deepCopy } from "../../utils/deepCopy";
import { isDueDateColumns } from "../../utils/determineColumns";
import { getRandomNumberNoLimit } from "../../utils/getRandomNumber";
import { newTaskPositionDTO } from "../../utils/newTaskPositionDTO";
import { defaultColumnOptions } from "../../utils/staticColumnsData";

interface TaskDetailContextType {
  loading: boolean;
  task: Task | null;
  isCreatingTask: boolean;
  taskState: TaskState | null;
  taskStateContext: TaskStateContext | null;

  selectTask: (task: Task) => void;
  setCreatingTask: (isCreating: boolean) => void;
  updateTaskStateContext: (groupBy: GroupBy) => void;
  initTaskStateContext: (param: InitTaskStateArgType) => void;
  dragTask: (param: DragTaskArgType) => void;
  addColumn: (param: AddColumnArgType) => void;
  updateTaskAttribute: (param: UpdateTaskAttributeArgType) => void;
  updateColumnTitle: (param: UpdateColumnTitleArgType) => void;
  addTask: (param: AddTaskArgType) => void;
  removeTask: (taskId: number) => void;
  updateTitle: (newTitle: string) => void;
}

export const useTaskDetail = create<TaskDetailContextType>()((set) => ({
  task: null,
  loading: true,
  taskState: null,
  isCreatingTask: false,
  taskStateContext: null,

  setCreatingTask: (isCreating) =>
    set((state) =>
      produce(state, (draftState) => {
        draftState.isCreatingTask = isCreating;
      })
    ),
  selectTask: (task) =>
    set((state) =>
      produce(state, (draftState) => {
        draftState.task = task;
      })
    ),
  updateTitle: (newTitle) =>
    set((state) =>
      produce(state, (draftState) => {
        if (draftState.taskState) {
          draftState.taskState.orderedTasks.forEach((tasks) =>
            tasks.taskList.forEach(
              (task) => task.id === task.id && (task.title = newTitle)
            )
          );
        }
      })
    ),
  removeTask: (taskId) =>
    set((state) =>
      produce(state, (draftState) => {
        if (draftState.taskState) {
          draftState.taskState.orderedTasks.forEach((orderedTask) =>
            orderedTask.taskList.forEach(
              (task, index, arr) => task.id === taskId && arr.splice(index, 1)
            )
          );
        }
      })
    ),
  updateColumnTitle: ({ newTitle, titleInput, currentColumn }) =>
    set((state) =>
      produce(state, (draftState) => {
        if (draftState.taskState) {
          draftState.taskState.columnOptions.statusColumns.forEach((column) =>
            column.id === currentColumn?.id && newTitle !== column.title
              ? titleInput && (column.title = titleInput)
              : column
          );
        }
      })
    ),
  addTask: ({
    groupBy,
    priority,
    createdTask,
    currentColumn,
    dueDateColumn,
    dueDateColumnId,
  }) =>
    set((state) =>
      produce(state, (draftState) => {
        if (draftState.taskState) {
          draftState.taskState.orderedTasks.forEach((orderedTask) => {
            const targetColumnId =
              groupBy === GroupBy.DUE_DATE
                ? dueDateColumnId
                : groupBy === GroupBy.PRIORITY
                ? priority
                : currentColumn.id;

            const isCurrentColumn = orderedTask.columnId === targetColumnId;
            if (isCurrentColumn && createdTask) {
              const task = initTaskMissingField(createdTask, dueDateColumn);
              orderedTask.taskList.push(task);
            }
          });
        }
        //
      })
    ),
  updateTaskAttribute: ({
    userId,
    groupBy,
    targetField,
    currentTask,
    targetColumnId,
    expectedDueDate,
  }) =>
    set((state) =>
      produce(state, (draftState) => {
        if (draftState.taskState) {
          const updateTaskListDTO: UpdateTasksPositionDTO = {
            sourceTaskId: 0,
            taskDtoList: [],
          };

          const { orderIndex, columnName }: OrderIndexInColumn =
            findTheLastOrderIndexInColumn(
              targetField,
              targetColumnId,
              draftState.taskState
            );

          draftState.taskState.orderedTasks.forEach((orderedTask) => {
            orderedTask.taskList.forEach((task, index, taskList) => {
              const isNewEvent =
                targetField === GroupBy.DUE_DATE ||
                task[targetField].columnId !== targetColumnId;

              if (task.id === currentTask.id && isNewEvent) {
                if (expectedDueDate !== undefined) {
                  task.expectedDueDate = expectedDueDate;
                }

                const newTaskEvent = newUpdateEvent(
                  userId,
                  task.id!,
                  targetField,
                  task[targetField].columnId,
                  targetColumnId
                );

                if (!task.taskEvents) task.taskEvents = [];
                task.taskEvents.push(newTaskEvent);

                task[targetField].name = columnName;
                task[targetField].orderIndex = orderIndex;
                task[targetField].columnId = targetColumnId;

                const updateTaskPositionDTO: TaskPositionDTO =
                  newTaskPositionDTO(task, targetField);
                updateTaskListDTO.sourceTaskId = task.id!;
                updateTaskListDTO.taskDtoList = deepCopy([
                  updateTaskPositionDTO,
                ]);

                // move task to targetColumn and delete from original column
                if (groupBy === targetField && draftState.taskState) {
                  taskList.splice(index, 1);
                  draftState.taskState.orderedTasks.forEach((orderedTask) => {
                    if (orderedTask.columnId === targetColumnId) {
                      orderedTask.taskList.push(task);
                    }
                  });
                }
              }
            });
          });

          updateTasksPosition(updateTaskListDTO);
        }
      })
    ),
  addColumn: ({
    dto,
    responseDTO,
    lastItemIndex,
    storedDefaultCategoryId,
    updateStoredDefaultCategoryId,
  }) =>
    set((state) =>
      produce(state, (draftState) => {
        if (draftState.taskState) {
          const {
            statusColumnId: newStatusColumnId,
            statusCategoryId: updatedStatusCategoryId,
            oldNewStatusPairs,
          } = responseDTO;

          const newStatusColumn = { ...dto, id: newStatusColumnId };
          draftState.taskState.statusCategoryId = updatedStatusCategoryId;
          // Create new column before the last one "Done"
          draftState.taskState.columnOptions.statusColumns.splice(
            lastItemIndex,
            0,
            newStatusColumn
          );

          if (storedDefaultCategoryId !== updatedStatusCategoryId) {
            updateStoredDefaultCategoryId(updatedStatusCategoryId);
          }
          if (oldNewStatusPairs) {
            draftState.taskState.columnOptions.statusColumns.forEach(
              (column) => {
                if (oldNewStatusPairs[column.id!]) {
                  column.id = oldNewStatusPairs[column.id!];
                }
              }
            );
            draftState.taskState.orderedTasks.forEach((orderedTask) => {
              orderedTask.columnId = oldNewStatusPairs[orderedTask.columnId];
              orderedTask.taskList.forEach((task) => {
                task.status.columnId = oldNewStatusPairs[task.status.columnId];
              });
            });
          }
        }
      })
    ),
  dragTask: ({ groupBy, result }) =>
    set((state) =>
      produce(state, (draftState) => {
        const { destination, source } = result;
        if (
          !destination ||
          (destination.droppableId === source.droppableId &&
            destination.index === source.index)
        ) {
          return;
        }

        if (draftState.taskState) {
          const currentColumns = draftState.taskState.columnOptions[
            `${groupBy}Columns`
          ] as UndeterminedColumns;

          const lookUpColumnId: LookUpReorderedColumn = {};
          const isColumnReordered = groupBy === GroupBy.DUE_DATE;
          if (isColumnReordered) {
            getLookUpReorderedColumnTable(
              draftState.taskState.orderedTasks,
              currentColumns,
              lookUpColumnId
            );
          }

          const sourceColumnId = isColumnReordered
            ? lookUpColumnId[Number(source.droppableId)]
            : Number(source.droppableId);
          const destinationColumnId = isColumnReordered
            ? lookUpColumnId[Number(destination.droppableId)]
            : Number(destination.droppableId);

          const destinationTaskColumn = currentColumns.find(
            (column) => column.id === destinationColumnId
          );

          const taskListForUpdate: TaskPositionDTOList = [];
          const sourceTasksArr = draftState.taskState.orderedTasks.find(
            (orderedTask) => orderedTask.columnId === sourceColumnId
          )!;

          const destinationTasksArr = draftState.taskState.orderedTasks.find(
            (orderedTask) => orderedTask.columnId === destinationColumnId
          )!;

          const destinationTasksArrLength =
            destinationTasksArr?.taskList.length;
          const lastTaskInDestinationTasksArr =
            destinationTasksArr?.taskList[destinationTasksArrLength - 1];

          const sourceTask = sourceTasksArr.taskList[source.index];
          const sourceTaskBefore = sourceTasksArr.taskList[source.index - 1];
          const sourceTaskAfter = sourceTasksArr.taskList[source.index + 1];
          const sourceTaskIndex = sourceTasksArr.taskList.findIndex(
            (task) => task.id === sourceTask.id
          );

          const destinationTask =
            destinationTasksArr.taskList[destination.index];
          const destinationTaskBefore =
            destinationTasksArr.taskList[destination.index - 1];
          const destinationTaskAfter =
            destinationTasksArr.taskList[destination.index + 1];
          const destinationTaskIndex = sourceTasksArr.taskList.findIndex(
            (task) => task.id === destinationTask?.id
          );

          /*
           * Drop in the same column
           */
          const isDropInTheSameColumn =
            source.droppableId === destination.droppableId;
          if (isDropInTheSameColumn) {
            const moveUpOneRow =
              sourceTaskBefore === destinationTask &&
              destinationTaskAfter === sourceTask;
            const moveDownOneRow =
              sourceTaskAfter === destinationTask &&
              destinationTaskBefore === sourceTask;

            // move up one row
            if (moveUpOneRow) {
              // swap orderIndex
              const sourceTaskBeforeOrderIndex =
                sourceTaskBefore[groupBy].orderIndex;
              sourceTaskBefore[groupBy].orderIndex =
                sourceTask[groupBy].orderIndex;
              sourceTask[groupBy].orderIndex = sourceTaskBeforeOrderIndex;
              taskListForUpdate.push(
                newTaskPositionDTO(sourceTaskBefore, groupBy)
              );
            }

            // move down one row
            else if (moveDownOneRow) {
              // swap orderIndex
              const sourceTaskAfterOrderIndex =
                sourceTaskAfter[groupBy].orderIndex;
              sourceTaskAfter[groupBy].orderIndex =
                sourceTask[groupBy].orderIndex;
              sourceTask[groupBy].orderIndex = sourceTaskAfterOrderIndex;
              taskListForUpdate.push(
                newTaskPositionDTO(sourceTaskAfter, groupBy)
              );
            }

            // move up or down multiple rows
            else {
              // move down
              const isMoveDown = sourceTaskIndex < destinationTaskIndex;
              if (isMoveDown) {
                const taskList = sourceTasksArr.taskList;
                const sourceItem = taskList[sourceTaskIndex];
                const targetItem = taskList[destinationTaskIndex];
                const targetItemPosition = targetItem[groupBy].orderIndex;

                const taskListOrderIndex: number[] = [];
                for (const task of taskList) {
                  taskListOrderIndex.push(task[groupBy].orderIndex);
                }

                for (
                  let i = sourceTaskIndex;
                  i < destinationTaskIndex + 1;
                  i++
                ) {
                  const task = taskList[i];
                  const taskBeforeOrderIndex = taskListOrderIndex[i - 1];
                  task[groupBy].orderIndex = taskBeforeOrderIndex;
                  if (task.id !== sourceItem.id) {
                    taskListForUpdate.push(newTaskPositionDTO(task, groupBy));
                  }
                }
                sourceItem[groupBy].orderIndex = targetItemPosition;
              }

              // move up
              else {
                const taskList = sourceTasksArr.taskList;

                const sourceItem = taskList[sourceTaskIndex];
                const targetItem = taskList[destinationTaskIndex];
                const targetItemPosition = targetItem[groupBy].orderIndex;

                // increase all tasks in between sourceTask and targetTask
                for (let i = destinationTaskIndex; i < sourceTaskIndex; i++) {
                  const task = taskList[i];
                  const taskAfter = taskList[i + 1];
                  task[groupBy].orderIndex = taskAfter[groupBy].orderIndex;
                  taskListForUpdate.push(newTaskPositionDTO(task, groupBy));
                }
                sourceItem[groupBy].orderIndex = targetItemPosition;
              }
            }

            sourceTasksArr.taskList.splice(source.index, 1); // delete original
            sourceTasksArr.taskList.splice(destination.index, 0, sourceTask); // insert original to new place
          } else {
            /*
             * Drop in a different column
             */
            // Override all previous update events
            // So as to keep the event consistent when submitting to server
            sourceTask.taskEvents = [
              newEventDTO(
                sourceTask.id!,
                groupBy,
                sourceColumnId,
                destinationColumnId
              ),
            ];
            // Change column
            sourceTask[groupBy].columnId = destinationColumnId;
            sourceTask[groupBy].name = destinationTaskColumn!.title;

            // Modify task.expectedDueDate
            if (
              destinationTaskColumn &&
              isDueDateColumns(destinationTaskColumn, groupBy)
            ) {
              sourceTask.expectedDueDate = getExpectedDueDateFromDueDateColumn(
                destinationTaskColumn
              );
            }

            // move to an empty column or to the last position
            if (!destinationTask) {
              sourceTask[groupBy].orderIndex = lastTaskInDestinationTasksArr
                ? lastTaskInDestinationTasksArr[groupBy].orderIndex + 1
                : 1;
            }

            // move to the middle or top of the column
            else {
              sourceTask[groupBy].orderIndex =
                destinationTask[groupBy].orderIndex;

              const taskList = destinationTasksArr.taskList;
              const targetIndex = destination.index;

              // increase all tasks orderIndex after targetIndex position
              for (let i = targetIndex; i < destinationTasksArrLength; i++) {
                const item = taskList[i];
                item[groupBy].orderIndex = item[groupBy].orderIndex + 1;
                taskListForUpdate.push(newTaskPositionDTO(item, groupBy));
              }
            }

            sourceTasksArr.taskList.splice(source.index, 1); // delete original
            destinationTasksArr.taskList.splice(
              destination.index,
              0,
              sourceTask
            ); // insert original to new place
          }

          taskListForUpdate.push(newTaskPositionDTO(sourceTask, groupBy));
          const updateTaskListDTO: UpdateTasksPositionDTO = {
            sourceTaskId: sourceTask.id!,
            taskDtoList: taskListForUpdate,
          };
          updateTasksPosition(updateTaskListDTO);
        }
      })
    ),
  updateTaskStateContext: (groupBy) =>
    set((state) =>
      produce(state, (draftState) => {
        if (!draftState.taskState || !draftState.taskStateContext) {
          return;
        }
        draftState.loading = true;
        draftState.taskStateContext.groupBy = groupBy;

        draftState.taskState.orderedTasks = groupTaskListOnGroupBy(
          collectAllTasks(draftState.taskState.orderedTasks),
          draftState.taskState.columnOptions[`${groupBy}Columns`],
          groupBy
        );

        draftState.loading = false;
      })
    ),
  initTaskStateContext: ({ networkData, groupBy, statusCategoryId, listId }) =>
    set((state) =>
      produce(state, (draftState) => {
        const {
          taskList: taskListData,
          statusCategory: { statusColumns },
        } = networkData;
        const { dueDateColumns, priorityColumns } = defaultColumnOptions;

        const allColumns: ColumnOptions = {
          dueDateColumns,
          priorityColumns,
          statusColumns,
        };

        const { reorderedDueDateColumns, reorderedStatusColumns } =
          initColumns(allColumns);

        const columnOptions: ColumnOptions = {
          ...allColumns,
          dueDateColumns: reorderedDueDateColumns,
          statusColumns: reorderedStatusColumns,
        };

        // init taskEvents and convert expectedDueDate to dueDate columns
        const taskList = processTaskList(reorderedDueDateColumns, taskListData);

        const orderedTasks = groupTaskListOnGroupBy(
          taskList,
          allColumns[`${groupBy}Columns`],
          groupBy
        );

        draftState.taskStateContext = {
          columnOptions,
          groupBy,
          currentListId: listId,
        };
        draftState.taskState = {
          orderedTasks,
          columnOptions,
          statusCategoryId,
        };
        draftState.loading = false;
      })
    ),
}));

function newUpdateEvent(
  userId: number,
  taskId: number,
  field: GroupBy,
  beforeUpdate: number,
  afterUpdate: number
): UpdateEvent {
  return {
    id: getRandomNumberNoLimit(),
    userId,
    taskId,
    field,
    beforeUpdate: String(beforeUpdate),
    afterUpdate: String(afterUpdate),
    createdAt: new Date(),
  };
}

/* 
// Drag task minimal product
    type Item = { id: number; position: number };

    const arr: Item[] = [
    { id: 11, position: 1 },
    { id: 22, position: 2 },
    { id: 33, position: 3 },
    { id: 44, position: 4 },
    { id: 55, position: 5 },
    ];

    function processMoveUpMultipleRows(arr: Item[]) {
    const sourceIndex = 3;
    const targetIndex = 1;

    const sourceItem = arr[sourceIndex];
    const targetItem = arr[targetIndex];
    const targetItemPosition = targetItem.position;

    for (let i = targetIndex; i < sourceIndex; i++) {
        const item = arr[i];
        const itemAfter = arr[i + 1];
        item.position = itemAfter.position;
    }
    sourceItem.position = targetItemPosition;

    }
    processMoveUpMultipleRows(arr);

    function processMoveDownMultipleRows(arr: Item[]) {
    const sourceIndex = 0;
    const targetIndex = 4;

    const sourceItem = arr[sourceIndex];
    const targetItem = arr[targetIndex];
    const targetItemPosition = targetItem.position;

    const positions: number[] = [];
    for (const item of arr) {
        positions.push(item.position);
    }

    for (let i = sourceIndex; i < targetIndex + 1; i++) {
        const item = arr[i];
        const itemBeforeIndex = positions[i - 1];
        item.position = itemBeforeIndex;
    }
    sourceItem.position = targetItemPosition;

    }
    processMoveDownMultipleRows(arr);

 */
