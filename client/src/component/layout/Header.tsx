import {
  Box,
  Flex,
  Heading,
  Progress,
  Spacer,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "../../ColorModeSwitcher";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthContext, { logOutUser } from "../../context/auth/useAuthContext";
import useGlobalContext from "../../context/global/useGlobalContext";
import { CLIENT_ROUTE } from "../../utils/constant";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";

type Props = { onToggle: (props?: any) => any; isOpen: boolean };

export default function Header({ onToggle, isOpen }: Props) {
  const toast = useToast({ duration: 4000, isClosable: true });
  const location = useLocation();
  const navigate = useNavigate();
  const { authState, authDispatch } = useAuthContext();
  const { globalState } = useGlobalContext();

  return (
    <Box borderBottom={"1px"} borderColor={"teal.400"}>
      <Flex minWidth="max-content" alignItems="center" gap="2" m={2}>
        {/* Toggle menu icon */}
        {!isOpen ? (
          <Box
            p={1}
            px={2}
            ml={2}
            _hover={{
              color: "black",
              bg: "gray.300",
            }}
            cursor={"pointer"}
            borderRadius={"md"}
            onClick={() => onToggle()}
          >
            <i className="bi bi-list"></i>
          </Box>
        ) : null}

        <Box pl={isOpen ? 3 : 0}>
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
          cursor={"pointer"}
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
              cursor={"pointer"}
              _hover={{
                color: "black",
                bg: "gray.300",
              }}
              onClick={() => {
                logOutUser(authDispatch, toast);
                navigate(CLIENT_ROUTE.HOME);
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
                cursor={"pointer"}
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

      {/* Loading progress bar */}
      {globalState.loading ? <Progress size="xs" isIndeterminate /> : null}
    </Box>
  );
}
