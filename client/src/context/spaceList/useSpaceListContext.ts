import React, { useContext } from "react";
import { SpaceListActionType, SPACE_LIST_ACTION } from "../../types";
import { SpaceListContext } from "./SpaceListContext";

export default function useSpaceListContext() {
  const context = useContext(SpaceListContext);
  if (!context) {
    throw new Error("useSpaceListContext must be used within a authContextProvider");
  }
  return context;
}

// Update global network error
export function popUpError(
  error: string,
  dispatch: React.Dispatch<SpaceListActionType>
) {
  return dispatch({ type: SPACE_LIST_ACTION.NEW_ERROR, payload: error });
}

// Update global loading taskState
export function indicateLoading(
  isLoading: boolean,
  dispatch: React.Dispatch<SpaceListActionType>
) {
  return dispatch({
    type: SPACE_LIST_ACTION.LOADING_STATE,
    payload: isLoading,
  });
}
