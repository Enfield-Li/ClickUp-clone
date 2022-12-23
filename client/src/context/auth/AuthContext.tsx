import { createContext, useReducer } from "react";
import { AuthContextType, AuthStateType } from "../../types";
import authReducer from "./AuthReducer";

export const AuthContext = createContext<AuthContextType | null>(null);

type ProviderType = {
  children: React.ReactNode;
};

// auth
const authInitialState: AuthStateType = {
  user: null,
  onboarding: false,
};

export default function AuthStateProvider({ children }: ProviderType) {
  const [authState, authDispatch] = useReducer(authReducer, authInitialState);

  return (
    <AuthContext.Provider value={{ authState, authDispatch }}>
      {children}
    </AuthContext.Provider>
  );
}
