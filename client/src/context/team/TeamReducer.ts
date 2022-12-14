import produce from "immer";
import { WritableDraft } from "immer/dist/internal";
import { determineFolderType } from "../../component/layout/subNavbar/folderAndList/determineList";
import {
  TeamStateType,
  TeamStateActionType,
  TEAM_STATE_ACTION,
} from "../../types";
import { deepCopy } from "../../utils/deepCopy";
import { updateActiveTeamState } from "./updateCurrentTeam";

export const errorMsg = "Failed to init teamState ";

export default function teamReducer(
  spaceListState: TeamStateType,
  action: TeamStateActionType
) {
  switch (action.type) {
    // Init
    case TEAM_STATE_ACTION.INIT_TEAM_STATE: {
      return produce(spaceListState, (draftState) => {
        const { teams, panelActivity } = action.payload;
        const { teamActivities, defaultTeamId } = panelActivity;

        draftState.teams = deepCopy(teams); // hack
        draftState.panelActivity.teamActivities = teamActivities;

        updateActiveTeamState({
          draftState,
          teamId: defaultTeamId,
        });
      });
    }

    // Select
    case TEAM_STATE_ACTION.SELECT_TEAM: {
      return produce(spaceListState, (draftState) => {
        const { teamId } = action.payload;
        draftState.panelActivity.defaultTeamId = teamId;

        updateActiveTeamState({
          draftState,
          teamId,
        });
      });
    }

    case TEAM_STATE_ACTION.SELECT_LIST: {
      return produce(spaceListState, (draftState) => {
        const { spaceId, listId } = action.payload;

        draftState.activeTeamState.selectedListId = listId;
        draftState.activeTeamState.selectedSpaceId = spaceId;
      });
    }

    case TEAM_STATE_ACTION.OPEN_SPACE: {
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

    case TEAM_STATE_ACTION.OPEN_FOLDER: {
      return produce(spaceListState, (draftState) => {
        const { folderId } = action.payload;

        draftState.teams.forEach((team) => {
          if (team.id === draftState.activeTeamState.selectedTeamId) {
            team.spaceList?.forEach((space) => {
              space.allListOrFolder.forEach((listOrFolder) => {
                const isFolder = determineFolderType(listOrFolder);
                const isCurrentFolder = listOrFolder.id === folderId;

                if (isFolder && isCurrentFolder) {
                  listOrFolder.isOpen = !listOrFolder.isOpen;
                }
              });
            });
          }
        });
      });
    }

    default: {
      return spaceListState;
    }
  }
}
