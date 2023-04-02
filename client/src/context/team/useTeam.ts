import produce from "immer";
import { WritableDraft } from "immer/dist/internal";
import { create } from "zustand";
import { determineFolderType } from "../../component/layout/subNavbar/folderAndList/determineList";
import {
  CreateFolderInfo,
  CreateListInfo,
  CreateTeamResponseDTO,
  DeleteFolderArgType,
  DeleteListInFolderArgType,
  DeleteListInSpaceArgType,
  DeleteSpaceArgType,
  FolderCategory,
  ListCategory,
  Space,
  Team,
  TeamActiveStatus,
  TeamsResponseDTO,
} from "../../types";
import { deepCopy } from "../../utils/deepCopy";
import { storeTeamActiveStatusToLocalStorage } from "../../utils/setTeamActiveStatusToLocalStorage";

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
  setCreateListInfo: (createListInfo: CreateListInfo) => void;
  setCreateFolderInfo: (createFolderInfo: CreateFolderInfo) => void;
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

export const useTeam = create<TeamStateType>()((set) => ({
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
    set((state) =>
      produce(state, (draftState) => {
        draftState.teamActiveStatus.teamId = teamId;
      })
    ),
  selectList: (list) =>
    set((state) =>
      produce(state, (draftState) => {
        draftState.teamActiveStatus.listId = list.id;
        draftState.teamActiveStatus.defaultStatusCategoryId =
          list.defaultStatusCategoryId;
        syncTeamStateActivity(draftState);
      })
    ),

  updateOpenedFolder: (folderId) =>
    set((state) =>
      produce(state, (draftState) => {
        if (draftState.teamActiveStatus.folderIds.includes(folderId)) {
          draftState.teamActiveStatus.folderIds =
            draftState.teamActiveStatus.folderIds.filter(
              (id) => id !== folderId
            );
        } else {
          draftState.teamActiveStatus.folderIds.push(folderId);
        }

        syncTeamStateActivity(draftState);
      })
    ),
  updateOpenedSpace: (spaceId) =>
    set((state) =>
      produce(state, (draftState) => {
        draftState.teamActiveStatus.spaceId =
          draftState.teamActiveStatus.spaceId === spaceId ? null : spaceId;
        syncTeamStateActivity(draftState);
      })
    ),
  updateListDefaultStatusCategoryId: (newDefaultStatusCategoryId) =>
    set((state) =>
      produce(state, (draftState) => {
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
      })
    ),

  setCreateListInfo: (createListInfo) =>
    set((state) =>
      produce(state, (draftState) => {
        const payload = deepCopy(createListInfo) as CreateListInfo;
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
      })
    ),
  setCreateFolderInfo: (createFolderInfo) =>
    set((state) =>
      produce(state, (draftState) => {
        const payload = deepCopy(createFolderInfo);
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
      })
    ),

  initTeamState: (dto) =>
    set((state) =>
      produce(state, (draftState) => {
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

        draftState.originalTeams = copiedTeams;
        draftState.teamsForRender = copiedTeams;
        draftState.teamActiveStatus = teamActivity;

        syncTeamStateActivity(draftState);
      })
    ),
  addSpace: (space) =>
    set((state) =>
      produce(state, (draftState) => {
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
      })
    ),
  addFolder: (folder) =>
    set((state) =>
      produce(state, (draftState) => {
        const folderCopied = deepCopy(folder) as FolderCategory;
        folderCopied.allLists.sort((a, b) => a.orderIndex - b.orderIndex);

        const spaceId = draftState.createFolderInfo?.spaceId;
        if (!spaceId) throw new Error("spaceId is null");

        draftState.teamActiveStatus.spaceId = spaceId;
        draftState.teamActiveStatus.folderIds.push(folderCopied.id);

        if (folderCopied.allLists.length) {
          const createdSubList = folderCopied.allLists[0] as ListCategory;
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

        syncTeamStateActivity(draftState);
        draftState.createFolderInfo = null;
      })
    ),
  addList: (list) =>
    set((state) =>
      produce(state, (draftState) => {
        if (!draftState.createListInfo)
          throw new Error("draftState.createListInfo not initialized");
        const { spaceId, folderId } = draftState.createListInfo;

        draftState.teamActiveStatus.spaceId = spaceId;
        draftState.teamActiveStatus.listId = list.id;
        draftState.teamActiveStatus.defaultStatusCategoryId =
          list.defaultStatusCategoryId;
        if (folderId) draftState.teamActiveStatus.folderIds.push(folderId);

        draftState.originalTeams.forEach(
          (team) =>
            team.id === draftState.teamActiveStatus.teamId &&
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

        syncTeamStateActivity(draftState);
        draftState.createListInfo = null;
      })
    ),

  removeTeam: () => set((state) => produce(state, (draftState) => {})),
  removeSpace: ({
    deletedSpaceId,
    nextListId,
    nextSpaceId,
    defaultStatusCategoryId,
  }) =>
    set((state) =>
      produce(state, (draftState) => {
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
      })
    ),
  removeListInSpace: ({ deletedListId, nextListId, defaultStatusCategoryId }) =>
    set((state) =>
      produce(state, (draftState) => {
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
      })
    ),
  removeListInFolder: ({
    folderId,
    deletedListId,
    nextListId,
    defaultStatusCategoryId,
  }) =>
    set((state) =>
      produce(state, (draftState) => {
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
      })
    ),
  removeFolder: ({ deletedFolderId, nextListId, defaultStatusCategoryId }) =>
    set((state) =>
      produce(state, (draftState) => {
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
      })
    ),
}));

function syncTeamStateActivity(draftState: WritableDraft<TeamStateType>) {
  storeTeamActiveStatusToLocalStorage(
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
