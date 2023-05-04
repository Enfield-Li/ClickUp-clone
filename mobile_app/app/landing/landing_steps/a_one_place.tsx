import { Text } from "react-native";
import LandingSwipeTab from "../../../components/landing/LandingSwipeTab";
import { landing_first } from "../../../media/imgDataUrl";

type Props = {};

function a_one_place(props: Props) {
  return (
    <LandingSwipeTab imageSource={landing_first}>
      <Text>One place for all your work.</Text>
      <Text>Tasks, Docs, Goals, and Chat - customizable</Text>
      <Text>to work for everyone.</Text>
    </LandingSwipeTab>
  );
}

export default a_one_place;
