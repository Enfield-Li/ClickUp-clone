import { CLIENT_ROUTE } from "../constant";

export type GetTaskBoardURLParam = {
  teamId: string | number;
  spaceId?: string | number | null;
  listId?: string | number | null;
};

export function getTaskBoardURL({
  teamId,
  spaceId,
  listId,
}: GetTaskBoardURLParam) {
  const listIdParam = listId ? `/${listId}` : "";
  const spaceIdParam = spaceId ? `/${spaceId}` : "";
  return `/${teamId}/${CLIENT_ROUTE.TASK_BOARD}${spaceIdParam}${listIdParam}`;
}
