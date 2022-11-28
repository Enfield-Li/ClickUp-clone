import { useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { ACCESS_TOKEN } from "../constant";
import useAuthContext from "../context/auth/useAuthContext";
import { AUTH_ACTION } from "../types";
import { initialSpaces, mockUser } from "./mockData";

export default function useInit() {
  const { authDispatch } = useAuthContext();
  const toast = useToast({ duration: 3000, isClosable: true });
  const accessToken = localStorage.getItem(ACCESS_TOKEN);

  useEffect(() => {
    authDispatch({
      type: AUTH_ACTION.LOGIN_USER,
      payload: { user: mockUser, spaces: initialSpaces },
    });
    // if (accessToken) {
    //   refreshUserToken(authDispatch, toast, navigate);
    //   setInterval(() => {
    //     refreshUserToken(authDispatch, toast, navigate);
    //   }, 1790000); // 29 min and 50 sec
    // } else {
    //   navigate(CLIENT_ROUTE.LOGIN);
    // }
  }, []);
}
