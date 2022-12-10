import { API_ENDPOINT } from "../../../constant";
import { initialSpaces } from "../../../hook/mockData";
import { Team } from "../../../types";
import { axiosTeamServiceInstance } from "../../../utils/AxiosInterceptor";

export function fetchSpaceListLocal(teamIds: number[]) {
  return initialSpaces;
}

export async function fetchTeamList(teamIds: number[]) {
  try {
    const response = await axiosTeamServiceInstance.get<Team[]>(
      API_ENDPOINT.TASK_ALL_TASKS
    );
  } catch (error) {}
}
