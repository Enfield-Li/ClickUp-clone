import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";

type Props = {};

function comments(props: Props) {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Stack.Screen
        options={{
          title: "Comments",
        }}
      />

      <Text>comments</Text>
      <Text>🛠🛠🛠 施工中 🛠🛠🛠</Text>
    </View>
  );
}

export default comments;

const styles = StyleSheet.create({});
