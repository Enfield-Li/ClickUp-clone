import produce from "immer";
import {
  SortBy,
  Task,
  TaskList,
  STATUS,
  TargetColumnAndId,
  UpdateTasksPositionDTO,
  SetTaskState,
} from "../../../types";
import { getNewEventDTO } from "../../../utils/createNewEvent";
import { updateTasksPosition } from "./networkActions";
import { updatePreviousIdsInColumn } from "./taskProcessing";

export function updateCurrentTaskStatus(
  sortBy: SortBy,
  currentTask: Task,
  setState: SetTaskState,
  targetStatusColumnId: number
) {
  setState((previousState) => {
    if (previousState) {
      return produce(previousState, (draftState) => {
        const taskListForUpdate: TaskList = [];

        const currentColumnId = draftState.orderedTasks.find((tasks) =>
          tasks.taskList.find((task) => task.id === currentTask.id)
        )?.columnId;

        const sourceColumn = draftState.orderedTasks.find(
          (tasks) => tasks.columnId === currentColumnId
        );

        const sourceTask = sourceColumn?.taskList.find(
          (task) => task.id === currentTask.id
        );

        const finishedColumn = draftState.orderedTasks.find(
          (tasks) => tasks.columnId === 0
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
              if (!sourceTask.taskStateBeforeFinish) {
                sourceTask.taskStateBeforeFinish = {};
              }
              sourceTask.taskStateBeforeFinish.dueDate = sourceTask.dueDate;
              sourceTask.taskStateBeforeFinish.priority = sourceTask.priority;
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
              sourceTask.taskStateBeforeFinish?.dueDate;
            const previousPriorityIdBeforeFinish =
              sourceTask.taskStateBeforeFinish?.priority;

            const targetColumn: TargetColumnAndId = {
              dueDate: previousDueDateIdBeforeFinish
                ? String(previousDueDateIdBeforeFinish)
                : "1",
              priority: previousPriorityIdBeforeFinish
                ? String(previousPriorityIdBeforeFinish)
                : "1",
            };

            updatePreviousIdsInColumn(draftState, targetColumn, sourceTask);
          }

          // update sourceTask with value in the new status column
          updatePreviousIdsInColumn(
            draftState,
            { status: String(targetStatusColumnId) },
            sourceTask
          );
          const destinationColumn = draftState.orderedTasks.find(
            (tasks) => tasks.columnId === targetStatusColumnId
          );

          // Push sourceTask to destinationColumn when sortBy === "status"
          if (sortBy === STATUS) {
            destinationColumn?.taskList.push(sourceTask);
          }

          sourceTask.taskEvents = getNewEventDTO(
            sourceTask.id!,
            STATUS,
            targetStatusColumnId,
            currentColumnId
          );

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
