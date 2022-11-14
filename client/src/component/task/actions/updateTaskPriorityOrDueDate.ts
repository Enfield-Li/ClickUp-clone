import produce from "immer";
import { updateTasksPosition } from "./TaskActions";
import { updatePreviousIdsInColumn } from "./taskProcessing";
import {
  DUE_DATE,
  lookUpPreviousTaskId,
  SetState,
  SortBy,
  TargetColumn,
  Task,
  TaskList,
  UpdateTasksPositionDTO,
} from "../../../types";
import { getNewEventDTO } from "../../../utils/createNewEvent";

export function updateTaskPriorityOrDueDate(
  sortBy: SortBy,
  currentTask: Task,
  setState: SetState,
  targetColumnKey: SortBy,
  targetColumnId: number,
  expectedDueDate?: Date
) {
  const taskListForUpdate: TaskList = [];
  const isDueDate = targetColumnKey === DUE_DATE;

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

          // Init taskEvents
          sourceTask.taskEvents = getNewEventDTO(
            sourceTask.id!,
            targetColumnKey,
            currentTask[targetColumnKey],
            targetColumnId
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
