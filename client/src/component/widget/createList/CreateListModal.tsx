import {
  Box,
  Button,
  Divider,
  Flex,
  Input,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useColorModeValue,
} from "@chakra-ui/react";
import { memo, useEffect, useState } from "react";
import useTeamStateContext from "../../../context/team/useTeamContext";
import { darkNavBG } from "../../../globalTheme";
import { createListForSpace } from "../../../networkCalls";
import { CreateListDTO, TEAM_STATE_ACTION } from "../../../types";
import { generateDefaultListName } from "../../../utils/generateDefaultListName";
import { getTaskBoardURL } from "../../../utils/getTaskBoardURL";

type Props = {};

export default memo(CreateListModal);
function CreateListModal({}: Props) {
  const [value, setValue] = useState("");
  const [placeHolderValue, setPlaceHolderValue] = useState("");
  const topBgColor = useColorModeValue("white", "darkMain.100");
  const bottomBgColor = useColorModeValue("lightMain.50", "darkMain.200");
  const {
    teamState,
    teamStateDispatch,
    modalControls: { isCreateListModalOpen, onCreateListModalClose },
  } = useTeamStateContext();

  useEffect(() => {
    const currentLevelLists = teamState.createListInfo?.currentLevelLists;
    const defaultName = generateDefaultListName(currentLevelLists);
    setPlaceHolderValue(defaultName);
  }, [teamState]);

  useEffect(() => {
    if (!isCreateListModalOpen) {
      setValue("");
    }
  }, [isCreateListModalOpen]);

  function handleCreateList(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    if (
      !teamState.createListInfo?.orderIndex ||
      !teamState.createListInfo.defaultStatusCategoryId
    ) {
      throw new Error("createListInfo not ready yet");
    }
    const { folderId, spaceId, orderIndex, defaultStatusCategoryId } =
      teamState.createListInfo;

    const dto: CreateListDTO = {
      spaceId,
      folderId,
      orderIndex,
      defaultStatusCategoryId,
      name: value ? value : placeHolderValue,
    };

    createListForSpace(dto, (list) => {
      teamStateDispatch({
        type: TEAM_STATE_ACTION.CREATE_LIST,
        payload: list,
      });
      handleResetModalState();
      const { teamId } = teamState.teamActiveStatus;
      getTaskBoardURL({ teamId, spaceId, listId: list.id });
    });
  }

  function handleResetModalState() {
    setValue("");
    onCreateListModalClose();
  }

  return (
    <Modal
      size="2xl"
      closeOnOverlayClick={true}
      isOpen={isCreateListModalOpen}
      onClose={onCreateListModalClose}
    >
      <ModalOverlay />
      <ModalContent bgColor={topBgColor} height="340px" rounded="md">
        <Flex
          px="37px"
          height="100px"
          alignItems="center"
          borderTopRadius="md"
          bgColor={bottomBgColor}
        >
          <Box fontSize="2xl" fontWeight="semibold">
            Create List
          </Box>

          <ModalCloseButton
            top="37px"
            right="37px"
            fontSize="lg"
            position="absolute"
            width="fit-content"
            height="fit-content"
            _hover={{ color: "purple.500" }}
          />
        </Flex>

        <Divider borderColor="blackAlpha.300" />

        <Box px="37px" py="6">
          <Box>
            <Box fontWeight="semibold" fontSize="sm" mb="2">
              List name
            </Box>
            <Input
              autoFocus
              rounded="3px"
              value={value}
              bgColor={darkNavBG}
              borderColor="blackAlpha.500"
              placeholder={placeHolderValue}
              onChange={(e) => setValue(e.target.value)}
            />
          </Box>

          <Flex justifyContent="flex-end" alignItems="center" mt="65px">
            <Button rounded="3px" onClick={handleResetModalState}>
              Cancel
            </Button>

            <Button
              ml="4"
              _focus={{}}
              _active={{}}
              rounded="3px"
              color="white"
              bgColor="customBlue.200"
              onClick={(e) => handleCreateList(e)}
              _hover={{ bgColor: "customBlue.100" }}
            >
              Create List
            </Button>
          </Flex>
        </Box>
      </ModalContent>
    </Modal>
  );
}
