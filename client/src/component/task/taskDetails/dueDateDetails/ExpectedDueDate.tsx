import {
  Box,
  Center,
  Flex,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from "@chakra-ui/react";
import produce from "immer";
import { useState } from "react";
import useTaskDetailContext, {
  updateTaskPriorityOrDueDate,
} from "../../../../context/task_detail/useTaskDetailContext";
import DueDateOptions from "./DueDateOptions";

type Props = {};

export default function ExpectedDueDate({}: Props) {
  const {
    task,
    setTask,
    isModalOpen,
    onModalOpen,
    onModalClose,
    taskStateContext,
    setTaskStateContext,
  } = useTaskDetailContext();

  const { setState, sortBy, columnOptions } = taskStateContext!;

  const [showDeleteButton, setShowDeleteButton] = useState(false);

  return (
    <Box fontSize="small" height="35px">
      <Box opacity="50%">DUE DATE</Box>
      <Flex
        cursor="pointer"
        _hover={{ textDecoration: "underline" }}
        onMouseOverCapture={() => setShowDeleteButton(true)}
        onMouseOutCapture={() => setShowDeleteButton(false)}
      >
        <Popover>
          {({ onClose: onOptionClose, isOpen: isOptionOpen }) => (
            // https://chakra-ui.com/docs/components/popover/usage#accessing-internal-state
            <>
              <Tooltip
                my={2}
                hasArrow
                placement="top"
                label={
                  <Box>
                    Time:&nbsp;
                    {new Date(task?.expectedDueDate!).toLocaleTimeString()}
                  </Box>
                }
                fontWeight="semibold"
              >
                <Box display="inline-block">
                  <PopoverTrigger>
                    <Center opacity="65%">
                      {new Date(task?.expectedDueDate!).toLocaleDateString()}
                    </Center>
                  </PopoverTrigger>
                </Box>
              </Tooltip>

              {/* DueDate option */}
              <PopoverContent width="200px">
                <PopoverBody shadow={"2xl"} p={0}>
                  <DueDateOptions isOptionOpen={isOptionOpen} />
                </PopoverBody>
              </PopoverContent>
            </>
          )}
        </Popover>

        {/* Delete button */}
        {showDeleteButton && (
          <Center
            p={1}
            color="red"
            opacity="65%"
            fontSize="8px"
            onClick={() => {
              setTask({ ...task!, expectedDueDate: undefined });

              // Update list state
              updateTaskPriorityOrDueDate(
                sortBy,
                task!,
                setState,
                "dueDate",
                1, // No due date
                undefined
              );
            }}
          >
            <i className="bi bi-x-circle-fill"></i>
          </Center>
        )}
      </Flex>
    </Box>
  );
}
