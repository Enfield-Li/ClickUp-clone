import { create } from "zustand";
import { combine } from "zustand/middleware";

interface CurrentListState {
  storedDefaultCategoryId: number | undefined;
  updateDefaultCategoryId: (newCategoryId: number | undefined) => void;
}

export const useCurrentListStore = create<CurrentListState>()((set) => ({
  storedDefaultCategoryId: undefined,
  updateDefaultCategoryId: (newCategoryId) =>
    set((state) => ({ storedDefaultCategoryId: newCategoryId })),
}));
