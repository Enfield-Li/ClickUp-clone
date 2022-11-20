import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import { memo } from "react";
import useAuthContext from "../../../context/auth/useAuthContext";
import { SetTask } from "../../../context/task_detail/TaskDetailContextTypes";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import { DueDateColumn, DueDateRange, Task } from "../../../types";
import { capitalizeFirstLetter } from "../../../utils/capitalizeFirstLetter";
import { handleSelectDueDateOptions } from "../../task/actions/handleSelectDueDateOptions";

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
    handleSelectDueDateOptions(task, authState, setTaskState, targetColumn);
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
