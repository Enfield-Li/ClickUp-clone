import produce from "immer";
import { WritableDraft } from "immer/dist/internal";
import { determineFolderType } from "../../component/layout/subNavbar/folderAndList/determineList";
import {
  TeamStateType,
  TeamStateActionType,
  TEAM_STATE_ACTION,
  ListCategory,
  Team,
} from "../../types";
import { deepCopy } from "../../utils/deepCopy";

const errorMsg =
  "Failed to init teamState, failed to find current statusColumnCategory";

export default function teamReducer(
  spaceListState: TeamStateType,
  action: TeamStateActionType
) {
  switch (action.type) {
    case TEAM_STATE_ACTION.INIT_TEAM_STATE: {
      return produce(spaceListState, (draftState) => {
        const { teams, panelActivity } = action.payload;
        const { TeamActivities, defaultTeamId } = panelActivity;

        const currentTeamActivities = TeamActivities.find(
          (teamActivity) => teamActivity.teamId === defaultTeamId
        );
        if (!currentTeamActivities) throw new Error(errorMsg);

        const { folderIds, listId, spaceIds } = currentTeamActivities;

        // draftState.teams = teams;
        draftState.teams = deepCopy(teams); // hack
        draftState.activeTeamState.selectedTeamId = defaultTeamId;
        draftState.activeTeamState.selectedListId =
          currentTeamActivities.listId;

        function setStatusColumn(
          team: WritableDraft<Team>,
          list: ListCategory,
          selectedListId: number
        ) {
          if (list.id === selectedListId) {
            const statusColumnCategory =
              team.defaultStatusColumnCategories.find(
                (category) => category.id === list.statusColumnsCategoryId
              );
            if (!statusColumnCategory) throw new Error(errorMsg);

            draftState.activeTeamState.currentStatusColumns =
              statusColumnCategory.statusColumns;
          }
        }

        draftState.teams.forEach(
          (team) =>
            team.id === defaultTeamId &&
            team.spaceList.forEach((space) => {
              if (space.id in spaceIds) {
                space.isOpen = true;

                space.allListOrFolder.forEach((listOrFolder) => {
                  const isFolder = determineFolderType(listOrFolder);

                  if (isFolder && listOrFolder.id in folderIds) {
                    listOrFolder.isOpen = true;

                    listOrFolder.allLists.forEach((list) => {
                      setStatusColumn(team, list, listId);
                    });
                  } else if (!isFolder) {
                    setStatusColumn(team, listOrFolder, listId);
                  }
                });
              }
            })
        );
      });
    }

    case TEAM_STATE_ACTION.UPDATE_OPENED_SPACE: {
      return produce(spaceListState, (draftState) => {
        const { spaceId } = action.payload;

        draftState.teams.forEach((team) => {
          if (team.id === draftState.activeTeamState.selectedTeamId) {
            team.spaceList?.forEach((space) => {
              // update previous space.isOpen to false
              if (space.isOpen && space.id !== spaceId) {
                space.isOpen = false;
              }
              if (space.id === spaceId) {
                space.isOpen = !space.isOpen;
              }
            });
          }
        });
      });
    }

    case TEAM_STATE_ACTION.UPDATE_OPENED_FOLDER: {
      return produce(spaceListState, (draftState) => {
        const { spaceId, folderId } = action.payload;

        draftState.teams.forEach((team) => {
          if (team.id === draftState.activeTeamState.selectedTeamId) {
            team.spaceList?.forEach((space) => {
              if (space.id === spaceId) {
                space.allListOrFolder.forEach((listOrFolder) => {
                  const isFolder = determineFolderType(listOrFolder);
                  const isCurrentFolder = listOrFolder.id === folderId;

                  if (isFolder && isCurrentFolder) {
                    listOrFolder.isOpen = !listOrFolder.isOpen;
                  }
                });
              }
            });
          }
        });
      });
    }

    case TEAM_STATE_ACTION.UPDATE_SELECTED_LIST: {
      return produce(spaceListState, (draftState) => {
        draftState.activeTeamState.selectedListId = action.payload.listId;
      });
    }

    case TEAM_STATE_ACTION.UPDATE_SELECTED_FOLDER: {
      throw new Error("not implemented");
    }

    case TEAM_STATE_ACTION.SELECT_TEAM: {
      return produce(spaceListState, (draftState) => {
        const { teamId } = action.payload;
        draftState.activeTeamState.selectedTeamId = teamId;
      });
    }

    case TEAM_STATE_ACTION.UPDATE_SELECTED_SPACE: {
      throw new Error("not implemented");
    }

    default: {
      return spaceListState;
    }
  }
}
