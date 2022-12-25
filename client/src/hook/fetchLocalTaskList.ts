import { space1TaskList, space2TaskList } from "./mockData";

export function fetchLocalTaskList(listId: number) {
  return listId % 2 ? space1TaskList : space2TaskList;
}
