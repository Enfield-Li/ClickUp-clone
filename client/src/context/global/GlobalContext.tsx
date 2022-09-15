import { createContext, useReducer } from "react";
import { globalInitialState, GlobalContextType } from "./GlobalContextTypes";
import globalReducer from "./GlobalReducer";

export const GlobalContext = createContext({} as GlobalContextType);

type ProviderType = {
  children: React.ReactNode;
};

export default function GlobalStateProvider({ children }: ProviderType) {
  const [globalState, globalDispatch] = useReducer(
    globalReducer,
    globalInitialState
  );

  return (
    <GlobalContext.Provider value={{ globalState, globalDispatch }}>
      {children}
    </GlobalContext.Provider>
  );
}
