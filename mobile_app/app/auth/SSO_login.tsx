import { Link, Stack, useNavigation } from "expo-router";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

type Props = {};

function SSO_login(props: Props) {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerTitleAlign: "center",
          headerBackButtonMenuEnabled: true,
          headerShadowVisible: false,
          headerTitle: () => (
            <View className="justify-center items-center mt-4 pb-2">
              <Text className="font-bold tracking-wide">SSO Login</Text>
              <Text className="mt-4 text-gray-600">
                Other sign in methods available
              </Text>
            </View>
          ),
        }}
      />

      <TouchableOpacity
        onPress={() => navigation.navigate("auth/sign_in_with_password")}
        className="rounded-lg bg-gray-100 mt-2 items-center flex-row justify-between p-2 mx-4"
      >
        <View className="flex-row">
          <View>
            <Icon size={20} name="email" color="rgb(255, 145, 20)" />
          </View>

          <Text className="ml-3 text-gray-700">Sign in with password</Text>
        </View>

        <View>
          <Icon size={15} name="arrow-right" color="rgb(122, 104, 240)" />
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default SSO_login;

const styles = StyleSheet.create({});
