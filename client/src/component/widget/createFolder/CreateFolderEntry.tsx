import { Box, Input } from "@chakra-ui/react";
import produce from "immer";
import useTeamStateContext from "../../../context/team/useTeamContext";
import { CreateFolderState, CreateFolderStep } from "../../../types";
import CreateFolderItem from "./CreateFolderItem";
import CreateFolderTemplate from "./CreateFolderTemplate";

type Props = {
  createFolder: CreateFolderState;
  setCreateFolder: React.Dispatch<React.SetStateAction<CreateFolderState>>;
};

export default function CreateFolderEntry({
  createFolder,
  setCreateFolder,
}: Props) {
  function handleInputOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCreateFolder(
      produce(createFolder, (draftState) => {
        draftState.createFolderDTO.name = e.target.value;
      })
    );
  }

  function handleOnClick(targetStep: CreateFolderStep) {
    setCreateFolder(
      produce(createFolder, (draftState) => {
        draftState.step = targetStep;
      })
    );
  }

  return (
    <CreateFolderTemplate
      title="Create folder"
      createFolder={createFolder}
      setCreateFolder={setCreateFolder}
      currentStep={CreateFolderStep.ENTRY}
    >
      <Box fontWeight="semibold" fontSize="sm" mb="1">
        Folder name
      </Box>

      <Input
        autoFocus
        variant="unstyled"
        onChange={handleInputOnChange}
        placeholder="Enter folder name"
        value={createFolder.createFolderDTO.name}
      />

      <Box
        mt="55px"
        cursor="pointer"
        borderWidth="1px"
        fontWeight="semibold"
        borderBottomWidth="0px"
        borderColor="blackAlpha.500"
      >
        <Box onClick={() => handleOnClick(CreateFolderStep.LISTS)}>
          <CreateFolderItem left="Lists" right="List" />
        </Box>
        <Box onClick={() => handleOnClick(CreateFolderStep.SHARE)}>
          <CreateFolderItem left="Share Folder with" right="people" />
        </Box>
        <Box onClick={() => handleOnClick(CreateFolderStep.STATUS)}>
          <CreateFolderItem left="Task statuses" right="User Space statuses" />
        </Box>
      </Box>
    </CreateFolderTemplate>
  );
}
