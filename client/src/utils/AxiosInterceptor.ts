import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { ACCESS_TOKEN, BASE_ENDPOINT, BEARER } from "../constant";

export const axiosInstance = axios.create({
  baseURL: BASE_ENDPOINT,
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN);
  if (accessToken && config.headers) {
    config.headers.Authorization = BEARER + accessToken;
  }
  config.withCredentials = true;
  return config;
});

export function createDevAxiosInstance(baseURL: string) {
  return axios.create({ baseURL });
}
