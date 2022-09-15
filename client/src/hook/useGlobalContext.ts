import React, { useContext } from "react";
import { GlobalContext } from "../context/global/GlobalContext";
import { GlobalActionType } from "../context/global/GlobalContextTypes";
import { GLOBAL } from "../utils/constant";

export default function useGlobalContext() {
  return useContext(GlobalContext);
}

export function popUpError(
  error: string,
  dispatch: React.Dispatch<GlobalActionType>
) {
  return dispatch({ type: GLOBAL.NEW_ERROR, payload: error });
}

export function indicateLoading(
  isLoading: boolean,
  dispatch: React.Dispatch<GlobalActionType>
) {
  return dispatch({ type: GLOBAL.LOADING_STATE, payload: isLoading });
}
