import {
  LOGIN_USER,
  LOGOUT_USER,
  UPDATE_GLOBAL_STATE,
} from "../../utils/constant";
import { AuthStateType, AuthActionType } from "./AuthContextTypes";

export default function authReducer(
  state: AuthStateType,
  action: AuthActionType
) {
  switch (action.type) {
    case LOGIN_USER: {
      return {
        ...state,
        user: {
          username: action.payload.username,
          password: action.payload.password,
        },
      };
    }

    case LOGOUT_USER: {
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
