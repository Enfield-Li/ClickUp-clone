import { Box, Center, Flex } from "@chakra-ui/react";
import { memo } from "react";
import { useAuth } from "../../../context/auth/useAuth";
import { CommentEvent } from "../../../types";
import { calculateTime } from "../../../utils/calculateTime";

type Props = { commentEvent: CommentEvent };

export default memo(CommentEvents);
function CommentEvents({ commentEvent }: Props) {
  const { user } = useAuth();

  return (
    <Flex my={1}>
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

      {/* Content */}
      <Box backgroundColor={"blackAlpha.300"} p={3} rounded="md" width="100%">
        <Flex fontSize="small" justifyContent="space-between">
          <Flex>
            {/* Someone */}
            <Center
              p={1}
              rounded="sm"
              cursor="pointer"
              fontWeight="bold"
              _hover={{
                backgroundSize: "120% 120%",
                backgroundColor: "blackAlpha.300",
              }}
            >
              {user!.id === commentEvent.userId ? "You" : commentEvent.username}
            </Center>
            {/* Commented */}
            <Center opacity="65%">
              <span>&nbsp;</span>commented
            </Center>
          </Flex>

          {/* Update date ago */}
          <Center opacity="65%" fontSize="small">
            {calculateTime(commentEvent.createdAt!)}
          </Center>
        </Flex>

        {/* Comment content */}
        <Box ml={3} mt={1} overflowWrap="break-word" wordBreak="break-all">
          {commentEvent.comment}
        </Box>
      </Box>
    </Flex>
  );
}
