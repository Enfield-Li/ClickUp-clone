import React, { useContext } from "react";
import { GlobalContext } from "../context/global/GlobalContext";
import { GlobalActionType } from "../context/global/GlobalContextTypes";
import { GLOBAL } from "../utils/constant";

export default function useGlobalContext() {
  return useContext(GlobalContext);
}

export function updateGlobalState(
  newAttr: string,
  dispatch: React.Dispatch<GlobalActionType>
) {
  return dispatch({ type: GLOBAL.UPDATE_GLOBAL_STATE, payload: newAttr });
}
