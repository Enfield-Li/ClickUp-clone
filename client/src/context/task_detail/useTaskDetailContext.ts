import produce from "immer";
import { useContext } from "react";
import { updateTasksPosition } from "../../component/task/actions/TaskActions";
import { updatePreviousIdsInColumn } from "../../component/task/actions/taskProcessing";
import {
  lookUpPreviousTaskId,
  SetState,
  SortBy,
  STATUS,
  TargetColumn,
  Task,
  TaskList,
  UpdateTasksPositionDTO,
} from "../../component/task/taskTypes";
import { TaskDetailContext } from "./TaskDetailContext";

export default function useTaskDetailContext() {
  return useContext(TaskDetailContext);
}

export function updateCurrentTaskStatus(
  sortBy: SortBy,
  currentTask: Task,
  setState: SetState,
  targetStatusColumnId: number
) {
  setState((previousState) => {
    if (previousState) {
      return produce(previousState, (draftState) => {
        const taskListForUpdate: TaskList = [];

        const currentColumnId = draftState.orderedTasks.find((tasks) =>
          tasks.taskList.find((task) => task.id === currentTask.id)
        )?.id;

        const sourceColumn = draftState.orderedTasks.find(
          (tasks) => tasks.id === currentColumnId
        );

        const sourceTask = sourceColumn?.taskList.find(
          (task) => task.id === currentTask.id
        );

        const finishedColumn = draftState.orderedTasks.find(
          (tasks) => tasks.id === 0
        );

        if (sourceTask) {
          const currentTaskIndexInSourceColumn =
            sourceColumn?.taskList.findIndex(
              (task) => task.id === sourceTask.id
            );

          // Current column
          const sourceTaskIndex =
            currentTaskIndexInSourceColumn ||
            currentTaskIndexInSourceColumn === 0;
          if (sourceTaskIndex) {
            // Delete sourceTask from sourceColumn when sortBy === "status"
            if (sortBy === STATUS) {
              sourceColumn?.taskList.splice(currentTaskIndexInSourceColumn, 1);
            }

            // Update sourceTaskAfter
            const sourceTaskAfter = sourceColumn?.taskList.find(
              (task) => task.previousTaskIds.inStatus === sourceTask.id
            );
            if (sourceTaskAfter) {
              sourceTaskAfter.previousTaskIds.inStatus =
                sourceTask.previousTaskIds.inStatus;

              taskListForUpdate.push(sourceTaskAfter);
            }

            // Task sets to finished
            const isSetToFinished = targetStatusColumnId === 3;
            if (isSetToFinished) {
              draftState.orderedTasks.forEach((tasks) =>
                tasks.taskList.forEach((taskAfter) => {
                  const sourceTaskAfterInPriority =
                    taskAfter.previousTaskIds.inPriority === sourceTask.id;
                  if (sourceTaskAfterInPriority) {
                    taskAfter.previousTaskIds.inPriority =
                      sourceTask.previousTaskIds.inPriority;

                    taskListForUpdate.push(taskAfter);
                  }

                  const sourceTaskAfterInDueDate =
                    taskAfter.previousTaskIds.inDueDate === sourceTask.id;
                  if (sourceTaskAfterInDueDate) {
                    taskAfter.previousTaskIds.inDueDate =
                      sourceTask.previousTaskIds.inDueDate;

                    taskListForUpdate.push(taskAfter);
                  }
                })
              );

              // Update sourceTask by cleaning up other sortBy's info
              if (!sourceTask.previousTaskIdsBeforeFinish) {
                sourceTask.previousTaskIdsBeforeFinish = {};
              }
              sourceTask.previousTaskIdsBeforeFinish.inDueDate =
                sourceTask.dueDate;
              sourceTask.previousTaskIdsBeforeFinish.inPriority =
                sourceTask.priority;
              sourceTask.priority = 0;
              sourceTask.dueDate = 0;
              sourceTask.previousTaskIds.inDueDate = 0;
              sourceTask.previousTaskIds.inPriority = 0;

              // Remove sourceTask from current column and push finished column
              if (sortBy !== STATUS) {
                sourceColumn?.taskList.splice(
                  currentTaskIndexInSourceColumn,
                  1
                );

                finishedColumn?.taskList.push(sourceTask);
              }
            }
          }

          // Task sets to unfinished
          const isSetToUnfinished = currentColumnId === 3;
          if (isSetToUnfinished) {
            const previousDueDateIdBeforeFinish =
              sourceTask.previousTaskIdsBeforeFinish?.inDueDate;
            const previousPriorityIdBeforeFinish =
              sourceTask.previousTaskIdsBeforeFinish?.inPriority;

            const targetColumn: TargetColumn = {
              dueDate: previousDueDateIdBeforeFinish
                ? String(previousDueDateIdBeforeFinish)
                : "1",
              priority: previousPriorityIdBeforeFinish
                ? String(previousPriorityIdBeforeFinish)
                : "1",
            };

            updatePreviousIdsInColumn(draftState, targetColumn, sourceTask);
          }

          // update sourceTask with value in the new column
          updatePreviousIdsInColumn(
            draftState,
            { status: String(targetStatusColumnId) },
            sourceTask
          );
          const destinationColumn = draftState.orderedTasks.find(
            (tasks) => tasks.id === targetStatusColumnId
          );

          // Push sourceTask to destinationColumn when sortBy === "status"
          if (sortBy === STATUS) {
            destinationColumn?.taskList.push(sourceTask);
          }

          sourceTask.taskEvents = [
            {
              taskId: sourceTask.id!,
              field: sortBy,
              afterUpdate: String(currentColumnId),
              beforeUpdate: String(targetStatusColumnId),
            },
          ];

          taskListForUpdate.push(sourceTask);

          const updateTaskListDTO: UpdateTasksPositionDTO = {
            sourceTaskId: sourceTask.id!,
            taskDtoList: taskListForUpdate,
          };

          updateTasksPosition(updateTaskListDTO);

          // Clear events from state task
          sourceTask.taskEvents = [];
          sourceTask.updatedAt = new Date();
        }
      });
    }
  });
}

