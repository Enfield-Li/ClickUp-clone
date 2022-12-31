import React from "react";
import { Link } from "react-router-dom";
import { CreateFolderState, CreateFolderStep } from "../../../types";
import CreateFolderTemplate from "./CreateFolderTemplate";

type Props = {
  createFolder: CreateFolderState;
  setCreateFolder: React.Dispatch<React.SetStateAction<CreateFolderState>>;
};

export default function CreateFolderSelectStatus({
  createFolder,
  setCreateFolder,
}: Props) {
  return (
    <CreateFolderTemplate
      createFolder={createFolder}
      setCreateFolder={setCreateFolder}
      currentStep={CreateFolderStep.ENTRY}
    >
      <Link replace={true} to="" />
      set privacy
    </CreateFolderTemplate>
  );
}
