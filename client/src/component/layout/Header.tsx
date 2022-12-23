import { Box, useColorModeValue, useToast } from "@chakra-ui/react";
import { memo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthContext from "../../context/auth/useAuthContext";
import { Section } from "../../ApplicationEntry";

type Props = {
  selectedSection: Section;
  setSelectedSection: React.Dispatch<React.SetStateAction<Section>>;
};

export default memo(Header);
function Header({ selectedSection, setSelectedSection }: Props) {
  const toast = useToast({ duration: 4000, isClosable: true });
  const location = useLocation();
  const navigate = useNavigate();
  const { authState, authDispatch } = useAuthContext();

  const headerBG = useColorModeValue("white", "darkMain.200");

  return (
    <Box bgColor={headerBG} height="54px">
      {/* <Flex minWidth="max-content" alignItems="center" gap="2" p={2}>
        <Box>
          {location.pathname === "/" ? (
            <Text>Home</Text>
          ) : (
            <Text>{capitalizeFirstLetter(location.pathname.substring(1))}</Text>
          )}
        </Box>
        <Spacer />
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
        <ColorModeSwitcher justifySelf="flex-end" />
      </Flex> */}
    </Box>
  );
}
