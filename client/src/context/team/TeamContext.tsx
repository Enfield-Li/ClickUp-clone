import { createContext, useReducer, useState } from "react";
import { TeamContextType, TeamStateType } from "../../types";
import teamReducer from "./TeamReducer";

export const TeamContext = createContext<TeamContextType | null>(null);

type ProviderType = {
  children: React.ReactNode;
};

const initialTeamContextState: TeamStateType = {
  teams: [],
  statusColumns: [],
  defaultListId: 0,
  defaultSpaceId: 0,
  defaultTeamId: 0,
};

export default function TeamStateProvider({ children }: ProviderType) {
  const [globalState, globalDispatch] = useReducer(
    teamReducer,
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
