import { API_ENDPOINT, BEARER, CLIENT_ROUTE } from "../../utils/constant";
import axios, { AxiosError } from "axios";
import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";
import {
  AuthActionType,
  AUTH_ACTION,
  Credentials,
  LogInError,
  User,
  UserResponse,
} from "./AuthContextTypes";
import { ACCESS_TOKEN } from "../../utils/constant";
import { ToastId, UseToastOptions } from "@chakra-ui/react";
import { axiosInstance } from "../../utils/AxiosInterceptor";
import { NavigateFunction } from "react-router-dom";

export default function useAuthContext() {
  return useContext(AuthContext);
}

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

    // update auth state
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
    // clear local auth state and accessToken
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

export async function registerUser(
  credentials: Credentials,
  dispatch: React.Dispatch<AuthActionType>,
  toast: (options?: UseToastOptions | undefined) => ToastId
) {
  try {
    const response = await axiosInstance.post<UserResponse>(
      API_ENDPOINT.AUTH_REGISTER,
      credentials
    );
    // store accessToken to localStorage
    localStorage.setItem(ACCESS_TOKEN, response.data.accessToken);

    const user = { id: response.data.id, username: response.data.username };

    // update auth state
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
    // clear local auth state and accessToken
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

    const response = err.response?.data as LogInError;

    toast({
      title: "Register failed...",
      description: "Please check the field.",
      status: "error",
    });

    return response.errors;
  }
}

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

export function logOutUser(
  dispatch: React.Dispatch<AuthActionType>,
  toast: (options?: UseToastOptions | undefined) => ToastId
) {
  // invalidate session
  axiosInstance.post(API_ENDPOINT.AUTH_LOGOUT, null);

  // clear local auth state and accessToken
  localStorage.removeItem(ACCESS_TOKEN);
  dispatch({ type: AUTH_ACTION.LOGOUT_USER });

  toast({
    title: "Successful!",
    description: "You've logged out.",
    status: "success",
  });
}
