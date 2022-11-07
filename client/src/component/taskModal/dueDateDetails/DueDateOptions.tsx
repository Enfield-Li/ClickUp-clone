import { Box, useColorModeValue } from "@chakra-ui/react";
import useAuthContext from "../../../context/auth/useAuthContext";
import { SetTask } from "../../../context/task_detail/TaskDetailContextTypes";
import useTaskDetailContext, {
  updateTaskPriorityOrDueDate,
} from "../../../context/task_detail/useTaskDetailContext";
import { capitalizeFirstLetter } from "../../../utils/capitalizeFirstLetter";
import { getRandomNumberNoLimit } from "../../../utils/getRandomNumber";
import { getLookUpDueDateTable } from "../../task/actions/columnProcessing";
import {
  DueDateColumn,
  DUE_DATE,
  SelectableDueDate,
  SetState,
  SortBy,
  Task,
  UpdateEvent,
} from "../../task/taskTypes";

type Props = {
  task: Task;
  sortBy: SortBy;
  setTask?: SetTask;
  setState: SetState;
  onClose: () => void;
};

export default function DueDateOptions({
  task,
  sortBy,
  setTask,
  setState,
  onClose,
}: Props) {
  const popoverContentHoverBgColor = useColorModeValue(
    "lightMain.100",
    "darkMain.200"
  );

  const { authState } = useAuthContext();
  const lookUpDueDate = getLookUpDueDateTable();

  const { taskStateContext } = useTaskDetailContext();
  const { columnOptions } = taskStateContext!;

  function handleSelect(targetColumn: DueDateColumn) {
    const weekString = targetColumn.title;
    const expectedDueDate = lookUpDueDate[weekString as SelectableDueDate];

    // Update list state
    updateTaskPriorityOrDueDate(
      sortBy,
      task!,
      setState,
      DUE_DATE,
      targetColumn.id,
      expectedDueDate
    );

    const newEvent: UpdateEvent = {
      id: getRandomNumberNoLimit(),
      userId: authState.user?.id,
      taskId: task!.id!,
      field: DUE_DATE,
      beforeUpdate: String(task?.dueDate),
      afterUpdate: String(targetColumn.id),
      createdAt: new Date(),
    };

    // Update task state
    if (setTask) {
      setTask({
        ...task!,
        expectedDueDate,
        dueDate: targetColumn.id,
        taskEvents: [...task!.taskEvents, newEvent],
      });
    }

    onClose();
  }

  return (
    <>
      {columnOptions.dueDate.map(
        (column, index) =>
          column.title !== "NO DUE DATE" &&
          column.title !== "FINISHED" && (
            <Box
              p={2}
              pl={4}
              key={index}
              cursor="pointer"
              onClick={() => handleSelect(column)}
              _hover={{ backgroundColor: popoverContentHoverBgColor }}
            >
              {capitalizeFirstLetter(column.title.toString())}
            </Box>
          )
      )}
    </>
  );
}
