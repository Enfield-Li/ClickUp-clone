import { Center } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";

type Props = {};

export default function NavBar({}: Props) {
  return (
    <>
      <Center h="40px">
        <Link to="/undefined">Functionality 1</Link>
      </Center>

      <Center h="40px">
        <Link to="/undefined">Functionality 2</Link>
      </Center>
    </>
  );
}
