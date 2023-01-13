import produce from "immer";
import { WritableDraft } from "immer/dist/internal";
import determineListType, {
  determineFolderType,
} from "../../component/layout/subNavbar/folderAndList/determineList";
import {
  Category,
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

    case TEAM_STATE_ACTION.CREATE_Folder: {
      return produce(teamState, (draftState) => {
        const folder = action.payload;

        draftState.teamActiveStatus.listId = null;
        draftState.teamActiveStatus.folderIds.push(folder.id);
        draftState.originalTeams.forEach(
          (team) =>
            team.id === draftState.teamActiveStatus.teamId &&
            team.spaces.forEach((space) => {
              if (space.id === draftState.teamActiveStatus.spaceId) {
                const index = space.allListOrFolder.findIndex((i) =>
                  determineListType(i)
                );
                space.allListOrFolder.splice(index, 0, folder);
              }
            })
        );

        syncTeamStateActivity(draftState);
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
