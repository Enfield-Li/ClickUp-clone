import produce from "immer";
import { AuthActionType, AuthStateType, AUTH_ACTION } from "../../types";
import setTeamActiveStatusToLocalStorage from "../../utils/setTeamActiveStatusToLocalStorage";

export default function authReducer(
  authState: AuthStateType,
  authAction: AuthActionType
) {
  switch (authAction.type) {
    case AUTH_ACTION.LOGIN_USER: {
      return produce(authState, (draftState) => {
        const { user } = authAction.payload;
        draftState.user = user;
      });
    }

    case AUTH_ACTION.UPDATE_TEAM_COUNT: {
      return produce(authState, (draftState) => {
        const { isAddTeam, teamId } = authAction.payload;

        if (!draftState.user) {
          throw new Error("User is not initialized");
        }

        draftState.user.defaultTeamId = teamId;
        draftState.user.joinedTeamCount += isAddTeam ? 1 : -1;
      });
    }

    case AUTH_ACTION.REGISTER_USER: {
      return produce(authState, (draftState) => {
        draftState.user = authAction.payload.registrationResponse;

        const teamActiveStatus =
          authAction.payload.registrationResponse.initTeamUIState;
        setTeamActiveStatusToLocalStorage(
          teamActiveStatus.teamId,
          teamActiveStatus
        );
      });
    }

    case AUTH_ACTION.LOGOUT_USER: {
      return produce(authState, (draftState) => {
        draftState.user = null;
      });
    }

    case AUTH_ACTION.OPEN_ONBOARDING: {
      return produce(authState, (draftState) => {});
    }

    case AUTH_ACTION.CLOSE_ONBOARDING: {
      return produce(authState, (draftState) => {});
    }

    default: {
      //   throw new Error("Illegal action performed in authReducer");
      return authState;
    }
  }
}
