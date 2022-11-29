import React, { useContext } from "react";
import { SpaceListActionType, SPACE_LIST_ACTION } from "../../types";
import { SpaceListContext } from "./SpaceListContext";

export default function useSpaceListContext() {
  const context = useContext(SpaceListContext);
  if (!context) {
    throw new Error(
      "useSpaceListContext must be used within a authContextProvider"
    );
  }
  return context;
}
