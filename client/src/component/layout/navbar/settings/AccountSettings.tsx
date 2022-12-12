import { Box, Flex } from "@chakra-ui/react";
import { ColorModeSwitcher } from "../../../../ColorModeSwitcher";

type Props = {};

export default function AccountSettings({}: Props) {
  return (
    <Box px="4" py="4" flexGrow="1" height="100%" borderTopRightRadius="md">
      <Box>account</Box>

      <Flex alignItems="center" justifyContent="space-between">
        <Box>Dark mode</Box>
        <ColorModeSwitcher mr="-2" />
      </Flex>
    </Box>
  );
}
