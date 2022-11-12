import { Center } from "@chakra-ui/react";
import useGlobalContext from "../../context/global/useGlobalContext";

type Props = {};

export default function Home({}: Props) {
  const { globalState, globalDispatch } = useGlobalContext();

  return (
    <Center textAlign="center" fontSize="xl" p={3} height="100vh">
      <Center>Under construction</Center>
    </Center>
  );
}
