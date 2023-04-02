import { Box, Tooltip } from "@chakra-ui/react";
import { memo } from "react";
import { useTaskDetail } from "../../context/task_detail/useTaskDetail";
import { toYYYYMMDDString } from "../../utils/getWeekDays";

type Props = {};

export default memo(TaskCreationInfo);
function TaskCreationInfo({}: Props) {
  const { task } = useTaskDetail();

  return (
    <Tooltip
      my={2}
      hasArrow
      placement="top"
      fontWeight="semibold"
      label={
        <Box>
          <Box>{`Created at: ${toYYYYMMDDString(task!.createdAt!)}`}</Box>
          <Box>{`Updated at: ${toYYYYMMDDString(task!.updatedAt!)}`}</Box>
        </Box>
      }
    >
      <Box fontSize="small" height="35px" mr={4}>
        <Box opacity="50%">CREATED</Box>
        <Box opacity="65%">
          {new Date(task?.createdAt!).toLocaleDateString()}
        </Box>
      </Box>
    </Tooltip>
  );
}
