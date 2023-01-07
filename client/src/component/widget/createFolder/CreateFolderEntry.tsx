import { Box, Center, Flex, Input } from "@chakra-ui/react";
import produce from "immer";
import useTeamStateContext from "../../../context/team/useTeamContext";
import { CreateFolderState, CreateFolderStep } from "../../../types";
import ReviewCreateFolderItem from "./ReviewCreateFolderItem";
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
    setCreateFolder((prev) =>
      produce(prev, (draftState) => {
        draftState.step = targetStep;
      })
    );
  }

  function isLastElement(index: number, arr: any[]) {
    return index === arr.length - 1;
  }

  return (
    <CreateFolderTemplate
      title="Create folder"
      isCurrentStepEntry={true}
      createFolder={createFolder}
      setCreateFolder={setCreateFolder}
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
        {/* List */}
        <ReviewCreateFolderItem
          title="Lists"
          handleClick={() => handleOnClick(CreateFolderStep.LISTS)}
        >
          <Flex alignItems="center" justifyContent="flex-end" width="500px">
            {createFolder.createFolderDTO.allLists.map((list, index, arr) => (
              <Center
                key={list}
                rounded="sm"
                height="10px"
                width="fit-content"
                mr={isLastElement(index, arr) ? "" : "9px"}
              >
                {list}
                {isLastElement(index, arr) ? "" : ","}
              </Center>
            ))}
          </Flex>
        </ReviewCreateFolderItem>

        {/* Share */}
        <ReviewCreateFolderItem
          title="Share Folder with"
          handleClick={() => handleOnClick(CreateFolderStep.SHARE)}
        >
          abc
        </ReviewCreateFolderItem>

        {/* Status */}
        <ReviewCreateFolderItem
          title="Task statuses"
          handleClick={() => handleOnClick(CreateFolderStep.STATUS)}
        >
          <Flex alignItems="center" justifyContent="flex-end" width="500px">
            {createFolder.selectedStatusColumns.map((column, index, arr) => (
              <Box
                width="10px"
                height="10px"
                rounded="sm"
                key={column.id}
                bgColor={column.color}
                mr={isLastElement(index, arr) ? "" : "10px"}
              ></Box>
            ))}
          </Flex>
        </ReviewCreateFolderItem>
      </Box>
    </CreateFolderTemplate>
  );
}
