import { createContext, useReducer } from "react";
import { authInitialState, AuthContextType } from "./AuthContextTypes";
import authReducer from "./AuthReducer";

export const AuthContext = createContext<AuthContextType | null>(null);

type ProviderType = {
  children: React.ReactNode;
};

export default function AuthStateProvider({ children }: ProviderType) {
  const [authState, authDispatch] = useReducer(authReducer, authInitialState);

  return (
    <AuthContext.Provider value={{ authState, authDispatch }}>
      {children}
    </AuthContext.Provider>
  );
}
