import {
  Box,
  Divider,
  Flex,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { memo, useRef } from "react";
import useTeamStateContext from "../../../context/team/useTeamContext";

type Props = {
  isPopoverOpen: boolean;
  children: React.ReactNode;
  onPopoverClose: () => void;
  onPopoverOpen: () => void;
};

export default memo(AddFolderOrListPopover);
function AddFolderOrListPopover({
  children,
  isPopoverOpen,
  onPopoverClose,
  onPopoverOpen,
}: Props) {
  const initialFocusRef = useRef(null);
  const popoverContentHoverBgColor = useColorModeValue(
    "lightMain.100",
    "darkMain.200"
  );
  const {
    modalControls: { onCreateListModalOpen, onCreateFolderModalOpen },
  } = useTeamStateContext();

  function handleOpenModal(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    onModalOpen: () => void
  ) {
    e.preventDefault();
    e.stopPropagation();
    onPopoverClose();
    onModalOpen();
  }

  return (
    <Popover
      isLazy
      arrowSize={0}
      closeOnBlur={false}
      isOpen={isPopoverOpen}
      onOpen={onPopoverOpen}
      placement="bottom-start"
      onClose={onPopoverClose}
      initialFocusRef={initialFocusRef}
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
          ref={initialFocusRef}
          _hover={{ backgroundColor: popoverContentHoverBgColor }}
          onClick={(e) => handleOpenModal(e, onCreateListModalOpen)}
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
          _hover={{ backgroundColor: popoverContentHoverBgColor }}
          onClick={(e) => handleOpenModal(e, onCreateFolderModalOpen)}
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
