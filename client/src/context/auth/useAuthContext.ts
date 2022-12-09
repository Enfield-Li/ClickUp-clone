import { API_ENDPOINT, BEARER } from "../../constant";
import axios from "axios";
import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { ACCESS_TOKEN } from "../../constant";
import { ToastId, UseToastOptions } from "@chakra-ui/react";
import { axiosGatewayInstance } from "../../utils/AxiosInterceptor";
import { AuthActionType, AUTH_ACTION } from "../../types";

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
  axiosGatewayInstance.post(API_ENDPOINT.AUTH_LOGOUT, null);

  // clear local auth taskState and accessToken
  localStorage.removeItem(ACCESS_TOKEN);
  dispatch({ type: AUTH_ACTION.LOGOUT_USER });

  toast({
    title: "Successful!",
    description: "You've logged out.",
    status: "success",
  });
}
