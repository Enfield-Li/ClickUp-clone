import {
  AUTH_ENDPOINT_LOGIN,
  AUTH_ENDPOINT_LOGOUT,
  AUTH_ENDPOINT_REFRESH_TOKEN,
  BEARER,
} from "./../utils/constant";
import axios, { AxiosError } from "axios";
import React, { useContext } from "react";
import { AuthContext } from "../context/auth/AuthContext";
import {
  AuthActionType,
  Credentials,
  User,
  UserResponse,
} from "../context/auth/AuthContextTypes";
import { ACCESS_TOKEN, AUTH } from "../utils/constant";
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
      AUTH_ENDPOINT_LOGIN,
      credentials,
      { withCredentials: true }
    );
    // store accessToken to localStorage
    localStorage.setItem(ACCESS_TOKEN, response.data.accessToken);

    const user = { id: response.data.id, username: response.data.username };

    // update auth state
    dispatch({
      type: AUTH.LOGIN_USER,
      payload: user,
    });

    toast({
      title: "Successful!",
      description: "You've logged in.",
      status: "success",
    });

    return true;
  } catch (error) {
    const err = error as AxiosError;
    console.log(err);

    // clear local auth state and accessToken
    localStorage.removeItem(ACCESS_TOKEN);
    dispatch({ type: AUTH.LOGOUT_USER });

    toast({
      title: "Error!",
      description: err.response?.data as string,
      status: "error",
    });
    
    return false;
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
      AUTH_ENDPOINT_REFRESH_TOKEN,
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
      type: AUTH.LOGIN_USER,
      payload: user,
    });
  } catch (error) {
    const err = error as AxiosError;
    console.log(err);

    // clear local auth state and accessToken
    localStorage.removeItem(ACCESS_TOKEN);
    dispatch({ type: AUTH.LOGOUT_USER });

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
  axios.post(AUTH_ENDPOINT_LOGOUT, null, {
    withCredentials: true,
  });

  // clear local auth state and accessToken
  localStorage.removeItem(ACCESS_TOKEN);
  dispatch({ type: AUTH.LOGOUT_USER });

  toast({
    title: "Successful!",
    description: "You've logged out.",
    status: "success",
  });
}
