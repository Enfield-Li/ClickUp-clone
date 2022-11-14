import { AxiosError } from "axios";
import React from "react";
import { ToastId, UseToastOptions } from "@chakra-ui/react";
import { NavigateFunction } from "react-router-dom";
import { AuthActionType, UserResponse, AUTH_ACTION } from "../../../context/auth/AuthContextTypes";
import { axiosInstance } from "../../../utils/AxiosInterceptor";
import { API_ENDPOINT, ACCESS_TOKEN, CLIENT_ROUTE } from "../../../utils/constant";

export async function refreshUserToken(
  dispatch: React.Dispatch<AuthActionType>,
  toast: (options?: UseToastOptions | undefined) => ToastId,
  navigate: NavigateFunction
) {
  try {
    const response = await axiosInstance.post<UserResponse>(
      API_ENDPOINT.AUTH_REFRESH_TOKEN
    );

    // store accessToken to localStorage
    localStorage.setItem(ACCESS_TOKEN, response.data.accessToken);

    const user = { id: response.data.id, username: response.data.username };

    // update auth state
    dispatch({
      type: AUTH_ACTION.LOGIN_USER,
      payload: user,
    });
  } catch (error) {
    const err = error as AxiosError;
    console.log(err);

    // clear local auth state and accessToken
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
