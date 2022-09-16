import { Center } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";
import { ROUTE } from "../../utils/constant";

type Props = {};

export default function NavBar({}: Props) {
  return (
    <>
      <Center h="40px">
        <Link to={ROUTE.FUNC_ONE}>Drag and Drop</Link>
      </Center>

      <Center h="40px">
        <Link to={ROUTE.FUNC_TWO}>Functionality 2</Link>
      </Center>
    </>
  );
}
