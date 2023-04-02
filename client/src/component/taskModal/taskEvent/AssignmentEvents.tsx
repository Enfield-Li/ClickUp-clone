import { Box, Flex } from "@chakra-ui/react";
import { memo } from "react";
import { useAuth } from "../../../context/auth/useAuth";
import { AssignmentEvent } from "../../../types";
import { calculateTime } from "../../../utils/calculateTime";

type Props = { assignmentEvent: AssignmentEvent };

export default memo(AssignmentEvents);
function AssignmentEvents({ assignmentEvent }: Props) {
  const { user } = useAuth();
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
          {user!.id === assignmentEvent.userId ? (
            <Box color="purple.400">You</Box>
          ) : (
            <Box opacity="65%">{assignmentEvent.username}</Box>
          )}
        </Box>

        <Box opacity="65%">
          {assignmentEvent.assignmentAction}
          <span>&nbsp;</span>
          {assignmentEvent.field}:<span>&nbsp;</span>
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
          {user!.id === assignmentEvent.assignedUser.userId ? (
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
