import { API_ENDPOINT, BEARER } from "../../utils/constant";
import axios, { AxiosError } from "axios";
import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";
import {
  AuthActionType,
  Credentials,
  LogInError,
  User,
  UserResponse,
} from "./AuthContextTypes";
import { ACCESS_TOKEN, AUTH_ACTION } from "../../utils/constant";
import { ToastId, UseToastOptions } from "@chakra-ui/react";

export default function useAuthContext() {
  return useContext(AuthContext);
}

export async function loginUser(
  credentials: Credentials,
  dispatch: React.Dispatch<AuthActionType>,
  toast: (options?: UseToastOptions | undefined) => ToastId
) {
  try {
    const response = await axios.post<UserResponse>(
      API_ENDPOINT.AUTH_ENDPOINT_LOGIN,
      credentials,
      { withCredentials: true }
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
    const response = await axios.post<UserResponse>(
      API_ENDPOINT.AUTH_ENDPOINT_REGISTER,
      credentials,
      { withCredentials: true }
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
    console.log(response);

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
  toast: (options?: UseToastOptions | undefined) => ToastId
) {
  try {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);

    if (!accessToken) return;

    const response = await axios.post<UserResponse>(
      API_ENDPOINT.AUTH_ENDPOINT_REFRESH_TOKEN,
      null,
      {
        withCredentials: true,
        headers: { Authorization: `${BEARER} ${accessToken}` },
      }
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
  axios.post(API_ENDPOINT.AUTH_ENDPOINT_LOGOUT, null, {
    withCredentials: true,
  });

  // clear local auth state and accessToken
  localStorage.removeItem(ACCESS_TOKEN);
  dispatch({ type: AUTH_ACTION.LOGOUT_USER });

  toast({
    title: "Successful!",
    description: "You've logged out.",
    status: "success",
  });
}
