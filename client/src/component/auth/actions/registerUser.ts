import { AxiosError } from "axios";
import React from "react";
import {
  axiosAuthServiceInstance,
  axiosGatewayInstance,
} from "../../../utils/AxiosInterceptor";
import { API_ENDPOINT, ACCESS_TOKEN } from "../../../constant";
import {
  RegisterCredentials,
  AuthActionType,
  AuthenticationResponse,
  AUTH_ACTION,
  ErrorResponse,
  FieldErrors,
} from "../../../types";

export async function registerUserLocal(
  registerCredentials: RegisterCredentials,
  dispatch: React.Dispatch<AuthActionType>
) {
  const { email, username } = registerCredentials;

  localStorage.setItem(ACCESS_TOKEN, "abc");
  dispatch({
    type: AUTH_ACTION.LOGIN_USER,
    payload: {
      user: { id: 1, email, joinedTeamIds: [], username },
    },
  });
}

export async function registerUser(
  registerCredentials: RegisterCredentials,
  dispatch: React.Dispatch<AuthActionType>
): Promise<FieldErrors | undefined> {
  try {
    const response =
      await axiosAuthServiceInstance.post<AuthenticationResponse>(
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
    const response = err.response?.data as ErrorResponse;
    return response.errors;
  }
}
