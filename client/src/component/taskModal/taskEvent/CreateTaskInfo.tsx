import { Flex, Box, Center } from "@chakra-ui/react";
import { memo } from "react";
import useAuthContext from "../../../context/auth/useAuthContext";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import { calculateTime } from "../../../utils/calculateTime";

type Props = {};

export default memo(TaskCreatorInfo);
function TaskCreatorInfo({}: Props) {
  const { authState } = useAuthContext();
  const { task } = useTaskDetailContext();

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
          {authState.user?.id === task?.creator.userId ? (
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
