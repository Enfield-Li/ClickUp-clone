import produce from "immer";
import { determineFolderType } from "../../component/layout/subNavbar/folderAndList/determineList";
import {
  TeamStateActionType,
  TeamStateType,
  TEAM_STATE_ACTION,
} from "../../types";
import { deepCopy } from "../../utils/deepCopy";

export const errorMsg = "Failed to init teamState ";

export default function teamReducer(
  spaceListState: TeamStateType,
  action: TeamStateActionType
) {
  switch (action.type) {
    // Init
    case TEAM_STATE_ACTION.INIT_TEAM_STATE: {
      return produce(spaceListState, (draftState) => {
        const { teams, teamActivity } = action.payload;
        const { folderIds, spaceId, teamId, listId } = teamActivity;
        draftState.teams = deepCopy(teams);
        draftState.teams.forEach((team) => {
          if (team.id === teamId) {
            team.isSelected = true;
            team.spaces.forEach((space) => {
              if (space.id === spaceId) {
                space.isChildListSelected = true;
              }

              space.allListOrFolder.forEach((listOrFolder) => {
                const isFolder = determineFolderType(listOrFolder);
                if (folderIds.includes(listOrFolder.id) && isFolder) {
                  listOrFolder.isOpen = true;
                  listOrFolder.allLists.forEach((list) => {
                    if (list.id === listId) {
                      list.isSelected = true;
                    }
                  });
                } else if (!isFolder && listOrFolder.id === listId) {
                  listOrFolder.isSelected = true;
                }
              });
            });
          }
        });
      });
    }

    // Select
    case TEAM_STATE_ACTION.SELECT_TEAM: {
      return produce(spaceListState, (draftState) => {});
    }

    case TEAM_STATE_ACTION.SELECT_LIST: {
      return produce(spaceListState, (draftState) => {});
    }

    case TEAM_STATE_ACTION.OPEN_SPACE: {
      return produce(spaceListState, (draftState) => {});
    }

    case TEAM_STATE_ACTION.OPEN_FOLDER: {
      return produce(spaceListState, (draftState) => {});
    }

    default: {
      return spaceListState;
    }
  }
}
