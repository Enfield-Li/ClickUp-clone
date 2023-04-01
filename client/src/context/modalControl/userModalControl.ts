import { create } from "zustand";

interface ModalControlContextType {
  isCreateListModalOpen: boolean;
  onCreateListModalOpen: () => void;
  onCreateListModalClose: () => void;

  isCreateFolderModalOpen: boolean;
  onCreateFolderModalOpen: () => void;
  onCreateFolderModalClose: () => void;

  isCreateSpaceModalOpen: boolean;
  onCreateSpaceModalOpen: () => void;
  onCreateSpaceModalClose: () => void;
}

export const userModalControl = create<ModalControlContextType>()((set) => ({
  isCreateListModalOpen: false,
  onCreateListModalOpen: () =>
    set((state) => ({ ...state, isCreateListModalOpen: true })),
  onCreateListModalClose: () =>
    set((state) => ({ ...state, isCreateListModalOpen: false })),

  isCreateFolderModalOpen: false,
  onCreateFolderModalOpen: () =>
    set((state) => ({ ...state, isCreateFolderModalOpen: true })),
  onCreateFolderModalClose: () =>
    set((state) => ({ ...state, isCreateFolderModalOpen: false })),

  isCreateSpaceModalOpen: false,
  onCreateSpaceModalOpen: () =>
    set((state) => ({ ...state, isCreateSpaceModalOpen: true })),
  onCreateSpaceModalClose: () =>
    set((state) => ({ ...state, isCreateSpaceModalOpen: false })),
}));
