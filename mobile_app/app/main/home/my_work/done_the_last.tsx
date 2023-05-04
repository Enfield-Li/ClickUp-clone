import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useAuth } from "../../../../stores/useAuth";
import { Stack } from "expo-router";

type Props = {};

function done(props: Props) {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Stack.Screen
        options={{
          title: "Done",
        }}
      />

      <Text>done</Text>
      <Text>🛠🛠🛠 under construction 🛠🛠🛠</Text>
    </View>
  );
}

export default done;

const styles = StyleSheet.create({});
