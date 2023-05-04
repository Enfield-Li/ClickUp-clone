import AsyncStorage from "@react-native-async-storage/async-storage";
import { TeamActiveStatus } from "../types";
import { ACCESS_TOKEN, TEAM_ACTIVITY } from "./constant";

export function storeTeamActiveStatusToStorage(
  teamId: number | undefined,
  teamActiveStatus: TeamActiveStatus
) {
  AsyncStorage.setItem(
    `${TEAM_ACTIVITY}_${teamId}`,
    JSON.stringify(teamActiveStatus)
  );
}

export function retriveTeamActiveStatusToStorage(teamId: number | undefined) {
  return AsyncStorage.getItem(`${TEAM_ACTIVITY}_${teamId}`);
}

export function storeAccessTokenToStorage(accessToken: string) {
  AsyncStorage.setItem(ACCESS_TOKEN, accessToken);
}

export function retriveAccessTokenToStorage(accessToken: string) {
  return AsyncStorage.getItem(ACCESS_TOKEN);
}

export function clearAccessTokenInStorage() {
  AsyncStorage.removeItem(ACCESS_TOKEN);
}
