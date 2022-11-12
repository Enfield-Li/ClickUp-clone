import {
  Box,
  Center,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { memo } from "react";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import { Task } from "../../../types";
import DueDateSwitch from "./DueDateSwitch";

type Props = {
  task: Task;
  children: React.ReactNode;
  setIsPopoverOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

function SelectDueDateIcon({ task, children, setIsPopoverOpen }: Props) {
  const popoverContentBgColor = useColorModeValue("white", "darkMain.100");

  const {
    setTask,
    isModalOpen,
    onModalOpen,
    onModalClose,
    taskStateContext,
    setTaskStateContext,
  } = useTaskDetailContext();

  return (
    <Popover
      placement="bottom"
      onOpen={() => setIsPopoverOpen && setIsPopoverOpen(true)}
      onClose={() => setIsPopoverOpen && setIsPopoverOpen(false)}
    >
      {({ onClose, isOpen: isOptionOpen }) => (
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
                <Box _hover={{ color: "purple.400", opacity: "100%" }}>
                  {children}
                </Box>
              </PopoverTrigger>
            </Box>
          </Tooltip>

          {/* DueDate option */}
          <PopoverContent
            width="383px"
            borderRadius="0px"
            bgColor={popoverContentBgColor}
          >
            <PopoverBody shadow={"2xl"} p={0}>
              <DueDateSwitch task={task!} onClose={onClose} />
            </PopoverBody>
          </PopoverContent>
        </>
      )}
    </Popover>
  );
}
export default memo(SelectDueDateIcon);
