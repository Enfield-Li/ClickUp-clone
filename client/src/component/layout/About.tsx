import { Box, Center, Text } from "@chakra-ui/react";
import React from "react";

type Props = {};

export default function About({}: Props) {
  return (
    <Box p={3}>
      <Center fontSize="xl">A clone of ClickUp: </Center>
      <Center>
        <iframe
          width="560"
          height="315"
          frameBorder="0"
          allowFullScreen
          title="YouTube video player"
          allow="autoplay; encrypted-media"
          src="https://www.youtube.com/embed/AirnL1NxOAw"
        ></iframe>
      </Center>
    </Box>
  );
}
