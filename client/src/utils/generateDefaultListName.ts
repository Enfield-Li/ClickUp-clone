import { ListCategory } from "../types";

export function generateDefaultListName(
  currentLevelLists: ListCategory[] | undefined
) {
  let number = 0;
  const name = "list";
  updateDefaultNameOnExist();

  function updateDefaultNameOnExist() {
    currentLevelLists?.forEach((list) => {
      if (list.name === (number !== 0 ? `${name}-${number}` : name)) {
        number++;
        updateDefaultNameOnExist();
      }
    });
  }

  const defaultName = number !== 0 ? `${name}-${number}` : name;
  return defaultName;
}
