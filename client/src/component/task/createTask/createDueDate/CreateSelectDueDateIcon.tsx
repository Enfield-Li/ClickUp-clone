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
import CreateDueDatePanel from "./CreateDueDatePanel";

type Props = {
  children: React.ReactNode;
  expectedDueDate: Date | undefined;
  setExpectedDueDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
};

function CreateSelectDueDateIcon({
  children,
  expectedDueDate,
  setExpectedDueDate,
}: Props) {
  const popoverContentBgColor = useColorModeValue("white", "darkMain.100");

  return (
    <Popover placement="bottom">
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
              <CreateDueDatePanel
                onClose={onClose}
                expectedDueDate={expectedDueDate}
                setExpectedDueDate={setExpectedDueDate}
              />
            </PopoverBody>
          </PopoverContent>
        </>
      )}
    </Popover>
  );
}
export default memo(CreateSelectDueDateIcon);