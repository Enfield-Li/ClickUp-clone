import { FolderCategory, ListCategory } from "../types";

export function determineListType(
  item: FolderCategory | ListCategory
): item is ListCategory {
  return (
    "isSelected" in item || "taskAmount" in item || "parentFolderId" in item
  );
}

export function determineFolderType(
  item: FolderCategory | ListCategory
): item is FolderCategory {
  return "isOpen" in item || "allLists" in item;
}
