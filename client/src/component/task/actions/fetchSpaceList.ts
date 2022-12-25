import { API_ENDPOINT } from "../../../constant";
import {
  defaultTeamStatusColumns,
  initPanelActivity,
  teams,
} from "../../../hook/mockData";
import { PanelActivity, Team } from "../../../types";
import { axiosTeamServiceInstance } from "../../../utils/AxiosInterceptor";

export function fetchTeamListLocal() {
  return { teams, initPanelActivity };
}

type InitTeamDTO = {
  teams: Team[];
  panelActivity: PanelActivity;
};

export async function fetchTeamList() {
  try {
    const response = await axiosTeamServiceInstance.get<InitTeamDTO>(
      API_ENDPOINT.TEAM
    );

    response.data.teams.forEach(
      (team) => (team.teamStatusColumn = defaultTeamStatusColumns)
    );

    console.log(response.data);
  } catch (error) {}
}
