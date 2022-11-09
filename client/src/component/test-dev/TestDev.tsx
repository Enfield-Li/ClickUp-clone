import { PhoneIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { HexColorPicker, RgbaColorPicker } from "react-colorful";

type Props = {};

export default function TestDev({}: Props) {
  function handleRightClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    if (e.nativeEvent.button === 0) {
      console.log("Left click");
    } else if (e.nativeEvent.button === 2) {
      console.log("Right click");
    }
  }

  return (
    // https://stackoverflow.com/a/31113000/16648127
    <Center height="100vh">
      <Box>
        <Box
          //   onClick={(e) => handleRightClick(e)}
          onContextMenu={(e) => handleRightClick(e)}
        >
          Welcome
        </Box>
      </Box>
    </Center>
  );

  return (
    <>
      {/* {Array(5)
        .fill(null)
        .map((column) => (
          <Box px={3}>
            <Skeleton>abc</Skeleton>
          </Box>
        ))} */}
    </>
  );
}
