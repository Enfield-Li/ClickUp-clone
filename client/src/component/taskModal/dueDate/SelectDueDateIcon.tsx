import {
  Box,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { memo } from "react";
import { SetTask } from "../../../context/task_detail/TaskDetailContextTypes";
import { Task } from "../../../types";
import DueDatePanel from "./DueDatePanel";

type Props = {
  task: Task;
  setTask?: SetTask;
  children: React.ReactNode;
  setIsPopoverOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

function SelectDueDateIcon({
  task,
  setTask,
  children,
  setIsPopoverOpen,
}: Props) {
  const popoverContentBgColor = useColorModeValue("white", "darkMain.100");

  return (
    <Popover
      placement="bottom"
      onOpen={() => setIsPopoverOpen && setIsPopoverOpen(true)}
      onClose={() => setIsPopoverOpen && setIsPopoverOpen(false)}
    >
      {({ onClose }) => (
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
              <DueDatePanel task={task!} setTask={setTask} onClose={onClose} />
            </PopoverBody>
          </PopoverContent>
        </>
      )}
    </Popover>
  );
}
export default memo(SelectDueDateIcon);