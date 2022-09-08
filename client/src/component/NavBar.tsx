import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Spacer,
} from "@chakra-ui/react";
import React from "react";
import { ColorModeSwitcher } from "../ColorModeSwitcher";
import { Link } from "react-router-dom";

type Props = {};

export default function NavBar({}: Props) {
  return (
    <Flex minWidth="max-content" alignItems="center" gap="2" m={2}>
      <Box p="2">
        <Heading size="md">PB platform</Heading>
      </Box>
      <Spacer />
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <ColorModeSwitcher justifySelf="flex-end" />
    </Flex>
  );
}
