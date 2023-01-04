import { Flex } from "@chakra-ui/react";
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
          setCreateFolder={setCreateFolder}
          statusCategoriesData={createFolder.statusCategoriesData}
        />
      </Flex>
    </CreateFolderTemplate>
  );
}
