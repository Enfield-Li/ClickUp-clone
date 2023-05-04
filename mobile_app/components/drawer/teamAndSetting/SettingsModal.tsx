import { Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import useNavigate from "../../../hooks/useNavigate";
import { useAuth } from "../../../stores/useAuth";
import { useTeam } from "../../../stores/useTeam";
import { logOut } from "../../../utils/networkCalls";
import TransparentModal from "../../modals/TransparentModal";

type Props = {
  modalVisible: boolean;
  toggleVisiblity: () => void;
};

function SettingsModal({ modalVisible, toggleVisiblity }: Props) {
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();
  const { teamsForRender, selectTeam } = useTeam();

  function onLogout() {
    logOut(() => {
      logoutUser();
      navigate("landing");
    });
  }

  return (
    <TransparentModal
      title="Settings"
      requireFullModal
      modalVisible={modalVisible}
      toggleVisiblity={toggleVisiblity}
    >
      <View className="mt-2 pb-2">
        <Text className="font-light text-xs">General</Text>
        <View className="flex-row items-center bg-gray-100 rounded-md p-2 mt-1">
          <View
            style={{ backgroundColor: user?.color }}
            className="rounded-full w-10 h-10 items-center justify-center mr-2 bg-black"
          >
            {/* user */}
            <Text className="text-white font-semibold">
              {user?.username[0].toUpperCase()}
            </Text>
          </View>
          <Text>{user?.username}</Text>
        </View>

        <View className="mt-4 justify-center items-center h-screen">
          <Text>Under construction</Text>
        </View>

        <TouchableOpacity
          onPress={onLogout}
          className="rounded-md justify-center items-center flex-row p-4 bg-gray-100"
        >
          <Icon size={20} name="logout" color="red" />
          <Text className="text-red-600 ml-2 font-semibold">Log out</Text>
        </TouchableOpacity>
      </View>
    </TransparentModal>
  );
}

export default SettingsModal;
