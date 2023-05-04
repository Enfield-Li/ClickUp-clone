import axios from "axios";
import { ACCESS_TOKEN, BEARER, SERVICE_ENDPOINT } from "./constant";

export function createDevAxiosInstance(baseURL: string) {
  const axiosInstance = axios.create({ baseURL });

  axiosInstance.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (accessToken && config.headers) {
      config.headers.Authorization = BEARER + accessToken;
    }

    config.withCredentials = true;
    return config;
  });

  return axiosInstance;
}

export const axiosGatewayInstance = createDevAxiosInstance(
  SERVICE_ENDPOINT.GATEWAY
);

export const axiosAuthServiceInstance = createDevAxiosInstance(
  SERVICE_ENDPOINT.AUTHORIZATION
);

export const axiosTaskServiceInstance = createDevAxiosInstance(
  SERVICE_ENDPOINT.TASK
);

export const axiosTeamServiceInstance = createDevAxiosInstance(
  SERVICE_ENDPOINT.TEAM
);

export const axiosStatusCategoryServiceInstance = createDevAxiosInstance(
  SERVICE_ENDPOINT.TEAM_STATUS_CATEGORY
);
