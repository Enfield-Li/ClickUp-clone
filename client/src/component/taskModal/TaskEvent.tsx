import { Box, Center, Divider, Flex, Spinner } from "@chakra-ui/react";
import { useRef, useEffect, useState, memo } from "react";
import useTaskDetailContext from "../../context/task_detail/useTaskDetailContext";
import { isCommentEvent, isAssignmentEvent } from "../../utils/determineEvent";
import { fetchTaskEvents } from "../task/actions/TaskActions";
import DueDateDetails from "./dueDateDetails/DueDateDetails";
import TaskCreationInfo from "./TaskCreationInfo";
import AssignmentEvents from "./taskEvent/AssignmentEvents";
import CommentEvents from "./taskEvent/CommentEvents";
import TaskCreatorInfo from "./taskEvent/CreateTaskInfo";
import UpdateEvents from "./taskEvent/updateEvents";

type Props = {};

function TaskEvent({}: Props) {
  const { task, setTask } = useTaskDetailContext();
  const [loadingTaskEvents, setLoadingTaskEvents] = useState<boolean>();

  useEffect(() => {
    getTaskEvents();

    async function getTaskEvents() {
      if (task?.id) {
        setLoadingTaskEvents(true);
        const events = await fetchTaskEvents(task.id);
        if (events) setTask({ ...task, taskEvents: events });
        setLoadingTaskEvents(false);
      }
    }
  }, []);

  // https://stackoverflow.com/a/52266212/16648127
  const bottomDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (task?.taskEvents.length)
      bottomDivRef.current?.scrollIntoView({ behavior: "auto" });
  }, [task?.taskEvents.length]);

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
        <TaskCreationInfo />

        {/* Divider */}
        <Center mx={4}>
          <Divider orientation="vertical" borderColor="gray.500" />
        </Center>

        {/* DueDate */}
        <Box mx={4}>
          <DueDateDetails />
        </Box>
      </Flex>

      {/* Events */}
      <Flex
        px={3}
        height="335px"
        overflow="auto"
        flexDirection="column"
        // https://stackoverflow.com/questions/18614301/keep-overflow-div-scrolled-to-bottom-unless-user-scrolls-up
      >
        {loadingTaskEvents ? (
          <Center mt={3} opacity="80%">
            <Spinner />
          </Center>
        ) : (
          <>
            <TaskCreatorInfo />
            {task?.taskEvents.map((event) => (
              <Box key={event.id}>
                <Box py={1}>
                  {isCommentEvent(event) ? (
                    <CommentEvents commentEvent={event} />
                  ) : isAssignmentEvent(event) ? (
                    <AssignmentEvents assignmentEvent={event} />
                  ) : (
                    <UpdateEvents updateEvent={event} />
                  )}
                </Box>
              </Box>
            ))}
          </>
        )}

        <div ref={bottomDivRef} />
      </Flex>
    </Box>
  );
}
export default memo(TaskEvent);
