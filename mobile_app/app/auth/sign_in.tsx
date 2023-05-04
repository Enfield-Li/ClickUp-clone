import { Stack } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import useNavigate from "../../hooks/useNavigate";
import { useAuth } from "../../stores/useAuth";

type Props = {};

export default function sign_in({}: Props) {
  const authState = useAuth();
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [showError, setShowError] = useState(false);

  const isEmailValid = input.includes("@");

  function goToNext() {
    if (isEmailValid) {
      authState.addEmail(input);
      navigate("auth/confirm_email");
    } else {
      setShowError(true);
    }
  }

  return (
    <View className="flex-1 justify-center pb-20 bg-white">
      <Stack.Screen
        options={{
          title: "Email",
          headerShown: true,
          headerTitleAlign: "center",
          headerBackButtonMenuEnabled: true,
          headerRight: () => (
            <TouchableOpacity
              onPress={goToNext}
              className="py-3 rounded-lg text-center"
            >
              <Text
                className={`font-bold ${
                  isEmailValid ? "text-purple-500" : "text-gray-500"
                }`}
              >
                Next
              </Text>
            </TouchableOpacity>
          ),
        }}
      />

      <View className="mx-4  bg-white">
        <Text className="text-gray-600 text-lg">Your email address</Text>

        <TextInput
          autoFocus
          value={input}
          className="text-xl"
          onSubmitEditing={goToNext}
          onChangeText={(text) => setInput(text)}
        />

        <Text
          className={`text-sm mt-2 ${
            !showError ? "text-gray-600" : "text-red-600"
          }`}
        >
          {!showError
            ? "We'll send you an email to confirm your address"
            : "Whoops! That's not a valid email."}
        </Text>
      </View>
    </View>
  );
}
