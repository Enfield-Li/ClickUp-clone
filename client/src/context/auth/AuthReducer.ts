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
          username: action.payload.username,
          password: action.payload.password,
        },
      };
    }

    case AUTH.LOGOUT_USER: {
      return {
        ...state,
        user: null,
      };
    }

    default: {
      return state;
    }
  }
}
