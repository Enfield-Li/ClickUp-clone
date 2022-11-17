import {
  Box,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from "@chakra-ui/react";
import React, { memo } from "react";

type Props = { children: React.ReactNode };

export default memo(function RightClickShowCardOptions({ children }: Props) {
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
        {/* Right click: https://stackoverflow.com/a/31113000/16648127 */}
        <Box onContextMenu={handleRightClick}>{children}</Box>
      </PopoverTrigger>

      <PopoverContent>
        <PopoverBody>content body</PopoverBody>
      </PopoverContent>
    </Popover>
  );
});
