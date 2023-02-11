import { useDisclosure } from "@chakra-ui/react";
import { createContext, useReducer, useState } from "react";
import { ModalControls, TeamContextType, TeamStateType } from "../../types";
import teamReducer from "./TeamReducer";

export const TeamContext = createContext<TeamContextType | null>(null);

type ProviderType = {
  children: React.ReactNode;
};

const initialTeamContextState: TeamStateType = {
  teamsForRender: [],
  originalTeams: [],
  teamActiveStatus: {
    teamId: 0,
    spaceId: 0,
    listId: 0,
    folderIds: [],
  },
  createListInfo: null,
  createFolderInfo: null,
};

export default function TeamStateProvider({ children }: ProviderType) {
  const [teamState, teamStateDispatch] = useReducer(
    teamReducer,
    initialTeamContextState
  );

  return (
    <TeamContext.Provider
      value={{
        teamState,
        teamStateDispatch,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
}
