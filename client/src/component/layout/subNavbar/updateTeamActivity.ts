import {
  FolderCategory,
  ListCategory,
  Space,
  TeamStateActionType,
  TeamStateType,
  TEAM_STATE_ACTION,
  UpdateTeamActivityDTO,
} from "../../../types";
import { GetTaskBoardURLParam } from "../../../utils/getTaskBoardURL";
import { space1TaskList } from "../../../utils/mockData";
import determineListType, {
  determineFolderType,
} from "./folderAndList/determineList";

type UpdateTeamActivityParam = {
  userId: number;
  teamState: TeamStateType;
  teamStateDispatch: React.Dispatch<TeamStateActionType>;
  propsValue: {
    space: Space;
    list?: ListCategory;
    folder?: FolderCategory;
  };
};

export function deleteItemAndUpdateTeamActivity({
  teamState,
  propsValue,
  teamStateDispatch,
}: UpdateTeamActivityParam): GetTaskBoardURLParam & {
  defaultStatusCategoryId: number | undefined;
} {
  const { space, list, folder } = propsValue;
  const listId = list?.id;
  const folderId = folder?.id;
  const dto: UpdateTeamActivityDTO = {
    folderIds: [],
    listId: undefined,
    spaceId: undefined,
    teamId: space.teamId,
  };

  const isSpace = !listId && !folderId;
  const isFolder = !listId && folderId;
  const isListInSpace = !folderId && listId;
  const isListInFolder = folderId && listId;

  if (isSpace) {
    let defaultStatusCategoryId: number | undefined;
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
    return { ...dto, defaultStatusCategoryId };
  }

  if (isFolder) {
    let defaultStatusCategoryId: number | undefined;

    // push folderId
    const isFolderAlreadyOpen =
      teamState.teamActiveStatus.folderIds.includes(folderId);
    if (isFolderAlreadyOpen) {
      dto.folderIds?.push(folderId);
    }

    // define next opened space/list
    const isListInFolder = folder.allLists.find(
      (list) => list.id === teamState.teamActiveStatus.listId
    );
    if (isListInFolder) {
      const nextActiveList = space.allListOrFolder.find(
        (listOrFolder) =>
          determineListType(listOrFolder) &&
          listOrFolder.parentFolderId !== folderId &&
          listOrFolder.id !== listId
      );

      dto.listId = nextActiveList?.id;
      defaultStatusCategoryId = nextActiveList?.defaultStatusCategoryId;
    } else {
      dto.listId = teamState.teamActiveStatus.listId;
    }

    teamStateDispatch({
      type: TEAM_STATE_ACTION.DELETE_FOLDER,
      payload: {
        deletedFolderId: folderId,
        nextListId: dto.listId,
      },
    });

    // TODO network call

    return {
      ...dto,
      spaceId: space.id,
      defaultStatusCategoryId,
    };
  }

  if (isListInSpace) {
    let defaultStatusCategoryId: number | undefined;

    // define next opened space/list
    const isListSelected = teamState.teamActiveStatus.listId === listId;
    if (isListSelected) {
      const nextActiveList = space.allListOrFolder.find(
        (listOrFolder) =>
          determineListType(listOrFolder) && listOrFolder.id !== listId
      );

      dto.listId = nextActiveList?.id;
      defaultStatusCategoryId = nextActiveList?.defaultStatusCategoryId;
    } else {
      dto.listId = teamState.teamActiveStatus.listId;
    }

    teamStateDispatch({
      type: TEAM_STATE_ACTION.DELETE_LIST_IN_SPACE,
      payload: {
        deletedListId: listId,
        nextListId: dto.listId,
      },
    });

    // network call

    return {
      ...dto,
      spaceId: space.id,
      defaultStatusCategoryId,
    };
  }

  if (isListInFolder) {
    let defaultStatusCategoryId: number | undefined;

    const parentFolder =
      (space.allListOrFolder.find(
        (listOrFolder) =>
          determineFolderType(listOrFolder) &&
          listOrFolder.id === list.parentFolderId
      ) as FolderCategory) || undefined;

    // define next opened space/list
    const isListSelected = teamState.teamActiveStatus.listId === listId;
    if (isListSelected) {
      const nextActiveList = parentFolder.allLists.find(
        (list) => list.id !== listId
      );

      dto.listId = nextActiveList?.id;
      defaultStatusCategoryId = nextActiveList?.defaultStatusCategoryId;
    } else {
      dto.listId = teamState.teamActiveStatus.listId;
    }

    teamStateDispatch({
      type: TEAM_STATE_ACTION.DELETE_LIST_IN_FOLDER,
      payload: {
        deletedListId: listId,
        nextListId: dto.listId,
        folderId: parentFolder.id,
      },
    });

    // network call
    return {
      ...dto,
      spaceId: space.id,
      defaultStatusCategoryId,
    };
  }

  throw new Error("Delete operation interrupted");
}
