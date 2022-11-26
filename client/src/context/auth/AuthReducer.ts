import { AuthStateType, AuthActionType, AUTH_ACTION } from "../../types";

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
          spaces: action.payload.spaces,
        },
      };
    }

    case AUTH_ACTION.LOGOUT_USER: {
      return { user: null };
    }

    default: {
      return taskState;
    }
  }
}
