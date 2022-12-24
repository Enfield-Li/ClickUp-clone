import { API_ENDPOINT } from "../../../constant";
import { initPanelActivity, teams } from "../../../hook/mockData";
import { Team } from "../../../types";
import { axiosTeamServiceInstance } from "../../../utils/AxiosInterceptor";

export function fetchTeamListLocal(userId: number) {
  return { teams, initPanelActivity };
}

export async function fetchTeamList(teamId: number) {
  try {
    const response = await axiosTeamServiceInstance.get<Team[]>(
      API_ENDPOINT.TASK_ALL_TASKS
    );
  } catch (error) {}
}
