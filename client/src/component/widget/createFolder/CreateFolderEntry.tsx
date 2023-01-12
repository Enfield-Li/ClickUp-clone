import { Box, Center, Flex, Input } from "@chakra-ui/react";
import produce from "immer";
import { useEffect, useState } from "react";
import { CreateFolderState, CreateFolderStep } from "../../../types";
import CreateFolderTemplate from "./CreateFolderTemplate";
import ReviewCreateFolderItem from "./ReviewCreateFolderItem";

type Props = {
  createFolder: CreateFolderState;
  setCreateFolder: React.Dispatch<React.SetStateAction<CreateFolderState>>;
};

export default function CreateFolderEntry({
  createFolder,
  setCreateFolder,
}: Props) {
  const [showError, setShowError] = useState(false);

  function handleInputOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (showError) setShowError(false);
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
      showError={() => setShowError(true)}
    >
      <Box
        mb="1"
        fontSize="sm"
        fontWeight="semibold"
        color={showError ? "red.500" : ""}
      >
        Folder name
      </Box>

      <Input
        autoFocus
        onChange={handleInputOnChange}
        placeholder="Enter folder name"
        borderColor={showError ? "red.500" : ""}
        value={createFolder.createFolderDTO.name}
        variant={showError ? "flushed" : "unstyled"}
      />
      {showError && (
        <Box mt="4px" color="red.500" height="10px" fontSize="12px">
          <i className="bi bi-exclamation-triangle-fill"></i>
          <span>&nbsp;</span>
          Folder name is required!
        </Box>
      )}

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
            {createFolder.createFolderDTO.allListNames.map(
              (list, index, arr) => (
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
              )
            )}
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