export function updateTaskPriorityOrDueDate(
  sortBy: SortBy,
  currentTask: Task,
  setState: SetState,
  targetColumnKey: SortBy,
  targetColumnId: number,
  expectedDueDate?: Date
) {
  const taskListForUpdate: TaskList = [];
  const isDueDate = targetColumnKey === "dueDate";

  const targetColumn: TargetColumn = isDueDate
    ? { dueDate: String(targetColumnId) }
    : { priority: String(targetColumnId) };

  setState((previousState) => {
    if (previousState) {
      return produce(previousState, (draftState) => {
        // Update sourceTask's Stats
        draftState.orderedTasks.forEach((taskList) =>
          taskList.taskList.forEach((task) => {
            const isSourceTask = task.id === currentTask.id;
            if (isSourceTask) {
              if (isDueDate) task.expectedDueDate = expectedDueDate;
              updatePreviousIdsInColumn(draftState, targetColumn, task);
            }

            // Update sourceTaskAfter's stats
            const isSourceTaskAfter =
              task.previousTaskIds[lookUpPreviousTaskId[targetColumnKey]] ===
              currentTask.id;
            if (isSourceTaskAfter) {
              task.previousTaskIds[lookUpPreviousTaskId[targetColumnKey]] =
                currentTask.previousTaskIds[
                  lookUpPreviousTaskId[targetColumnKey]
                ];

              taskListForUpdate.push(task);
            }
          })
        );

        // Update positions
        const currentColumnId = draftState.orderedTasks.find((tasks) =>
          tasks.taskList.find((task) => task.id === currentTask.id)
        )?.id;

        const sourceColumn = draftState.orderedTasks.find(
          (tasks) => tasks.id === currentColumnId
        );

        const sourceTask = sourceColumn?.taskList.find(
          (task) => task.id === currentTask.id
        );

        const destinationColumn = draftState.orderedTasks.find(
          (tasks) => tasks.id === targetColumnId
        );

        const currentTaskIndexInSourceColumn = sourceColumn?.taskList.findIndex(
          (task) => task.id === sourceTask?.id
        );

        if (sourceTask) {
          // Remove from current column and push task to finished column
          if (sortBy === targetColumnKey) {
            const sourceTaskIndex =
              currentTaskIndexInSourceColumn ||
              currentTaskIndexInSourceColumn === 0;
            if (sourceTaskIndex) {
              sourceColumn?.taskList.splice(currentTaskIndexInSourceColumn, 1);
              destinationColumn?.taskList.push(sourceTask);
            }
          }

          sourceTask.taskEvents = [
            {
              taskId: sourceTask.id!,
              field: sortBy,
              afterUpdate: String(currentColumnId),
              beforeUpdate: String(targetColumnId),
            },
          ];
          taskListForUpdate.push(sourceTask);

          const updateTaskListDTO: UpdateTasksPositionDTO = {
            sourceTaskId: sourceTask.id!,
            taskDtoList: taskListForUpdate,
          };

          updateTasksPosition(updateTaskListDTO);

          // Clear events from state task
          sourceTask.taskEvents = [];
          sourceTask.updatedAt = new Date();
        }
      });
    }
  });
}

// export function toTaskDtoList(taskList: TaskList) {
//   const taskDtoList: TaskDTO[] = [];
//   taskList.forEach((task) => {
//     const {
//       id,
//       title,
//       dueDate,
//       status,
//       priority,
//       creatorId,
//       creatorName,
//       description,
//       watchers,
//       assignees,
//       previousTask,
//       taskEvents,
//       previousTaskBeforeFinish,
//     } = task;

//     const updateEventDTO: UpdateEventDTO[] = [];

//     taskDtoList.push({
//       id,
//       title,
//       dueDate,
//       status,
//       priority,
//       creatorId,
//       creatorName,
//       description,
//       watchers,
//       assignees,
//       previousTask,
//       taskEvents,
//       previousTaskBeforeFinish,
//     });
//   });
// }

// function toUpdateEventDTO() {}
