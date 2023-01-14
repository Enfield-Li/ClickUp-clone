import { space } from "@chakra-ui/react";
import produce from "immer";
import { WritableDraft } from "immer/dist/internal";
import determineListType, {
  determineFolderType,
} from "../../component/layout/subNavbar/folderAndList/determineList";
import {
  Category,
  CreateFolderInfo,
  CreateListInfo,
  FolderCategory,
  ListCategory,
  Team,
  TeamStateActionType,
  TeamStateType,
  TEAM_STATE_ACTION,
} from "../../types";
import { deepCopy } from "../../utils/deepCopy";

export default function teamReducer(
  teamState: TeamStateType,
  action: TeamStateActionType
) {
  function syncTeamStateActivity(draftState: WritableDraft<TeamStateType>) {
    const { spaceId, teamId, listId, folderIds } = draftState.teamActiveStatus;
    draftState.teams = deepCopy(draftState.originalTeams);

    draftState.teams.forEach((team) => {
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
        const copied = deepCopy(teams) as Team[];
        copied.forEach((team) =>
          team.spaces
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .forEach((space) => {
              space.allListOrFolder = reorderListAndFolder(
                space.allListOrFolder
              );
            })
        );

        function reorderListAndFolder(
          listOrFolders: (FolderCategory | ListCategory)[]
        ) {
          const reOrderedList: (FolderCategory | ListCategory)[] = [];
          const orderedFolder: FolderCategory[] = [];
          const orderedList: ListCategory[] = [];

          listOrFolders
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .forEach((listOrFolder) => {
              const isFolder = determineFolderType(listOrFolder);
              if (isFolder) {
                listOrFolder.allLists.sort(
                  (a, b) => a.orderIndex - b.orderIndex
                );
                orderedFolder.push(listOrFolder);
                return;
              }

              if (!listOrFolder.parentFolderId) {
                orderedList.push(listOrFolder);
              }
            });

          reOrderedList.push(...orderedFolder, ...orderedList);
          return reOrderedList;
        }

        draftState.teams = copied;
        draftState.originalTeams = copied;
        draftState.teamActiveStatus = teamActivity;

        syncTeamStateActivity(draftState);
      });
    }

    // Select
    case TEAM_STATE_ACTION.SELECT_TEAM: {
      return produce(teamState, (draftState) => {
        const { teamId } = action.payload;

        draftState.teamActiveStatus.teamId = teamId;
        syncTeamStateActivity(draftState);
      });
    }

    case TEAM_STATE_ACTION.SELECT_LIST: {
      return produce(teamState, (draftState) => {
        const { listId } = action.payload;

        draftState.teamActiveStatus.listId = listId;
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

        draftState.teamActiveStatus.spaceId = space.id;
        draftState.teamActiveStatus.listId = space.allListOrFolder[0].id;
        draftState.originalTeams.forEach(
          (team) =>
            team.id === draftState.teamActiveStatus.teamId &&
            team.spaces.push(space)
        );

        syncTeamStateActivity(draftState);
      });
    }

    case TEAM_STATE_ACTION.CREATE_FOLDER: {
      return produce(teamState, (draftState) => {
        const folder = action.payload;
        const spaceId = draftState.createFolderInfo?.spaceId;
        if (!spaceId) throw new Error("spaceId is null");

        draftState.teamActiveStatus.listId = null;
        draftState.teamActiveStatus.spaceId = spaceId;

        draftState.teamActiveStatus.folderIds.push(folder.id);
        draftState.originalTeams.forEach(
          (team) =>
            team.id === draftState.teamActiveStatus.teamId &&
            team.spaces.forEach((space) => {
              if (space.id === spaceId) {
                const index = space.allListOrFolder.findIndex((i) =>
                  determineListType(i)
                );

                if (!index || index === -1) {
                  space.allListOrFolder.push(folder);
                  return;
                }
                space.allListOrFolder.splice(index, 0, folder);
              }
            })
        );

        syncTeamStateActivity(draftState);
        draftState.createFolderInfo = null;
      });
    }

    case TEAM_STATE_ACTION.SET_CREATE_FOLDER_INFO: {
      return produce(teamState, (draftState) => {
        const payload = deepCopy(action.payload) as CreateFolderInfo;
        const { spaceId } = payload;

        draftState.teams.forEach(
          (team) =>
            team.isSelected &&
            team.spaces.forEach(
              (space) =>
                space.id === spaceId &&
                (payload["statusColumnsCategoryId"] =
                  space.statusColumnsCategoryId)
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
            team.isSelected &&
            team.spaces.forEach(
              (space) =>
                space.id === spaceId &&
                (payload["statusColumnsCategoryId"] =
                  space.statusColumnsCategoryId)
            )
        );

        const lastListOrFolder = draftState.originalTeams
          .find((team) => team.isSelected)
          ?.spaces.find((space) => space.id === spaceId)
          // @ts-expect-error
          ?.allListOrFolder.findLast((listOrFolder, index, arr) => {
            const isFolder = determineFolderType(listOrFolder);
            if (isFolder && listOrFolder.id === folderId) {
              return;
            }

            return index === arr.length - 1;
          });

        if (!lastListOrFolder) {
          payload["orderIndex"] = 1;
          draftState.createListInfo = payload;
          return;
        }

        const isFolder = determineFolderType(lastListOrFolder);
        if (isFolder) {
          const lastListItem =
            lastListOrFolder.allLists[lastListOrFolder.allLists.length - 1];
          payload["orderIndex"] = lastListItem.orderIndex + 1;

          draftState.createListInfo = payload;
          return;
        }

        const lastListItem = lastListOrFolder;
        payload["orderIndex"] = lastListItem.orderIndex + 1;

        draftState.createListInfo = payload;
      });
    }

    // case TEAM_STATE_ACTION.CREATE_SPACE: {
    //   return produce(teamState, (draftState) => {
    //     const {} = action.payload;
    //   });
    // }

    default: {
      return teamState;
    }
  }
}
