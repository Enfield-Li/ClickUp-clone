import {
  Box,
  Center,
  Flex,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { memo, MouseEvent, useState } from "react";
import useTeamStateContext from "../../../context/team/useTeamContext";
import { Space, TEAM_STATE_ACTION } from "../../../types";
import AddFolderOrListPopover from "./AddFolderOrListPopover";
import SpaceContent from "./folderAndList/SpaceContent";

type Props = { space: Space };

export default memo(SpaceComponent);
function SpaceComponent({ space }: Props) {
  const { colorMode } = useColorMode();
  const [hover, setHover] = useState(false);
  const {
    teamState,
    teamStateDispatch,
    modalControls: { onCreateListModalOpen, onCreateFolderModalOpen },
  } = useTeamStateContext();
  const hoverBgColor =
    colorMode === "dark" ? "rgb(36, 46, 52)" : "darkMain.200";
  const isCurrentSpaceSelected = space.isChildListSelected;

  const {
    isOpen: isPopoverOpen,
    onClose: onPopoverClose,
    onOpen: onPopoverOpen,
  } = useDisclosure();

  function handleOpenSpace(
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
    spaceId: number
  ): void {
    teamStateDispatch({
      type: TEAM_STATE_ACTION.OPEN_SPACE,
      payload: { spaceId },
    });
  }

  function handleAddCategory(
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ): void {
    e.stopPropagation();
    onPopoverOpen();
    // throw new Error("Function not implemented.");
  }

  return (
    <Box>
      <Flex
        cursor="pointer"
        position="relative"
        alignItems="center"
        onMouseOverCapture={() => setHover(true)}
        onClick={(e) => handleOpenSpace(e, space.id)}
        onMouseLeave={() => !isPopoverOpen && setHover(false)}
      >
        {/* Drag icon */}
        {/* {hover && (
        <Box position="absolute" left="-16px" color="gray" fontSize="22px">
          <i className="bi bi-grip-vertical"></i>
        </Box>
      )} */}

        {/* Triangle */}
        <Center fontSize="8px" color="gray" mr="1" pl="1">
          {space.isOpen ? (
            <Box>
              <i className="bi bi-caret-down-fill"></i>
            </Box>
          ) : (
            <Box>
              <i className="bi bi-caret-right-fill"></i>
            </Box>
          )}
        </Center>

        <Flex
          py="1"
          pl="4px"
          flexGrow="1"
          rounded="4px"
          alignItems="center"
          justifyContent="space-between"
          _hover={{ bgColor: hoverBgColor }}
          bgColor={isCurrentSpaceSelected ? hoverBgColor : ""}
        >
          <Flex alignItems="center">
            {/* Square */}
            <Center
              ml="1"
              mr="2"
              pb="3.5px"
              width="20px"
              height="20px"
              rounded="4px"
              fontSize="15px"
              fontWeight="bold"
              color="lightMain.200"
              backgroundSize="contain"
              backgroundImage={space.avatar}
              bgColor={!space.avatar ? space.color : ""}
            >
              {!space.avatar ? space.name[0] : ""}
            </Center>

            <Center pb="3px" fontSize="15px">
              {space.name}
            </Center>
          </Flex>

          {(hover || isPopoverOpen) && (
            <AddFolderOrListPopover
              isPopoverOpen={isPopoverOpen}
              onPopoverClose={onPopoverClose}
              onCreateListModalOpen={onCreateListModalOpen}
              onCreateFolderModalOpen={onCreateFolderModalOpen}
            >
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
                _hover={{ bgColor: "purple.500" }}
                onClick={(e) => handleAddCategory(e)}
              >
                +
              </Center>
            </AddFolderOrListPopover>
          )}
        </Flex>
      </Flex>

      {space.isOpen && <SpaceContent space={space} />}
    </Box>
  );
}
