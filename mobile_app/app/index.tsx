import { Redirect, Stack } from "expo-router";
import { View } from "react-native";
import { useInit } from "../utils/useInit";

export default function App() {
  useInit();

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Stack.Screen options={{ headerShown: false }} />

      <Redirect href="main" />

      {/* <Loading /> */}
    </View>
  );
}
