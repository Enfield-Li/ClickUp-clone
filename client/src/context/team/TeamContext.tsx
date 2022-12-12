import { createContext, useReducer, useState } from "react";
import { TeamContextType, TeamStateType } from "../../types";
import teamReducer from "./TeamReducer";

export const TeamContext = createContext<TeamContextType | null>(null);

type ProviderType = {
  children: React.ReactNode;
};

const initialTeamContextState: TeamStateType = {
  teams: [],
  activeTeamState: {
    selectedTeamId: 0,
    selectedListId: 0,
    currentStatusColumns: [],
  },
  panelActivity: {
    id: 0,
    userId: 0,
    defaultTeamId: 0,
    teamActivities: [],
  },
};

export default function TeamStateProvider({ children }: ProviderType) {
  const [teamState, teamStateDispatch] = useReducer(
    teamReducer,
    initialTeamContextState
  );
//   console.log({ teamState });

  return (
    <TeamContext.Provider value={{ teamState, teamStateDispatch }}>
      {children}
    </TeamContext.Provider>
  );
}
