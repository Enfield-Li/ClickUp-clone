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
        const copiedTeams = deepCopy(teams) as Team[];
        copiedTeams.forEach(
          (team) =>
            team.id === teamActivity.teamId &&
            team.spaces
              .sort((a, b) => a.orderIndex - b.orderIndex)
              .forEach((space) => {
                space.listCategories = space.listCategories.filter(
                  (list) => !list.parentFolderId
                );
                space.allListOrFolder.push(
                  ...space.folderCategories.sort(
                    (a, b) => a.orderIndex - b.orderIndex
                  )
                );
                space.allListOrFolder.push(
                  ...space.listCategories.sort(
                    (a, b) => a.orderIndex - b.orderIndex
                  )
                );
              })
        );

        draftState.teams = copiedTeams;
        draftState.originalTeams = copiedTeams;
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
        const spaceCopy = JSON.parse(JSON.stringify(space));

        spaceCopy.allListOrFolder.push(spaceCopy.listCategories[0]);
        draftState.teamActiveStatus.spaceId = spaceCopy.id;
        draftState.teamActiveStatus.listId = spaceCopy.listCategories[0].id;
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
        const folder = action.payload;
        const spaceId = draftState.createFolderInfo?.spaceId;
        if (!spaceId) throw new Error("spaceId is null");

        draftState.teamActiveStatus.listId = folder.allLists[0].id;
        draftState.teamActiveStatus.spaceId = spaceId;
        draftState.teamActiveStatus.folderIds.push(folder.id);

        draftState.originalTeams.forEach(
          (team) =>
            team.id === draftState.teamActiveStatus.teamId &&
            team.spaces.forEach((space) => {
              if (space.id === spaceId) {
                // @ts-expect-error
                const index = space.allListOrFolder.findLastIndex((i) =>
                  determineListType(i)
                );

                if (index >= 0) {
                  space.allListOrFolder.splice(index - 1, 0, folder);
                  return;
                }
                space.allListOrFolder.push(folder);
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

        draftState.teamActiveStatus.listId = newList.id;
        draftState.teamActiveStatus.spaceId = spaceId;
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

                space.allListOrFolder.forEach(
                  (listOrFolder) =>
                    determineFolderType(listOrFolder) &&
                    listOrFolder.id === folderId &&
                    listOrFolder.allLists.push(newList)
                );
              }
            })
        );

        syncTeamStateActivity(draftState);
        draftState.createListInfo = null;
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
                (payload["defaultStatusCategoryId"] =
                  space.defaultStatusCategoryId)
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
                if (folderId) {
                  space.folderCategories.forEach((folder) => {
                    if (folder.id === folderId) {
                      const lists = folder.allLists;
                      payload.currentLevelLists = lists;

                      const lastListItem = lists[lists.length - 1];
                      payload.orderIndex = lastListItem
                        ? lastListItem.orderIndex + 1
                        : 1;
                    }
                  });
                  return;
                }

                const lists = space.listCategories;
                payload.currentLevelLists = lists;

                const lastListItem = lists[lists.length - 1];
                payload.orderIndex = lastListItem
                  ? lastListItem.orderIndex + 1
                  : 1;
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
