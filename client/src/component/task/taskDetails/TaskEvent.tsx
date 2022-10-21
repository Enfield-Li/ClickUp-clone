import { Box, Flex } from "@chakra-ui/react";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import { getRandomNumberNoLimit } from "../../../utils/getRandomNumber";
import { isCommentEvent } from "../../../utils/isComment";
import CommentEvents from "./taskEvent/CommentEvents";
import DueDateDetails from "./dueDateDetails/DueDateDetails";
import UpdateEvents from "./taskEvent/updateEvents";

type Props = {};

export default function TaskEvent({}: Props) {
  const {
    task,
    isModalOpen,
    setTask,
    onModalOpen,
    onModalClose,
    taskStateContext,
    setTaskStateContext,
  } = useTaskDetailContext();

  const { setState, sortBy, columnOptions } = taskStateContext!;
  console.log({ task });

  return (
    <Box flexBasis={"50%"}>
      <Flex justifyContent={"space-evenly"} my={3}>
        <Box>Stats 1</Box>
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
          <Box key={getRandomNumberNoLimit()}>
            {isCommentEvent(event) ? (
              <Box my={2}>
                <CommentEvents commentEvent={event} />
              </Box>
            ) : (
              <Box my={2}>
                <UpdateEvents updateEvent={event} />
              </Box>
            )}
          </Box>
        ))}
      </Flex>
    </Box>
  );
}
