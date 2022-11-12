import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
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
} from "../../../types";

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
    "darkMain.300"
  );
  const bgColor = useColorModeValue("white", "darkMain.200");

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
      {columnOptions.dueDate.map((column, index) => {
        return (
          column.title !== "FUTURE" &&
          column.title !== "OVER DUE" &&
          column.title !== "FINISHED" &&
          column.title !== "NO DUE DATE" && (
            <Flex
              py={2}
              px={3}
              key={index}
              width="130px"
              fontSize="13px"
              cursor="pointer"
              bgColor={bgColor}
              justifyContent="space-between"
              onClick={() => handleSelect(column)}
              _hover={{ backgroundColor: popoverContentHoverBgColor }}
            >
              <Box>{capitalizeFirstLetter(column.title.toString())}</Box>
              <Box opacity="60%" fontWeight="semibold">
                txt
              </Box>
            </Flex>
          )
        );
      })}
    </>
  );
}
