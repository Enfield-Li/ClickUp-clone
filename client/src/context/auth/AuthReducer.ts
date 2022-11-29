import produce from "immer";
import determineListType, {
  determineFolderType,
} from "../../component/layout/subNavbar/folderAndList/determineList";
import { AuthStateType, AuthActionType, AUTH_ACTION } from "../../types";

export default function authReducer(
  authState: AuthStateType,
  authAction: AuthActionType
) {
  switch (authAction.type) {
    case AUTH_ACTION.LOGIN_USER: {
      return produce(authState, (draftState) => {
        const { spaces, user } = authAction.payload;
        const openedListId = spaces.find((space) => space.isOpen)?.id;

        draftState.spaces = spaces;
        draftState.openedListId = openedListId;
        draftState.user = { id: user.id, username: user.username };
      });
    }

    case AUTH_ACTION.LOGOUT_USER: {
      return produce(authState, (draftState) => {
        draftState.user = null;
      });
    }

    case AUTH_ACTION.UPDATE_OPEN_SPACE: {
      return produce(authState, (draftState) => {
        const { spaceId } = authAction.payload;

        draftState.spaces.forEach((space) => {
          // update previous space.isOpen to false
          if (space.isOpen && space.id !== spaceId) {
            space.isOpen = false;
          }
          if (space.id === spaceId) {
            space.isOpen = !space.isOpen;
          }
        });
      });
    }

    case AUTH_ACTION.UPDATE_OPEN_FOLDER: {
      return produce(authState, (draftState) => {
        const { spaceId, folderId } = authAction.payload;

        draftState.spaces.forEach((space) => {
          if (space.id === spaceId) {
            space.allListOrFolder.forEach((listOrFolder) => {
              if (
                listOrFolder.id === folderId &&
                determineFolderType(listOrFolder)
              ) {
                listOrFolder.isOpen = true;
              }
            });
          }
        });
      });
    }

    case AUTH_ACTION.UPDATE_SELECTED_LIST: {
      return produce(authState, (draftState) => {
        const { listId } = authAction.payload;
        draftState.openedListId = listId;
        draftState.spaces.forEach((space) =>
          space.allListOrFolder.forEach((listOrFolder) => {
            if (listOrFolder.id === listId) {
              listOrFolder.isSelected = false;
            }
            if (determineFolderType(listOrFolder)) {
              listOrFolder.allLists.forEach(
                (list) => list.id === listId && (list.isSelected = false)
              );
            }
          })
        );
      });
    }

    case AUTH_ACTION.UPDATE_SELECTED_FOLDER: {
      throw new Error("not implemented");
    }

    case AUTH_ACTION.UPDATE_SELECTED_SPACE: {
      throw new Error("not implemented");
    }

    default: {
      //   throw new Error("Illegal action performed in authReducer");
      return authState;
    }
  }
}
