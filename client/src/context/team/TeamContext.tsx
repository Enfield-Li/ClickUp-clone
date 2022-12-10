import { createContext, useReducer, useState } from "react";
import { TeamContextType, initialTeamContextState } from "../../types";
import spaceListReducer from "./TeamReducer";

export const TeamContext = createContext<TeamContextType | null>(null);
type ProviderType = {
  children: React.ReactNode;
};

export default function TeamStateProvider({ children }: ProviderType) {
  const [globalState, globalDispatch] = useReducer(
    spaceListReducer,
    initialTeamContextState
  );

  return (
    <TeamContext.Provider
      value={{ teamState: globalState, TeamStateDispatch: globalDispatch }}
    >
      {children}
    </TeamContext.Provider>
  );
}
