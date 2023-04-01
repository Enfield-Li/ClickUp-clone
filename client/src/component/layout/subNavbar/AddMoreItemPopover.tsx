import {
  Box,
  Flex,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Portal,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { memo } from "react";
import { userModalControl } from "../../../context/modalControl/userModalControl";
import useTeamStateContext from "../../../context/team/useTeamContext";
import useUnImplementedToast from "../../../hook/useFeatureNotImplemented";
import { Space, TEAM_STATE_ACTION } from "../../../types";

const createNewOptions = [
  "List",
  "/",
  "Doc",
  "Whiteboard",
  "/",
  "Folder",
  "From template",
  "import",
];

type Props = {
  space: Space;
  folderId?: number;
  children: React.ReactNode;
  isPopoverOpen: boolean;
  onPopoverClose: () => void;
  onPopoverOpen: () => void;
  returnRefFn?: () => void;
};

export default memo(AddMoreItemPopover);
function AddMoreItemPopover({
  space,
  folderId,
  isPopoverOpen,
  onPopoverClose,
  onPopoverOpen,
  children,
  returnRefFn,
}: Props) {
  const toast = useUnImplementedToast();
  const { defaultStatusCategoryId, id: spaceId } = space;
  const fontColor = useColorModeValue("black", "lightMain.100");
  const hoverBgColor = useColorModeValue("lightMain.100", "darkMain.300");

  const { teamStateDispatch } = useTeamStateContext();
  const { onCreateListModalOpen, onCreateFolderModalOpen } = userModalControl();

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

  function handleOpenCreateListModal(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    handleOpenModal(e, () => {
      onCreateListModalOpen();
      teamStateDispatch({
        type: TEAM_STATE_ACTION.SET_CREATE_LIST_INFO,
        payload: {
          spaceId,
          folderId: folderId,
          defaultStatusCategoryId: space.defaultStatusCategoryId,
        },
      });
    });
  }

  function handleOpenCreateFolderModal(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    handleOpenModal(e, () => {
      onCreateFolderModalOpen();
      teamStateDispatch({
        type: TEAM_STATE_ACTION.SET_CREATE_FOLDER_INFO,
        payload: {
          spaceId,
          defaultStatusCategoryId,
        },
      });
    });
  }

  return (
    <Popover
      isLazy
      isOpen={isPopoverOpen}
      onOpen={onPopoverOpen}
      onClose={onPopoverClose}
      placement="right-start"
      returnFocusOnClose={true}
    >
      <PopoverTrigger>
        <Box onClick={(e) => e.stopPropagation()}>{children}</Box>
      </PopoverTrigger>

      <Portal>
        <PopoverContent
          p="2"
          width="220px"
          fontSize="sm"
          shadow="dark-lg"
          color={fontColor}
          onBlur={returnRefFn}
          onMouseOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {createNewOptions.map((option, index) =>
            option === "/" ? (
              <Box
                my="1"
                key={index}
                border="solid"
                borderWidth="1px"
                borderColor="blackAlpha.400"
              ></Box>
            ) : (
              <Flex
                p="7px"
                pl="10px"
                key={index}
                rounded="md"
                opacity={
                  option === "List" || option === "Folder" ? "80%" : "40%"
                }
                onClick={(e) => {
                  e.stopPropagation();
                  option === "List"
                    ? handleOpenCreateListModal(e)
                    : option === "Folder"
                    ? handleOpenCreateFolderModal(e)
                    : toast();
                }}
                cursor={
                  option === "List" || option === "Folder"
                    ? "pointer"
                    : "not-allowed"
                }
                _hover={{ bgColor: hoverBgColor }}
              >
                <Box mr={2}>
                  {option === "List" ? (
                    <i className="bi bi-list-ul"></i>
                  ) : option === "Folder" ? (
                    <i className="bi bi-folder-plus"></i>
                  ) : (
                    <i className="bi bi-exclamation-diamond"></i>
                  )}
                </Box>
                <Box>{option}</Box>
              </Flex>
            )
          )}
        </PopoverContent>
      </Portal>
    </Popover>
  );
}
