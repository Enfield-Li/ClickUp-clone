import { AuthStateType, AuthActionType, AUTH_ACTION } from "../../types";

export default function authReducer(
  taskState: AuthStateType,
  action: AuthActionType
) {
  switch (action.type) {
    case AUTH_ACTION.LOGIN_USER: {
      const { spaces } = action.payload;
      const openedSpaceId = spaces.find((space) => space.isOpen)?.id;

      return {
        openedSpaceId: openedSpaceId ? openedSpaceId : null,
        user: {
          id: action.payload.id,
          username: action.payload.username,
          spaces,
        },
      };
    }

    case AUTH_ACTION.LOGOUT_USER: {
      return { ...taskState, user: null };
    }

    default: {
      throw new Error("Illegal action performed in authReducer");
    }
  }
}
