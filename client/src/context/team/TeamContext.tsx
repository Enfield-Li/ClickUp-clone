import { useDisclosure } from "@chakra-ui/react";
import { createContext, useReducer, useState } from "react";
import { TeamContextType, TeamStateType } from "../../types";
import teamReducer from "./TeamReducer";

export const TeamContext = createContext<TeamContextType | null>(null);

type ProviderType = {
  children: React.ReactNode;
};

const initialTeamContextState: TeamStateType = {
  teams: [],
};

export default function TeamStateProvider({ children }: ProviderType) {
  const [teamState, teamStateDispatch] = useReducer(
    teamReducer,
    initialTeamContextState
  );

  const {
    isOpen: isCreateListModalOpen,
    onOpen: onCreateListModalOpen,
    onClose: onCreateListModalClose,
  } = useDisclosure();

  const {
    isOpen: isCreateFolderModalOpen,
    onOpen: onCreateFolderModalOpen,
    onClose: onCreateFolderModalClose,
  } = useDisclosure();

  const {
    isOpen: isCreateSpaceModalOpen,
    onOpen: onCreateSpaceModalOpen,
    onClose: onCreateSpaceModalClose,
  } = useDisclosure();

  const modalControls = {
    isCreateListModalOpen,
    onCreateListModalOpen,
    onCreateListModalClose,
    isCreateFolderModalOpen,
    onCreateFolderModalOpen,
    onCreateFolderModalClose,
    isCreateSpaceModalOpen,
    onCreateSpaceModalOpen,
    onCreateSpaceModalClose,
  };

  return (
    <TeamContext.Provider
      value={{
        teamState,
        modalControls,
        teamStateDispatch,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
}
