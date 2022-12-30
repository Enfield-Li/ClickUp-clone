import { Box, Center, Flex, Spinner } from "@chakra-ui/react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import produce from "immer";
import { memo, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { TASK_BOARD_PARAM } from "../../constant";
import { useFetchTasks } from "../../hook/useFetch";
import { updateTasksPosition } from "../../networkCalls";
import {
  LookUpReorderedColumn,
  SetTaskState,
  SortBy,
  Task,
  TaskPositionDTO,
  TaskPositionDTOList,
  TaskState,
  UndeterminedColumns,
  UpdateEvent,
  UpdateTasksPositionDTO,
} from "../../types";
import { newEventDTO } from "../../utils/createNewEvent";
import { isDueDateColumns } from "../../utils/determineColumns";
import {
  getExpectedDueDateFromDueDateColumn,
  getLookUpReorderedColumnTable,
} from "./actions/taskProcessing";
import Column from "./Column";
import CreateListPanel from "./panel/CreateListPanel";
import AddStatusColumn from "./customStatusColumn/AddStatusColumn";
import CreateSpacePanel from "./panel/CreateSpacePanel";

type Props = {
  sortBy: SortBy;
};

export default memo(TaskBoardView);
function TaskBoardView({ sortBy }: Props) {
  const param = useParams();
  const selectedListId = Number(param[TASK_BOARD_PARAM]);
  const { taskState, loading, error, setTaskState } = useFetchTasks({
    sortBy,
    selectedListId,
  });
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  //   console.log(taskState);

  const memHandleDragEnd = useCallback(
    (result: DropResult, taskState: TaskState) => {
      handleDragEnd(result, taskState, setTaskState, sortBy);
    },
    [taskState, sortBy]
  );

  if (!selectedListId) {
    return (
      <Center height="50vh">
        <CreateSpacePanel />
      </Center>
    );
  }

  if (loading)
    return (
      <Center>
        <Spinner />
      </Center>
    );

  if (!taskState)
    return (
      <Center flexGrow={1} mt="-60px">
        <CreateListPanel />
      </Center>
    );

  const selectedColumns = taskState.columnOptions[`${sortBy}Columns`];

  return (
    <Box px={6} overflowY="auto" mr={3} pt="3">
      <DragDropContext
        onDragEnd={(result) => memHandleDragEnd(result, taskState)}
      >
        <Flex>
          {/* Columns and tasks */}
          {selectedColumns.map((currentColumn, index) => {
            const taskListForCurrentColumn = taskState.orderedTasks.find(
              (orderedTask) => orderedTask.columnId === currentColumn.id
            )?.taskList;

            return (
              <Box key={currentColumn.id} borderRadius={4}>
                <Column
                  taskState={taskState}
                  currentColumn={currentColumn}
                  // Pass down list as per column.id
                  taskList={taskListForCurrentColumn}
                  isCreateTaskOpen={isCreateTaskOpen}
                  setIsCreateTaskOpen={setIsCreateTaskOpen}
                />
              </Box>
            );
          })}

          {/* Add column in status */}
          {sortBy === SortBy.STATUS && (
            <Box mx={2}>
              <AddStatusColumn
                setTaskState={setTaskState}
                statusColumns={taskState.columnOptions.statusColumns}
              />
            </Box>
          )}
        </Flex>
      </DragDropContext>
    </Box>
  );
}

async function handleDragEnd(
  result: DropResult,
  taskState: TaskState,
  setTaskState: SetTaskState,
  sortBy: SortBy
) {
  const { destination, source } = result;
  if (
    !destination ||
    (destination.droppableId === source.droppableId &&
      destination.index === source.index)
  ) {
    return;
  }
  const currentColumns = taskState.columnOptions[
    `${sortBy}Columns`
  ] as UndeterminedColumns;

  const lookUpColumnId: LookUpReorderedColumn = {};
  const isColumnReordered = sortBy !== SortBy.PRIORITY;
  if (isColumnReordered) {
    getLookUpReorderedColumnTable(
      taskState.orderedTasks,
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

  const sourceTaskColumnIndex = currentColumns.findIndex(
    (column) => column.id === sourceColumnId
  );
  const destinationTaskColumn = currentColumns.find(
    (column) => column.id === destinationColumnId
  );
  const destinationTaskColumnIndex = currentColumns.findIndex(
    (column) => column.id === destinationColumnId
  );

  setTaskState(
    produce(taskState, (draftState) => {
      const taskListForUpdate: TaskPositionDTOList = [];
      const sourceTasksArr = draftState.orderedTasks[sourceTaskColumnIndex];
      const destinationTasksArr =
        draftState.orderedTasks[destinationTaskColumnIndex];
      const destinationTasksArrLength = destinationTasksArr?.taskList.length;
      const lastTaskInDestinationTasksArr =
        destinationTasksArr?.taskList[destinationTasksArrLength - 1];

      const sourceTask = sourceTasksArr.taskList[source.index];
      const sourceTaskBefore = sourceTasksArr.taskList[source.index - 1];
      const sourceTaskAfter = sourceTasksArr.taskList[source.index + 1];
      const sourceTaskIndex = sourceTasksArr.taskList.findIndex(
        (task) => task.id === sourceTask.id
      );

      const destinationTask = destinationTasksArr.taskList[destination.index];
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
            sourceTaskBefore[sortBy].orderIndex;
          sourceTaskBefore[sortBy].orderIndex = sourceTask[sortBy].orderIndex;
          sourceTask[sortBy].orderIndex = sourceTaskBeforeOrderIndex;
          taskListForUpdate.push(newTaskPositionDTO(sourceTaskBefore, sortBy));
        }

        // move down one row
        else if (moveDownOneRow) {
          // swap orderIndex
          const sourceTaskAfterOrderIndex = sourceTaskAfter[sortBy].orderIndex;
          sourceTaskAfter[sortBy].orderIndex = sourceTask[sortBy].orderIndex;
          sourceTask[sortBy].orderIndex = sourceTaskAfterOrderIndex;
          taskListForUpdate.push(newTaskPositionDTO(sourceTaskAfter, sortBy));
        }

        // move up or down multiple rows
        else {
          // move down
          const isMoveDown = sourceTaskIndex < destinationTaskIndex;
          if (isMoveDown) {
            const taskList = sourceTasksArr.taskList;
            const sourceItem = taskList[sourceTaskIndex];
            const targetItem = taskList[destinationTaskIndex];
            const targetItemPosition = targetItem[sortBy].orderIndex;

            const taskListOrderIndex: number[] = [];
            for (const task of taskList) {
              taskListOrderIndex.push(task[sortBy].orderIndex);
            }

            for (let i = sourceTaskIndex; i < destinationTaskIndex + 1; i++) {
              const task = taskList[i];
              const taskBeforeOrderIndex = taskListOrderIndex[i - 1];
              task[sortBy].orderIndex = taskBeforeOrderIndex;
              if (task.id !== sourceItem.id) {
                taskListForUpdate.push(newTaskPositionDTO(task, sortBy));
              }
            }
            sourceItem[sortBy].orderIndex = targetItemPosition;
          }

          // move up
          else {
            const taskList = sourceTasksArr.taskList;

            const sourceItem = taskList[sourceTaskIndex];
            const targetItem = taskList[destinationTaskIndex];
            const targetItemPosition = targetItem[sortBy].orderIndex;

            // increase all tasks in between sourceTask and targetTask
            for (let i = destinationTaskIndex; i < sourceTaskIndex; i++) {
              const task = taskList[i];
              const taskAfter = taskList[i + 1];
              task[sortBy].orderIndex = taskAfter[sortBy].orderIndex;
              taskListForUpdate.push(newTaskPositionDTO(task, sortBy));
            }
            sourceItem[sortBy].orderIndex = targetItemPosition;
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
            sortBy,
            sourceColumnId,
            destinationColumnId
          ),
        ];
        // Change column
        sourceTask[sortBy].columnId = destinationColumnId;
        sourceTask[sortBy].name = destinationTaskColumn!.title;

        // Modify task.expectedDueDate
        if (
          destinationTaskColumn &&
          isDueDateColumns(destinationTaskColumn, sortBy)
        ) {
          sourceTask.expectedDueDate = getExpectedDueDateFromDueDateColumn(
            destinationTaskColumn
          );
        }

        // move to an empty column or to the last position
        if (!destinationTask) {
          sourceTask[sortBy].orderIndex = lastTaskInDestinationTasksArr
            ? lastTaskInDestinationTasksArr[sortBy].orderIndex + 1
            : 1;
        }

        // move to the middle or top of the column
        else {
          sourceTask[sortBy].orderIndex = destinationTask[sortBy].orderIndex;

          const taskList = destinationTasksArr.taskList;
          const targetIndex = destination.index;

          // increase all tasks orderIndex after targetIndex position
          for (let i = targetIndex; i < destinationTasksArrLength; i++) {
            const item = taskList[i];
            item[sortBy].orderIndex = item[sortBy].orderIndex + 1;
            taskListForUpdate.push(newTaskPositionDTO(item, sortBy));
          }
        }

        sourceTasksArr.taskList.splice(source.index, 1); // delete original
        destinationTasksArr.taskList.splice(destination.index, 0, sourceTask); // insert original to new place
      }

      taskListForUpdate.push(newTaskPositionDTO(sourceTask, sortBy));
      const updateTaskListDTO: UpdateTasksPositionDTO = {
        sourceTaskId: sourceTask.id!,
        taskDtoList: taskListForUpdate,
      };
      updateTasksPosition(updateTaskListDTO);
    })
  );
}

function newTaskPositionDTO(task: Task, sortBy: SortBy): TaskPositionDTO {
  const lastUpdateEvent = task.taskEvents[0] as UpdateEvent;

  const taskPositionDto: TaskPositionDTO = {
    taskId: task.id!,
    expectedDueDate: task.expectedDueDate,
    updateEvent: lastUpdateEvent,
  };

  if (sortBy === SortBy.STATUS) {
    taskPositionDto[sortBy] = task[sortBy];
  }
  if (sortBy === SortBy.DUE_DATE) {
    taskPositionDto[sortBy] = task[sortBy];
  }
  if (sortBy === SortBy.PRIORITY) {
    taskPositionDto[sortBy] = task[sortBy];
  }
  //   taskPositionDto[sortBy] = task[sortBy];

  return taskPositionDto;
}

/* 
// minimal product
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
