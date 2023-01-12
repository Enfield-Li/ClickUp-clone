import {
  Box,
  Divider,
  Flex,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { memo } from "react";

type Props = {
  isPopoverOpen: boolean;
  children: React.ReactNode;
  onPopoverClose: () => void;
};

export default memo(AddFolderOrListPopover);
function AddFolderOrListPopover({
  children,
  isPopoverOpen,
  onPopoverClose,
}: Props) {
  const popoverContentHoverBgColor = useColorModeValue(
    "lightMain.100",
    "darkMain.200"
  );

  function clicked(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    console.log("click");
  }

  return (
    <Popover
      isLazy
      arrowSize={0}
      closeOnBlur={false}
      isOpen={isPopoverOpen}
      placement="bottom-start"
      onClose={onPopoverClose}
    >
      <PopoverTrigger>{children}</PopoverTrigger>

      <PopoverContent
        py="1"
        my="2"
        width="225px"
        position="absolute"
        onBlur={onPopoverClose}
      >
        <Flex
          mx="2"
          my="1"
          py="1"
          px="2"
          rounded="md"
          onClick={clicked}
          _hover={{ backgroundColor: popoverContentHoverBgColor }}
        >
          <Box mr="2" opacity="70%">
            <i className="bi bi-list-ul"></i>
          </Box>
          <Box>List</Box>
        </Flex>

        <Divider borderColor="blackAlpha.500" />

        <Flex
          px="2"
          mx="2"
          py="1"
          my="1"
          rounded="md"
          onClick={clicked}
          _hover={{ backgroundColor: popoverContentHoverBgColor }}
        >
          <Box mr="2" opacity="70%">
            <i className="bi bi-folder-plus"></i>
          </Box>
          <Box>Folder</Box>
        </Flex>
      </PopoverContent>
    </Popover>
  );
}
