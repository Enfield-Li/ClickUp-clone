import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { AuthenticationResponse, RegistrationResponse, User } from "../types";
import {
  clearAccessTokenInStorage,
  storeAccessTokenToStorage,
} from "../utils/asyncStorage";

export type AuthStateType = {
  user?: User | null;
  emailAccount?: string;
  logoutUser: () => void;
  loginUser: (user: AuthenticationResponse) => void;
  registerUser: (registrationResponse: RegistrationResponse) => void;
  addEmail: (email: string) => void;
  updateStateDefaultTeamId: (teamId: number) => void;
};

export const useAuth = create<AuthStateType>()(
  // @ts-ignore
  immer((set) => ({
    user: null,
    addEmail: (email) =>
      set((state) => {
        state.emailAccount = email;
      }),
    updateStateDefaultTeamId: (teamId) =>
      set((state) => {
        if (state.user) {
          state.user.defaultTeamId = teamId;
        }
      }),
    loginUser: (user) =>
      set((state) => {
        state.user = user;
        storeAccessTokenToStorage(user?.accessToken);
      }),
    logoutUser: () =>
      set((state) => {
        state.user = null;
        clearAccessTokenInStorage();
      }),
    registerUser: (registrationResponse) =>
      set((state) => {
        state.user = registrationResponse;

        // init team activity
        // const teamActiveStatus = deepCopy(registrationResponse.initTeamUIState);
        // teamActiveStatus["folderIds"] = [];

        // // store team activity status
        // storeTeamActiveStatusToLocalStorage(
        //   teamActiveStatus.teamId,
        //   teamActiveStatus
        // );

        // // store accessToken
        // storeAccessTokenToLocalStorage(
        //   ACCESS_TOKEN,
        //   registrationResponse.accessToken
        // );
      }),
  }))
);
