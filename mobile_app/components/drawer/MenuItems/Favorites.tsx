import { StyleSheet, Text, View } from "react-native";
import ExclamationIcon from "react-native-vector-icons/AntDesign";

type Props = {};

function Favorites(props: Props) {
  return (
    <View className="mx-4">
      <View className="flex-row items-center">
        <ExclamationIcon size={15} color="gray" name="exclamationcircleo" />
        <Text className="ml-2 text-gray-500 font-semibold">
          You don't have any favorites yet.
        </Text>
      </View>

      <Text className="mt-2 text-gray-500 text-sm">
        Favorite a Folder, List, View, Task or Doc to see them here
      </Text>
    </View>
  );
}

export default Favorites;

const styles = StyleSheet.create({});
