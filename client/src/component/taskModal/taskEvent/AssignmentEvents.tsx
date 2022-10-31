import { Flex, Box } from "@chakra-ui/react";
import useAuthContext from "../../../context/auth/useAuthContext";
import { calculateTime } from "../../../utils/calculateTime";
import { AssignmentEvent } from "../../task/taskTypes";

type Props = { assignmentEvent: AssignmentEvent };

export default function AssignmentEvents({ assignmentEvent }: Props) {
  const { authState } = useAuthContext();
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
          {authState.user!.id === assignmentEvent.userId ? (
            <Box color="purple.400">You</Box>
          ) : (
            <Box opacity="65%">{assignmentEvent.username}</Box>
          )}
        </Box>

        <Box opacity="65%">
          {assignmentEvent.assignmentAction}&nbsp;{assignmentEvent.field}:&nbsp;
        </Box>

        <Box
          p={1}
          rounded="sm"
          cursor="pointer"
          _hover={{
            backgroundSize: "120% 120%",
            backgroundColor: "blackAlpha.300",
          }}
        >
          {authState.user!.id === assignmentEvent.assignedUser.userId ? (
            <Box color="purple.400">You</Box>
          ) : (
            <Box>{assignmentEvent.assignedUser.username}</Box>
          )}
        </Box>
      </Flex>

      <Box opacity="65%">{calculateTime(assignmentEvent.createdAt!)}</Box>
    </Flex>
  );
}