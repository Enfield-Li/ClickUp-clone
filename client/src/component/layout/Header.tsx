import { Box, useColorModeValue } from "@chakra-ui/react";
import { memo } from "react";

type Props = {};

export default memo(Header);
function Header({}: Props) {
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
        {user?.username ? (
          <>
            <Text>Hello! {user.username}</Text>
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
