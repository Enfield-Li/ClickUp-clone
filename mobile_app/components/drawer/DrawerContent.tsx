import { usePathname } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import HomeIcon from "react-native-vector-icons/SimpleLineIcons";
import useNavigate from "../../hooks/useNavigate";
import useShowToast from "../../hooks/useShowToast";
import MenuItems from "./MenuItems/MenuItems";
import TeamAndSettings from "./teamAndSetting/TeamAndSettings";

type Props = {};

const DrawerContent = (props: Props) => {
  const pathname = usePathname();
  const navigate = useNavigate();
  const showToast = useShowToast();

  return (
    <SafeAreaView className="flex-1">
      <TeamAndSettings />

      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          onPress={() => showToast()}
          className="bg-gray-100 rounded-md mx-2 h-9 flex-row items-center px-3 mt-2"
        >
          <Icon size={18} name="search" color="gray" />
          <Text className="ml-2 text-gray-500">Search</Text>
        </TouchableOpacity>

        <View className="mt-1" />

        {/* Home */}
        <TouchableOpacity
          onPress={() => {
            if (!pathname.includes("home")) {
              navigate("home");
            }
          }}
          className={`border-l-4 h-12 flex-row items-center px-3 border-white ${
            pathname.includes("home") && " border-blue-600 bg-blue-100"
          }  mt-3`}
        >
          <HomeIcon size={18} name="home" color="black" />
          <Text className="ml-2 text-black font-semibold">Home</Text>
        </TouchableOpacity>

        {/* Notifications */}
        <TouchableOpacity
          onPress={() => {
            if (!pathname.includes("notifications")) {
              navigate("notifications");
            }
          }}
          className={`border-l-4 h-12 flex-row items-center px-3 border-white ${
            pathname.includes("notifications") && "border-blue-600 bg-blue-100"
          }`}
        >
          <Icon size={18} name="bell" color="black" />
          <Text className="ml-2 text-black font-semibold">Notifications</Text>
        </TouchableOpacity>

        <MenuItems />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DrawerContent;
