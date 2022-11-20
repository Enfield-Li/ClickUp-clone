import produce from "immer";
import {
  SetTaskState,
  TargetColumnAndId,
  Task,
  TaskEvent,
} from "../../../types";
import { updateTaskOnTargetColumnAndId } from "./createNewTask";

export function updateTaskPriorityOrDueDate(
  currentTask: Task,
  setTaskState: SetTaskState,
  targetColumnId: number,
  expectedDueDate: Date | null,
  taskEvent?: TaskEvent
) {
  setTaskState(
    (prev) =>
      prev &&
      produce(prev, (draftState) =>
        draftState.orderedTasks.forEach((orderedTask) =>
          orderedTask.taskList.forEach((task) => {
            if (task.id === currentTask.id) {
              task.expectedDueDate = expectedDueDate;
              if (taskEvent) task.taskEvents.push(taskEvent);

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
  );
}
