import { API_ENDPOINT } from "../../../constant";
import { AxiosError } from "axios";
import React from "react";
import {
  AuthActionType,
  AUTH_ACTION,
  Credentials,
  LogInError,
  UserResponse,
} from "../../../context/auth/AuthContextTypes";
import { ACCESS_TOKEN } from "../../../constant";
import { ToastId, UseToastOptions } from "@chakra-ui/react";
import { axiosInstance } from "../../../utils/AxiosInterceptor";

export async function loginUser(
  credentials: Credentials,
  dispatch: React.Dispatch<AuthActionType>,
  toast: (options?: UseToastOptions | undefined) => ToastId
) {
  try {
    const response = await axiosInstance.post<UserResponse>(
      API_ENDPOINT.AUTH_LOGIN,
      credentials
    );
    // store accessToken to localStorage
    localStorage.setItem(ACCESS_TOKEN, response.data.accessToken);

    const user = { id: response.data.id, username: response.data.username };

    // update auth taskState
    dispatch({
      type: AUTH_ACTION.LOGIN_USER,
      payload: user,
    });

    toast({
      title: "Successful!",
      description: "You've logged in.",
      status: "success",
    });
  } catch (error) {
    // clear local auth taskState and accessToken
    localStorage.removeItem(ACCESS_TOKEN);
    dispatch({ type: AUTH_ACTION.LOGOUT_USER });

    const err = error as AxiosError;

    if (err.response?.status == 401) {
      toast({
        title: "Login failed...",
        description: err.response.data as string,
        status: "error",
      });
      return [];
    }

    console.log(err);
    const response = err.response?.data as LogInError;

    toast({
      title: "Login failed...",
      description: "Please check the field.",
      status: "error",
    });

    return response.errors;
  }
}
