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
  onCreateListModalOpen: () => void;
  onCreateFolderModalOpen: () => void;
};

export default memo(AddFolderOrListPopover);
function AddFolderOrListPopover({
  children,
  isPopoverOpen,
  onPopoverClose,
  onCreateListModalOpen,
  onCreateFolderModalOpen,
}: Props) {
  const popoverContentHoverBgColor = useColorModeValue(
    "lightMain.100",
    "darkMain.200"
  );

  return (
    <Box>
      <Popover
        isLazy
        arrowSize={0}
        isOpen={isPopoverOpen}
        placement="bottom-start"
        onClose={onPopoverClose}
        returnFocusOnClose={false}
      >
        <PopoverTrigger>{children}</PopoverTrigger>

        <PopoverContent
          py="1"
          my="2"
          width="225px"
          onClick={(e) => e.stopPropagation()}
        >
          <Flex
            mx="2"
            my="1"
            py="1"
            px="2"
            rounded="md"
            onClick={onCreateListModalOpen}
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
            onClick={onCreateFolderModalOpen}
            _hover={{ backgroundColor: popoverContentHoverBgColor }}
          >
            <Box mr="2" opacity="70%">
              <i className="bi bi-folder-plus"></i>
            </Box>
            <Box>Folder</Box>
          </Flex>
        </PopoverContent>
      </Popover>
    </Box>
  );
}
