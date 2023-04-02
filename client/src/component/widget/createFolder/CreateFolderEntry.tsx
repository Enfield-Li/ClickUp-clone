import { Box, Center, Flex, Input } from "@chakra-ui/react";
import produce from "immer";
import { useTeam } from "../../../context/team/useTeam";
import { CreateFolderState, CreateFolderStep } from "../../../types";
import CreateFolderTemplate from "./CreateFolderTemplate";
import ReviewCreateFolderItem from "./ReviewCreateFolderItem";

type Props = {
  createFolderState: CreateFolderState;
  setCreateFolderState: React.Dispatch<React.SetStateAction<CreateFolderState>>;
};

export default function CreateFolderEntry({
  createFolderState,
  setCreateFolderState,
}: Props) {
  const { createFolderInfo } = useTeam();
  const folderNameError = createFolderState.folderNameError.isError;

  function handleInputOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCreateFolderState(
      produce(createFolderState, (draftState) => {
        const isFolderNameExists = createFolderInfo?.currentLevelFolders?.find(
          (folder) => folder.name === e.target.value
        );

        draftState.createFolderDTO.name = e.target.value;
        draftState.folderNameError.errorMsg = "Folder name taken";
        draftState.folderNameError.isError = isFolderNameExists ? true : false;
      })
    );
  }

  function handleOnClick(targetStep: CreateFolderStep) {
    setCreateFolderState((prev) =>
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
      createFolderState={createFolderState}
      setCreateFolderState={setCreateFolderState}
    >
      <Box
        mb="1"
        fontSize="sm"
        fontWeight="semibold"
        color={folderNameError ? "red.500" : ""}
      >
        Folder name
      </Box>

      <Input
        autoFocus
        onChange={handleInputOnChange}
        placeholder="Enter folder name"
        value={createFolderState.createFolderDTO.name}
        borderColor={folderNameError ? "red.500" : ""}
        variant={folderNameError ? "flushed" : "unstyled"}
      />
      {folderNameError && (
        <Flex
          mt="4px"
          height="10px"
          color="red.500"
          fontSize="12px"
          fontWeight="semibold"
        >
          <Box fontSize="11px" mr="3px">
            <i className="bi bi-exclamation-triangle-fill"></i>
          </Box>
          <span>&nbsp;</span>
          {createFolderState.folderNameError.errorMsg}
        </Flex>
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
            {createFolderState.createFolderDTO.allListNames.map(
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
          someone
        </ReviewCreateFolderItem>

        {/* Status */}
        <ReviewCreateFolderItem
          title="Task statuses"
          handleClick={() => handleOnClick(CreateFolderStep.STATUS)}
        >
          <Flex alignItems="center" justifyContent="flex-end" width="500px">
            {createFolderState.selectedStatusColumns.map(
              (column, index, arr) => (
                <Box
                  width="10px"
                  height="10px"
                  rounded="sm"
                  key={column.id}
                  bgColor={column.color}
                  mr={isLastElement(index, arr) ? "" : "10px"}
                ></Box>
              )
            )}
          </Flex>
        </ReviewCreateFolderItem>
      </Box>
    </CreateFolderTemplate>
  );
}
