import { Stack, useSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { InitListParam } from "../../types";

type Props = {};

function list(props: Props) {
  const params = useSearchParams<InitListParam>();

  return (
    <View className="flex-1 justify-center items-center">
      <Stack.Screen options={{}} />

      <Text>list</Text>
      <Text>🛠🛠🛠 under construction 🛠🛠🛠</Text>
    </View>
  );
}

export default list;

const styles = StyleSheet.create({});
