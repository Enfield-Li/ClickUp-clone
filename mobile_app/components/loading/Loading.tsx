import { Image, View } from "react-native";
import { loadingCircleDataUrlLight } from "../../media/imgDataUrl";

type Props = {};

export default function Loading({}: Props) {
  return (
    <View className="items-center">
      <Image
        source={{ uri: loadingCircleDataUrlLight }}
        className="rounded-full w-28 h-28 border items-center justify-center"
      />
      <Image
        resizeMode="contain"
        className="w-max h-28 absolute mt-2"
        source={require("../../media/clickup-logo-left.png")}
      />
    </View>
  );
}
