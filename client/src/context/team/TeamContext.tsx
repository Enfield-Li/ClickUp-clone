import { createContext, useReducer, useState } from "react";
import { TeamContextType, TeamStateType } from "../../types";
import spaceListReducer from "./TeamReducer";

export const TeamContext = createContext<TeamContextType | null>(null);
type ProviderType = {
  children: React.ReactNode;
};

export default function TeamStateProvider({ children }: ProviderType) {
  const initialTeamContextState: TeamStateType = {
    spaceList: null,
    openedListId: null,
    lookUpStatusColumns: [],
  };
  const [globalState, globalDispatch] = useReducer(
    spaceListReducer,
    initialTeamContextState
  );

  return (
    <TeamContext.Provider
      value={{ teamState: globalState, teamStateDispatch: globalDispatch }}
    >
      {children}
    </TeamContext.Provider>
  );
}
