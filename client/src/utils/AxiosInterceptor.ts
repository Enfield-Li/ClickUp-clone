import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { ACCESS_TOKEN, AUTH_ENDPOINT, BEARER } from "./constant";

export const axiosInstance = axios.create({
  baseURL: AUTH_ENDPOINT,
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN);
  if (accessToken && config.headers) {
    config.headers.Authorization = BEARER + accessToken;
  }
  config.withCredentials = true;
  return config;
});
