import {
  AUTH_ENDPOINT_LOGIN,
  AUTH_ENDPOINT_LOGOUT,
  AUTH_ENDPOINT_REFRESH_TOKEN,
  BEARER,
} from "./../utils/constant";
import axios from "axios";
import React, { useContext } from "react";
import { AuthContext } from "../context/auth/AuthContext";
import {
  AuthActionType,
  Credentials,
  User,
  UserResponse,
} from "../context/auth/AuthContextTypes";
import { ACCESS_TOKEN, AUTH } from "../utils/constant";

export default function useAuthContext() {
  return useContext(AuthContext);
}

export async function loginUser(
  credentials: Credentials,
  dispatch: React.Dispatch<AuthActionType>
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
  } catch (error) {
    // clear local auth state and accessToken
    localStorage.removeItem(ACCESS_TOKEN);
    dispatch({ type: AUTH.LOGOUT_USER });
    console.log(error);
  }
}

export async function refreshUserToken(
  dispatch: React.Dispatch<AuthActionType>
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
    // clear local auth state and accessToken
    localStorage.removeItem(ACCESS_TOKEN);
    dispatch({ type: AUTH.LOGOUT_USER });
    console.log(error);
  }
}

export function logOutUser(dispatch: React.Dispatch<AuthActionType>) {
  // invalidate session
  axios.post(AUTH_ENDPOINT_LOGOUT, null, {
    withCredentials: true,
  });

  // clear local auth state and accessToken
  localStorage.removeItem(ACCESS_TOKEN);
  dispatch({ type: AUTH.LOGOUT_USER });
}
