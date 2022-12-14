import { Center } from "@chakra-ui/react";
import { memo } from "react";

type Props = {};

export default memo(Home);
function Home({}: Props) {
  return (
    <Center textAlign="center" fontSize="xl" p={3} height="100vh">
      <Center>Under construction</Center>
    </Center>
  );
}
