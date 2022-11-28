import produce from "immer";
import { determineFolderType } from "../../component/layout/navbar/folderAndList/determineList";
import { AuthStateType, AuthActionType, AUTH_ACTION } from "../../types";

export default function authReducer(
  authState: AuthStateType,
  authAction: AuthActionType
) {
  switch (authAction.type) {
    case AUTH_ACTION.LOGIN_USER: {
      const { spaces } = authAction.payload;
      const openedSpaceId = spaces.find((space) => space.isOpen)?.id;

      return {
        openedSpaceId,
        user: {
          id: authAction.payload.id,
          username: authAction.payload.username,
          spaces,
        },
      };
    }

    case AUTH_ACTION.LOGOUT_USER: {
      return { ...authState, user: null };
    }

    case AUTH_ACTION.UPDATE_OPENED_SPACE: {
      return produce(authState, (draftState) => {
        const { spaceId } = authAction.payload;

        draftState.openedTaskListId = spaceId;
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
      return produce(authState, (draftState) => {
        const { spaceId, folderId } = authAction.payload;

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
