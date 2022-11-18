import { Box, Center, Flex, Spinner } from "@chakra-ui/react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import produce from "immer";
import { memo, useCallback, useState } from "react";
import {
  LookUpReorderedColumn,
  SetTaskState,
  SortBy,
  TaskList,
  TaskState,
  UndeterminedColumns,
  UpdateTasksPositionDTO,
} from "../../types";
import { useLocalTasks } from "../../useLocalState/useLocalState";
import { newEventDTO } from "../../utils/createNewEvent";
import { isDueDateColumns } from "../../utils/determineColumns";
import {
  getExpectedDueDateFromDueDateColumn,
  getLookUpReorderedColumnTable,
} from "./actions/taskProcessing";
import Column from "./Column";
import AddStatusColumn from "./customStatusColumn/AddStatusColumn";

type Props = {
  sortBy: SortBy;
};

export default memo(function TaskBoardView({ sortBy }: Props) {
  //   const { state, loading, error, setState } = useFetchTasks(sortBy);
  const { state: taskState, loading, setState } = useLocalTasks(sortBy);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  console.log(taskState);

  const memHandleDragEnd = useCallback(
    (result: DropResult, state: TaskState) => {
      handleDragEnd(result, state, setState, sortBy);
    },
    [taskState, sortBy]
  );

  if (!taskState || loading)
    return (
      <Center>
        <Spinner />
      </Center>
    );

  const selectedColumns = taskState.columnOptions[`${sortBy}Columns`];

  return (
    <Box px={6} overflowY={"auto"} mr={3}>
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
                  state={taskState}
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
                setState={setState}
                statusColumns={taskState.columnOptions.statusColumns}
              />
            </Box>
          )}
        </Flex>
      </DragDropContext>
    </Box>
  );
});

async function handleDragEnd(
  result: DropResult,
  state: TaskState,
  setState: SetTaskState,
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
  const isDueDateColumn = sortBy === SortBy.DUE_DATE;
  const currentColumns = state.columnOptions[
    `${sortBy}Columns`
  ] as UndeterminedColumns;

  const lookUpColumnId: LookUpReorderedColumn = {};
  const isColumnReordered = sortBy !== SortBy.PRIORITY;
  if (isColumnReordered) {
    getLookUpReorderedColumnTable(
      state.orderedTasks,
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

  const sourceTaskColumn = currentColumns.find(
    (column) => column.id === sourceColumnId
  );
  const sourceTaskColumnIndex = currentColumns.findIndex(
    (column) => column.id === sourceColumnId
  );
  const destinationTaskColumn = currentColumns.find(
    (column) => column.id === destinationColumnId
  );
  const destinationTaskColumnIndex = currentColumns.findIndex(
    (column) => column.id === destinationColumnId
  );

  setState(
    produce(state, (draftState) => {
      const taskListForUpdate: TaskList = [];
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
          taskListForUpdate.push(sourceTaskBefore);
        }

        // move down one row
        else if (moveDownOneRow) {
          // swap orderIndex
          const sourceTaskAfterOrderIndex = sourceTaskAfter[sortBy].orderIndex;
          sourceTaskAfter[sortBy].orderIndex = sourceTask[sortBy].orderIndex;
          sourceTask[sortBy].orderIndex = sourceTaskAfterOrderIndex;
          taskListForUpdate.push(sourceTaskAfter);
        }

        // move up or down multiple rows
        else {
          // move down
          const isMoveDown = sourceTaskIndex < destinationTaskIndex;
          if (isMoveDown) {
            handleMoveDownMultipleRows(
              sourceTasksArr.taskList,
              sortBy,
              sourceTaskIndex,
              destinationTaskIndex,
              taskListForUpdate
            );
          }

          // move up
          else {
            handleMoveUpMultipleRows(
              sourceTasksArr.taskList,
              sortBy,
              sourceTaskIndex,
              destinationTaskIndex,
              taskListForUpdate
            );
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
        sourceTask.taskEvents = newEventDTO(
          sourceTask.id!,
          sortBy,
          sourceColumnId,
          destinationColumnId
        );
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

          insertTask(
            destinationTasksArr.taskList,
            sortBy,
            destination.index,
            destinationTasksArrLength,
            taskListForUpdate
          );
        }

        sourceTasksArr.taskList.splice(source.index, 1); // delete original
        destinationTasksArr.taskList.splice(destination.index, 0, sourceTask); // insert original to new place
      }

      taskListForUpdate.push(sourceTask);
      const updateTaskListDTO: UpdateTasksPositionDTO = {
        sourceTaskId: sourceTask.id!,
        taskDtoList: taskListForUpdate,
      };
      //   updateTasksPosition(updateTaskListDTO);
      // Clear events from state task
      sourceTask.taskEvents = [];
    })
  );
}

function insertTask(
  taskList: TaskList,
  sortBy: SortBy,
  targetIndex: number,
  targetTasksArrLength: number,
  taskListForUpdate: TaskList
) {
  // increase all tasks orderIndex after targetIndex position
  for (let i = targetIndex; i < targetTasksArrLength; i++) {
    const item = taskList[i];
    item[sortBy].orderIndex = item[sortBy].orderIndex + 1;
    taskListForUpdate.push(item);
  }

  return { taskList, taskListForUpdate };
}

function handleMoveUpMultipleRows(
  taskList: TaskList,
  sortBy: SortBy,
  sourceIndex: number,
  targetIndex: number,
  taskListForUpdate: TaskList
) {
  const sourceItem = taskList[sourceIndex];
  const targetItem = taskList[targetIndex];
  const targetItemPosition = targetItem[sortBy].orderIndex;

  for (let i = targetIndex; i < sourceIndex; i++) {
    const item = taskList[i];
    const itemAfter = taskList[i + 1];
    item[sortBy].orderIndex = itemAfter[sortBy].orderIndex;
    taskListForUpdate.push(item);
  }
  sourceItem[sortBy].orderIndex = targetItemPosition;

  return { taskList, taskListForUpdate };
}

function handleMoveDownMultipleRows(
  taskList: TaskList,
  sortBy: SortBy,
  sourceIndex: number,
  targetIndex: number,
  taskListForUpdate: TaskList
) {
  const sourceItem = taskList[sourceIndex];
  const targetItem = taskList[targetIndex];
  const targetItemPosition = targetItem[sortBy].orderIndex;

  const positions: number[] = [];
  for (const item of taskList) {
    positions.push(item[sortBy].orderIndex);
  }

  for (let i = sourceIndex; i < targetIndex + 1; i++) {
    const item = taskList[i];
    const itemBeforeIndex = positions[i - 1];
    item[sortBy].orderIndex = itemBeforeIndex;
    if (item.id !== sourceItem.id) taskListForUpdate.push(item);
  }
  sourceItem[sortBy].orderIndex = targetItemPosition;

  return { taskList, taskListForUpdate };
}

/* 
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
