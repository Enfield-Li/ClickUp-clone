import { Box, Flex, Heading, Spacer, Text } from "@chakra-ui/react";
import { ColorModeSwitcher } from "../ColorModeSwitcher";
import { Link, useLocation } from "react-router-dom";
import useAuthContext, { logOutUser } from "../hook/useAuthContext";

type Props = {};

export default function NavBar({}: Props) {
  const location = useLocation();
  const { state: userState, dispatch: userDispatch } = useAuthContext();

  return (
    <Flex minWidth="max-content" alignItems="center" gap="2" m={2}>
      <Box p="2">
        <Link to="/">
          <Heading size="md">PB platform</Heading>
        </Link>
      </Box>

      <Spacer />

      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      {userState?.user ? (
        <>
          <Text>Hello! {userState.user?.username}</Text>
          <Link to="/" onClick={() => logOutUser(userDispatch)}>
            Log out
          </Link>
        </>
      ) : (
        <>
          {location.pathname === "/login" ? null : (
            <Link to="/login">Log in</Link>
          )}
        </>
      )}
      <ColorModeSwitcher justifySelf="flex-end" />
    </Flex>
  );
}
