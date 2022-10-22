import { Box, Center, Divider, Flex } from "@chakra-ui/react";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import { getRandomNumberNoLimit } from "../../../utils/getRandomNumber";
import { isCommentEvent } from "../../../utils/isComment";
import CommentEvents from "./taskEvent/CommentEvents";
import DueDateDetails from "./dueDateDetails/DueDateDetails";
import UpdateEvents from "./taskEvent/updateEvents";
import TaskCreatorInfo from "./taskEvent/CreateTaskInfo";

type Props = {};

export default function TaskEvent({}: Props) {
  const { task } = useTaskDetailContext();

  return (
    <Box flexBasis={"50%"}>
      <Flex
        py={4}
        pl={4}
        mr={4}
        borderBottom="1px"
        borderBottomColor="gray.500"
      >
        {/* Created at */}
        <Box fontSize="small" height="35px" mr={2}>
          <Box opacity="50%">CREATED</Box>
          <Box opacity="65%">{task?.createdAt?.toLocaleDateString()}</Box>
        </Box>

        <Center mx={4}>
          <Divider orientation="vertical" borderColor="gray.500" />
        </Center>

        {/* DueDate */}
        <Box mx={4}>
          <DueDateDetails />
        </Box>
      </Flex>

      <Flex
        px={3}
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
        <TaskCreatorInfo />
      </Flex>
    </Box>
  );
}
