import { useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { refreshUserToken } from "../component/auth/actions/refreshUserToken";
import { ACCESS_TOKEN, CLIENT_ROUTE } from "../constant";
import useAuthContext from "../context/auth/useAuthContext";
import { AUTH_ACTION } from "../types";
import { mockUser } from "./mockData";

export default function useInit() {
  const navigate = useNavigate();
  const location = useLocation();
  const { authState, authDispatch } = useAuthContext();
  const toast = useToast({ duration: 3000, isClosable: true });
  const accessToken = localStorage.getItem(ACCESS_TOKEN);

  // localStorage.removeItem("access token");
  useEffect(() => {
    // authDispatch({ type: AUTH_ACTION.LOGIN_USER, payload: { user: mockUser } });
    if (accessToken) {
      refreshUserToken(authDispatch, toast, navigate);
      setInterval(() => {
        refreshUserToken(authDispatch, toast, navigate);
      }, 1790000); // 29 min and 50 sec
    } else {
      const isNotLoginPage =
        location.pathname !== CLIENT_ROUTE.REGISTER &&
        location.pathname !== CLIENT_ROUTE.LOGIN;
      if (isNotLoginPage) {
        navigate(CLIENT_ROUTE.LOGIN);
      }
    }
  }, []);
}
