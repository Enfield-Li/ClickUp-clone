import { StyleSheet, Text, View } from "react-native";
import React from "react";
import LandingSwipeTab from "../../../components/landing/LandingSwipeTab";
import { landing_third } from "../../../media/imgDataUrl";

type Props = {};

function c_personalized_way(props: Props) {
  return (
    <LandingSwipeTab imageSource={landing_third}>
      <Text>
        Personalized to the {"\n"}
        <Text>way you work.</Text>
      </Text>
      <Text>Customize ClickUp to work for you.</Text>
      <Text>No opinions, just options.</Text>
    </LandingSwipeTab>
  );
}

export default c_personalized_way;

const styles = StyleSheet.create({});
