import { Box, useColorModeValue } from "@chakra-ui/react";

type Props = {};

export default function TeamList({}: Props) {
  const fontColor = useColorModeValue("darkMain.200", "lightMain.100");
  const bgColor = useColorModeValue("lightMain.100", "darkMain.200");
  const borderColor = useColorModeValue("lightMain.200", "blackAlpha.600");

  return (
    <Box
      p="1"
      bg="black"
      width="43px"
      height="100%"
      bgColor={bgColor}
      borderRightWidth="1px"
      borderTopLeftRadius="md"
      borderColor={borderColor}
    >
      <Box color={fontColor}>abc</Box>
    </Box>
  );
}
