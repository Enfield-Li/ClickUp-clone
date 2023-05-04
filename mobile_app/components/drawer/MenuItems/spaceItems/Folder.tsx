import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { Fragment } from "react";
import { FolderCategory } from "../../../../types";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTeam } from "../../../../stores/useTeam";
import Icon from "react-native-vector-icons/Feather";
import useShowToast from "../../../../hooks/useShowToast";
import List from "./List";

type Props = { folder: FolderCategory };

function Folder({ folder }: Props) {
  const showToast = useShowToast();
  const { updateOpenedFolder } = useTeam();

  return (
    <TouchableOpacity
      key={"folder" + folder.id}
      onPress={() => updateOpenedFolder(folder.id)}
    >
      {folder.isOpen ? (
        <>
          {/* open */}
          <View
            className={`flex-row items-center justify-between pl-12 py-3 pr-4 ${
              folder.isOpen && "bg-gray-100"
            }`}
          >
            {/* left */}
            <View className="flex-row items-center">
              <Ionicons
                size={11}
                name="caret-down"
                color="rgb(166, 166, 166)"
                style={{ marginRight: 15 }}
              />

              <Ionicons
                size={20}
                name="folder-open-outline"
                color="rgb(166, 166, 166)"
                style={{ marginRight: 10 }}
              />
              <Text>{folder.name}</Text>
            </View>

            {/* right */}
            <View className="flex-row">
              {/* add */}
              <TouchableOpacity className="mr-3" onPress={() => {}}>
                <Icon size={20} name="plus" color="rgb(125, 103, 240)" />
              </TouchableOpacity>

              {/* go to */}
              <TouchableOpacity onPress={() => showToast()}>
                <Icon size={20} color="rgb(125, 103, 240)" name="log-out" />
              </TouchableOpacity>
            </View>
          </View>

          <View>
            {folder.allLists.map((list) => (
              <Fragment key={list.id}>
                <List list={list} />
              </Fragment>
            ))}
          </View>
        </>
      ) : (
        //   closed
        <View className="flex-row items-center pl-12 py-3 pr-4">
          <Ionicons
            size={11}
            name="caret-forward"
            color="rgb(166, 166, 166)"
            style={{ marginRight: 15 }}
          />
          <Ionicons
            size={20}
            name="folder"
            color="rgb(166, 166, 166)"
            style={{ marginRight: 10 }}
          />
          <Text>{folder.name}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default Folder;

const styles = StyleSheet.create({});
