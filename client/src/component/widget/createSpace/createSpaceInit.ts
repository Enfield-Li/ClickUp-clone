import {
  CreateSpaceDTO,
  CreateSpaceState,
  CreateSpaceStep,
} from "../../../types";

export const initCreateSpaceDTO: CreateSpaceDTO = {
  name: "",
  teamId: 0,
  avatar: "",
  color: "gray",
  orderIndex: 0,
  isPrivate: false,
  statusColumnsCategoryId: 0,
};

export const initialCreateSpace: CreateSpaceState = {
  isAllSet: false,
  teamStatusCategories: [],
  selectedStatusColumns: [],
  step: CreateSpaceStep.NAME,
  createSpaceDTO: initCreateSpaceDTO,
};
