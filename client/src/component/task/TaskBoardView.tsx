import { Box, Center, Flex, Spinner } from "@chakra-ui/react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import produce from "immer";
import { memo, useCallback, useState } from "react";
import {
  LookUpReorderedColumn,
  SetTaskState,
  SortBy,
  TaskState,
  TargetColumnAndId,
  TaskList,
  UpdateTasksPositionDTO,
} from "../../types";
import { useLocalTasks } from "../../useLocalState/useLocalState";
import { getNewEventDTO } from "../../utils/createNewEvent";
import { updateTasksPosition } from "./actions/networkActions";
import {
  getLookUpReorderedColumnTable,
  updatePreviousIdsInColumn,
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
            // Task marked as finished is managed in "status", and hidden from other sortBy conditions
            const columnWithTaskStatusDone: boolean = currentColumn.id !== 0;
            const taskListForCurrentColumn = taskState.orderedTasks.find(
              (orderedTask) => orderedTask.columnId === currentColumn.id
            )?.taskList;

            return (
              columnWithTaskStatusDone && (
                <Box key={currentColumn.id} borderRadius={4}>
                  <Column
                    state={taskState}
                    currentColumn={currentColumn}
                    // Pass down list as per column.id
                    tasks={taskListForCurrentColumn}
                    isCreateTaskOpen={isCreateTaskOpen}
                    setIsCreateTaskOpen={setIsCreateTaskOpen}
                  />
                </Box>
              )
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
  //   const { destination, source } = result;
  //   const currentColumns = state.columnOptions[sortBy];
  //   if (
  //     !destination ||
  //     (destination.droppableId === source.droppableId &&
  //       destination.index === source.index)
  //   ) {
  //     return;
  //   }
  //   const lookUpColumnId: LookUpReorderedColumn = {};
  //   const isColumnReordered = sortBy !== PRIORITY;
  //   if (isColumnReordered) {
  //     getLookUpReorderedColumnTable(
  //       state.orderedTasks,
  //       currentColumns,
  //       lookUpColumnId
  //     );
  //   }
  //   const sourceColumnId = isColumnReordered
  //     ? lookUpColumnId[Number(source.droppableId)]
  //     : Number(source.droppableId);
  //   const destinationColumnId = isColumnReordered
  //     ? lookUpColumnId[Number(destination.droppableId)]
  //     : Number(destination.droppableId);
  //   const sourceTaskColumnIndex = currentColumns.findIndex(
  //     (column) => column.id === sourceColumnId
  //   );
  //   const destinationTaskColumnIndex = currentColumns.findIndex(
  //     (column) => column.id === destinationColumnId
  //   );
  //   setState(
  //     produce(state, (draftState) => {
  //       const taskListForUpdate: TaskList = [];
  //       const sourceTasksArr = draftState.orderedTasks[sourceTaskColumnIndex];
  //       const destinationTasksArr =
  //         draftState.orderedTasks[destinationTaskColumnIndex];
  //       const destinationTasksArrLength = destinationTasksArr.taskList.length;
  //       const lastTaskInDestinationTasksArr =
  //         destinationTasksArr.taskList[destinationTasksArrLength - 1];
  //       const sourceTask = sourceTasksArr.taskList[source.index];
  //       const sourceTaskBefore = sourceTasksArr.taskList[source.index - 1];
  //       const sourceTaskAfter = sourceTasksArr.taskList[source.index + 1];
  //       const destinationTask = destinationTasksArr.taskList[destination.index];
  //       const destinationTaskBefore =
  //         destinationTasksArr.taskList[destination.index - 1];
  //       const destinationTaskAfter =
  //         destinationTasksArr.taskList[destination.index + 1];
  //       const sourceTaskIndex = sourceTasksArr.taskList.findIndex(
  //         (task) => task.id === sourceTask.id
  //       );
  //       /*
  //        * Drop in the same column
  //        */
  //       const isDropInTheSameColumn =
  //         source.droppableId === destination.droppableId;
  //       if (isDropInTheSameColumn) {
  //         const moveUpOneRow =
  //           sourceTaskBefore === destinationTask &&
  //           destinationTaskAfter === sourceTask;
  //         const moveDownOneRow =
  //           sourceTaskAfter === destinationTask &&
  //           destinationTaskBefore === sourceTask;
  //         // move up one row
  //         if (moveUpOneRow) {
  //           sourceTask.previousTaskIds[lookUpPreviousTaskId[sortBy]] =
  //             destinationTaskBefore ? destinationTaskBefore.id : undefined;
  //           destinationTask.previousTaskIds[lookUpPreviousTaskId[sortBy]] =
  //             sourceTask.id;
  //           if (sourceTaskAfter) {
  //             sourceTaskAfter.previousTaskIds[lookUpPreviousTaskId[sortBy]] =
  //               destinationTask.id;
  //             taskListForUpdate.push(sourceTaskAfter);
  //           }
  //         }
  //         // move down one row
  //         else if (moveDownOneRow) {
  //           destinationTask.previousTaskIds[lookUpPreviousTaskId[sortBy]] =
  //             sourceTaskBefore ? sourceTaskBefore.id : undefined;
  //           sourceTask.previousTaskIds[lookUpPreviousTaskId[sortBy]] =
  //             destinationTask.id;
  //           if (destinationTaskAfter) {
  //             destinationTaskAfter.previousTaskIds[lookUpPreviousTaskId[sortBy]] =
  //               sourceTask.id;
  //             taskListForUpdate.push(destinationTaskAfter);
  //           }
  //         }
  //         // move up or down multiple rows
  //         else {
  //           const destinationTaskIndex = sourceTasksArr.taskList.findIndex(
  //             (task) => task.id === destinationTask.id
  //           );
  //           // move down
  //           const isMoveDown = sourceTaskIndex < destinationTaskIndex;
  //           if (isMoveDown) {
  //             sourceTaskAfter.previousTaskIds[lookUpPreviousTaskId[sortBy]] =
  //               sourceTaskBefore ? sourceTaskBefore.id : undefined;
  //             sourceTask.previousTaskIds[lookUpPreviousTaskId[sortBy]] =
  //               destinationTask.id;
  //             taskListForUpdate.push(sourceTaskAfter);
  //             if (destinationTaskAfter) {
  //               destinationTaskAfter.previousTaskIds[
  //                 lookUpPreviousTaskId[sortBy]
  //               ] = sourceTask.id;
  //               taskListForUpdate.push(destinationTaskAfter);
  //             }
  //           }
  //           // move up
  //           else {
  //             sourceTask.previousTaskIds[lookUpPreviousTaskId[sortBy]] =
  //               destinationTaskBefore ? destinationTaskBefore.id : undefined;
  //             destinationTask.previousTaskIds[lookUpPreviousTaskId[sortBy]] =
  //               sourceTask.id;
  //             if (sourceTaskAfter) {
  //               sourceTaskAfter.previousTaskIds[lookUpPreviousTaskId[sortBy]] =
  //                 sourceTaskBefore ? sourceTaskBefore.id : undefined;
  //               taskListForUpdate.push(sourceTaskAfter);
  //             }
  //           }
  //         }
  //         sourceTasksArr.taskList.splice(source.index, 1); // delete original
  //         sourceTasksArr.taskList.splice(destination.index, 0, sourceTask); // insert original to new place
  //         /*
  //          * Drop in a different column
  //          */
  //       } else {
  //         // Override all previous update events
  //         // So as to keep the event consistent when submitting to server
  //         sourceTask.taskEvents = getNewEventDTO(
  //           sourceTask.id!,
  //           sortBy,
  //           sourceColumnId,
  //           destinationColumnId
  //         );
  //         // Change column
  //         sourceTask[sortBy] = destinationColumnId;
  //         if (sourceTaskAfter) {
  //           sourceTaskAfter.previousTaskIds[lookUpPreviousTaskId[sortBy]] =
  //             sourceTaskBefore ? sourceTaskBefore.id : undefined;
  //           taskListForUpdate.push(sourceTaskAfter);
  //         }
  //         // move to an empty column or to the last position
  //         if (!destinationTask) {
  //           sourceTask.previousTaskIds[lookUpPreviousTaskId[sortBy]] =
  //             lastTaskInDestinationTasksArr
  //               ? lastTaskInDestinationTasksArr.id
  //               : undefined;
  //         }
  //         // move to the middle or top of the column
  //         else {
  //           destinationTask.previousTaskIds[lookUpPreviousTaskId[sortBy]] =
  //             sourceTask.id;
  //           sourceTask.previousTaskIds[lookUpPreviousTaskId[sortBy]] =
  //             destinationTaskBefore ? destinationTaskBefore.id : undefined;
  //         }
  //         sourceTasksArr.taskList.splice(source.index, 1); // delete original
  //         destinationTasksArr.taskList.splice(destination.index, 0, sourceTask); // insert original to new place
  //       }
  //       // Move task from unfinished to finished
  //       const isSetToFinished =
  //         sortBy === STATUS &&
  //         destination.droppableId === "3" && // Hard code column
  //         source.droppableId !== "3"; // Hard code column
  //       if (isSetToFinished) {
  //         // Remove task from other sortBy options, by updating the sourceTaskAfter
  //         draftState.orderedTasks.forEach((tasks) =>
  //           tasks.taskList.forEach((taskAfter) => {
  //             // Update priority
  //             const sourceTaskAfterInPriority =
  //               taskAfter.previousTaskIds.inPriority === sourceTask.id;
  //             if (sourceTaskAfterInPriority) {
  //               taskAfter.previousTaskIds.inPriority =
  //                 sourceTask.previousTaskIds.inPriority;
  //               taskListForUpdate.push(taskAfter);
  //             }
  //             // Update dueDate
  //             const sourceTaskAfterInDueDate =
  //               taskAfter.previousTaskIds.inDueDate === sourceTask.id;
  //             if (sourceTaskAfterInDueDate) {
  //               taskAfter.previousTaskIds.inDueDate =
  //                 sourceTask.previousTaskIds.inDueDate;
  //               taskListForUpdate.push(taskAfter);
  //             }
  //           })
  //         );
  //         // Update sourceTask by cleaning up other sortBy's info
  //         if (!sourceTask.taskStateBeforeFinish) {
  //           sourceTask.taskStateBeforeFinish = {};
  //         }
  //         // get previousTaskBeforeFinish first
  //         sourceTask.taskStateBeforeFinish.dueDate = sourceTask.dueDate;
  //         sourceTask.taskStateBeforeFinish.priority = sourceTask.priority;
  //         // then update other sortBy column
  //         sourceTask.priority = 0;
  //         sourceTask.dueDate = 0;
  //         sourceTask.previousTaskIds.inDueDate = 0;
  //         sourceTask.previousTaskIds.inPriority = 0;
  //         sourceTask.expectedDueDate = undefined;
  //       }
  //       // Move finished task to unfinished, and update other sortBy's info
  //       const isSetToUnfinished =
  //         sortBy === STATUS &&
  //         destination.droppableId !==
  //           String(draftState.columnOptions.statusColumns.length) &&
  //         source.droppableId === "3"; // Hard code column
  //       if (isSetToUnfinished) {
  //         const previousDueDateIdBeforeFinish =
  //           sourceTask.taskStateBeforeFinish?.dueDate;
  //         const previousPriorityIdBeforeFinish =
  //           sourceTask.taskStateBeforeFinish?.priority;
  //         const targetColumn: TargetColumn = {
  //           dueDate: previousDueDateIdBeforeFinish
  //             ? String(previousDueDateIdBeforeFinish)
  //             : "1", // Fall back to default column
  //           priority: previousPriorityIdBeforeFinish
  //             ? String(previousPriorityIdBeforeFinish)
  //             : "1", // Fall back to default column
  //         };
  //         updatePreviousIdsInColumn(draftState, targetColumn, sourceTask);
  //         // Clear previousTaskIdsBeforeFinish
  //         sourceTask.taskStateBeforeFinish = {};
  //       }
  //       if (destinationTask) taskListForUpdate.push(destinationTask);
  //       taskListForUpdate.push(sourceTask);
  //       const updateTaskListDTO: UpdateTasksPositionDTO = {
  //         sourceTaskId: sourceTask.id!,
  //         taskDtoList: taskListForUpdate,
  //       };
  //       updateTasksPosition(updateTaskListDTO);
  //       // Clear events from state task
  //       sourceTask.taskEvents = [];
  //     })
  //   );
}
