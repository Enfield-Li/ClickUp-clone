import { createContext, useReducer, useState } from "react";
import { SpaceListContextType, initialSpaceListState } from "../../types";
import spaceListReducer from "./SpaceListReducer";

export const SpaceListContext = createContext<SpaceListContextType | null>(
  null
);
type ProviderType = {
  children: React.ReactNode;
};

export default function SpaceListStateProvider({ children }: ProviderType) {
  const [globalState, globalDispatch] = useReducer(
    spaceListReducer,
    initialSpaceListState
  );

  return (
    <SpaceListContext.Provider
      value={{ spaceListState: globalState, spaceListDispatch: globalDispatch }}
    >
      {children}
    </SpaceListContext.Provider>
  );
}
