import React, { useContext } from "react";
import { GlobalContext } from "./GlobalContext";
import { GlobalActionType, GLOBAL_ACTION } from "./GlobalContextTypes";

export default function useGlobalContext() {
  return useContext(GlobalContext);
}

// Update global network error
export function popUpError(
  error: string,
  dispatch: React.Dispatch<GlobalActionType>
) {
  return dispatch({ type: GLOBAL_ACTION.NEW_ERROR, payload: error });
}

// Update global loading taskState
export function indicateLoading(
  isLoading: boolean,
  dispatch: React.Dispatch<GlobalActionType>
) {
  return dispatch({ type: GLOBAL_ACTION.LOADING_STATE, payload: isLoading });
}
