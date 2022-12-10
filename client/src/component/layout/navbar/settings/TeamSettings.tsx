import { Box, useColorModeValue } from "@chakra-ui/react";

type Props = {};

export default function TeamSettings({}: Props) {
  const borderColor = useColorModeValue("lightMain.200", "blackAlpha.600");

  return (
    <Box
      px="4"
      py="4"
      width="50%"
      height="100%"
      borderRightWidth="1px"
      borderColor={borderColor}
    >
      <Box>team</Box>
    </Box>
  );
}
