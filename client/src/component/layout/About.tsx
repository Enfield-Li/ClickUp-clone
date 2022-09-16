import { Box, Text } from "@chakra-ui/react";
import React from "react";

type Props = {};

export default function About({}: Props) {
  return (
    <>
      <Box textAlign="center" fontSize="xl" p={3}>
        <Text>About page</Text>
      </Box>
    </>
  );
}
