import { PhoneIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Box,
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

export default function FunctionalityTwo({}: Props) {
  const [color, setColor] = useState("#aabbcc");
  const [color2, setColor2] = useState({ r: 200, g: 150, b: 35, a: 0.5 });

  console.log({ color });
  console.log({ color2 });
  return (
    <Center height="100vh" backgroundColor="lightMain.100">
      <Box>
        <Box bg="brand.100">Welcome</Box>
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
