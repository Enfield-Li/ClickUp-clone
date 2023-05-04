import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { Fragment, useState } from "react";
import { produce } from "immer";
import Icon from "react-native-vector-icons/Feather";
import Dashboards from "./Dashboards";
import Docs from "./Docs";
import Favorites from "./Favorites";
import Spaces from "./Spaces";
import useShowToast from "../../../hooks/useShowToast";
import { menuItemNameStyle } from "./util/menuItemNameStyle";

type Props = {};
type MenuItem = { name: string; isOpen: boolean };

function MenuItems(props: Props) {
  const showToast = useShowToast();
  const [menuItemsTitle, setMenuItemsTitle] = useState<MenuItem[]>([
    { name: "Favorites", isOpen: false },
    { name: "Spaces", isOpen: false },
    { name: "Dashboards", isOpen: false },
    { name: "Docs", isOpen: false },
  ]);

  function onSelectMenuItem(name: string) {
    setMenuItemsTitle(
      produce(menuItemsTitle, (draftState) => {
        draftState.forEach(
          (menuItem) =>
            menuItem.name === name && (menuItem.isOpen = !menuItem.isOpen)
        );
      })
    );
  }

  return (
    <View className="mt-1">
      {menuItemsTitle.map((menuItem, index) => (
        <Fragment key={index}>
          {/* item top header */}
          <TouchableOpacity
            className={`${
              menuItem.isOpen && "bg-gray-100"
            } py-3 flex-row justify-between items-center px-4 border-t border-slate-100`}
            onPress={() => onSelectMenuItem(menuItem.name)}
          >
            {/* item name */}
            <Text className={menuItemNameStyle(menuItem.isOpen)}>
              {menuItem.name}
            </Text>

            {menuItem.isOpen ? (
              //   is space?
              <View className="flex-row items-center">
                {menuItem.name === "Spaces" && (
                  <View className="flex-row items-center">
                    {/* search */}
                    <TouchableOpacity
                      className="mr-3"
                      onPress={() => showToast()}
                    >
                      <Icon
                        size={18}
                        color="rgb(125, 103, 240)"
                        name="search"
                      />
                    </TouchableOpacity>
                    {/* add */}
                    <TouchableOpacity
                      className="mr-3"
                      onPress={() => showToast()}
                    >
                      <Icon size={20} name="plus" color="rgb(125, 103, 240)" />
                    </TouchableOpacity>
                  </View>
                )}

                {/* Arror */}
                <Icon
                  size={20}
                  name="chevron-down"
                  color="rgb(125, 103, 240)"
                />
              </View>
            ) : (
              <Icon size={20} name="chevron-right" color="gray" />
            )}
          </TouchableOpacity>

          {menuItem.isOpen && (
            <View className="py-4">
              {menuItem.name === "Favorites" ? (
                <Favorites />
              ) : menuItem.name === "Spaces" ? (
                <Spaces />
              ) : menuItem.name === "Dashboards" ? (
                <Dashboards />
              ) : (
                <Docs />
              )}
            </View>
          )}
        </Fragment>
      ))}
    </View>
  );
}

export default MenuItems;

const styles = StyleSheet.create({});
