import { FolderType, ListType } from "../../../../types";

export default function determineListType(
  item: FolderType | ListType
): item is ListType {
  return "taskAmount" in item || "parentList" in item || "allStatuses" in item;
}

export function determineFolderType(
  item: FolderType | ListType
): item is FolderType {
  return "isOpen" in item || "allLists" in item;
}
