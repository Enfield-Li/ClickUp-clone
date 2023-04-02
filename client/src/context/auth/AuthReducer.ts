import produce from "immer";
import { ACCESS_TOKEN } from "../../constant";
import { AuthActionType, AuthStateType, AUTH_ACTION } from "../../types";
import { deepCopy } from "../../utils/deepCopy";
import { storeAccessTokenToLocalStorage, storeTeamActiveStatusToLocalStorage } from "../../utils/setTeamActiveStatusToLocalStorage";

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

        // init team activity
        const teamActiveStatus = deepCopy(
          authAction.payload.registrationResponse.initTeamUIState
        );
        teamActiveStatus["folderIds"] = [];
        storeTeamActiveStatusToLocalStorage(
          teamActiveStatus.teamId,
          teamActiveStatus
        );

        // store accessToken to localStorage
        storeAccessTokenToLocalStorage(
          ACCESS_TOKEN,
          authAction.payload.registrationResponse.accessToken
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
