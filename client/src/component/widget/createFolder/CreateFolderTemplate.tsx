import { ChevronLeftIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Divider,
  ModalCloseButton,
  useColorModeValue,
} from "@chakra-ui/react";
import produce from "immer";
import { useNavigate } from "react-router-dom";
import useTeamStateContext from "../../../context/team/useTeamContext";
import { createFolder } from "../../../networkCalls";
import {
  CreateFolderState,
  CreateFolderStep,
  TEAM_STATE_ACTION,
} from "../../../types";
import { getTaskBoardURL } from "../../../utils/getTaskBoardURL";
import { initCreateFolderState } from "./createfolderInitialState";

type Props = {
  title: string;
  children: React.ReactNode;
  isCurrentStepEntry: boolean;
  createFolderState: CreateFolderState;
  setCreateFolderState: React.Dispatch<React.SetStateAction<CreateFolderState>>;
};

export default function CreateFolderTemplate({
  title,
  children,
  createFolderState,
  setCreateFolderState,
  isCurrentStepEntry,
}: Props) {
  const navigate = useNavigate();
  const {
    teamState,
    teamStateDispatch,
    modalControls: { onCreateFolderModalClose },
  } = useTeamStateContext();
  const fontColor = useColorModeValue("darkMain.200", "lightMain.200");

  function handleGoBackToEntry() {
    setCreateFolderState(
      produce(createFolderState, (draftState) => {
        draftState.step = CreateFolderStep.ENTRY;
      })
    );
  }

  function handleOnClick() {
    // create folder
    if (isCurrentStepEntry) {
      if (!createFolderState.createFolderDTO.name) {
        setCreateFolderState(
          produce(createFolderState, (draftState) => {
            draftState.folderNameError.isError = true;
            draftState.folderNameError.errorMsg = "Folder name is required!";
          })
        );
        return;
      }

      createFolder(createFolderState.createFolderDTO, (folder) => {
        onCreateFolderModalClose();
        setCreateFolderState(initCreateFolderState);

        teamStateDispatch({
          type: TEAM_STATE_ACTION.CREATE_FOLDER,
          payload: folder,
        });

        navigate(
          getTaskBoardURL({
            listId: folder.allLists[0].id,
            teamId: teamState.teamActiveStatus.teamId,
            spaceId: createFolderState.createFolderDTO.spaceId,
          }),
          {
            state: { defaultStatusCategoryId: folder.defaultStatusCategoryId },
          }
        );
      });

      return;
    }

    // return to entry
    setCreateFolderState(
      produce(createFolderState, (draftState) => {
        draftState.step = CreateFolderStep.ENTRY;
      })
    );
  }

  return (
    <>
      <Center px="50px" height="100px" alignItems="center" borderTopRadius="md">
        {createFolderState.step !== CreateFolderStep.ENTRY && (
          <ChevronLeftIcon
            top="37px"
            left="45px"
            fontSize="35px"
            cursor="pointer"
            fontWeight="bold"
            position="absolute"
            onClick={handleGoBackToEntry}
            _hover={{ color: "purple.500" }}
          />
        )}

        <Box fontSize="2xl" fontWeight="semibold">
          {title}
        </Box>

        <ModalCloseButton
          top="42px"
          right="55px"
          fontSize="lg"
          position="absolute"
          width="fit-content"
          height="fit-content"
          _hover={{ color: "purple.500" }}
        />
      </Center>

      <Divider borderColor="blackAlpha.500" opacity="100%" />

      <Box px="50px" py="6" mt="1">
        <Box height="fit-content" color={fontColor}>
          {children}
        </Box>

        <Button
          mt="30px"
          mb="20px"
          _focus={{}}
          _active={{}}
          width="100%"
          height="50px"
          rounded="3px"
          color="white"
          display="block"
          bgColor="customBlue.200"
          onClick={handleOnClick}
          _hover={{ bgColor: "customBlue.100" }}
          disabled={
            isCurrentStepEntry && createFolderState.folderNameError.isError
          }
        >
          {isCurrentStepEntry ? "Create Folder" : "Save"}
        </Button>
      </Box>
    </>
  );
}
