import { createContext, useReducer, useState } from "react";
import { TeamContextType, TeamStateType } from "../../types";
import teamReducer from "./TeamReducer";

export const TeamContext = createContext<TeamContextType | null>(null);

type ProviderType = {
  children: React.ReactNode;
};

const initialTeamContextState: TeamStateType = {
  teams: [],
  panelActivity: null,
  activeTeamState: {
    selectedTeamId: 0,
    selectedListId: null,
    selectedSpaceId: null,
    currentStatusColumns: [],
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
