import { AxiosError } from "axios";
import { API_ENDPOINT } from "../../../constant";
import {
  defaultTeamStatusColumns,
  initPanelActivity,
  teams,
} from "../../../hook/mockData";
import {
  ErrorResponse,
  PanelActivity,
  Team,
  TeamStateActionType,
  TEAM_STATE_ACTION,
} from "../../../types";
import { axiosTeamServiceInstance } from "../../../utils/AxiosInterceptor";

export function fetchTeamListLocal() {
  return { teams, initPanelActivity };
}

type InitTeamDTO = {
  teams: Team[];
  panelActivity: PanelActivity;
};

export async function fetchTeamList(
  onSuccess: (data: InitTeamDTO) => void,
  onFailure: (msg: string) => void
) {
  try {
    const response = await axiosTeamServiceInstance.get<InitTeamDTO>(
      API_ENDPOINT.TEAM
    );

    onSuccess(response.data);
  } catch (error) {
    const err = error as AxiosError;
    const response = err.response?.data as ErrorResponse;
    console.log(response);
    onFailure(response.message);
  }
}
