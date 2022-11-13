import {
  Box,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import CreatePriorityOptions from "./CreatePriorityOptions";
import { memo } from "react";
import { PriorityColumn } from "../../../../types";
import { capitalizeFirstLetter } from "../../../../utils/capitalizeFirstLetter";

type Props = {
  priority: number | null;
  children: React.ReactNode;
  currentPriority?: PriorityColumn;
  setPriority: React.Dispatch<React.SetStateAction<number | null>>;
  setIsPopoverOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

function CreateSelectPriorityPopover({
  priority,
  children,
  setPriority,
  setIsPopoverOpen,
  currentPriority,
}: Props) {
  //   const noPriority = task.priority === 1;
  //   const taskFinished = task.priority === 0;
  //   const hasPriority = !noPriority && !taskFinished;
  const popoverContentBgColor = useColorModeValue("white", "darkMain.100");

  return (
    // https://github.com/chakra-ui/chakra-ui/issues/2843#issuecomment-748641805
    <Popover
      placement="bottom"
      onOpen={() => setIsPopoverOpen && setIsPopoverOpen(true)}
      onClose={() => setIsPopoverOpen && setIsPopoverOpen(false)}
    >
      {({ onClose: onOptionClose }) => (
        <>
          <Tooltip
            my={2}
            hasArrow
            placement="top"
            fontWeight="semibold"
            label={
              "Set priority"
              //   !hasPriority
              //     ? "Set priority"
              //     : currentPriority &&
              //       capitalizeFirstLetter(currentPriority.title)
            }
          >
            <Box display="inline-block">
              <PopoverTrigger>{children}</PopoverTrigger>
            </Box>
          </Tooltip>

          <PopoverContent width="200px" bgColor={popoverContentBgColor}>
            <PopoverBody shadow={"2xl"} m={0} p={0}>
              <CreatePriorityOptions
                priority={priority}
                setPriority={setPriority}
                onOptionClose={onOptionClose}
              />
            </PopoverBody>
          </PopoverContent>
        </>
      )}
    </Popover>
  );
}
export default memo(CreateSelectPriorityPopover);
