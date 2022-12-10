import { AxiosError } from "axios";
import React from "react";
import { ACCESS_TOKEN, API_ENDPOINT } from "../../../constant";
import {
  AuthActionType,
  ErrorResponse,
  AUTH_ACTION,
  FieldErrors,
  LoginCredentials,
  AuthenticationResponse,
} from "../../../types";
import { axiosAuthServiceInstance } from "../../../utils/AxiosInterceptor";

export async function loginUser(
  loginCredentials: LoginCredentials,
  dispatch: React.Dispatch<AuthActionType>
): Promise<FieldErrors | undefined> {
  try {
    const response =
      await axiosAuthServiceInstance.post<AuthenticationResponse>(
        API_ENDPOINT.AUTH_LOGIN,
        loginCredentials
      );
    console.log(response.data.accessToken);

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
    const response = err.response?.data as ErrorResponse;
    return response.errors;
  }
}
