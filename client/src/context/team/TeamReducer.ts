import produce from "immer";
import { WritableDraft } from "immer/dist/internal";
import { determineFolderType } from "../../component/layout/subNavbar/folderAndList/determineList";
import {
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
    const { spaceId, teamId, listId } = draftState.teamActiveStatus;
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
              listOrFolder["isOpen"] = true;
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
        teams.forEach((team) =>
          team.spaces
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .forEach((space) =>
              space.allListOrFolder.sort((a, b) => a.orderIndex - b.orderIndex)
            )
        );

        draftState.teams = teams;
        draftState.originalTeams = teams;
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

        draftState.teams.forEach(
          (team) =>
            team.isSelected &&
            team.spaces.forEach((space) =>
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
        const newFolder = action.payload;
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
