import { Box, Center, Flex, useColorModeValue } from "@chakra-ui/react";
import useAuthContext from "../../../context/auth/useAuthContext";

type Props = {};

export default function SubNavbarContent({}: Props) {
  const { authState } = useAuthContext();
  const textColor = useColorModeValue("darkMain.400", "lightMain.200");

  return (
    <Box color={textColor} fontWeight="semibold">
      <Flex height="35px" alignItems="center" px="3">
        <Box>Spaces</Box>
      </Flex>

      <Box>
        {authState.user?.spaces.map((space) => (
          <Box>space</Box>
        ))}
      </Box>
    </Box>
  );
}
