import { deleteSpace } from "../../../networkCalls";
import {
  Space,
  TeamStateActionType,
  TeamStateType,
  TEAM_STATE_ACTION,
  UpdateTeamActivityDTO,
} from "../../../types";
import determineListType from "./folderAndList/determineList";

type UpdateTeamActivityParam = {
  userId: number;
  teamState: TeamStateType;
  teamStateDispatch: React.Dispatch<TeamStateActionType>;
  propsValue: {
    space: Space;
    listId?: number;
    folderId?: number;
  };
};

export function deleteItemAndUpdateTeamActivity({
  teamState,
  propsValue,
  teamStateDispatch,
}: UpdateTeamActivityParam) {
  const { space, listId, folderId } = propsValue;
  const dto: UpdateTeamActivityDTO = {
    folderIds: [],
    listId: undefined,
    spaceId: undefined,
    teamId: space.teamId,
  };
  let defaultStatusCategoryId: number | undefined;

  const isSpace = Boolean(!listId && !folderId);
  const isFolder = Boolean(!listId && folderId);
  const isListInSpace = Boolean(!folderId && listId);
  const isListInFolder = Boolean(folderId && listId);

  if (isSpace) {
    // purge current opened folder
    space.allListOrFolder.forEach((folderCategory) => {
      if (teamState.teamActiveStatus.folderIds.includes(folderCategory.id)) {
        dto.folderIds?.push(folderCategory.id);
      }
    });

    // define next opened space/list
    teamState.originalTeams.forEach((team) => {
      const isCurrentTeam = team.id === space.teamId;
      if (isCurrentTeam) {
        const nextActiveSpace = team.spaces.find(
          (currentSpace) => currentSpace.id !== space.id
        );
        const nextActiveList =
          nextActiveSpace?.allListOrFolder.find(determineListType);

        defaultStatusCategoryId = nextActiveList?.defaultStatusCategoryId;

        dto.listId = nextActiveList?.id;
        dto.spaceId = nextActiveSpace?.id;
      }
    });

    teamStateDispatch({
      type: TEAM_STATE_ACTION.DELETE_SPACE,
      payload: {
        deletedSpaceId: space.id,
        nextListId: dto.listId || null,
        nextSpaceId: dto.spaceId || null,
      },
    });

    console.log(dto);

    // deleteSpace(space.id, dto);
  }

  return { ...dto, defaultStatusCategoryId };
}
