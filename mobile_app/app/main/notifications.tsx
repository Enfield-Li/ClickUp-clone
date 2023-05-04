import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";

type Props = {};

function notifications(props: Props) {
  return (
    <View className="flex-1 justify-center items-center">
      <Stack.Screen
        options={{ headerTitleAlign: "center", title: "Notifications" }}
      />

      <Text>notifications</Text>
      <Text>🛠🛠🛠 under construction 🛠🛠🛠</Text>
    </View>
  );
}

export default notifications;

const styles = StyleSheet.create({});
