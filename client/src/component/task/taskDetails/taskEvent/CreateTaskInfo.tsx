import { Flex, Box } from "@chakra-ui/react";
import useAuthContext from "../../../../context/auth/useAuthContext";
import useTaskDetailContext from "../../../../context/task_detail/useTaskDetailContext";
import { calculateTime } from "../../../../utils/calculateTime";

type Props = {};

export default function TaskCreatorInfo({}: Props) {
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

      <Box opacity="65%">{calculateTime(new Date(task?.createdAt!))}</Box>
    </Flex>
  );
}
