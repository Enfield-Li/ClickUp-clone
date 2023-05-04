import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { ACCESS_TOKEN, BEARER, SERVICE_ENDPOINT } from "./constant";

export function createDevAxiosInstance(baseURL: string) {
  const axiosInstance = axios.create({ baseURL });

  axiosInstance.interceptors.request.use(async (config) => {
    const accessToken = await AsyncStorage.getItem(ACCESS_TOKEN);
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
