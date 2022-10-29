import { Box, Center, Flex } from "@chakra-ui/react";
import React from "react";

type Props = {};

export default function TaskOptions({}: Props) {
  return (
    <Center mr={3}>
      <i className="bi bi-three-dots"></i>
      {/* <i className="bi bi-trash3"></i> */}
    </Center>
  );
}
