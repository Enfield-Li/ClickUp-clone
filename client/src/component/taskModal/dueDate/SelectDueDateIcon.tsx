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
import { Task } from "../../../types";
import DueDatePanel from "./DueDatePanel";

type Props = {
  task: Task;
  children: React.ReactNode;
  setIsPopoverOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};
export default memo(SelectDueDateIcon);
function SelectDueDateIcon({ task, children, setIsPopoverOpen }: Props) {
  const popoverContentBgColor = useColorModeValue("white", "darkMain.100");

  return (
    <Popover
      isLazy
      placement="bottom"
      onOpen={() => setIsPopoverOpen && setIsPopoverOpen(true)}
      onClose={() => setIsPopoverOpen && setIsPopoverOpen(false)}
    >
      {({ onClose }: { onClose: () => void }) => (
        // https://chakra-ui.com/docs/components/popover/usage#accessing-internal-taskState
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
              <DueDatePanel task={task!} onClose={onClose} />
            </PopoverBody>
          </PopoverContent>
        </>
      )}
    </Popover>
  );
}
