import { FolderType, ListType } from "../../../../types";

export default function determineListType(
  item: FolderType | ListType
): item is ListType {
  return "taskAmount" in item || "parentList" in item || "allStatuses" in item;
}
