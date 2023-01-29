import { Flex } from "@chakra-ui/react";
import produce from "immer";
import React from "react";
import { CreateFolderState, CreateFolderStep } from "../../../types";
import StatusColumnsDisplay from "../statusColumn/StatusColumnsDisplay";
import CreateFolderTemplate from "./CreateFolderTemplate";

type Props = {
  createFolder: CreateFolderState;
  setCreateFolder: React.Dispatch<React.SetStateAction<CreateFolderState>>;
};

export default function CreateFolderStatusColumns({
  createFolder,
  setCreateFolder,
}: Props) {
  return (
    <CreateFolderTemplate
      isCurrentStepEntry={false}
      createFolder={createFolder}
      setCreateFolder={setCreateFolder}
      title="What task statuses do you want?"
    >
      <Flex height="100%">
        <StatusColumnsDisplay
          selectedCategoryId={
            createFolder.createFolderDTO.defaultStatusCategoryId
          }
          teamStatusCategories={createFolder.teamStatusCategories}
          handleSelectCategory={(selectedCategory) =>
            setCreateFolder((prev) =>
              produce(prev, (draftState) => {
                draftState.selectedStatusColumns =
                  selectedCategory.statusColumns;
                draftState.createFolderDTO.defaultStatusCategoryId =
                  selectedCategory.id;
              })
            )
          }
          handleUpdateCategories={(updatedStatusCategories) =>
            setCreateFolder((prev) =>
              produce(prev, (draftState) => {
                draftState.teamStatusCategories = updatedStatusCategories;
              })
            )
          }
        />
      </Flex>
    </CreateFolderTemplate>
  );
}
