import produce from "immer";
import React, { useContext } from "react";
import {
  SortBy,
  Task,
  STATUS,
  TargetColumn,
  SetState,
  lookUpPreviousTaskId,
} from "../../component/task/Data";
import { updateTaskStatsInColumn } from "../../component/task/TaskDataProcessing";
import { TaskDetailContext as TaskDetailContext } from "./TaskDetailContext";

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
        const currentColumnId = draftState.orderedTasks.find((tasks) =>
          tasks.taskList.find((task) => task.id === currentTask.id)
        )?.id;

        const sourceColumn = draftState.orderedTasks.find(
          (tasks) => tasks.id === currentColumnId
        );

        const sourceTask = sourceColumn?.taskList.find(
          (task) => task.id === currentTask.id
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
              (task) => task.previousTask.statusId === sourceTask.id
            );
            if (sourceTaskAfter) {
              sourceTaskAfter.previousTask.statusId =
                sourceTask.previousTask.statusId;
            }

            // Task sets to finished
            const isSetToFinished = targetStatusColumnId === 3;
            if (isSetToFinished) {
              draftState.orderedTasks.forEach((tasks) =>
                tasks.taskList.forEach((taskAfter) => {
                  const sourceTaskAfterInPriority =
                    taskAfter.previousTask.priorityId === sourceTask.id;
                  if (sourceTaskAfterInPriority) {
                    taskAfter.previousTask.priorityId =
                      sourceTask.previousTask.priorityId;
                  }

                  const sourceTaskAfterInDueDate =
                    taskAfter.previousTask.dueDateId === sourceTask.id;
                  if (sourceTaskAfterInDueDate) {
                    taskAfter.previousTask.dueDateId =
                      sourceTask.previousTask.dueDateId;
                  }
                })
              );

              // Update currentTaskCopy by cleaning up other sortBy's info
              if (!sourceTask.previousTaskBeforeFinish) {
                sourceTask.previousTaskBeforeFinish = {};
              }
              sourceTask.previousTaskBeforeFinish.dueDateId =
                sourceTask.dueDate;
              sourceTask.previousTaskBeforeFinish.priorityId =
                sourceTask.priority;
              sourceTask.priority = 0;
              sourceTask.dueDate = 0;
              sourceTask.previousTask.dueDateId = 0;
              sourceTask.previousTask.priorityId = 0;

              // Remove from current column and push task to finished column
              if (sortBy !== STATUS) {
                sourceColumn?.taskList.splice(
                  currentTaskIndexInSourceColumn,
                  1
                );

                const finishedColumn = draftState.orderedTasks.find(
                  (tasks) => tasks.id === 0
                );
                finishedColumn?.taskList.push(sourceTask);
              }
            }
          }

          // Task sets to unfinished
          const isSetToUnfinished = currentColumnId === 3;
          if (isSetToUnfinished) {
            const previousDueDateIdBeforeFinish =
              sourceTask.previousTaskBeforeFinish?.dueDateId;
            const previousPriorityIdBeforeFinish =
              sourceTask.previousTaskBeforeFinish?.priorityId;

            const targetColumn: TargetColumn = {
              dueDate: previousDueDateIdBeforeFinish
                ? String(previousDueDateIdBeforeFinish)
                : "1",
              priority: previousPriorityIdBeforeFinish
                ? String(previousPriorityIdBeforeFinish)
                : "1",
            };
            updateTaskStatsInColumn(draftState, targetColumn, sourceTask);
          }

          // update sourceTask with value in the new column
          updateTaskStatsInColumn(
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
        }
      });
    }
  });
}

export function updateTaskPriorityOrDueDate(
  sortBy: SortBy,
  currentTask: Task,
  setState: SetState,
  targetColumnKey: keyof typeof lookUpPreviousTaskId,
  targetColumnId: number
) {
  const targetColumn: TargetColumn =
    targetColumnKey === "dueDate"
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
              updateTaskStatsInColumn(draftState, targetColumn, task);
            }

            // Update sourceTaskAfter's stats
            const isSourceTaskAfter =
              task.previousTask[lookUpPreviousTaskId[targetColumnKey]] ===
              currentTask.id;
            if (isSourceTaskAfter) {
              task.previousTask[lookUpPreviousTaskId[targetColumnKey]] =
                currentTask.previousTask[lookUpPreviousTaskId[targetColumnKey]];
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

        // Remove from current column and push task to finished column
        if (sortBy === targetColumnKey) {
          const sourceTaskIndex =
            currentTaskIndexInSourceColumn ||
            currentTaskIndexInSourceColumn === 0;
          if (sourceTaskIndex && sourceTask) {
            sourceColumn?.taskList.splice(currentTaskIndexInSourceColumn, 1);

            destinationColumn?.taskList.push(sourceTask);
          }
        }
      });
    }
  });
}
