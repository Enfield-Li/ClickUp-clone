import { Link, Slot, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SvgXml } from "react-native-svg";
import { loginLogoDataUrl } from "../../media/imgDataUrl";

type Props = {};

function _layout(props: Props) {
  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View className="items-center mt-16">
        <SvgXml xml={loginLogoDataUrl} width={"45%"} />
        {/* {test2} */}
      </View>

      <Slot />

      {/* tailwind button */}
      <Link
        href="/auth/sign_in"
        className="w-11/12 bg-purple-600 py-3 rounded-lg mx-auto mb-6 text-center"
      >
        <Text className="text-white">Get started</Text>
      </Link>
    </View>
  );
}

export default _layout;

const styles = StyleSheet.create({});
