import { useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../constant";
import useAuthContext from "../context/auth/useAuthContext";
import useGlobalContext from "../context/global/useGlobalContext";

export default function useInit() {
  const navigate = useNavigate();
  const { globalState } = useGlobalContext();
  const { authDispatch } = useAuthContext();
  const toast = useToast({ duration: 3000, isClosable: true });
  const accessToken = localStorage.getItem(ACCESS_TOKEN);

  useEffect(() => {
    authDispatch({
      type: "LOGIN_USER",
      payload: { id: 3, username: "user", spaces: [] },
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
