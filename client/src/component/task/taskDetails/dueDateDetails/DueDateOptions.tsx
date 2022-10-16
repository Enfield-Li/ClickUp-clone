import { Box, Flex, Select } from "@chakra-ui/react";
import React from "react";
import useTaskDetailContext from "../../../../context/task_detail/useTaskDetailContext";
import { capitalizeFirstLetter } from "../../../../utils/capitalizeFirstLetter";

type Props = { onOptionClose: () => void };

export default function DueDateOptions({ onOptionClose }: Props) {
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
    <Flex>
      <Box>
        {columnOptions.dueDate.map(
          (dueDate) =>
            dueDate.id !== 0 &&
            dueDate.id !== task?.dueDate && (
              <Box
                p={2}
                pl={4}
                key={dueDate.id}
                cursor="pointer"
                _hover={{ backgroundColor: "blue.600" }}
              >
                {capitalizeFirstLetter(dueDate.title.toLowerCase())}
              </Box>
            )
        )}
      </Box>
      calendar
    </Flex>
  );
}
