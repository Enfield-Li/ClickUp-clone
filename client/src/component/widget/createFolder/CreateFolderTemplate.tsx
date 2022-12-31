import { ChevronLeftIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Divider,
  ModalCloseButton,
} from "@chakra-ui/react";
import produce from "immer";
import { CreateFolderState, CreateFolderStep } from "../../../types";

type Props = {
  children: React.ReactNode;
  currentStep: CreateFolderStep;
  createFolder: CreateFolderState;
  setCreateFolder: React.Dispatch<React.SetStateAction<CreateFolderState>>;
};

export default function CreateFolderTemplate({
  children,
  currentStep,
  createFolder,
  setCreateFolder,
}: Props) {
  function handleGoBackToEntry() {
    setCreateFolder(
      produce(createFolder, (draftState) => {
        draftState.step = CreateFolderStep.ENTRY;
      })
    );
  }

  function handleOnClick() {
    if (currentStep === CreateFolderStep.ENTRY) {
      return;
    }
    setCreateFolder(
      produce(createFolder, (draftState) => {
        draftState.step = CreateFolderStep.ENTRY;
      })
    );
  }

  return (
    <>
      <Center px="50px" height="100px" alignItems="center" borderTopRadius="md">
        {createFolder.step !== CreateFolderStep.ENTRY && (
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
          Create Folder
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

      <Box px="50px" py="6" mt="4">
        <Box height="fit-content">{children}</Box>

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
        >
          Create Folder
        </Button>
      </Box>
    </>
  );
}
