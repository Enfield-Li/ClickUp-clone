import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import { memo } from "react";
import { useAuth } from "../../../context/auth/useAuth";
import { useTaskDetail } from "../../../context/task_detail/useTaskDetail";
import { DueDateColumn, DueDateRange, GroupBy, Task } from "../../../types";
import { capitalizeFirstLetter } from "../../../utils/capitalizeFirstLetter";
import { getExpectedDueDateFromWeekString } from "../../task/actions/columnProcessing";

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

  const { user } = useAuth();
  const { taskStateContext, updateTaskAttribute } = useTaskDetail();
  const { groupBy, columnOptions } = taskStateContext!;

  function handleOnClick(targetColumn: DueDateColumn) {
    onClose();
    const weekString = targetColumn.title;
    const expectedDueDate = getExpectedDueDateFromWeekString(weekString);

    // Update list taskState
    updateTaskAttribute({
      groupBy,
      expectedDueDate,
      currentTask: task!,
      userId: user!.id!,
      targetField: GroupBy.DUE_DATE,
      targetColumnId: targetColumn.id!,
    });
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
