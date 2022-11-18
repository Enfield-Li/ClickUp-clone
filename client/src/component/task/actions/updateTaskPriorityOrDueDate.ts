import produce from "immer";
import { SetTaskState, TargetColumnAndId, Task } from "../../../types";
import { updateTaskOnTargetColumnAndId } from "./createNewTask";
import { getDueDateColumnIdFromExpectedDueDate } from "./taskProcessing";

export function updateTaskPriorityOrDueDate(
  currentTask: Task,
  setState: SetTaskState,
  targetColumnId: number,
  expectedDueDate?: Date
) {
  setState(
    (prev) =>
      prev &&
      produce(prev, (draftState) =>
        draftState.orderedTasks.forEach((orderedTask) =>
          orderedTask.taskList.forEach((task) => {
            if (task.id === currentTask.id) {
              // determine if it's update dueDate or priority
              if (expectedDueDate) {
                task.expectedDueDate = expectedDueDate;
                targetColumnId = getDueDateColumnIdFromExpectedDueDate(
                  draftState.columnOptions.dueDateColumns,
                  expectedDueDate
                );
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
  );
}
