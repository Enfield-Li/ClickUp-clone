import React, { useContext } from "react";
import { TeamStateActionType, TEAM_STATE_ACTION } from "../../types";
import { TeamContext } from "./TeamContext";

export default function useTeamStateContext() {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error(
      "useSpaceListContext must be used within a authContextProvider"
    );
  }
  return context;
}
