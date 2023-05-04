import { Fragment } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import useShowToast from "../../../hooks/useShowToast";
import { useTeam } from "../../../stores/useTeam";
import SpaceContent from "./spaceItems/SpaceContent";

type Props = {};

function Spaces(props: Props) {
  const showToast = useShowToast();
  const { teamsForRender, updateOpenedSpace } = useTeam();
  const selectedTeam = teamsForRender.find((team) => team.isSelected);

  function spaceNameStyle(isSpaceOpen: boolean | null) {
    return !isSpaceOpen ? "text-gray-700" : "text-gray-900 font-semibold";
  }

  return (
    <View>
      <TouchableOpacity onPress={() => showToast()} className="flex-row px-10">
        <Ionicons size={18} name="md-grid-outline" color="gray" />
        <Text className="ml-4 text-gray-700">Everything</Text>
      </TouchableOpacity>

      <View className="mt-3"></View>

      {selectedTeam?.spaces.map((space) => (
        <Fragment key={space.id}>
          {/* space header */}
          <TouchableOpacity
            key={space.id}
            onPress={() => updateOpenedSpace(space.id)}
            className={`flex-row items-center justify-between py-3 pl-3 pr-4 ${
              space.isOpen && "bg-gray-100"
            }`}
          >
            {/* left */}
            <View className="flex-row items-center ">
              {space.isOpen ? (
                <Ionicons
                  size={11}
                  name="caret-down"
                  color="rgb(166, 166, 166)"
                />
              ) : (
                <Ionicons
                  size={11}
                  name="caret-forward"
                  color="rgb(166, 166, 166)"
                />
              )}

              {/* square */}
              <View
                style={{ backgroundColor: space.color }}
                className="h-7 w-7 pb-1 rounded-md ml-3 mr-3 justify-center"
              >
                <Text className="text-white text-center">{space.name[0]}</Text>
              </View>

              {/* space name */}
              <Text className={spaceNameStyle(space.isOpen)}>{space.name}</Text>
            </View>

            {/* right */}
            <View className="flex-row items-center">
              {/* add */}
              <TouchableOpacity className="mr-3" onPress={() => showToast()}>
                <Icon size={20} name="plus" color="rgb(125, 103, 240)" />
              </TouchableOpacity>

              {/* go to */}
              <TouchableOpacity onPress={() => showToast()}>
                <Icon size={20} color="rgb(125, 103, 240)" name="log-out" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          {/* space content */}
          {space.isOpen && (
            <View>
              <SpaceContent allListOrFolder={space.allListOrFolder} />
            </View>
          )}
        </Fragment>
      ))}
    </View>
  );
}

export default Spaces;

const styles = StyleSheet.create({});
