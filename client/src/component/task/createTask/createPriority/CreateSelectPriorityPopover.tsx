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
  priority?: number;
  children: React.ReactNode;
  currentPriorityColumn?: PriorityColumn;
  setIsPopoverOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setPriority: React.Dispatch<React.SetStateAction<number | undefined>>;
};

export default memo(function CreateSelectPriorityPopover({
  priority,
  children,
  setPriority,
  setIsPopoverOpen,
  currentPriorityColumn,
}: Props) {
  const popoverContentBgColor = useColorModeValue("white", "darkMain.100");

  return (
    // https://github.com/chakra-ui/chakra-ui/issues/2843#issuecomment-748641805
    <Popover
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
              !priority
                ? "Set priority"
                : currentPriorityColumn &&
                  capitalizeFirstLetter(currentPriorityColumn.title)
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
});
