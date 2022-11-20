import { AuthStateType } from "../../../context/auth/AuthContextTypes";
import {
  DueDateColumn,
  SetTaskState,
  SortBy,
  Task,
  UpdateEvent,
} from "../../../types";
import { getRandomNumberNoLimit } from "../../../utils/getRandomNumber";
import { getExpectedDueDateFromWeekString } from "./columnProcessing";
import { updateTaskPriorityOrDueDate } from "./updateTaskPriorityOrDueDate";

export function handleSelectDueDateOptions(
  task: Task,
  authState: AuthStateType,
  setTaskState: SetTaskState,
  targetColumn: DueDateColumn
) {
  const weekString = targetColumn.title;
  const expectedDueDate = getExpectedDueDateFromWeekString(weekString);
  // Update list taskState
  updateTaskPriorityOrDueDate(
    task!,
    setTaskState,
    targetColumn.id,
    expectedDueDate
  );
  const newEvent: UpdateEvent = {
    id: getRandomNumberNoLimit(),
    userId: authState.user?.id,
    taskId: task!.id!,
    field: SortBy.DUE_DATE,
    beforeUpdate: String(task?.dueDate),
    afterUpdate: String(targetColumn.id),
    createdAt: new Date(),
  };
}
