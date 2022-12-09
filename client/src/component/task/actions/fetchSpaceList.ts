import { API_ENDPOINT } from "../../../constant";
import { initialSpaces } from "../../../hook/mockData";
import { SpaceType } from "../../../types";
import { axiosSpaceServiceInstance } from "../../../utils/AxiosInterceptor";

export function fetchSpaceListLocal(teamIds: number[]) {
  return initialSpaces;
}

export async function fetchSpaceList(teamIds: number[]) {
  try {
    const response = await axiosSpaceServiceInstance.get<SpaceType[]>(
      API_ENDPOINT.TASK_ALL_TASKS
    );
  } catch (error) {}
}
