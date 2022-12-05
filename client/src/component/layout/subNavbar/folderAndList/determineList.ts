import { FolderCategory, ListCategory } from "../../../../types";

export default function determineListType(
  item: FolderCategory | ListCategory
): item is ListCategory {
  return "taskAmount" in item || "parentList" in item || "allStatuses" in item;
}

export function determineFolderType(
  item: FolderCategory | ListCategory
): item is FolderCategory {
  return "isOpen" in item || "allLists" in item;
}
