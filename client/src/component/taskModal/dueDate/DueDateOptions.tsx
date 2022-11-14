import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import useAuthContext from "../../../context/auth/useAuthContext";
import { SetTask } from "../../../context/task_detail/TaskDetailContextTypes";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import { updateTaskPriorityOrDueDate } from "../../task/actions/updateTaskPriorityOrDueDate";
import { capitalizeFirstLetter } from "../../../utils/capitalizeFirstLetter";
import { getRandomNumberNoLimit } from "../../../utils/getRandomNumber";
import {
  getExpectedDueDateFromWeekString,
  getLookUpDueDateTable,
} from "../../task/actions/columnProcessing";
import {
  DueDateColumn,
  DUE_DATE,
  SelectableDueDate,
  SetState,
  SortBy,
  Task,
  UpdateEvent,
} from "../../../types";
import { memo } from "react";

type Props = {
  task: Task;
  setTask?: SetTask;
  onClose: () => void;
  setExpectedDueDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
};

function DueDateOptions({ task, setTask, onClose, setExpectedDueDate }: Props) {
  const popoverContentHoverBgColor = useColorModeValue(
    "lightMain.100",
    "darkMain.300"
  );
  const bgColor = useColorModeValue("lightMain.50", "darkMain.200");

  const { authState } = useAuthContext();
  const { taskStateContext } = useTaskDetailContext();
  const { setState, sortBy, columnOptions } = taskStateContext!;

  function handleSelect(targetColumn: DueDateColumn) {
    const weekString = targetColumn.title;
    const expectedDueDate = getExpectedDueDateFromWeekString(
      weekString as SelectableDueDate
    );
    setExpectedDueDate(expectedDueDate);

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

export default memo(DueDateOptions);
