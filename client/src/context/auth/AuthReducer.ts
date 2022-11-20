import { AuthStateType, AuthActionType, AUTH_ACTION } from "./AuthContextTypes";

export default function authReducer(
  taskState: AuthStateType,
  action: AuthActionType
) {
  switch (action.type) {
    case AUTH_ACTION.LOGIN_USER: {
      return {
        ...taskState,
        user: {
          id: action.payload.id,
          username: action.payload.username,
        },
      };
    }

    case AUTH_ACTION.LOGOUT_USER: {
      return {
        ...taskState,
        user: undefined,
      };
    }

    default: {
      return taskState;
    }
  }
}
