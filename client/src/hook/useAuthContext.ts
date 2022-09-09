import React, { useContext } from "react";
import { AuthContext } from "../context/auth/AuthContext";
import { AuthActionType, User } from "../context/auth/AuthContextTypes";
import { AUTH } from "../utils/constant";

export default function useAuthContext() {
  return useContext(AuthContext);
}

export function logInUser(
  credentials: User,
  dispatch: React.Dispatch<AuthActionType>
) {
  return dispatch({ type: AUTH.LOGIN_USER, payload: credentials });
}

export function logOutUser(dispatch: React.Dispatch<AuthActionType>) {
  return dispatch({ type: AUTH.LOGOUT_USER });
}
