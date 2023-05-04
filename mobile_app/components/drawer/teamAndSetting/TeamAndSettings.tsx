import { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import SettingsIcon from "react-native-vector-icons/Feather";
import Icon from "react-native-vector-icons/Entypo";
import { useAuth } from "../../../stores/useAuth";
import { useTeam } from "../../../stores/useTeam";
import JoinedTeamsModal from "./JoinedTeamsModal";
import SettingsModal from "./SettingsModal";

type Props = {};

function TeamAndSettings(props: Props) {
  const { user } = useAuth();
  const { teamsForRender } = useTeam();
  const [teamModalVisible, setTeamModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const selectedTeam = teamsForRender.find((team) => team.isSelected);

  function toggleTeamModalVisiblity() {
    setTeamModalVisible(!teamModalVisible);
  }

  function toggleSettingsModalVisiblity() {
    setSettingsModalVisible(!settingsModalVisible);
  }

  return (
    <View className="flex-row justify-between items-center w-full px-3 mb-2">
      {/* workspace */}
      <TouchableWithoutFeedback onPress={toggleTeamModalVisiblity}>
        <View className="flex-1 mr-5 flex-row items-center text-white font-bold rounded-full h-100 w-100">
          {/* avatar */}
          <View
            style={{ backgroundColor: user?.color }}
            className="rounded-full w-10 h-10 items-center justify-center mr-2"
          >
            {/* user */}
            <Text className="text-white font-semibold text-lg">
              {selectedTeam?.name[0]}
            </Text>
          </View>

          {/* space name */}
          <View className="flex-1 justify-center">
            <View className="flex-row items-center">
              <Text className="text-md font-semibold text-lg mr-1">
                {selectedTeam?.name}
              </Text>
              <Icon
                size={16}
                name="chevron-small-down"
                color="rgb(38, 38, 38)"
              />
            </View>

            {/* username */}
            <Text className="font-light text-xs mt-[-6]">{user?.username}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
      <JoinedTeamsModal
        modalVisible={teamModalVisible}
        toggleVisiblity={toggleTeamModalVisiblity}
      />

      {/* Settings */}
      <TouchableOpacity onPress={toggleSettingsModalVisiblity}>
        <SettingsIcon size={20} name="settings" color="rgb(28, 34, 37)" />
      </TouchableOpacity>
      <SettingsModal
        modalVisible={settingsModalVisible}
        toggleVisiblity={toggleSettingsModalVisiblity}
      />
    </View>
  );
}

export default TeamAndSettings;

const styles = StyleSheet.create({});
