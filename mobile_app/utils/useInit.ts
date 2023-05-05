import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { ACCESS_TOKEN } from "./constant";
import { refreshUserToken } from "./networkCalls";
import { useAuth } from "../stores/useAuth";
import useNavigate from "../hooks/useNavigate";
import { autoLogin } from "./autoLogin";

export function useInit() {
  const authState = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let intervalId: NodeJS.Timer;
    async function checkAuthStatus() {
      //   autoLogin(authState);

      const accessToken = await AsyncStorage.getItem(ACCESS_TOKEN);
      if (accessToken) {
        refreshUserToken(authState, navigate);
        intervalId = setInterval(() => {
          refreshUserToken(authState, navigate);
        }, 1790000); // 29 min and 50 sec
      } else if (!accessToken) {
        navigate("landing");
      }
    }
    checkAuthStatus();
    return () => clearInterval(intervalId);
  }, []);
}
