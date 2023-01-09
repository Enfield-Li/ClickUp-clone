import produce from "immer";
import { determineFolderType } from "../../component/layout/subNavbar/folderAndList/determineList";
import {
  TeamStateActionType,
  TeamStateType,
  TEAM_STATE_ACTION,
} from "../../types";
import { deepCopy } from "../../utils/deepCopy";

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
        draftState.teamActivity = teamActivity;

        draftState.teams.forEach((team) => {
          if (team.id === teamId) {
            team.isSelected = true;
            team.spaces.forEach((space) => {
              if (space.id === spaceId) {
                space.isOpen = true;
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
      return produce(spaceListState, (draftState) => {
        const { teamId } = action.payload;

        draftState.teamActivity.teamId = teamId;

        draftState.teams.forEach((team) => {
          if (team.id === teamId && team.isSelected) {
            return;
          }

          if (team.id !== teamId && team.isSelected) {
            team.isSelected = false;
          }
          if (team.id === teamId) {
            team.isSelected = true;
          }
        });
      });
    }

    case TEAM_STATE_ACTION.SELECT_LIST: {
      return produce(spaceListState, (draftState) => {
        const { spaceId, folderId, listId } = action.payload;

        draftState.teamActivity.listId = listId;

        draftState.teams.forEach(
          (team) =>
            team.isSelected &&
            team.spaces.forEach(
              (space) =>
                space.id === spaceId &&
                space.allListOrFolder.forEach((listOrFolder) => {
                  const isFolder = determineFolderType(listOrFolder);

                  if (isFolder && listOrFolder.id === folderId) {
                    listOrFolder.allLists.forEach((list) => {
                      if (list.id !== listId && list.isSelected) {
                        list.isSelected = false;
                      }
                      if (list.id === listId) {
                        list.isSelected = true;
                      }
                    });
                  }

                  if (!isFolder && listOrFolder.id === listId) {
                    listOrFolder.isSelected = true;
                  }

                  if (
                    !isFolder &&
                    listOrFolder.id !== listId &&
                    listOrFolder.isSelected
                  ) {
                    listOrFolder.isSelected = false;
                  }
                })
            )
        );
      });
    }

    case TEAM_STATE_ACTION.OPEN_SPACE: {
      return produce(spaceListState, (draftState) => {
        const { spaceId } = action.payload;

        draftState.teamActivity.spaceId = spaceId;

        draftState.teams.forEach(
          (team) =>
            team.isSelected &&
            team.spaces.forEach((space) => {
              if (space.id === spaceId && space.isOpen) {
                space.isOpen = !space.isOpen;
                return;
              }

              if (space.id === spaceId && !space.isOpen) {
                space.isOpen = true;
              }
            })
        );
      });
    }

    case TEAM_STATE_ACTION.OPEN_FOLDER: {
      return produce(spaceListState, (draftState) => {
        const { folderId, spaceId } = action.payload;

        draftState.teams.forEach(
          (team) =>
            team.isSelected &&
            team.spaces.forEach(
              (space) =>
                space.id === spaceId &&
                space.allListOrFolder.forEach((listOrFolder) => {
                  const isFolder = determineFolderType(listOrFolder);
                  if (isFolder && listOrFolder.id === folderId) {
                    listOrFolder.isOpen = !listOrFolder.isOpen;
                  }
                })
            )
        );
      });
    }

    default: {
      return spaceListState;
    }
  }
}
