import produce from "immer";
import { create } from "zustand";
import { ACCESS_TOKEN } from "../../constant";
import {
  AuthenticationResponse,
  RegistrationResponse,
  User,
} from "../../types";
import { deepCopy } from "../../utils/deepCopy";
import {
  storeAccessTokenToLocalStorage,
  storeTeamActiveStatusToLocalStorage,
} from "../../utils/setTeamActiveStatusToLocalStorage";

export type AuthStateType = {
  user: User | null;
  logoutUser: () => void;
  openOnboarding: () => void;
  closeOnboarding: () => void;
  loginUser: (user: AuthenticationResponse) => void;
  updateTeamCount: (isAddTeam: boolean, teamId: number) => void;
  registerUser: (registrationResponse: RegistrationResponse) => void;
};

export const useAuth = create<AuthStateType>()((set) => ({
  user: null,
  loginUser: (user) =>
    set((state) =>
      produce(state, (draftState) => {
        draftState.user = user;
      })
    ),
  logoutUser: () =>
    set((state) =>
      produce(state, (draftState) => {
        draftState.user = null;
      })
    ),
  registerUser: (registrationResponse) =>
    set((state) =>
      produce(state, (draftState) => {
        draftState.user = registrationResponse;

        // init team activity
        const teamActiveStatus = deepCopy(registrationResponse.initTeamUIState);
        teamActiveStatus["folderIds"] = [];

        // store team activity status
        storeTeamActiveStatusToLocalStorage(
          teamActiveStatus.teamId,
          teamActiveStatus
        );

        // store accessToken
        storeAccessTokenToLocalStorage(
          ACCESS_TOKEN,
          registrationResponse.accessToken
        );
      })
    ),
  updateTeamCount: (isAddTeam, teamId) =>
    set((state) =>
      produce(state, (draftState) => {
        if (!draftState.user) {
          throw new Error("User is not initialized");
        }

        draftState.user.defaultTeamId = teamId;
        draftState.user.joinedTeamCount += isAddTeam ? 1 : -1;
      })
    ),
  openOnboarding: () =>
    set((state) =>
      produce(state, (draftState) => {
        //
      })
    ),
  closeOnboarding: () =>
    set((state) =>
      produce(state, (draftState) => {
        //
      })
    ),
}));
