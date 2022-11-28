import produce from "immer";
import { determineFolderType } from "../../component/layout/navbar/folderAndList/determineList";
import { AuthStateType, AuthActionType, AUTH_ACTION } from "../../types";

export default function authReducer(
  taskState: AuthStateType,
  action: AuthActionType
) {
  switch (action.type) {
    case AUTH_ACTION.LOGIN_USER: {
      const { spaces } = action.payload;
      const openedSpaceId = spaces.find((space) => space.isOpen)?.id;

      return {
        openedSpaceId,
        user: {
          id: action.payload.id,
          username: action.payload.username,
          spaces,
        },
      };
    }

    case AUTH_ACTION.LOGOUT_USER: {
      return { ...taskState, user: null };
    }

    case AUTH_ACTION.UPDATE_OPENED_SPACE: {
      return produce(taskState, (draftState) => {
        const { spaceId } = action.payload;

        draftState.openedListId = spaceId;
        draftState.user?.spaces.forEach((space) => {
          if (space.isOpen && space.id !== spaceId) {
            space.isOpen = false;
          }
          if (space.id === spaceId) {
            space.isOpen = true;
          }
        });
      });
    }

    case AUTH_ACTION.UPDATE_OPENED_FOLDER: {
      return produce(taskState, (draftState) => {
        const { spaceId, folderId } = action.payload;

        draftState.user?.spaces.forEach((space) => {
          if (space.id === spaceId) {
            space.allListOrFolder.forEach((listOrFolder) => {
              if (
                determineFolderType(listOrFolder) &&
                listOrFolder.id === folderId
              ) {
                listOrFolder.isOpen = true;
              }
            });
          }
        });
      });
    }

    case AUTH_ACTION.UPDATE_SELECTED_FOLDER: {
      throw new Error("not implemented");
    }

    case AUTH_ACTION.UPDATE_SELECTED_LIST: {
      throw new Error("not implemented");
    }

    case AUTH_ACTION.UPDATE_SELECTED_SPACE: {
      throw new Error("not implemented");
    }

    default: {
      throw new Error("Illegal action performed in authReducer");
    }
  }
}
