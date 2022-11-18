import { DueDateColumn, SetTaskState, Task, UpdateEvent } from "../../../types";
import { getRandomNumberNoLimit } from "../../../utils/getRandomNumber";
import { getExpectedDueDateFromWeekString } from "./columnProcessing";
import { updateTaskPriorityOrDueDate } from "./updateTaskPriorityOrDueDate";

export function handleSelectDueDateOptions(
  task: Task,
  setState: SetTaskState,
  targetColumn: DueDateColumn
) {
  const weekString = targetColumn.title;
  const expectedDueDate = getExpectedDueDateFromWeekString(weekString);
  // Update list state
  updateTaskPriorityOrDueDate(
    task!,
    setState,
    targetColumn.id,
    expectedDueDate
  );
  //   const newEvent: UpdateEvent = {
  //     id: getRandomNumberNoLimit(),
  //     userId: authState.user?.id,
  //     taskId: task!.id!,
  //     field: DUE_DATE,
  //     beforeUpdate: String(task?.dueDate),
  //     afterUpdate: String(targetColumn.id),
  //     createdAt: new Date(),
  //   };
  //   // Update task state
  //   if (setTask) {
  //     setTask({
  //       ...task!,
  //       expectedDueDate,
  //       dueDate: targetColumn.id,
  //       taskEvents: [...task!.taskEvents, newEvent],
  //     });
  //   }
  //   onClose();
}
