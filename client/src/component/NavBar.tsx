import { Box, Flex, Heading, Spacer, Text } from "@chakra-ui/react";
import { ColorModeSwitcher } from "../ColorModeSwitcher";
import { Link, useNavigate } from "react-router-dom";
import useAuthContext, { logOutUser } from "../hook/useAuthContext";

type Props = {};

export default function NavBar({}: Props) {
  const navigate = useNavigate();
  const { state: userState, dispatch: userDispatch } = useAuthContext();

  return (
    <Flex minWidth="max-content" alignItems="center" gap="2" m={2}>
      <Box p="2">
        <Heading size="md">PB platform</Heading>
      </Box>
      <Spacer />
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Text
        onClick={() =>
          userState?.user ? logOutUser(userDispatch) : navigate("/login")
        }
      >
        {userState?.user ? "Hello! " + userState.user.username : "login"}
      </Text>
      <ColorModeSwitcher justifySelf="flex-end" />
    </Flex>
  );
}
