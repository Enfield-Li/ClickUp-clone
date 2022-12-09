import {
  Box,
  Flex,
  Progress,
  Spacer,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { memo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ColorModeSwitcher } from "../../ColorModeSwitcher";
import useAuthContext, { logOutUser } from "../../context/auth/useAuthContext";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";
import { CLIENT_ROUTE } from "../../constant";

type Props = {};

export default memo(Header);
function Header({}: Props) {
  const toast = useToast({ duration: 4000, isClosable: true });
  const location = useLocation();
  const navigate = useNavigate();
  const { authState, authDispatch } = useAuthContext();

  const headerBG = useColorModeValue("white", "darkMain.200");

  return (
    <Box backgroundColor={headerBG}>
      <Flex minWidth="max-content" alignItems="center" gap="2" p={2}>
        <Box>
          {location.pathname === "/" ? (
            <Text>Home</Text>
          ) : (
            <Text>{capitalizeFirstLetter(location.pathname.substring(1))}</Text>
          )}
        </Box>
        <Spacer />
        {/* About page */}
        <Box
          p={2}
          borderRadius={3}
          cursor="pointer"
          _hover={{
            color: "black",
            bg: "gray.300",
          }}
          onClick={() => navigate(CLIENT_ROUTE.ABOUT)}
        >
          About
        </Box>
        {/* User info & logout */}
        {authState.user?.username ? (
          <>
            <Text>Hello! {authState.user.username}</Text>
            <Box
              p={2}
              borderRadius={3}
              cursor="pointer"
              _hover={{
                color: "black",
                bg: "gray.300",
              }}
              onClick={() => {
                logOutUser(authDispatch, toast);
                navigate(CLIENT_ROUTE.LOGIN);
              }}
            >
              Log out
            </Box>
          </>
        ) : (
          <>
            {/* Login */}
            {location.pathname === CLIENT_ROUTE.LOGIN ? null : (
              <Box
                p={2}
                borderRadius={3}
                cursor="pointer"
                _hover={{
                  color: "black",
                  bg: "gray.300",
                }}
                onClick={() => navigate(CLIENT_ROUTE.LOGIN)}
              >
                Log in
              </Box>
            )}
          </>
        )}
        {/* Dark/light mode switcher */}
        <ColorModeSwitcher justifySelf="flex-end" />
      </Flex>
    </Box>
  );
}
