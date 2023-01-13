import { useDisclosure } from "@chakra-ui/react";
import { createContext, useReducer, useState } from "react";
import { ModalControls, TeamContextType, TeamStateType } from "../../types";
import teamReducer from "./TeamReducer";

export const TeamContext = createContext<TeamContextType | null>(null);

type ProviderType = {
  children: React.ReactNode;
};

const initialTeamContextState: TeamStateType = {
  teams: [],
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

  const {
    isOpen: isPopoverOpen,
    onClose: onPopoverClose,
    onOpen: onPopoverOpen,
  } = useDisclosure();

  const modalControls: ModalControls = {
    isCreateListModalOpen,
    onCreateListModalOpen,
    onCreateListModalClose,
    isCreateFolderModalOpen,
    onCreateFolderModalOpen,
    onCreateFolderModalClose,
    isCreateSpaceModalOpen,
    onCreateSpaceModalOpen,
    onCreateSpaceModalClose,
    isPopoverOpen,
    onPopoverClose,
    onPopoverOpen,
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
