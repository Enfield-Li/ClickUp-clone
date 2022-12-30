import { useDisclosure } from "@chakra-ui/react";
import { createContext } from "react";
import { ModalControlContextType } from "../../types";

export const ModalControlContext =
  createContext<ModalControlContextType | null>(null);

type ProviderType = {
  children: React.ReactNode;
};

export default function ModalControlStateProvider({ children }: ProviderType) {
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

  return (
    <ModalControlContext.Provider
      value={{
        isCreateListModalOpen,
        onCreateListModalOpen,
        onCreateListModalClose,
        isCreateFolderModalOpen,
        onCreateFolderModalOpen,
        onCreateFolderModalClose,
        isCreateSpaceModalOpen,
        onCreateSpaceModalOpen,
        onCreateSpaceModalClose,
      }}
    >
      {children}
    </ModalControlContext.Provider>
  );
}
