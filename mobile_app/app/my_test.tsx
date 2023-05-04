import { Stack } from "expo-router";
import React, { useState } from "react";
import { View, Text, Button, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-gesture-handler";

type Props = {};

export default function my_test({}: Props) {
  const [input, setInput] = useState("");

  function handleNext() {}

  return (
    <View className="flex-1 items-center justify-center">
      <Text>test</Text>
    </View>
  );
}
