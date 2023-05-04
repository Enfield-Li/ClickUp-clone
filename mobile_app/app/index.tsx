import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, Stack } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import useNavigate from "../hooks/useNavigate";
import { useAuth } from "../stores/useAuth";
import { ACCESS_TOKEN } from "../utils/constant";
import { login, refreshUserToken } from "../utils/networkCalls";

export default function App() {
  const authState = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let intervalId: NodeJS.Timer;

    async function checkAuthStatus() {
      await login(
        { email: "user1@gmail.com", password: "user1user1" },
        (res) => {
          authState.loginUser(res);
        }
      );

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

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Stack.Screen options={{ headerShown: false }} />

      <Redirect href="landing" />

      {/* <Loading /> */}
    </View>
  );
}
