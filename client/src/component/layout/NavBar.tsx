import { Center } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";

type Props = {};

export default function NavBar({}: Props) {
  return (
    <>
      <Center h="40px">
        <Link to="/functionality_one">Functionality 1</Link>
      </Center>

      <Center h="40px">
        <Link to="/functionality_two">Functionality 2</Link>
      </Center>
    </>
  );
}
