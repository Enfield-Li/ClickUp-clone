import { Box, Flex } from "@chakra-ui/react";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import { getRandomNumberNoLimit } from "../../../utils/getRandomNumber";
import { isCommentEvent } from "../../../utils/isComment";
import CommentEvents from "./taskEvent/CommentEvents";
import DueDateDetails from "./dueDateDetails/DueDateDetails";
import UpdateEvents from "./taskEvent/updateEvents";

type Props = {};

export default function TaskEvent({}: Props) {
  const { task } = useTaskDetailContext();

  return (
    <Box flexBasis={"50%"}>
      <Flex justifyContent={"space-evenly"} my={3}>
        <Flex flexDirection="column">
          <Box opacity="50%">CREATED</Box>
          <Box opacity="65%">{task?.createdAt?.toLocaleDateString()}</Box>
        </Flex>
        <DueDateDetails />
      </Flex>

      <Flex
        px={4}
        height="335px"
        overflow="auto"
        flexDirection="column-reverse"
        // https://stackoverflow.com/questions/18614301/keep-overflow-div-scrolled-to-bottom-unless-user-scrolls-up
      >
        {task?.taskEvents.map((event) => (
          <Box key={event.id}>
            {isCommentEvent(event) ? (
              <Box py={1}>
                <CommentEvents commentEvent={event} />
              </Box>
            ) : (
              <Box py={1}>
                <UpdateEvents updateEvent={event} />
              </Box>
            )}
          </Box>
        ))}
      </Flex>
    </Box>
  );
}
