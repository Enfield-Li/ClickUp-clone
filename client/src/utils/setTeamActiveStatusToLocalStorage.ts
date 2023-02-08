import { WritableDraft } from "immer/dist/internal";
import { TEAM_ACTIVITY } from "../constant";
import { TeamActiveStatus } from "../types";

export default function setTeamActiveStatusToLocalStorage(
  teamId: number | undefined,
  teamActiveStatus: WritableDraft<TeamActiveStatus>
) {
  localStorage.setItem(
    `${TEAM_ACTIVITY}_${teamId}`,
    JSON.stringify(teamActiveStatus)
  );
}
