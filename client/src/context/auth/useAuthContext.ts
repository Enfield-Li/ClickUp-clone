import { API_ENDPOINT, BEARER } from "../../utils/constant";
import axios from "axios";
import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { AuthActionType, AUTH_ACTION, User } from "./AuthContextTypes";
import { ACCESS_TOKEN } from "../../utils/constant";
import { ToastId, UseToastOptions } from "@chakra-ui/react";
import { axiosInstance } from "../../utils/AxiosInterceptor";

export default function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within a authContextProvider");
  }
  return context;
}

export function logOutUser(
  dispatch: React.Dispatch<AuthActionType>,
  toast: (options?: UseToastOptions | undefined) => ToastId
) {
  // invalidate session
  axiosInstance.post(API_ENDPOINT.AUTH_LOGOUT, null);

  // clear local auth taskState and accessToken
  localStorage.removeItem(ACCESS_TOKEN);
  dispatch({ type: AUTH_ACTION.LOGOUT_USER });

  toast({
    title: "Successful!",
    description: "You've logged out.",
    status: "success",
  });
}
