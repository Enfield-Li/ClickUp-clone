import { AUTH_ACTION } from "../../utils/constant";
import { AuthStateType, AuthActionType } from "./AuthContextTypes";

export default function authReducer(
  state: AuthStateType,
  action: AuthActionType
) {
  switch (action.type) {
    case AUTH_ACTION.LOGIN_USER: {
      return {
        ...state,
        user: {
          id: action.payload.id,
          username: action.payload.username,
        },
      };
    }

    case AUTH_ACTION.LOGOUT_USER: {
      return {
        ...state,
        user: undefined,
      };
    }

    default: {
      return state;
    }
  }
}
