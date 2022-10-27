import { Box, Flex } from "@chakra-ui/react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import produce from "immer";
import { useFetchTasks, useLocalTasks } from "../../hook/useFetch";
import { API_ENDPOINT } from "../../utils/constant";
import Column from "./Column";
import { updateTasksPosition } from "./TaskActions";
import {
  processLookColumnId,
  updateTaskStatsInColumn,
} from "./dataProcessing/taskProcessing";
import {
  DUE_DATE,
  LookUpColumnId,
  lookUpPreviousTaskId,
  PRIORITY,
  SetState,
  SortBy,
  State,
  STATUS,
  TargetColumn,
  TaskList,
  UpdateTasksPositionDTO,
} from "./taskTypes";
import AddStatusColumn from "./columnDetails/AddStatusColumn";
import { toPlainObject } from "../../utils/proxyToObject";

type Props = {
  sortBy: SortBy;
};

export default function TaskListView({ sortBy }: Props) {
  const { state, setState, loading } = useLocalTasks(sortBy);
  //   const { state, loading, error, setState } = useFetchTasks(
  //     API_ENDPOINT.TASK_ALL_TASKS,
  //     sortBy
  //   );
  console.log(state);

  if (!state || loading) return <div>Loading</div>;

  const currentColumns = state.columnOptions[sortBy];

  return (
    <Box px={3} overflowY={"auto"} mr={3}>
      <DragDropContext
        onDragEnd={(result) => handleDragEnd(result, state, setState, sortBy)}
      >
        <Flex>
          {/* Columns and tasks */}
          {currentColumns.map((currentColumn, index) => {
            // Task marked as finished is managed in "status", and hidden from other sortBy conditions
            const columnWithTaskStatusDone: boolean = currentColumn.id !== 0;
            const taskListForCurrentColumn = state.orderedTasks.find(
              (orderedTask) => orderedTask.id === currentColumn.id
            )?.taskList;

            return (
              columnWithTaskStatusDone && (
                <Box key={currentColumn.id} borderRadius={4}>
                  <Column
                    state={state}
                    sortBy={sortBy}
                    setState={setState}
                    currentColumn={currentColumn}
                    // Pass down list as per column.id
                    tasks={taskListForCurrentColumn}
                    dueDateColumns={state.columnOptions.dueDate}
                  />
                </Box>
              )
            );
          })}

          {/* Add column in status */}
          {sortBy === STATUS && (
            <Box mx={2}>
              <AddStatusColumn
                setState={setState}
                statusColumns={state.columnOptions.status}
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
  state: State,
  setState: SetState,
  sortBy: SortBy
) {
  const { destination, source } = result;
  const currentColumns = state.columnOptions[sortBy];

  if (!destination) return;
  if (
    destination.droppableId === source.droppableId &&
    destination.index === source.index
  ) {
    return;
  }

  const lookUpColumnId: LookUpColumnId = {};
  const isColumnReordered = sortBy !== PRIORITY;
  if (isColumnReordered) {
    processLookColumnId(state.orderedTasks, currentColumns, lookUpColumnId);
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
  const destinationTaskColumnIndex = currentColumns.findIndex(
    (column) => column.id === destinationColumnId
  );
  console.log({ destinationTaskColumnIndex });

  console.log({
    destinationTasksArr: state.orderedTasks[destinationTaskColumnIndex],
  });

  setState(
    produce(state, (draftState) => {
      const taskListForUpdate: TaskList = [];

      const sourceTasksArr = draftState.orderedTasks[sourceTaskColumnIndex];
      const destinationTasksArr =
        draftState.orderedTasks[destinationTaskColumnIndex];

      const destinationTasksArrLength = destinationTasksArr.taskList.length;
      const lastTaskInDestinationTasksArr =
        destinationTasksArr.taskList[destinationTasksArrLength - 1];

      const sourceTask = sourceTasksArr.taskList[source.index];
      const sourceTaskBefore = sourceTasksArr.taskList[source.index - 1];
      const sourceTaskAfter = sourceTasksArr.taskList[source.index + 1];

      const destinationTask = destinationTasksArr.taskList[destination.index];
      const destinationTaskBefore =
        destinationTasksArr.taskList[destination.index - 1];
      const destinationTaskAfter =
        destinationTasksArr.taskList[destination.index + 1];

      const sourceTaskIndex = sourceTasksArr.taskList.findIndex(
        (task) => task.id === sourceTask.id
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
          sourceTask.previousTask[lookUpPreviousTaskId[sortBy]] =
            destinationTaskBefore ? destinationTaskBefore.id : undefined;
          destinationTask.previousTask[lookUpPreviousTaskId[sortBy]] =
            sourceTask.id;
          if (sourceTaskAfter) {
            sourceTaskAfter.previousTask[lookUpPreviousTaskId[sortBy]] =
              destinationTask.id;

            taskListForUpdate.push(sourceTaskAfter);
          }
        }

        // move down one row
        else if (moveDownOneRow) {
          destinationTask.previousTask[lookUpPreviousTaskId[sortBy]] =
            sourceTaskBefore ? sourceTaskBefore.id : undefined;
          sourceTask.previousTask[lookUpPreviousTaskId[sortBy]] =
            destinationTask.id;
          if (destinationTaskAfter) {
            destinationTaskAfter.previousTask[lookUpPreviousTaskId[sortBy]] =
              sourceTask.id;

            taskListForUpdate.push(destinationTaskAfter);
          }
        }

        // move up or down multiple rows
        else {
          const destinationTaskIndex = sourceTasksArr.taskList.findIndex(
            (task) => task.id === destinationTask.id
          );

          // move down
          const isMoveDown = sourceTaskIndex < destinationTaskIndex;
          if (isMoveDown) {
            sourceTaskAfter.previousTask[lookUpPreviousTaskId[sortBy]] =
              sourceTaskBefore ? sourceTaskBefore.id : undefined;
            sourceTask.previousTask[lookUpPreviousTaskId[sortBy]] =
              destinationTask.id;
            if (destinationTaskAfter) {
              destinationTaskAfter.previousTask[lookUpPreviousTaskId[sortBy]] =
                sourceTask.id;

              taskListForUpdate.push(destinationTaskAfter);
            }
          }

          // move up
          else {
            sourceTask.previousTask[lookUpPreviousTaskId[sortBy]] =
              destinationTaskBefore ? destinationTaskBefore.id : undefined;
            destinationTask.previousTask[lookUpPreviousTaskId[sortBy]] =
              sourceTask.id;
            if (sourceTaskAfter) {
              sourceTaskAfter.previousTask[lookUpPreviousTaskId[sortBy]] =
                sourceTaskBefore ? sourceTaskBefore.id : undefined;

              taskListForUpdate.push(sourceTaskAfter);
            }
          }
        }

        sourceTasksArr.taskList.splice(source.index, 1); // delete original
        sourceTasksArr.taskList.splice(destination.index, 0, sourceTask); // insert original to new place

        /*
         * Drop in a different column
         */
      } else {
        // Change column
        sourceTask[sortBy] = destinationColumnId;

        if (sourceTaskAfter) {
          sourceTaskAfter.previousTask[lookUpPreviousTaskId[sortBy]] =
            sourceTaskBefore ? sourceTaskBefore.id : undefined;

          taskListForUpdate.push(sourceTaskAfter);
        }

        // move to an empty column or to the last position
        if (!destinationTask) {
          sourceTask.previousTask[lookUpPreviousTaskId[sortBy]] =
            lastTaskInDestinationTasksArr
              ? lastTaskInDestinationTasksArr.id
              : undefined;
        }

        // move to the middle or top of the column
        else {
          destinationTask.previousTask[lookUpPreviousTaskId[sortBy]] =
            sourceTask.id;
          sourceTask.previousTask[lookUpPreviousTaskId[sortBy]] =
            destinationTaskBefore ? destinationTaskBefore.id : undefined;
        }

        sourceTasksArr.taskList.splice(source.index, 1); // delete original
        destinationTasksArr.taskList.splice(destination.index, 0, sourceTask); // insert original to new place
      }

      // Move task from unfinished to finished
      const isSetToFinished =
        sortBy === STATUS &&
        destination.droppableId === "3" && // Hard code column
        source.droppableId !== "3"; // Hard code column

      if (isSetToFinished) {
        // Remove task from other sortBy options, by updating the sourceTaskAfter
        draftState.orderedTasks.forEach((tasks) =>
          tasks.taskList.forEach((taskAfter) => {
            // Update priority
            const sourceTaskAfterInPriority =
              taskAfter.previousTask.priorityId === sourceTask.id;

            if (sourceTaskAfterInPriority) {
              taskAfter.previousTask.priorityId =
                sourceTask.previousTask.priorityId;

              taskListForUpdate.push(taskAfter);
            }

            // Update dueDate
            const sourceTaskAfterInDueDate =
              taskAfter.previousTask.dueDateId === sourceTask.id;

            if (sourceTaskAfterInDueDate) {
              taskAfter.previousTask.dueDateId =
                sourceTask.previousTask.dueDateId;

              taskListForUpdate.push(taskAfter);
            }
          })
        );

        // Update sourceTask by cleaning up other sortBy's info
        if (!sourceTask.previousTaskBeforeFinish) {
          sourceTask.previousTaskBeforeFinish = {};
        }
        sourceTask.previousTaskBeforeFinish.dueDateId = sourceTask.dueDate;
        sourceTask.previousTaskBeforeFinish.priorityId = sourceTask.priority;
        sourceTask.priority = 0;
        sourceTask.dueDate = 0;
        sourceTask.previousTask.dueDateId = 0;
        sourceTask.previousTask.priorityId = 0;
      }

      // Move finished task to unfinished, and update other sortBy's info
      const isSetToUnfinished =
        sortBy === STATUS &&
        destination.droppableId !==
          String(draftState.columnOptions.status.length) &&
        source.droppableId === "3"; // Hard code column

      if (isSetToUnfinished) {
        const previousDueDateIdBeforeFinish =
          sourceTask.previousTaskBeforeFinish?.dueDateId;

        const previousPriorityIdBeforeFinish =
          sourceTask.previousTaskBeforeFinish?.priorityId;

        const targetColumn: TargetColumn = {
          dueDate: previousDueDateIdBeforeFinish
            ? String(previousDueDateIdBeforeFinish)
            : "1", // Fall back to default column
          priority: previousPriorityIdBeforeFinish
            ? String(previousPriorityIdBeforeFinish)
            : "1", // Fall back to default column
        };

        updateTaskStatsInColumn(draftState, targetColumn, sourceTask);
      }

      // Override all previous update events
      // So as to keep the event consistent when submitting to server
      sourceTask.taskEvents = [
        {
          taskId: sourceTask.id!,
          field: sortBy,
          afterUpdate: String(sourceColumnId),
          beforeUpdate: String(destinationColumnId),
        },
      ];

      if (destinationTask) taskListForUpdate.push(destinationTask);
      taskListForUpdate.push(sourceTask);

      const updateTaskListDTO: UpdateTasksPositionDTO = {
        sourceTaskId: sourceTask.id!,
        taskDtoList: taskListForUpdate,
      };
      updateTasksPosition(updateTaskListDTO);

      // Clear events from state task
      sourceTask.taskEvents = [];
    })
  );
}
