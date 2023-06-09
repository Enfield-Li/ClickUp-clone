import {
  CreateFolderDTO,
  CreateFolderState,
  CreateFolderStep,
} from "../../../types";

export const iniCreateFolderDTO: CreateFolderDTO = {
  name: "",
  spaceId: 0,
  orderIndex: 0,
  isPrivate: false,
  allListNames: ["list"],
  defaultStatusCategoryId: 0,
};

export const initCreateFolderState: CreateFolderState = {
  teamStatusCategories: [],
  selectedStatusColumns: [],
  step: CreateFolderStep.ENTRY,
  createFolderDTO: iniCreateFolderDTO,
  folderNameError: { errorMsg: "", isError: false },
};
