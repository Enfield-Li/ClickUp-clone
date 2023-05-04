import { Slot } from "expo-router";
import React, { ReactNode } from "react";
import { View, Image, Text } from "react-native";
import { landing_first } from "../../media/imgDataUrl";

type Props = {
  imageSource?: string;
  children: [ReactNode, ReactNode, ReactNode];
};

export default function LandingSwipeTab({ imageSource, children }: Props) {
  return (
    <View className="items-center justify-center flex-1 bg-white">
      <Image
        resizeMode="contain"
        className="w-full h-60"
        source={{ uri: imageSource }}
      />

      <View className="mt-10 items-center">
        <Text className="text-2xl font-bold tracking-wide text-center justify-center">
          {children[0]}
        </Text>
      </View>

      <Text className="mt-6 text-xs tracking-wide">{children[1]}</Text>
      <Text className="mt-1 text-xs tracking-wide">{children[2]}</Text>
    </View>
  );
}
