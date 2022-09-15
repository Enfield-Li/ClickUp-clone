import { useToast } from "@chakra-ui/react";
import React, { useEffect } from "react";
import useGlobalContext from "./useGlobalContext";

export default function useInit() {
  const { globalState } = useGlobalContext();
  const toast = useToast();

  useEffect(() => {
    console.log("Initialize some network connection...");
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
