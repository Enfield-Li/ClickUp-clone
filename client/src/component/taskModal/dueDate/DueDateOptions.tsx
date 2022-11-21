import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import { memo } from "react";
import { AuthStateType } from "../../../context/auth/AuthContextTypes";
import useAuthContext from "../../../context/auth/useAuthContext";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import {
  DueDateColumn,
  DueDateRange,
  SetTaskState,
  SortBy,
  Task,
} from "../../../types";
import { capitalizeFirstLetter } from "../../../utils/capitalizeFirstLetter";
import { getExpectedDueDateFromWeekString } from "../../task/actions/columnProcessing";
import {
  newUpdateEvent,
  updateTaskPriorityOrDueDate,
} from "../../task/actions/updateTaskAttributes";

type Props = {
  task: Task;
  onClose: () => void;
};

export default memo(DueDateOptions);
function DueDateOptions({ task, onClose }: Props) {
  const popoverContentHoverBgColor = useColorModeValue(
    "lightMain.100",
    "darkMain.300"
  );
  const bgColor = useColorModeValue("lightMain.50", "darkMain.200");

  const { authState } = useAuthContext();
  const { taskStateContext } = useTaskDetailContext();
  const { setTaskState, sortBy, columnOptions } = taskStateContext!;

  function handleOnClick(targetColumn: DueDateColumn) {
    onClose();
    const weekString = targetColumn.title;
    const expectedDueDate = getExpectedDueDateFromWeekString(weekString);

    const newEvent = newUpdateEvent(
      authState.user!.id!,
      task.id!,
      SortBy.DUE_DATE,
      task.dueDate.columnId,
      targetColumn.id
    );

    // Update list taskState
    updateTaskPriorityOrDueDate(
      task!,
      setTaskState,
      targetColumn.id,
      newEvent,
      expectedDueDate
    );
  }

  return (
    <>
      {columnOptions.dueDateColumns.map((column, index) => {
        return (
          column.title !== DueDateRange.FUTURE &&
          column.title !== DueDateRange.OVER_DUE &&
          column.title !== DueDateRange.NO_DUE_DATE && (
            <Flex
              py={2}
              px={3}
              key={index}
              width="130px"
              fontSize="13px"
              cursor="pointer"
              bgColor={bgColor}
              justifyContent="space-between"
              onClick={() => handleOnClick(column)}
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
