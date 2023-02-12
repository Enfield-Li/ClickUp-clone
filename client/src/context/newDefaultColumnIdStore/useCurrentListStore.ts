import { create } from "zustand";
import { combine } from "zustand/middleware";

interface CurrentListState {
  storedDefaultCategoryId: number;
  updateDefaultCategoryId: (newCategoryId: number) => void;
}

export const useCurrentListStore = create<CurrentListState>()((set) => ({
  storedDefaultCategoryId: 0,
  updateDefaultCategoryId: (newCategoryId) =>
    set((state) => ({ storedDefaultCategoryId: newCategoryId })),
}));
