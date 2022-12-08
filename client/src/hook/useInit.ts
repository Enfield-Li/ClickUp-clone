import { useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { refreshUserToken } from "../component/auth/actions/refreshUserToken";
import { ACCESS_TOKEN, CLIENT_ROUTE } from "../constant";
import useAuthContext from "../context/auth/useAuthContext";
import { AUTH_ACTION } from "../types";
import { initialSpaces, mockUser } from "./mockData";

export default function useInit() {
  const navigate = useNavigate();
  const location = useLocation();
  const { authDispatch } = useAuthContext();
  const toast = useToast({ duration: 3000, isClosable: true });
  const accessToken = localStorage.getItem(ACCESS_TOKEN);

  useEffect(() => {
    // authDispatch({ type: AUTH_ACTION.LOGIN_USER, payload: { user: mockUser } });
    if (accessToken) {
      refreshUserToken(authDispatch, toast, navigate);
      setInterval(() => {
        refreshUserToken(authDispatch, toast, navigate);
      }, 1790000); // 29 min and 50 sec
    } else {
      if (
        location.pathname !== CLIENT_ROUTE.LOGIN ||
        location.pathname !== CLIENT_ROUTE.REGISTER
      ) {
        navigate(CLIENT_ROUTE.LOGIN);
      }
    }
  }, []);
}
