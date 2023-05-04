import { create } from "zustand";
import {
  Team,
  TeamActiveStatus,
  CreateListInfo,
  CreateFolderInfo,
  TeamsResponseDTO,
  ListCategory,
  Space,
  FolderCategory,
  DeleteSpaceArgType,
  DeleteFolderArgType,
  DeleteListInFolderArgType,
  DeleteListInSpaceArgType,
} from "../types";
import { deepCopy } from "../utils/deepCopy";
import { immer } from "zustand/middleware/immer";
import { determineFolderType } from "../utils/determineList";
import { storeTeamActiveStatusToStorage } from "../utils/asyncStorage";

export type TeamStateType = {
  teamsForRender: Team[];
  originalTeams: Team[];
  teamActiveStatus: TeamActiveStatus;
  createListInfo: CreateListInfo | null;
  createFolderInfo: CreateFolderInfo | null;
  initTeamState: (dto: TeamsResponseDTO) => void;
  selectTeam: (teamId: number) => void;
  selectList: (list: ListCategory) => void;
  updateOpenedFolder: (folderId: number) => void;
  updateOpenedSpace: (spaceId: number | null) => void;
  updateListDefaultStatusCategoryId: (
    newDefaultStatusCategoryId: number
  ) => void;
  addSpace: (space: Space) => void;
  addFolder: (folder: FolderCategory) => void;
  addList: (list: ListCategory) => void;
  removeTeam: () => void;
  removeSpace: (deleteSpaceArg: DeleteSpaceArgType) => void;
  removeFolder: (deleteFolderArg: DeleteFolderArgType) => void;
  removeListInFolder: (
    deleteListInFolderArgType: DeleteListInFolderArgType
  ) => void;
  removeListInSpace: (
    deleteListInSpaceArgType: DeleteListInSpaceArgType
  ) => void;
};

