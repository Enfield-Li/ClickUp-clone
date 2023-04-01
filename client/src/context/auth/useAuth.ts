import { create } from "zustand";
import { combine } from "zustand/middleware";
import {
  AuthenticationResponse,
  RegistrationResponse,
  User,
} from "../../types";

type AuthStateType = {
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
  loginUser: () => set((state) => ({ ...state })),
  logoutUser: () => set((state) => ({ ...state })),
  registerUser: () => set((state) => ({ ...state })),
  openOnboarding: () => set((state) => ({ ...state })),
  closeOnboarding: () => set((state) => ({ ...state })),
  updateTeamCount: (isAddTeam, teamId) => set((state) => ({ ...state })),
}));
