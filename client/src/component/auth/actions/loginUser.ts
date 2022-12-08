import { API_ENDPOINT } from "../../../constant";
import { AxiosError } from "axios";
import React from "react";
import { ACCESS_TOKEN } from "../../../constant";
import { ToastId, UseToastOptions } from "@chakra-ui/react";
import { axiosInstance } from "../../../utils/AxiosInterceptor";
import {
  LoginCredentials,
  AuthActionType,
  UserResponse,
  AUTH_ACTION,
  LogInError,
} from "../../../types";

export async function loginUser(
  loginCredentials: LoginCredentials,
  dispatch: React.Dispatch<AuthActionType>
) {
  try {
    const response = await axiosInstance.post<UserResponse>(
      API_ENDPOINT.AUTH_LOGIN,
      loginCredentials
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

    console.log(err);
    const response = err.response?.data as LogInError;

    return response.errors;
  }
}
