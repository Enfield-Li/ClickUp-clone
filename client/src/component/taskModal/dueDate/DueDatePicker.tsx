import { Box } from "@chakra-ui/react";
import { TextField } from "@mui/material";
import { StaticDatePicker } from "@mui/x-date-pickers";
import { memo } from "react";
import useAuthContext from "../../../context/auth/useAuthContext";
import { SetTask } from "../../../context/task_detail/TaskDetailContextTypes";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import { updateTaskPriorityOrDueDate } from "../../task/actions/updateTaskPriorityOrDueDate";
import {
  ColumnOptions,
  DUE_DATE,
  SetState,
  SortBy,
  Task,
  UpdateEvent,
} from "../../../types";
import { getRandomNumberNoLimit } from "../../../utils/getRandomNumber";
import { getDueDateFromExpectedDueDateString } from "../../task/actions/taskProcessing";
import MaterialTheme from "../../test-dev/MaterialTheme";

type Props = {
  task: Task;
  setTask?: SetTask;
  onClose: () => void;
  expectedDueDate?: Date;
  setExpectedDueDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
};

function DueDatePicker({
  task,
  setTask,
  onClose,
  expectedDueDate,
  setExpectedDueDate,
}: Props) {
  const { authState } = useAuthContext();
  const { taskStateContext } = useTaskDetailContext();
  const { setState, sortBy, columnOptions } = taskStateContext!;

  return (
    <MaterialTheme>
      <StaticDatePicker
        value={expectedDueDate}
        displayStaticWrapperAs="desktop"
        renderInput={(params) => <TextField {...params} />}
        onChange={(newValue) => {
          if (newValue) {
            setExpectedDueDate(newValue);

            handleDatePicker(
              task,
              authState.user!.id,
              sortBy,
              setState,
              onClose,
              columnOptions,
              newValue,
              setTask
            );
          }
        }}
      />
    </MaterialTheme>
  );
}

export default memo(DueDatePicker);

function handleDatePicker(
  task: Task,
  userId: number,
  sortBy: SortBy,
  setState: SetState,
  onClose: () => void,
  columnOptions: ColumnOptions,
  expectedDueDateInput: Date,
  setTask?: SetTask
) {
  if (expectedDueDateInput) {
    const targetDueDateColumnId = getDueDateFromExpectedDueDateString(
      columnOptions.dueDate,
      expectedDueDateInput
    );

    // Do nothing when it comes to selecting the same day
    const isSameDay = targetDueDateColumnId === task.dueDate;
    if (isSameDay) {
      onClose();
      return;
    }

    // Update list state
    updateTaskPriorityOrDueDate(
      sortBy,
      task!,
      setState,
      DUE_DATE,
      targetDueDateColumnId,
      expectedDueDateInput
    );

    const newEvent: UpdateEvent = {
      id: getRandomNumberNoLimit(),
      userId,
      taskId: task!.id!,
      field: DUE_DATE,
      beforeUpdate: String(task?.dueDate),
      afterUpdate: String(targetDueDateColumnId),
      createdAt: new Date(),
    };

    // Update modal task state
    if (setTask) {
      setTask({
        ...task!,
        expectedDueDate: expectedDueDateInput,
        taskEvents: [...task!.taskEvents, newEvent],
      });
    }

    onClose();
  }
}
