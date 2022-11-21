import { TextField } from "@mui/material";
import { StaticDatePicker } from "@mui/x-date-pickers";
import { memo } from "react";
import useAuthContext from "../../../context/auth/useAuthContext";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import { SortBy, Task } from "../../../types";
import { getDueDateColumnIdFromExpectedDueDate } from "../../task/actions/taskProcessing";
import {
  newUpdateEvent,
  updateTaskPriorityOrDueDate,
} from "../../task/actions/updateTaskAttributes";
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

  function handleDatePicker(expectedDueDateInput: Date) {
    if (expectedDueDateInput) {
      const targetDueDateColumnId = getDueDateColumnIdFromExpectedDueDate(
        columnOptions.dueDateColumns,
        expectedDueDateInput
      );

      const newEvent = newUpdateEvent(
        authState.user!.id!,
        task.id!,
        SortBy.DUE_DATE,
        task.dueDate.columnId,
        targetDueDateColumnId
      );

      // Update list taskState
      updateTaskPriorityOrDueDate(
        task!,
        setTaskState,
        targetDueDateColumnId,
        newEvent,
        expectedDueDateInput
      );

      onClose();
    }
  }

  return (
    <MaterialTheme>
      <StaticDatePicker
        value={task.expectedDueDate}
        displayStaticWrapperAs="desktop"
        renderInput={(params) => <TextField {...params} />}
        onChange={(newValue) => {
          if (newValue) handleDatePicker(newValue);
        }}
      />
    </MaterialTheme>
  );
}
