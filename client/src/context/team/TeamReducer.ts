import produce from "immer";
import { WritableDraft } from "immer/dist/internal";
import { determineFolderType } from "../../component/layout/subNavbar/folderAndList/determineList";
import {
  CreateListInfo,
  FolderCategory,
  ListCategory,
  Team,
  TeamStateActionType,
  TeamStateType,
  TEAM_STATE_ACTION,
} from "../../types";
import { deepCopy } from "../../utils/deepCopy";
import setTeamActiveStatusToLocalStorage from "../../utils/setTeamActiveStatusToLocalStorage";

export default function teamReducer(
  teamState: TeamStateType,
  action: TeamStateActionType
) {
  function syncTeamStateActivity(draftState: WritableDraft<TeamStateType>) {
    setTeamActiveStatusToLocalStorage(
      draftState.teamActiveStatus.teamId,
      draftState.teamActiveStatus
    );
    const { spaceId, teamId, listId, folderIds } = draftState.teamActiveStatus;
    draftState.teamsForRender = deepCopy(draftState.originalTeams);

    draftState.teamsForRender.forEach((team) => {
      if (team.id === teamId) {
        team["isSelected"] = true;
        team.spaces.forEach((space) => {
          if (space.id === spaceId) {
            space.isOpen = true;
          }

          space.allListOrFolder.forEach((listOrFolder) => {
            const isFolder = determineFolderType(listOrFolder);
            if (isFolder) {
              if (folderIds.includes(listOrFolder.id)) {
                listOrFolder["isOpen"] = true;
              }

              listOrFolder.allLists.forEach((list) => {
                if (list.id === listId) {
                  list["isSelected"] = true;
                }
              });
            } else if (!isFolder && listOrFolder.id === listId) {
              listOrFolder["isSelected"] = true;
            }
          });
        });
      }
    });
  }

  switch (action.type) {
    // Init
    case TEAM_STATE_ACTION.INIT_TEAM_STATE: {
      return produce(teamState, (draftState) => {
        const { teams, teamActivity } = action.payload;

        // reorder
        const copiedTeams = deepCopy(teams) as Team[];
        copiedTeams.forEach(
          (team) =>
            team.id === teamActivity.teamId &&
            team.spaces
              .sort((a, b) => a.orderIndex - b.orderIndex)
              .forEach((space) => {
                const reorderedFolderCategories = space.folderCategories
                  .map((folder) => {
                    folder.allLists.sort((a, b) => a.orderIndex - b.orderIndex);
                    return folder;
                  })
                  .sort((a, b) => a.orderIndex - b.orderIndex);
                const reorderedListCategories = space.listCategories
                  //   .filter((list) => !list.parentFolderId)
                  .sort((a, b) => a.orderIndex - b.orderIndex);

                space.allListOrFolder.push(
                  ...reorderedFolderCategories,
                  ...reorderedListCategories
                );
              })
        );

        draftState.originalTeams = copiedTeams;
        draftState.teamsForRender = copiedTeams;
        draftState.teamActiveStatus = teamActivity;

        syncTeamStateActivity(draftState);
      });
    }

    // Update
    case TEAM_STATE_ACTION.UPDATE_LIST_DEFAULT_STATUS_CATEGORY_ID: {
      return produce(teamState, (draftState) => {
        const { newDefaultStatusCategoryId } = action.payload;

        const currentListId = draftState.teamActiveStatus.listId;
        draftState.originalTeams.forEach(
          (team) =>
            team.id === draftState.teamActiveStatus.teamId &&
            team.spaces.forEach((space) => {
              space.listCategories.forEach(
                (list) =>
                  list.id === currentListId &&
                  (list.defaultStatusCategoryId = newDefaultStatusCategoryId)
              );
              space.allListOrFolder.forEach((listOrFolder) => {
                if (determineFolderType(listOrFolder)) {
                  listOrFolder.allLists.forEach((list) => {
                    list.defaultStatusCategoryId = newDefaultStatusCategoryId;
                  });
                } else if (listOrFolder.id === currentListId) {
                  listOrFolder.defaultStatusCategoryId =
                    newDefaultStatusCategoryId;
                }
              });
            })
        );

        syncTeamStateActivity(draftState);
      });
    }

    // Select
    case TEAM_STATE_ACTION.SELECT_TEAM: {
      return produce(teamState, (draftState) => {
        const { teamId } = action.payload;

        draftState.teamActiveStatus.teamId = teamId;
      });
    }

    case TEAM_STATE_ACTION.SELECT_LIST: {
      return produce(teamState, (draftState) => {
        const { list } = action.payload;

        draftState.teamActiveStatus.listId = list.id;
        draftState.teamActiveStatus.defaultStatusCategoryId =
          list.defaultStatusCategoryId;
        syncTeamStateActivity(draftState);
      });
    }

    case TEAM_STATE_ACTION.OPEN_SPACE: {
      return produce(teamState, (draftState) => {
        const { spaceId } = action.payload;

        draftState.teamActiveStatus.spaceId =
          draftState.teamActiveStatus.spaceId === spaceId ? null : spaceId;
        syncTeamStateActivity(draftState);
      });
    }

    // delete
    case TEAM_STATE_ACTION.DELETE_FOLDER: {
      return produce(teamState, (draftState) => {
        const { deletedFolderId, nextListId, defaultStatusCategoryId } =
          action.payload;

        draftState.teamActiveStatus.listId = nextListId;
        draftState.teamActiveStatus.defaultStatusCategoryId =
          defaultStatusCategoryId;

        draftState.originalTeams.forEach((team) =>
          team.spaces.forEach((space) => {
            space.folderCategories.forEach(
              (folder, index, arr) =>
                folder.id === deletedFolderId && arr.splice(index, 1)
            );
            space.allListOrFolder.forEach(
              (folder, index, arr) =>
                folder.id === deletedFolderId && arr.splice(index, 1)
            );
          })
        );

        syncTeamStateActivity(draftState);
      });
    }

    case TEAM_STATE_ACTION.DELETE_LIST_IN_SPACE: {
      return produce(teamState, (draftState) => {
        const { nextListId, deletedListId, defaultStatusCategoryId } =
          action.payload;

        draftState.teamActiveStatus.listId = nextListId;
        draftState.teamActiveStatus.defaultStatusCategoryId =
          defaultStatusCategoryId;

        // delete original
        draftState.originalTeams.forEach((team) =>
          team.spaces.forEach((space) => {
            space.allListOrFolder.forEach(
              (listOrFolder, index, arr) =>
                listOrFolder.id === deletedListId && arr.splice(index, 1)
            );
            space.listCategories.forEach(
              (listOrFolder, index, arr) =>
                listOrFolder.id === deletedListId && arr.splice(index, 1)
            );
          })
        );
        syncTeamStateActivity(draftState);
      });
    }

    case TEAM_STATE_ACTION.DELETE_LIST_IN_FOLDER: {
      return produce(teamState, (draftState) => {
        const { nextListId, deletedListId, folderId, defaultStatusCategoryId } =
          action.payload;

        draftState.teamActiveStatus.listId = nextListId;
        draftState.teamActiveStatus.defaultStatusCategoryId =
          defaultStatusCategoryId;

        // delete original
        draftState.originalTeams.forEach((team) =>
          team.spaces.forEach((space) => {
            space.allListOrFolder.forEach(
              (listOrFolder) =>
                determineFolderType(listOrFolder) &&
                listOrFolder.allLists.forEach(
                  (list, index, arr) =>
                    list.id === deletedListId && arr.splice(index, 1)
                )
            );

            space.listCategories.forEach(
              (listOrFolder) =>
                determineFolderType(listOrFolder) &&
                listOrFolder.allLists.forEach(
                  (list, index, arr) =>
                    list.id === deletedListId && arr.splice(index, 1)
                )
            );
          })
        );
        syncTeamStateActivity(draftState);
      });
    }

    case TEAM_STATE_ACTION.DELETE_SPACE: {
      return produce(teamState, (draftState) => {
        const {
          nextSpaceId,
          nextListId,
          deletedSpaceId,
          defaultStatusCategoryId,
        } = action.payload;

        draftState.teamActiveStatus.listId = nextListId;
        draftState.teamActiveStatus.spaceId = nextSpaceId;
        draftState.teamActiveStatus.defaultStatusCategoryId =
          defaultStatusCategoryId;

        // delete original
        draftState.originalTeams.forEach((team) =>
          team.spaces.forEach(
            (space, index, arr) =>
              space.id === deletedSpaceId && arr.splice(index, 1)
          )
        );
        syncTeamStateActivity(draftState);
      });
    }

    case TEAM_STATE_ACTION.OPEN_FOLDER: {
      return produce(teamState, (draftState) => {
        const { folderId } = action.payload;

        if (draftState.teamActiveStatus.folderIds.includes(folderId)) {
          draftState.teamActiveStatus.folderIds =
            draftState.teamActiveStatus.folderIds.filter(
              (id) => id !== folderId
            );
        } else {
          draftState.teamActiveStatus.folderIds.push(folderId);
        }

        syncTeamStateActivity(draftState);
      });
    }

    case TEAM_STATE_ACTION.CREATE_SPACE: {
      return produce(teamState, (draftState) => {
        const space = action.payload;
        const spaceCopy = JSON.parse(JSON.stringify(space));

        spaceCopy.allListOrFolder.push(spaceCopy.listCategories[0]);
        draftState.teamActiveStatus.spaceId = spaceCopy.id;
        const createdSubList = spaceCopy.listCategories[0] as ListCategory;
        draftState.teamActiveStatus.listId = createdSubList.id;
        draftState.teamActiveStatus.defaultStatusCategoryId =
          createdSubList.defaultStatusCategoryId;

        draftState.originalTeams.forEach(
          (team) =>
            team.id === draftState.teamActiveStatus.teamId &&
            team.spaces.push(spaceCopy)
        );

        syncTeamStateActivity(draftState);
      });
    }

    case TEAM_STATE_ACTION.CREATE_FOLDER: {
      return produce(teamState, (draftState) => {
        const folder = deepCopy(action.payload) as FolderCategory;
        folder.allLists.sort((a, b) => a.orderIndex - b.orderIndex);

        const spaceId = draftState.createFolderInfo?.spaceId;
        if (!spaceId) throw new Error("spaceId is null");

        draftState.teamActiveStatus.spaceId = spaceId;
        draftState.teamActiveStatus.folderIds.push(folder.id);

        if (folder.allLists.length) {
          const createdSubList = folder.allLists[0] as ListCategory;
          draftState.teamActiveStatus.listId = createdSubList.id;
          draftState.teamActiveStatus.defaultStatusCategoryId =
            createdSubList.defaultStatusCategoryId;
        }

        draftState.originalTeams.forEach(
          (team) =>
            team.id === draftState.teamActiveStatus.teamId &&
            team.spaces.forEach((space) => {
              if (space.id === spaceId) {
                // @ts-expect-error
                const lastFolderIndex = space.allListOrFolder.findLastIndex(
                  // @ts-expect-error
                  (i) => determineFolderType(i)
                );

                if (lastFolderIndex >= 0) {
                  space.allListOrFolder.splice(lastFolderIndex + 1, 0, folder);
                  return;
                }
                space.allListOrFolder.unshift(folder);
                space.folderCategories.push(folder);
              }
            })
        );

        syncTeamStateActivity(draftState);
        draftState.createFolderInfo = null;
      });
    }

    case TEAM_STATE_ACTION.CREATE_LIST: {
      return produce(teamState, (draftState) => {
        const newList = action.payload;
        if (!draftState.createListInfo)
          throw new Error("draftState.createListInfo not initialized");
        const { spaceId, folderId } = draftState.createListInfo;

        draftState.teamActiveStatus.spaceId = spaceId;
        draftState.teamActiveStatus.listId = newList.id;
        draftState.teamActiveStatus.defaultStatusCategoryId =
          newList.defaultStatusCategoryId;
        if (folderId) draftState.teamActiveStatus.folderIds.push(folderId);

        draftState.originalTeams.forEach(
          (team) =>
            team.id === draftState.teamActiveStatus.teamId &&
            team.spaces.forEach((space) => {
              if (space.id === spaceId) {
                if (!folderId) {
                  space.allListOrFolder.push(newList);
                  space.listCategories.push(newList);
                  return;
                }

                space.allListOrFolder.forEach((listOrFolder) => {
                  if (
                    determineFolderType(listOrFolder) &&
                    listOrFolder.id === folderId
                  ) {
                    listOrFolder.allLists.push(newList);
                    space.listCategories.push(newList);
                  }
                });
              }
            })
        );

        syncTeamStateActivity(draftState);
        draftState.createListInfo = null;
      });
    }

    case TEAM_STATE_ACTION.SET_CREATE_FOLDER_INFO: {
      return produce(teamState, (draftState) => {
        const payload = deepCopy(action.payload);
        const { spaceId } = payload;

        draftState.originalTeams.forEach(
          (team) =>
            team.id === draftState.teamActiveStatus.teamId &&
            team.spaces.forEach(
              (space) =>
                space.id === spaceId &&
                (payload.currentLevelFolders = space.folderCategories)
            )
        );

        draftState.createFolderInfo = payload;
      });
    }

    case TEAM_STATE_ACTION.SET_CREATE_LIST_INFO: {
      return produce(teamState, (draftState) => {
        const payload = deepCopy(action.payload) as CreateListInfo;
        const { spaceId, folderId } = payload;

        draftState.originalTeams.forEach(
          (team) =>
            team.id === draftState.teamActiveStatus.teamId &&
            team.spaces.forEach((space) => {
              if (space.id === spaceId) {
                if (!folderId) {
                  const lists = space.listCategories;
                  payload.currentLevelLists = lists;

                  const lastListItem = lists[lists.length - 1];
                  payload.orderIndex = lastListItem
                    ? lastListItem.orderIndex + 1
                    : 1;
                  return;
                }

                space.allListOrFolder.forEach((listOrFolder) => {
                  if (
                    determineFolderType(listOrFolder) &&
                    listOrFolder.id === folderId
                  ) {
                    const lists = listOrFolder.allLists;
                    payload.currentLevelLists = lists;

                    const lastListItem = lists[lists.length - 1];
                    payload.orderIndex = lastListItem
                      ? lastListItem.orderIndex + 1
                      : 1;
                  }
                });
              }
            })
        );

        draftState.createListInfo = payload;
      });
    }

    default: {
      return teamState;
    }
  }
}
