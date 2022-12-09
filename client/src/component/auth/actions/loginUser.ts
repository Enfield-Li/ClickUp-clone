import { AxiosError } from "axios";
import React from "react";
import { ACCESS_TOKEN, API_ENDPOINT } from "../../../constant";
import {
  AuthActionType,
  AuthenticationError,
  AUTH_ACTION,
  FieldErrors,
  LoginCredentials,
  UserResponse,
} from "../../../types";
import { axiosAuthServiceInstance } from "../../../utils/AxiosInterceptor";

export async function loginUser(
  loginCredentials: LoginCredentials,
  dispatch: React.Dispatch<AuthActionType>
): Promise<FieldErrors | undefined> {
  try {
    const response = await axiosAuthServiceInstance.post<UserResponse>(
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
    const response = err.response?.data as AuthenticationError;
    return response.errors;
  }
}
