import { TextField } from "@mui/material";
import { StaticDatePicker } from "@mui/x-date-pickers";
import { memo } from "react";
import useAuthContext from "../../../context/auth/useAuthContext";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import {
  ColumnOptions,
  SetTaskState,
  SortBy,
  Task,
  UpdateEvent,
} from "../../../types";
import { getRandomNumberNoLimit } from "../../../utils/getRandomNumber";
import { getDueDateColumnIdFromExpectedDueDate } from "../../task/actions/taskProcessing";
import { updateTaskPriorityOrDueDate } from "../../task/actions/updateTaskPriorityOrDueDate";
import MaterialTheme from "../../test-dev/MaterialTheme";

type Props = {
  task: Task;
  onClose: () => void;
};

export default memo(DueDatePicker);
function DueDatePicker({ task, onClose }: Props) {
  const { authState } = useAuthContext();
  const { taskStateContext } = useTaskDetailContext();
  const { setTaskState, columnOptions } = taskStateContext!;

  return (
    <MaterialTheme>
      <StaticDatePicker
        value={task.expectedDueDate}
        displayStaticWrapperAs="desktop"
        renderInput={(params) => <TextField {...params} />}
        onChange={(newValue) => {
          if (newValue) {
            handleDatePicker(
              task,
              authState.user!.id,
              setTaskState,
              onClose,
              columnOptions,
              newValue
            );
          }
        }}
      />
    </MaterialTheme>
  );
}

function handleDatePicker(
  task: Task,
  userId: number,
  setTaskState: SetTaskState,
  onClose: () => void,
  columnOptions: ColumnOptions,
  expectedDueDateInput: Date
) {
  if (expectedDueDateInput) {
    const targetDueDateColumnId = getDueDateColumnIdFromExpectedDueDate(
      columnOptions.dueDateColumns,
      expectedDueDateInput
    );

    const newEvent: UpdateEvent = {
      id: getRandomNumberNoLimit(),
      userId,
      taskId: task!.id!,
      field: SortBy.DUE_DATE,
      beforeUpdate: String(task?.dueDate),
      afterUpdate: String(targetDueDateColumnId),
      createdAt: new Date(),
    };

    // Update list taskState
    updateTaskPriorityOrDueDate(
      task!,
      setTaskState,
      targetDueDateColumnId,
      expectedDueDateInput,
      newEvent
    );

    onClose();
  }
}
