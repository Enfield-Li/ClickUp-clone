import { Center } from "@chakra-ui/react";
import React from "react";

type Props = {};

export default function UnderConstruction({}: Props) {
  return (
    <Center
      p={3}
      mt="-60px"
      fontSize="xl"
      height="100vh"
      flexDir="column"
      textAlign="center"
    >
      <Center>🛠🛠🛠 Under construction 🛠🛠🛠</Center>
      <Center fontSize="small" opacity="55%">
        (I'm not gonna implement this LOL)
      </Center>
    </Center>
  );
}
