import { Box } from "@chakra-ui/react";
import { TextField } from "@mui/material";
import { StaticDatePicker } from "@mui/x-date-pickers";
import useAuthContext from "../../../context/auth/useAuthContext";
import { SetTask } from "../../../context/task_detail/TaskDetailContextTypes";
import { updateTaskPriorityOrDueDate } from "../../../context/task_detail/useTaskDetailContext";
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
  sortBy: SortBy;
  setState: SetState;
  onClose: () => void;
  expectedDueDate?: Date;
  columnOptions: ColumnOptions;
  setExpectedDueDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
};

export default function DatePicker({
  task,
  sortBy,
  setState,
  onClose,
  columnOptions,
  expectedDueDate,
  setExpectedDueDate,
}: Props) {
  const { authState } = useAuthContext();

  return (
    <Box>
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
                newValue
              );
            }
          }}
        />
      </MaterialTheme>
    </Box>
  );
}

function handleDatePicker(
  task: Task,
  userId: number,
  sortBy: SortBy,
  setState: SetState,
  onClose: () => void,
  columnOptions: ColumnOptions,
  expectedDueDate: Date,
  setTask?: SetTask
) {
  if (expectedDueDate) {
    const targetDueDateColumnId = getDueDateFromExpectedDueDateString(
      columnOptions.dueDate,
      expectedDueDate
    );

    // Do nothing when it comes to selecting the same day
    const isSameDay = targetDueDateColumnId === task?.dueDate;
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
      expectedDueDate
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
        expectedDueDate,
        taskEvents: [...task!.taskEvents, newEvent],
      });
    }

    onClose();
  }
}
