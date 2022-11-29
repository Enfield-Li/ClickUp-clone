import { Center } from "@chakra-ui/react";
import useSpaceListContext from "../../context/spaceList/useSpaceListContext";

type Props = {};

export default function Home({}: Props) {
  const { spaceListState: globalState, spaceListDispatch: globalDispatch } =
    useSpaceListContext();

  return (
    <Center textAlign="center" fontSize="xl" p={3} height="100vh">
      <Center>Under construction</Center>
    </Center>
  );
}
