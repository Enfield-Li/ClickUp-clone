import { AxiosError } from "axios";
import React from "react";
import {
  axiosAuthServiceInstance,
  axiosInstance,
} from "../../../utils/AxiosInterceptor";
import { API_ENDPOINT, ACCESS_TOKEN } from "../../../constant";
import {
  RegisterCredentials,
  AuthActionType,
  UserResponse,
  AUTH_ACTION,
  LogInError,
} from "../../../types";

export async function registerUser(
  registerCredentials: RegisterCredentials,
  dispatch: React.Dispatch<AuthActionType>
) {
  try {
    const response = await axiosAuthServiceInstance.post<UserResponse>(
      API_ENDPOINT.AUTH_REGISTER,
      registerCredentials
    );
    // store accessToken to localStorage
    localStorage.setItem(ACCESS_TOKEN, response.data.accessToken);

    // update auth taskState
    dispatch({
      type: AUTH_ACTION.LOGIN_USER,
      payload: { user: response.data },
    });
  } catch (error) {
    // clear local auth taskState and accessToken
    localStorage.removeItem(ACCESS_TOKEN);
    dispatch({ type: AUTH_ACTION.LOGOUT_USER });

    const err = error as AxiosError;

    if (err.response?.status == 401) {
      return [];
    }

    const response = err.response?.data as LogInError;

    return response.errors;
  }
}
