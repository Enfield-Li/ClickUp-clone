import produce from "immer";
import { SetTaskState, SortBy, Task, UpdateEvent } from "../../../types";
import { getRandomNumberNoLimit } from "../../../utils/getRandomNumber";
import {
  findTheLastOrderIndexInColumn,
  OrderIndexInColumn,
} from "./createNewTask";

export function updateTaskAttribute(
  userId: number,
  sortBy: SortBy,
  targetField: SortBy,
  currentTask: Task,
  setTaskState: SetTaskState,
  targetColumnId: number,
  expectedDueDate?: Date | null
) {
  setTaskState(
    (taskState) =>
      taskState &&
      produce(taskState, (draftState) =>
        draftState.orderedTasks.forEach((orderedTask) => {
          orderedTask.taskList.forEach((task, index, taskList) => {
            const isNewEvent = task[targetField].columnId !== targetColumnId;
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
              task.taskEvents.push(newTaskEvent);

              const { orderIndex, columnName }: OrderIndexInColumn =
                findTheLastOrderIndexInColumn(
                  targetField,
                  targetColumnId,
                  draftState
                );

              task[targetField].name = columnName;
              task[targetField].orderIndex = orderIndex;
              task[targetField].columnId = targetColumnId;

              // move task to targetColumn and delete from original column
              if (sortBy === targetField) {
                taskList.splice(index, 1);
                draftState.orderedTasks.forEach((orderedTask) => {
                  if (orderedTask.columnId === targetColumnId) {
                    orderedTask.taskList.push(task);
                  }
                });
              }
            }
          });
        })
      )
  );
}

export function newUpdateEvent(
  userId: number,
  taskId: number,
  field: SortBy,
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
