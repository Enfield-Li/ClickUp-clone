import { AUTH } from "../../utils/constant";
import { AuthStateType, AuthActionType } from "./AuthContextTypes";

export default function authReducer(
  state: AuthStateType,
  action: AuthActionType
) {
  switch (action.type) {
    case AUTH.LOGIN_USER: {
      return {
        ...state,
        user: {
          id: action.payload.id,
          username: action.payload.username,
        },
      };
    }

    case AUTH.LOGOUT_USER: {
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
