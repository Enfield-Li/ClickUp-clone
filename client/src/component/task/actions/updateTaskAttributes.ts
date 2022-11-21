import produce from "immer";
import {
  SetTaskState,
  SortBy,
  TargetColumnAndId,
  Task,
  TaskEvent,
  UpdateEvent,
} from "../../../types";
import { deepCopy } from "../../../utils/deepCopy";
import { getRandomNumberNoLimit } from "../../../utils/getRandomNumber";
import {
  findTheLastOrderIndexInColumn,
  OrderIndexInColumn,
  updateTaskOnTargetColumnAndId,
} from "./createNewTask";

export function updateCurrentTaskStatus(
  currentTask: Task,
  setTaskState: SetTaskState,
  targetStatusColumnId: number,
  newTaskEvent: TaskEvent
) {
  setTaskState(
    (taskState) =>
      taskState &&
      deepCopy(
        // ^^ without it, immer produce won't trigger rerender, WTF ???
        produce(taskState, (draftState) =>
          draftState.orderedTasks.forEach((orderedTask) => {
            orderedTask.taskList.forEach((task) => {
              if (task.id === currentTask.id) {
                task.taskEvents.push(newTaskEvent);
                const { orderIndex, columnName }: OrderIndexInColumn =
                  findTheLastOrderIndexInColumn(
                    SortBy.STATUS,
                    targetStatusColumnId,
                    draftState
                  );

                task[SortBy.STATUS].name = columnName;
                task[SortBy.STATUS].orderIndex = orderIndex;
                task[SortBy.STATUS].columnId = targetStatusColumnId;
              }
            });
          })
        )
      )
  );
}

export function updateTaskPriorityOrDueDate(
  currentTask: Task,
  setTaskState: SetTaskState,
  targetColumnId: number,
  newTaskEvent: TaskEvent,
  expectedDueDate?: Date | null
) {
  setTaskState(
    (prev) =>
      prev &&
      deepCopy(
        // ^^ without it, immer produce won't trigger rerender, WTF ???
        produce(prev, (draftState) =>
          draftState.orderedTasks.forEach((orderedTask) =>
            orderedTask.taskList.forEach((task) => {
              if (task.id === currentTask.id) {
                task.taskEvents.push(newTaskEvent);
                if (expectedDueDate !== undefined) {
                  task.expectedDueDate = expectedDueDate;
                }

                const targetColumnAndId: TargetColumnAndId = expectedDueDate
                  ? { dueDate: targetColumnId }
                  : { priority: targetColumnId };
                updateTaskOnTargetColumnAndId(
                  targetColumnAndId,
                  draftState,
                  task
                );
              }
            })
          )
        )
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
