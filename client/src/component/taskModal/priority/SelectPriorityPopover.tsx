import {
  Box,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { Priority, PriorityColumn, Task } from "../../../types";
import PriorityOptions from "./PriorityOptions";
import { capitalizeFirstLetter } from "../../../utils/capitalizeFirstLetter";
import { memo } from "react";

type Props = {
  task: Task;
  children: React.ReactNode;
  currentTaskPriority?: PriorityColumn;
  setIsPopoverOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

export default memo(SelectPriorityPopover);
function SelectPriorityPopover({
  task,
  children,
  setIsPopoverOpen,
  currentTaskPriority,
}: Props) {
  const noPriority = task.priority.name === Priority.NO_PRIORITY;
  const popoverContentBgColor = useColorModeValue("white", "darkMain.100");

  return (
    // https://github.com/chakra-ui/chakra-ui/issues/2843#issuecomment-748641805
    <Popover
      isLazy
      placement="bottom"
      onOpen={() => setIsPopoverOpen && setIsPopoverOpen(true)}
      onClose={() => setIsPopoverOpen && setIsPopoverOpen(false)}
    >
      {({ onClose: onOptionClose }: { onClose: () => void }) => (
        <>
          <Tooltip
            my={2}
            hasArrow
            placement="top"
            fontWeight="semibold"
            label={
              noPriority
                ? "Set priority"
                : currentTaskPriority &&
                  capitalizeFirstLetter(currentTaskPriority.title)
            }
          >
            <Box display="inline-block">
              <PopoverTrigger>{children}</PopoverTrigger>
            </Box>
          </Tooltip>

          <PopoverContent width="200px" bgColor={popoverContentBgColor}>
            <PopoverBody shadow={"2xl"} m={0} p={0}>
              <PriorityOptions task={task!} onOptionClose={onOptionClose} />
            </PopoverBody>
          </PopoverContent>
        </>
      )}
    </Popover>
  );
}
