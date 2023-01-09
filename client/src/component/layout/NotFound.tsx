import { Center } from "@chakra-ui/react";
import React from "react";

type Props = {};

export default function NotFound({}: Props) {
  return (
    <Center textAlign="center" fontSize="xl" p={3} height="100vh">
      <Center>Page not found</Center>
    </Center>
  );
}
