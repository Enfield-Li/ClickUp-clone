import { CLIENT_ROUTE } from "../constant";

type Param = {
  teamId: string | number;
  spaceId: string | number;
  listId: string | number;
};

export function getTaskBoardURL({ teamId, spaceId, listId }: Param) {
  const listIdParam = listId ? `/${listId}` : "";
  const spaceIdParam = spaceId ? `/${spaceId}` : "";
  return `/${teamId}/${CLIENT_ROUTE.TASK_BOARD}${spaceIdParam}${listIdParam}`;
}
