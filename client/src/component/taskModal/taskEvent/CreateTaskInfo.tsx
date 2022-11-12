import { Flex, Box, Center } from "@chakra-ui/react";
import { memo } from "react";
import useAuthContext from "../../../context/auth/useAuthContext";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import { calculateTime } from "../../../utils/calculateTime";

type Props = {};

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
          {authState.user?.id === task?.creatorId ? (
            <Box color="purple.400">You</Box>
          ) : (
            <Box>{task?.creatorName}</Box>
          )}
        </Box>

        {/* Created this task */}
        <Box opacity="65%">&nbsp;created this task</Box>
      </Flex>

      <Center opacity="65%">{calculateTime(new Date(task?.createdAt!))}</Center>
    </Flex>
  );
}
export default memo(TaskCreatorInfo);
