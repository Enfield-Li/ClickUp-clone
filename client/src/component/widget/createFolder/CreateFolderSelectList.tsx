import React from "react";
import { CreateFolderState, CreateFolderStep } from "../../../types";
import CreateFolderTemplate from "./CreateFolderTemplate";

type Props = {
  createFolder: CreateFolderState;
  setCreateFolder: React.Dispatch<React.SetStateAction<CreateFolderState>>;
};

export default function CreateFolderSelectList({
  createFolder,
  setCreateFolder,
}: Props) {
  return (
    <CreateFolderTemplate
      createFolder={createFolder}
      setCreateFolder={setCreateFolder}
      currentStep={CreateFolderStep.ENTRY}
    >
      select list
    </CreateFolderTemplate>
  );
}
