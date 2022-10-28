import {
  Box,
  Center,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from "@chakra-ui/react";
import React from "react";
import useTaskDetailContext from "../../../../context/task_detail/useTaskDetailContext";
import DueDateOptions from "./DueDateOptions";

type Props = {};

export default function DueDatePicker({}: Props) {
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
  const isTaskFinished = task?.dueDate === 0 || task?.dueDate === 1;

  return (
    <Popover>
      {({ onClose: onOptionClose, isOpen: isOptionOpen }) => (
        // https://chakra-ui.com/docs/components/popover/usage#accessing-internal-state
        <>
          <Tooltip
            my={2}
            hasArrow
            placement="top"
            label={"Due date"}
            fontWeight="semibold"
          >
            <Box display="inline-block">
              <PopoverTrigger>
                <Center
                  width="35px"
                  height="35px"
                  opacity="55%"
                  fontSize={"17px"}
                  cursor={"pointer"}
                  border="1px dashed"
                  borderRadius={"50%"}
                  _hover={{ color: "purple.400", opacity: "100%" }}
                >
                  <i className="bi bi-calendar2-check"></i>
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
  );
}
