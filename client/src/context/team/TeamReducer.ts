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

export default function teamReducer(
  spaceListState: TeamStateType,
  action: TeamStateActionType
) {
  switch (action.type) {
    case TEAM_STATE_ACTION.INIT_TEAM_STATE: {
      return produce(spaceListState, (draftState) => {
        const {
          teams,
          defaultTeamId,
          defaultSpaceId,
          defaultFolderId,
          defaultListId,
        } = action.payload;

        draftState.teams = teams;
        draftState.defaultTeamId = defaultTeamId;
        draftState.defaultSpaceId = defaultSpaceId;
        draftState.defaultFolderId = defaultFolderId;
        draftState.defaultListId = defaultListId;

        function setStatusColumn(
          team: WritableDraft<Team>,
          list: ListCategory,
          defaultListId: number
        ) {
          if (list.id === defaultListId) {
            const statusColumnCategory =
              team.defaultStatusColumnCategories.find(
                (category) => category.id === list.statusColumnsCategoryId
              );

            const errorMsg =
              "Failed to init teamState, failed to find current statusColumnCategory";
            if (!statusColumnCategory) throw new Error(errorMsg);

            draftState.statusColumns = statusColumnCategory.statusColumns;
          }
        }

        draftState.teams.forEach(
          (team) =>
            team.id === defaultTeamId &&
            team.spaceList.forEach(
              (space) =>
                space.id === defaultSpaceId &&
                space.allListOrFolder.forEach((listOrFolder) => {
                  const isFolder = determineFolderType(listOrFolder);

                  if (isFolder && listOrFolder.id === defaultFolderId) {
                    listOrFolder.allLists.forEach((list) => {
                      setStatusColumn(team, list, defaultListId);
                    });
                  } else if (!isFolder) {
                    setStatusColumn(team, listOrFolder, defaultListId);
                  }
                })
            )
        );
      });
    }

    case TEAM_STATE_ACTION.UPDATE_OPENED_SPACE: {
      return produce(spaceListState, (draftState) => {
        draftState.defaultSpaceId = action.payload.spaceId;
      });
    }

    case TEAM_STATE_ACTION.UPDATE_OPENED_FOLDER: {
      return produce(spaceListState, (draftState) => {
        draftState.defaultSpaceId = action.payload.spaceId;
        draftState.defaultFolderId = action.payload.folderId;
      });
    }

    case TEAM_STATE_ACTION.UPDATE_SELECTED_LIST: {
      return produce(spaceListState, (draftState) => {
        draftState.defaultListId = action.payload.listId;
      });
    }

    case TEAM_STATE_ACTION.UPDATE_SELECTED_FOLDER: {
      throw new Error("not implemented");
    }

    case TEAM_STATE_ACTION.UPDATE_SELECTED_SPACE: {
      throw new Error("not implemented");
    }

    default: {
      return spaceListState;
    }
  }
}
