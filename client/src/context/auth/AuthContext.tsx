import { createContext, useReducer } from "react";
import { authInitialState, AuthContextType } from "./AuthContextTypes";
import authReducer from "./AuthReducer";

export const AuthContext = createContext({} as AuthContextType);

type ProviderType = {
  children: React.ReactNode;
};

export default function AuthStateProvider({ children }: ProviderType) {
  const [state, dispatch] = useReducer(authReducer, authInitialState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}
