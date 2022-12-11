import axios, { AxiosError } from "axios";
import React from "react";
import { ToastId, UseToastOptions } from "@chakra-ui/react";
import { NavigateFunction } from "react-router-dom";
import {
  axiosAuthServiceInstance,
  axiosGatewayInstance,
} from "../../../utils/AxiosInterceptor";
import { API_ENDPOINT, ACCESS_TOKEN, CLIENT_ROUTE } from "../../../constant";
import {
  AuthActionType,
  AuthenticationResponse,
  AUTH_ACTION,
} from "../../../types";

export async function refreshUserTokenLocal(
  dispatch: React.Dispatch<AuthActionType>
) {
  // store accessToken to localStorage
  localStorage.setItem(ACCESS_TOKEN, "abc");

  // update auth taskState
  dispatch({
    type: AUTH_ACTION.LOGIN_USER,
    payload: {
      user: {
        id: 1,
        teamIds: [1, 2],
        username: "mockUser",
        email: "mockUser@email.com",
      },
    },
  });
}

export async function refreshUserToken(
  dispatch: React.Dispatch<AuthActionType>,
  toast: (options?: UseToastOptions | undefined) => ToastId,
  navigate: NavigateFunction
) {
  try {
    const response =
      await axiosAuthServiceInstance.post<AuthenticationResponse>(
        API_ENDPOINT.AUTH_REFRESH_TOKEN
      );

    // store accessToken to localStorage
    localStorage.setItem(ACCESS_TOKEN, response.data.accessToken);

    // update auth taskState
    dispatch({
      type: AUTH_ACTION.LOGIN_USER,
      payload: { user: response.data },
    });
  } catch (error) {
    const err = error as AxiosError;
    console.log(err);

    // clear local auth taskState and accessToken
    localStorage.removeItem(ACCESS_TOKEN);
    dispatch({ type: AUTH_ACTION.LOGOUT_USER });

    navigate(CLIENT_ROUTE.LOGIN);
    toast({
      title: "Error!",
      description: err.response?.data as string,
      status: "error",
    });
  }
}
