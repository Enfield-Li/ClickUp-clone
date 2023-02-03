import { Flex } from "@chakra-ui/react";
import produce from "immer";
import React from "react";
import { CreateFolderState, CreateFolderStep } from "../../../types";
import StatusColumnsDisplay from "../statusColumn/StatusColumnsDisplay";
import CreateFolderTemplate from "./CreateFolderTemplate";

type Props = {
  createFolderState: CreateFolderState;
  setCreateFolderState: React.Dispatch<React.SetStateAction<CreateFolderState>>;
};

export default function CreateFolderStatusColumns({
  createFolderState,
  setCreateFolderState,
}: Props) {
  return (
    <CreateFolderTemplate
      isCurrentStepEntry={false}
      createFolderState={createFolderState}
      setCreateFolderState={setCreateFolderState}
      title="What task statuses do you want?"
    >
      <Flex height="100%">
        <StatusColumnsDisplay
          selectedCategoryId={
            createFolderState.createFolderDTO.defaultStatusCategoryId
          }
          teamStatusCategories={createFolderState.teamStatusCategories}
          handleSelectCategory={(selectedCategory) =>
            setCreateFolderState((prev) =>
              produce(prev, (draftState) => {
                draftState.selectedStatusColumns =
                  selectedCategory.statusColumns;
                draftState.createFolderDTO.defaultStatusCategoryId =
                  selectedCategory.id;
              })
            )
          }
          handleUpdateCategories={(updatedStatusCategories) =>
            setCreateFolderState((prev) =>
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
