import { create } from "zustand";
import { combine } from "zustand/middleware";

interface CurrentListState {
  storedDefaultCategoryId: number;
  updateStoredDefaultCategoryId: (newCategoryId: number) => void;
}

export const useCurrentListStore = create<CurrentListState>()((set) => ({
  storedDefaultCategoryId: 0,
  updateStoredDefaultCategoryId: (newCategoryId) =>
    set((state) => ({ storedDefaultCategoryId: newCategoryId })),
}));
