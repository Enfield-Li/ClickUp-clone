import { StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import { TopTabs } from "../../../utils/TopTabs";

type Props = {};

function _layout(props: Props) {
  return (
    <TopTabs
      tabBarPosition="bottom"
      screenOptions={{
        tabBarIcon: ({ focused }) => (
          <Icon
            size={20}
            name="dot-single"
            color={focused ? "#7c4ffc" : "gray"}
          />
        ),
        tabBarShowLabel: false,
        animationEnabled: true,
        tabBarIndicatorStyle: { width: 0 },
        tabBarStyle: {
          width: 60,
          shadowColor: "white",
          alignSelf: "center",
        },
        tabBarItemStyle: {
          margin: 0,
          padding: 0,
          alignSelf: "center",
        },

        // tabBarIndicatorStyle: {
        //   borderColor: "white",
        //   borderBottomColor: "white",
        //   borderWidth: 0,
        // },
        // tabBarItemStyle: {
        //   //   width: 30,
        //   //   height: 30,
        // },
        // tabBarIconStyle: { borderColor: "white" },
        // tabBarLabelStyle: { borderColor: "white" },
        // tabBarIndicatorContainerStyle: { borderColor: "white" },
        // tabBarContentContainerStyle: { borderColor: "white" },
        // style
      }}
    />
  );
}

export default _layout;

const styles = StyleSheet.create({});
