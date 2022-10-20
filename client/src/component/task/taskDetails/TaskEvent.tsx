import { Box, Flex } from "@chakra-ui/react";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import { capitalizeFirstLetter } from "../../../utils/capitalizeFirstLetter";
import { isComment } from "../../../utils/isComment";
import DueDateDetails from "./dueDateDetails/DueDateDetails";

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

  return (
    <Box flexBasis={"50%"}>
      <Flex justifyContent={"space-evenly"} my={3}>
        <Box>Stats 1</Box>

        <DueDateDetails />
      </Flex>
      <Box m={3}>
        <Box>Events:</Box>
        <Box>
          {task?.taskEvents.map(
            (event) => isComment(event) && <Box>{event.content}</Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
