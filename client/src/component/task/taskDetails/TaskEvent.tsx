import { Flex, Box } from "@chakra-ui/react";
import React from "react";
import { Task } from "../Data";

type Props = { task: Task };

export default function TaskEvent({ task }: Props) {
  return (
    <Box flexBasis={"50%"}>
      <Flex justifyContent={"space-evenly"} my={3}>
        <Box>Stats 1</Box>
        <Box>Task dueDate: {task.dueDate}</Box>
      </Flex>
      <Box>Events</Box>
    </Box>
  );
}
