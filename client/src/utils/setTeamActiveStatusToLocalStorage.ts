import { TEAM_ACTIVITY } from "../constant";
import { TeamActiveStatus } from "../types";

export function storeTeamActiveStatusToLocalStorage(
  teamId: number | undefined,
  teamActiveStatus: TeamActiveStatus
) {
  localStorage.setItem(
    `${TEAM_ACTIVITY}_${teamId}`,
    JSON.stringify(teamActiveStatus)
  );
}

export function storeAccessTokenToLocalStorage(
  key: string,
  accessToken: string
) {
  localStorage.setItem(key, accessToken);
}
