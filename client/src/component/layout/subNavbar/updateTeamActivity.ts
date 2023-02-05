import { deleteSpace } from "../../../networkCalls";
import {
  Space,
  TeamStateActionType,
  TeamStateType,
  TEAM_STATE_ACTION,
  UpdateTeamActivityDTO,
} from "../../../types";

type UpdateTeamActivityParam = {
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
    console.log(teamState.teamActiveStatus);
    console.log(space.folderCategories);
    // purge current opened folder
    space.allListOrFolder.forEach((folderCategory) => {
      if (teamState.teamActiveStatus.folderIds.includes(folderCategory.id)) {
        dto.folderIds?.push(folderCategory.id);
      }
    });

    teamState.originalTeams.forEach((team) => {
      if (
        team.id === space.teamId &&
        space.id === teamState.teamActiveStatus.spaceId
      ) {
        // define next opened space/list
        const nextActiveSpace = team.spaces.find(
          (currentSpace) => currentSpace.id !== space.id
        );
        const nextActiveList = nextActiveSpace?.listCategories.find(Boolean);

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
