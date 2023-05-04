import { Stack, useNavigation } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import useShowToast from "../../hooks/useShowToast";

type Props = {};

function confirm_email(props: Props) {
  const showToast = useShowToast();
  const navigation = useNavigation();

  return (
    <View className="flex-1 justify-center items-center pb-20 bg-white">
      <Stack.Screen
        options={{
          title: "",
          headerBackButtonMenuEnabled: true,
        }}
      />

      <View className="bg-gray-100 rounded-lg p-6">
        <Icon size={70} name="paper-plane" color="rgb(122, 104, 240)" />
      </View>
      <Text className="text-xl font-bold tracking-wide mt-6">
        We've sent you an email
      </Text>
      <Text className="mt-3 text-gray-600">
        Go to your email to open the link
      </Text>

      <TouchableOpacity
        onPress={() => showToast()}
        className="w-11/12 bg-purple-500 py-3 rounded-lg mx-auto mt-14"
      >
        <Text className="text-white text-center">Open Email App</Text>
      </TouchableOpacity>

      <View className="my-5 items-center flex-row">
        <View className="border-b w-1/3 border-slate-100" />
        <Text className="text-gray-400 mx-5 text-xs">OR</Text>
        <View className="border-b w-1/3 border-slate-100" />
      </View>

      <TouchableOpacity
        onPress={() => showToast()}
        className="w-11/12 py-3 rounded-lg mx-auto border border-gray-200"
      >
        <Text className="text-gray-400 text-center">Enter the code</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("auth/SSO_login")}
        className="absolute bottom-0 left-0 right-0 h-14 bg-slate-100 justify-center items-center border-t border-gray-200"
      >
        <Text className="text-blue-700">Other SIgn in Options</Text>
      </TouchableOpacity>
    </View>
  );
}

export default confirm_email;

const styles = StyleSheet.create({});
