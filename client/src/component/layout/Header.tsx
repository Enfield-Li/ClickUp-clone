import { Box, Flex, Heading, Progress, Spacer, Text } from "@chakra-ui/react";
import { ColorModeSwitcher } from "../../ColorModeSwitcher";
import { Link, useLocation } from "react-router-dom";
import useAuthContext, { logOutUser } from "../../hook/useAuthContext";
import useGlobalContext from "../../hook/useGlobalContext";
import { ROUTE } from "../../utils/constant";

type Props = {};

export default function Header({}: Props) {
  const location = useLocation();
  const { authState, authDispatch } = useAuthContext();
  const { globalState } = useGlobalContext();

  return (
    <>
      <Flex minWidth="max-content" alignItems="center" gap="2" m={2}>
        <Spacer />
        <Box
          p={2}
          borderRadius={3}
          _hover={{
            background: "rgb(51, 88, 119)",
          }}
        >
          <Link to={ROUTE.ABOUT}>About</Link>
        </Box>

        {/* Login */}
        {authState?.user ? (
          <>
            <Text>Hello! {authState.user?.username}</Text>
            <Link to={ROUTE.HOME} onClick={() => logOutUser(authDispatch)}>
              Log out
            </Link>
          </>
        ) : (
          <>
            {location.pathname === ROUTE.LOGIN ? null : (
              <Box
                p={2}
                borderRadius={3}
                _hover={{
                  background: "rgb(51, 88, 119)",
                }}
              >
                <Link to={ROUTE.LOGIN}>Log in</Link>
              </Box>
            )}
          </>
        )}

        {/* Dark/light mode switcher */}
        <ColorModeSwitcher justifySelf="flex-end" />
      </Flex>
      {/* Loading progress bar */}
      {globalState.loading ? <Progress size="xs" isIndeterminate /> : null}
    </>
  );
}
