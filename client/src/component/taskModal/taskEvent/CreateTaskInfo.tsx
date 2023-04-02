import { Box, Center, Flex } from "@chakra-ui/react";
import { memo } from "react";
import { useAuth } from "../../../context/auth/useAuth";
import { useTaskDetail } from "../../../context/task_detail/useTaskDetail";
import { calculateTime } from "../../../utils/calculateTime";

type Props = {};

export default memo(TaskCreatorInfo);
function TaskCreatorInfo({}: Props) {
  const { user } = useAuth();
  const { task } = useTaskDetail();

  return (
    <Flex justifyContent="space-between" fontSize="small">
      <Flex alignItems="center">
        {/* Someone */}
        <Box
          p={1}
          rounded="sm"
          cursor="pointer"
          _hover={{
            backgroundSize: "120% 120%",
            backgroundColor: "blackAlpha.300",
          }}
        >
          {user?.id === task?.creator.userId ? (
            <Box color="purple.400">You</Box>
          ) : (
            <Box>{task?.creator.username}</Box>
          )}
        </Box>

        {/* Created this task */}
        <Box opacity="65%">
          <span>&nbsp;</span>created this task
        </Box>
      </Flex>

      <Center opacity="65%">{calculateTime(new Date(task?.createdAt!))}</Center>
    </Flex>
  );
}
