import { useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { ACCESS_TOKEN, CLIENT_ROUTE } from "../utils/constant";
import useGlobalContext from "../context/global/useGlobalContext";
import useAuthContext, {
  refreshUserToken,
} from "../context/auth/useAuthContext";
import { useNavigate } from "react-router-dom";

export default function useInit() {
  const navigate = useNavigate();
  const { globalState } = useGlobalContext();
  const { authDispatch } = useAuthContext();
  const toast = useToast({ duration: 3000, isClosable: true });
  const accessToken = localStorage.getItem(ACCESS_TOKEN);

  useEffect(() => {
    authDispatch({ type: "LOGIN_USER", payload: { id: 3, username: "user" } });
    // if (accessToken) {
    //   refreshUserToken(authDispatch, toast, navigate);
    //   setInterval(() => {
    //     refreshUserToken(authDispatch, toast, navigate);
    //   }, 1790000); // 29 min and 50 sec
    // } else {
    //   navigate(CLIENT_ROUTE.LOGIN);
    // }
  }, []);

  // toast for indicating network error
  useEffect(() => {
    if (globalState.error)
      toast({
        title: "Something's gone wrong...",
        description: globalState.error,
        status: "error",
      });
  }, [globalState.error]);
}
