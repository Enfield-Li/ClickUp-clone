import {
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Box,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";

type Props = { children: React.ReactNode };

export default function RightClickPopover({ children }: Props) {
  const { isOpen, onClose, onOpen } = useDisclosure();

  function handleRightClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    onOpen();
  }

  return (
    <Popover
      isOpen={isOpen}
      onClose={onClose}
      placement="right-start"
      returnFocusOnClose={false}
    >
      <PopoverTrigger>
        {/* https://stackoverflow.com/a/31113000/16648127 */}
        <Box onContextMenu={handleRightClick}>{children}</Box>
      </PopoverTrigger>

      <PopoverContent ml={-6}>
        <PopoverBody>content body</PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
