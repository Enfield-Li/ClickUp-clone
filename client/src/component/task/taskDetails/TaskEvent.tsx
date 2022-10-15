import { Box, Flex } from "@chakra-ui/react";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";

type Props = {};

export default function TaskEvent({}: Props) {
  const {
    task,
    isOpen,
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
        <Box>Task dueDate: {task!.dueDate}</Box>
      </Flex>
      <Box>Events</Box>
    </Box>
  );
}
