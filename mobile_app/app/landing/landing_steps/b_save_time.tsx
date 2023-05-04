import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import LandingSwipeTab from "../../../components/landing/LandingSwipeTab";
import { landing_second } from "../../../media/imgDataUrl";

type Props = {};

function b_save_time(props: Props) {
  return (
    <LandingSwipeTab imageSource={landing_second} >
      <Text>
        Save one day every week, {"\n"}
        <Text>guaranteed.</Text>
      </Text>
      <Text>Tasks, Docs, Goals, and Chat - customizable</Text>
      <Text>to work for everyone.</Text>
    </LandingSwipeTab>
  );
}

export default b_save_time;

const styles = StyleSheet.create({});
