import { useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { refreshUserToken } from "../component/auth/actions/refreshUserToken";
import { ACCESS_TOKEN, CLIENT_ROUTE } from "../constant";
import useAuthContext from "../context/auth/useAuthContext";

export default function useInit() {
  const navigate = useNavigate();
  const location = useLocation();
  const { authDispatch } = useAuthContext();
  const toast = useToast({ duration: 3000, isClosable: true });
  const accessToken = localStorage.getItem(ACCESS_TOKEN);

  useEffect(() => {
    if (accessToken) {
      refreshUserToken(authDispatch, toast, navigate);
      setInterval(() => {
        refreshUserToken(authDispatch, toast, navigate);
      }, 1790000); // 29 min and 50 sec
    } else {
      const isLoginProcess =
        location.pathname !== CLIENT_ROUTE.REGISTER &&
        location.pathname !== CLIENT_ROUTE.LOGIN;

      if (!isLoginProcess) {
        navigate(CLIENT_ROUTE.LOGIN);
      }
    }
  }, []);
}
