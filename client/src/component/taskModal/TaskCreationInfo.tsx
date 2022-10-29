import { Box, Tooltip } from "@chakra-ui/react";
import React from "react";
import useTaskDetailContext from "../../context/task_detail/useTaskDetailContext";

type Props = {};

export default function TaskCreationInfo({}: Props) {
  const { task } = useTaskDetailContext();

  return (
    <Tooltip
      my={2}
      hasArrow
      placement="top"
      fontWeight="semibold"
      label={
        <Box>
          <Box>{`Created at: ${task?.createdAt}`}</Box>
          <Box>{`Updated at: ${task?.updatedAt}`}</Box>
        </Box>
      }
    >
      <Box fontSize="small" height="35px" mr={4}>
        <Box opacity="50%">CREATED</Box>
        <Box opacity="65%">
          {new Date(task?.createdAt!).toLocaleDateString()}
        </Box>
      </Box>
    </Tooltip>
  );
}
