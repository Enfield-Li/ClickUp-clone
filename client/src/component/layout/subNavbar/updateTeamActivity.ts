import { TeamStateType } from "../../../context/team/useTeam";
import { deleteFolder, deleteList, deleteSpace } from "../../../networkCalls";
import {
  FolderCategory,
  ListCategory,
  Space,
  UpdateTeamActivityDTO,
} from "../../../types";
import { GetTaskBoardURLParam } from "../../../utils/getTaskBoardURL";
import determineListType, {
  determineFolderType,
} from "./folderAndList/determineList";

type UpdateTeamActivityParam = {
  userId: number;
  teamState: TeamStateType;
  propsValue: {
    space: Space;
    list?: ListCategory;
    folder?: FolderCategory;
  };
};

export function deleteItemAndUpdateTeamActivity({
  userId,
  teamState,
  propsValue,
}: UpdateTeamActivityParam): GetTaskBoardURLParam & {
  defaultStatusCategoryId: number | undefined;
} {
  const {
    teamActiveStatus,
    originalTeams,
    removeFolder,
    removeListInFolder,
    removeListInSpace,
    removeSpace,
  } = teamState;

  const { space, list, folder } = propsValue;
  const listId = list?.id;
  const folderId = folder?.id;
  const dto: UpdateTeamActivityDTO = {
    userId,
    folderIds: [],
    listId: undefined,
    spaceId: space.id,
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
      if (teamActiveStatus.folderIds.includes(folderCategory.id)) {
        dto.folderIds?.push(folderCategory.id);
      }
    });

    // define next opened space/list
    originalTeams.forEach((team) => {
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

    removeSpace({
      deletedSpaceId: space.id,
      nextListId: dto.listId || null,
      nextSpaceId: dto.spaceId || null,
    });

    // network call
    deleteSpace(space.id);

    return { ...dto, defaultStatusCategoryId };
  }

  if (isFolder) {
    let defaultStatusCategoryId: number | undefined;

    // push folderId
    const isFolderAlreadyOpen = teamActiveStatus.folderIds.includes(folderId);
    if (isFolderAlreadyOpen) {
      dto.folderIds?.push(folderId);
    }

    // define next opened space/list
    const isListInFolder = folder.allLists.find(
      (list) => list.id === teamActiveStatus.listId
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
      dto.listId = teamActiveStatus.listId || null;
    }

    removeFolder({
      deletedFolderId: folderId,
      nextListId: dto.listId,
      defaultStatusCategoryId,
    });

    // network call
    deleteFolder(folderId);

    return {
      ...dto,
      defaultStatusCategoryId,
    };
  }

  if (isListInSpace) {
    let defaultStatusCategoryId: number | undefined;

    // define next opened space/list
    const isListSelected = teamActiveStatus.listId === listId;
    if (isListSelected) {
      const nextActiveList = space.allListOrFolder.find(
        (listOrFolder) =>
          determineListType(listOrFolder) && listOrFolder.id !== listId
      );

      dto.listId = nextActiveList?.id;
      defaultStatusCategoryId = nextActiveList?.defaultStatusCategoryId;
    } else {
      dto.listId = teamActiveStatus.listId || null;
    }

    removeListInSpace({
      deletedListId: listId,
      nextListId: dto.listId,
    });

    // network call
    deleteList(listId);

    return {
      ...dto,
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
    const isListSelected = teamActiveStatus.listId === listId;
    if (isListSelected) {
      const nextActiveListInFolder = parentFolder.allLists.find(
        (list) => list.id !== listId
      );

      if (nextActiveListInFolder) {
        dto.listId = nextActiveListInFolder?.id;
        defaultStatusCategoryId =
          nextActiveListInFolder?.defaultStatusCategoryId;
      } else {
        const nextActiveListInSpace = space.allListOrFolder.find(
          (listOrFolder) =>
            determineListType(listOrFolder) &&
            listOrFolder.parentFolderId !== folderId &&
            listOrFolder.id !== listId
        );

        dto.listId = nextActiveListInSpace?.id;
        defaultStatusCategoryId =
          nextActiveListInSpace?.defaultStatusCategoryId;
      }
    } else {
      dto.listId = teamActiveStatus.listId || null;
    }

    removeListInFolder({
      deletedListId: listId,
      nextListId: dto.listId,
      folderId: parentFolder.id,
    });

    // network call
    deleteList(listId);

    return {
      ...dto,
      defaultStatusCategoryId,
    };
  }

  throw new Error("Delete operation interrupted");
}
