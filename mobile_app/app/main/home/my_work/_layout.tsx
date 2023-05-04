import { Stack } from "expo-router";
import { TopTabs } from "../../../../utils/TopTabs";

function TabOne() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "My Work",
        }}
      />

      <TopTabs
        screenOptions={{
          tabBarStyle: {
            height: 50,
            width: "100%",
            marginTop: -5,
            shadowColor: "white",
            alignItems: "center",
            borderBottomWidth: 1,
            borderBottomColor: "rgb(223, 223, 223)",
          },
          tabBarItemStyle: {
            width: "auto",
            marginHorizontal: 13,
            paddingHorizontal: 14,
          },
          tabBarIndicatorStyle: {
            height: 3,
            left: "10%",
          },
          tabBarInactiveTintColor: "gray",
          tabBarActiveTintColor: "blue",
          tabBarPressColor: "white",
          tabBarScrollEnabled: true,
        }}
      />
    </>
  );
}

export default TabOne;
