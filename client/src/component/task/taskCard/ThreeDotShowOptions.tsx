import {
  Box,
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from "@chakra-ui/react";
import React from "react";

type Props = {
  setIsPopoverOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ThreeDotShowOptions({ setIsPopoverOpen }: Props) {
  return (
    <Popover
      onOpen={() => setIsPopoverOpen && setIsPopoverOpen(true)}
      onClose={() => setIsPopoverOpen && setIsPopoverOpen(false)}
    >
      <Tooltip
        my={2}
        hasArrow
        placement="top"
        label="More options"
        fontWeight="semibold"
      >
        {/* additional element */}
        <Box
          opacity="55%"
          display="inline-block"
          _hover={{ color: "purple.400", opacity: "100%" }}
        >
          <PopoverTrigger>
            <i className="bi bi-three-dots"></i>
          </PopoverTrigger>
        </Box>
      </Tooltip>
      <PopoverContent>
        <PopoverBody>content body</PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
