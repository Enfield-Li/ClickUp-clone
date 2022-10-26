import { Box, Skeleton } from "@chakra-ui/react";
import React from "react";

type Props = {};

export default function FunctionalityTwo({}: Props) {
  return (
    <>
      {Array(5)
        .fill(null)
        .map((column) => (
          <Box px={3}>
            <Skeleton>abc</Skeleton>
          </Box>
        ))}
    </>
  );
}
