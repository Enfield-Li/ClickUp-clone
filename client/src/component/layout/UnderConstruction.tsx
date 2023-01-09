import { Center } from "@chakra-ui/react";
import React from "react";

type Props = {};

export default function UnderConstruction({}: Props) {
  return (
    <Center textAlign="center" fontSize="xl" p={3} height="100vh" mt="-60px">
      <Center>🛠🛠🛠 Under construction 🛠🛠🛠</Center>
    </Center>
  );
}
