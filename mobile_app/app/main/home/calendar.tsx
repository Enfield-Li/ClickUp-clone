import { StyleSheet, View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {};

function calendar(props: Props) {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Stack.Screen options={{ headerShown: false, title: "Calendar" }} />

      <Text>calendar page</Text>
      <Text>🛠🛠🛠 under construction 🛠🛠🛠</Text>
    </View>
  );
}

export default calendar;

const styles = StyleSheet.create({
  icon: {
    width: 32,
    height: 32,
  },
});