export const useTeam = create<TeamStateType>()(
  // @ts-ignore
  immer((set) => ({
    teamsForRender: [],
    originalTeams: [],
    teamActiveStatus: {
      teamId: 0,
      spaceId: 0,
      listId: 0,
      folderIds: [],
    },
    createListInfo: null,
    createFolderInfo: null,
    selectTeam: (teamId) =>
      set((state) => {
        state.teamActiveStatus.teamId = teamId;
        syncTeamStateActivity(state);
      }),
    selectList: (list) =>
      set((state) => {
        state.teamActiveStatus.listId = list.id;
        state.teamActiveStatus.defaultStatusCategoryId =
          list.defaultStatusCategoryId;
        syncTeamStateActivity(state);
      }),

    updateOpenedFolder: (folderId) =>
      set((state) => {
        if (state.teamActiveStatus.folderIds.includes(folderId)) {
          state.teamActiveStatus.folderIds =
            state.teamActiveStatus.folderIds.filter((id) => id !== folderId);
        } else {
          state.teamActiveStatus.folderIds.push(folderId);
        }

        syncTeamStateActivity(state);
      }),
    updateOpenedSpace: (spaceId) =>
      set((state) => {
        state.teamActiveStatus.spaceId =
          state.teamActiveStatus.spaceId === spaceId ? null : spaceId;
        syncTeamStateActivity(state);
      }),
    updateListDefaultStatusCategoryId: (newDefaultStatusCategoryId) =>
      set((state) => {
        const currentListId = state.teamActiveStatus.listId;
        state.originalTeams.forEach(
          (team) =>
            team.id === state.teamActiveStatus.teamId &&
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

        syncTeamStateActivity(state);
      }),

    initTeamState: (dto) =>
      set((state) => {
        const { teams, teamActivity } = dto;

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

        state.originalTeams = copiedTeams;
        state.teamsForRender = copiedTeams;
        state.teamActiveStatus = teamActivity;

        syncTeamStateActivity(state);
      }),
    addSpace: (space) =>
      set((state) => {
        const spaceCopy = JSON.parse(JSON.stringify(space));

        spaceCopy.allListOrFolder.push(spaceCopy.listCategories[0]);
        state.teamActiveStatus.spaceId = spaceCopy.id;
        const createdSubList = spaceCopy.listCategories[0] as ListCategory;
        state.teamActiveStatus.listId = createdSubList.id;
        state.teamActiveStatus.defaultStatusCategoryId =
          createdSubList.defaultStatusCategoryId;

        state.originalTeams.forEach(
          (team) =>
            team.id === state.teamActiveStatus.teamId &&
            team.spaces.push(spaceCopy)
        );

        syncTeamStateActivity(state);
      }),
    addFolder: (folder) =>
      set((state) => {
        const folderCopied = deepCopy(folder) as FolderCategory;
        folderCopied.allLists.sort((a, b) => a.orderIndex - b.orderIndex);

        const spaceId = state.createFolderInfo?.spaceId;
        if (!spaceId) throw new Error("spaceId is null");

        state.teamActiveStatus.spaceId = spaceId;
        state.teamActiveStatus.folderIds.push(folderCopied.id);

        if (folderCopied.allLists.length) {
          const createdSubList = folderCopied.allLists[0] as ListCategory;
          state.teamActiveStatus.listId = createdSubList.id;
          state.teamActiveStatus.defaultStatusCategoryId =
            createdSubList.defaultStatusCategoryId;
        }

        state.originalTeams.forEach(
          (team) =>
            team.id === state.teamActiveStatus.teamId &&
            team.spaces.forEach((space) => {
              if (space.id === spaceId) {
                const lastFolderIndex = space.allListOrFolder.findLastIndex(
                  (i) => determineFolderType(i)
                );

                if (lastFolderIndex >= 0) {
                  space.allListOrFolder.splice(
                    lastFolderIndex + 1,
                    0,
                    folderCopied
                  );
                  return;
                }
                space.allListOrFolder.unshift(folderCopied);
                space.folderCategories.push(folderCopied);
              }
            })
        );

        syncTeamStateActivity(state);
        state.createFolderInfo = null;
      }),
    addList: (list) =>
      set((state) => {
        if (!state.createListInfo)
          throw new Error("state.createListInfo not initialized");
        const { spaceId, folderId } = state.createListInfo;

        state.teamActiveStatus.spaceId = spaceId;
        state.teamActiveStatus.listId = list.id;
        state.teamActiveStatus.defaultStatusCategoryId =
          list.defaultStatusCategoryId;
        if (folderId) state.teamActiveStatus.folderIds.push(folderId);

        state.originalTeams.forEach(
          (team) =>
            team.id === state.teamActiveStatus.teamId &&
            team.spaces.forEach((space) => {
              if (space.id === spaceId) {
                if (!folderId) {
                  space.allListOrFolder.push(list);
                  space.listCategories.push(list);
                  return;
                }

                space.allListOrFolder.forEach((listOrFolder) => {
                  if (
                    determineFolderType(listOrFolder) &&
                    listOrFolder.id === folderId
                  ) {
                    listOrFolder.allLists.push(list);
                    space.listCategories.push(list);
                  }
                });
              }
            })
        );

        syncTeamStateActivity(state);
        state.createListInfo = null;
      }),

    removeTeam: () => set((state) => {}),
    removeSpace: ({
      deletedSpaceId,
      nextListId,
      nextSpaceId,
      defaultStatusCategoryId,
    }) =>
      set((state) => {
        state.teamActiveStatus.listId = nextListId;
        state.teamActiveStatus.spaceId = nextSpaceId;
        state.teamActiveStatus.defaultStatusCategoryId =
          defaultStatusCategoryId;

        // delete original
        state.originalTeams.forEach((team) =>
          team.spaces.forEach(
            (space, index, arr) =>
              space.id === deletedSpaceId && arr.splice(index, 1)
          )
        );
        syncTeamStateActivity(state);
      }),
    removeListInSpace: ({
      deletedListId,
      nextListId,
      defaultStatusCategoryId,
    }) =>
      set((state) => {
        state.teamActiveStatus.listId = nextListId;
        state.teamActiveStatus.defaultStatusCategoryId =
          defaultStatusCategoryId;

        // delete original
        state.originalTeams.forEach((team) =>
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
        syncTeamStateActivity(state);
      }),
    removeListInFolder: ({
      folderId,
      deletedListId,
      nextListId,
      defaultStatusCategoryId,
    }) =>
      set((state) => {
        state.teamActiveStatus.listId = nextListId;
        state.teamActiveStatus.defaultStatusCategoryId =
          defaultStatusCategoryId;

        // delete original
        state.originalTeams.forEach((team) =>
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
        syncTeamStateActivity(state);
      }),
    removeFolder: ({ deletedFolderId, nextListId, defaultStatusCategoryId }) =>
      set((state) => {
        state.teamActiveStatus.listId = nextListId;
        state.teamActiveStatus.defaultStatusCategoryId =
          defaultStatusCategoryId;

        state.originalTeams.forEach((team) =>
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

        syncTeamStateActivity(state);
      }),
  }))
);

function syncTeamStateActivity(state: TeamStateType) {
  storeTeamActiveStatusToStorage(
    state.teamActiveStatus.teamId,
    state.teamActiveStatus
  );
  const { spaceId, teamId, listId, folderIds } = state.teamActiveStatus;
  state.teamsForRender = deepCopy(state.originalTeams);

  state.teamsForRender.forEach((team) => {
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
    } else {
      team["isSelected"] = false;
    }
  });
}
