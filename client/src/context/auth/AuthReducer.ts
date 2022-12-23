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
        draftState.user = authAction.payload.user;
      });
    }

    case AUTH_ACTION.REGISTER_USER: {
      return produce(authState, (draftState) => {
        draftState.user = authAction.payload.user;
        draftState.onboarding = true;
      });
    }

    case AUTH_ACTION.LOGOUT_USER: {
      return produce(authState, (draftState) => {
        draftState.user = null;
      });
    }

    case AUTH_ACTION.OPEN_ONBOARDING: {
      return produce(authState, (draftState) => {
        draftState.onboarding = true;
      });
    }

    case AUTH_ACTION.CLOSE_ONBOARDING: {
      return produce(authState, (draftState) => {
        draftState.onboarding = false;
      });
    }

    default: {
      //   throw new Error("Illegal action performed in authReducer");
      return authState;
    }
  }
}
