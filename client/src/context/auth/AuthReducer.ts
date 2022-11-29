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
        const { user } = authAction.payload;
        draftState.user = { id: user.id, username: user.username };
      });
    }

    case AUTH_ACTION.LOGOUT_USER: {
      return produce(authState, (draftState) => {
        draftState.user = null;
      });
    }

    default: {
      //   throw new Error("Illegal action performed in authReducer");
      return authState;
    }
  }
}
