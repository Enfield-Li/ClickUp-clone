import {
  Box,
  Center,
  Divider,
  Flex,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { memo } from "react";
import useTeamStateContext from "../../../context/team/useTeamContext";
import { FolderCategory, Space, TEAM_STATE_ACTION } from "../../../types";
import Folder from "./folderAndList/Folder";

type Props = {
  space: Space;
  isPopoverOpen: boolean;
  folder?: FolderCategory;
  onPopoverClose: () => void;
  onPopoverOpen: () => void;
};

export default memo(AddFolderOrListPopover);
function AddFolderOrListPopover({
  space,
  folder,
  isPopoverOpen,
  onPopoverClose,
  onPopoverOpen,
}: Props) {
  const { defaultStatusCategoryId, id: spaceId } = space;
  const popoverContentHoverBgColor = useColorModeValue(
    "lightMain.100",
    "darkMain.200"
  );
  const {
    teamStateDispatch,
    modalControls: { onCreateListModalOpen, onCreateFolderModalOpen },
  } = useTeamStateContext();

  function handleOpenModal(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    openModal: () => void
  ) {
    e.stopPropagation();
    onPopoverClose();
    openModal();
  }

  function handleOpenPopover(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation();
    onPopoverOpen();
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
    >
      <PopoverTrigger>
        <Center
          pb="1"
          mr="3"
          width="15px"
          height="15px"
          rounded="full"
          fontSize="15px"
          color="darkMain.200"
          fontWeight="extrabold"
          bgColor="lightMain.400"
          onClick={handleOpenPopover}
          _hover={{ bgColor: "purple.500" }}
        >
          +
        </Center>
      </PopoverTrigger>

      <PopoverContent
        py="1"
        my="2"
        width="225px"
        position="absolute"
        onBlur={onPopoverClose}
        onClick={(e) => e.stopPropagation()}
      >
        <Flex
          mx="2"
          my="1"
          py="1"
          px="2"
          rounded="md"
          _hover={{ backgroundColor: popoverContentHoverBgColor }}
          onClick={(e) =>
            handleOpenModal(e, () => {
              onCreateListModalOpen();
              teamStateDispatch({
                type: TEAM_STATE_ACTION.SET_CREATE_LIST_INFO,
                payload: {
                  spaceId,
                  folderId: folder?.id,
                  defaultStatusCategoryId: space.defaultStatusCategoryId,
                },
              });
            })
          }
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
          onClick={(e) =>
            handleOpenModal(e, () => {
              onCreateFolderModalOpen();
              teamStateDispatch({
                type: TEAM_STATE_ACTION.SET_CREATE_FOLDER_INFO,
                payload: {
                  spaceId,
                  defaultStatusCategoryId,
                },
              });
            })
          }
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
