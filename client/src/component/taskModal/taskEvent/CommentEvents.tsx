import { Box, Center, Flex } from "@chakra-ui/react";
import useAuthContext from "../../../context/auth/useAuthContext";
import { calculateTime } from "../../../utils/calculateTime";
import { CommentEvent } from "../../task/taskTypes";

type Props = { commentEvent: CommentEvent };

export default function CommentEvents({ commentEvent }: Props) {
  const { authState } = useAuthContext();

  return (
    <Flex>
      {/* User profile picture */}
      <Center
        ml={1}
        mr={3}
        width="30px"
        height="30px"
        rounded="full"
        border="solid 1px"
      >
        {commentEvent.username?.[0]}
      </Center>
      <Box backgroundColor={"blackAlpha.300"} p={4} rounded="md" width="100%">
        <Flex fontSize="small" justifyContent="space-between">
          <Flex>
            {/* Someone */}
            <Box fontWeight="bold">
              {authState.user!.id === commentEvent.userId
                ? "You"
                : commentEvent.username}
            </Box>
            {/* Commented */}
            <Box opacity="65%">&nbsp;commented</Box>
          </Flex>

          {/* Update date ago */}
          <Box opacity="65%" fontSize="small">
            {calculateTime(commentEvent.createdAt!)}
          </Box>
        </Flex>

        {/* Comment content */}
        <Box mt={3} ml={2} overflowWrap="break-word" wordBreak="break-all">
          {commentEvent.comment}
        </Box>
      </Box>
    </Flex>
  );
}
