import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import { memo } from "react";
import useAuthContext from "../../../context/auth/useAuthContext";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import { DueDateColumn, DueDateRange, SortBy, Task } from "../../../types";
import { capitalizeFirstLetter } from "../../../utils/capitalizeFirstLetter";
import { getExpectedDueDateFromWeekString } from "../../task/actions/columnProcessing";
import { updateTaskAttribute } from "../../task/actions/updateTaskAttributes";

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

    // Update list taskState
    updateTaskAttribute(
      authState.user!.id!,
      sortBy,
      SortBy.DUE_DATE,
      task!,
      setTaskState,
      targetColumn.id!,
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
