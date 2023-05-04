import { Stack } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Feather";
import { useAuth } from "../../stores/useAuth";
import useNavigate from "../../hooks/useNavigate";
import { login } from "../../utils/networkCalls";
import useShowToast from "../../hooks/useShowToast";

type Props = {};

function sign_in_with_password(props: Props) {
  const authState = useAuth();
  const navigate = useNavigate();
  const showToast = useShowToast();
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);

  const email = authState.emailAccount;

  function signIn() {
    if (email) {
      login(
        { email, password },
        (response) => {
          authState.loginUser(response);
          navigate("main");
        },
        (errorMsg) => {
          showToast(errorMsg[0].message);
        }
      );
    }
  }

  return (
    <View className="flex-1 items-center bg-white">
      <Stack.Screen
        options={{
          headerTitle: "Sign in",
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerBackButtonMenuEnabled: true,
        }}
      />

      <View className="w-full p-3">
        <Text className="text-gray-700 text-xs">Password</Text>

        <View className="flex-row border border-gray-300 rounded-lg mt-2 mb-5 p-2 pl-3 justify-between items-center">
          <View className="flex-row items-center flex-1 pr-4">
            <Icon size={17} name="lock" color="gray" />

            <TextInput
              autoFocus
              value={password}
              placeholder="Password"
              className="ml-2 flex-1"
              onSubmitEditing={signIn}
              secureTextEntry={hidePassword}
              onChangeText={(text) => setPassword(text)}
            />
          </View>

          <TouchableOpacity
            className="p-1"
            onPress={() => setHidePassword(!hidePassword)}
          >
            {hidePassword ? (
              <Icon size={17} name="eye-off" color="gray" />
            ) : (
              <Icon size={17} name="eye" color="gray" />
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={signIn}
          className="w-full bg-purple-600 py-3 rounded-lg mx-auto mb-4 text-center"
        >
          <Text className="text-white text-center">Sign in</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text className="text-purple-500 text-center font-semibold text-xs">
            Forgot password?
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default sign_in_with_password;

const styles = StyleSheet.create({});
