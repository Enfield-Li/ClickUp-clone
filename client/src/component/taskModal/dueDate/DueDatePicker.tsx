import { TextField } from "@mui/material";
import { StaticDatePicker } from "@mui/x-date-pickers";
import { memo } from "react";
import { useAuth } from "../../../context/auth/useAuth";
import { useTaskDetail } from "../../../context/task_detail/useTaskDetail";
import { GroupBy, Task } from "../../../types";
import MaterialTheme from "../../../utils/MaterialTheme";
import { getDueDateColumnIdFromExpectedDueDate } from "../../task/actions/taskProcessing";
import { updateTaskAttribute } from "../../task/actions/updateTaskAttributes";

type Props = {
  task: Task;
  onClose: () => void;
};

export default memo(DueDatePicker);
function DueDatePicker({ task, onClose }: Props) {
  const { user } = useAuth();
  const { taskStateContext } = useTaskDetail();
  const { groupBy, setTaskState, columnOptions } = taskStateContext!;

  function handleDatePicker(expectedDueDateInput: Date) {
    if (expectedDueDateInput && task && user?.id) {
      const targetDueDateColumnId = getDueDateColumnIdFromExpectedDueDate(
        columnOptions.dueDateColumns,
        expectedDueDateInput
      );

      // Update list taskState
      updateTaskAttribute({
        groupBy: groupBy,
        setTaskState,
        currentTask: task,
        userId: user.id,
        targetField: GroupBy.DUE_DATE,
        targetColumnId: targetDueDateColumnId,
        expectedDueDate: expectedDueDateInput,
      });

      onClose();
    }
  }

  return (
    <MaterialTheme>
      <StaticDatePicker
        value={task.expectedDueDate}
        displayStaticWrapperAs="desktop"
        renderInput={(params) => <TextField {...params} />}
        onChange={(newValue) => newValue && handleDatePicker(newValue)}
      />
    </MaterialTheme>
  );
}
