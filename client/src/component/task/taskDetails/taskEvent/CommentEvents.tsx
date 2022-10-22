import { Box, Center, Flex } from "@chakra-ui/react";
import useAuthContext from "../../../../context/auth/useAuthContext";
import { calculateTime } from "../../../../utils/calculateTime";
import { CommentEvent } from "../../taskTypes";

type Props = { commentEvent: CommentEvent };

export default function CommentEvents({ commentEvent }: Props) {
  const { authState } = useAuthContext();

  return (
    <Flex>
      <Center
        ml={1}
        mr={3}
        width="30px"
        height="30px"
        rounded="full"
        border="solid 1px"
      >
        {commentEvent.username[0]}
      </Center>
      <Box backgroundColor={"blackAlpha.300"} p={4} rounded="md" width="100%">
        <Flex fontSize="small" justifyContent="space-between">
          <Flex>
            <Box fontWeight="bold">
              {authState.user!.id === commentEvent.userId
                ? "You"
                : commentEvent.username[0]}
            </Box>
            <Box opacity="65%">&nbsp;commented</Box>
          </Flex>

          <Box opacity="65%" fontSize="small">
            {calculateTime(commentEvent.updatedAt!)}
          </Box>
        </Flex>

        <Box mt={3} ml={2} overflowWrap="break-word" wordBreak="break-all">
          {commentEvent.comment}
        </Box>
      </Box>
    </Flex>
  );
}
