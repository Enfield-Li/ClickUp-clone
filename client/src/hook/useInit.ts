import { useToast } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { Credentials } from "../context/auth/AuthContextTypes";
import useAuthContext, { refreshUserToken } from "./useAuthContext";
import useGlobalContext from "./useGlobalContext";

export default function useInit() {
  const { globalState } = useGlobalContext();
  const { authDispatch } = useAuthContext();
  const toast = useToast();

  useEffect(() => {
    refreshUserToken(authDispatch);
  }, []);

  // toast for indicating network error
  useEffect(() => {
    if (globalState.error)
      toast({
        title: "Something's gone wrong...",
        description: globalState.error,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
  }, [globalState.error]);
}
