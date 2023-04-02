import {
  Box,
  Center,
  Divider,
  Flex,
  useColorMode,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { memo } from "react";
import { useNavigate } from "react-router";
import { ACCESS_TOKEN, CLIENT_ROUTE } from "../../../../constant";
import { useAuth } from "../../../../context/auth/useAuth";
import { logOut } from "../../../../networkCalls";
import ColorModeSwitcher from "./ColorModeSwitcher";

const mySettingTitles1: string[] = [
  "My Settings",
  "Notifications",
  "Layout size & style",
  "Apps",
  "Rewards",
  "Log out",
];
const mySettingTitles2: string[] = [
  "My Settings",
  "Notifications",
  "Layout size & style",
  "Trash",
  "Apps",
  "Template Center",
  "Rewards",
];
const helpTitles: string[] = ["Help", "Hotkeys", "Dark mode"];

type Props = { isTeamOwner: boolean };

export default memo(AccountSettings);
function AccountSettings({ isTeamOwner }: Props) {
  const { user, logoutUser } = useAuth();

  const toast = useToast();
  const navigate = useNavigate();
  const { toggleColorMode } = useColorMode();
  const fontColor = useColorModeValue("black", "lightMain.200");
  const borderColor = useColorModeValue("lightMain.200", "blackAlpha.600");

  function isLogOutBtn(title: string) {
    return title === "Log out";
  }

  function handleLogOutUser() {
    navigate(CLIENT_ROUTE.LOGIN);
    // clear local auth taskState and accessToken
    logoutUser();
    localStorage.removeItem(ACCESS_TOKEN);

    toast({
      title: "Successful!",
      description: "You've logged out.",
      status: "success",
    });

    logOut();
  }

  return (
    <Box
      px="5"
      py="4"
      flexGrow="1"
      height="100%"
      color={fontColor}
      borderTopRightRadius="md"
    >
      <Flex
        mb="4"
        width="100%"
        cursor="pointer"
        _hover={{ color: "purple.500" }}
      >
        <Center
          width="26px"
          height="26px"
          rounded="full"
          color="lightMain.200"
          bgColor={user?.color}
        >
          {user?.username[0].toUpperCase()}
        </Center>

        <Center ml="2" fontSize="12px" fontWeight="semibold">
          {user?.username}
        </Center>
      </Flex>

      <Box>
        {isTeamOwner
          ? mySettingTitles1.map((title, index) => (
              <Box
                my="12px"
                key={index}
                width="100%"
                fontSize="12px"
                _hover={{ color: "purple.500" }}
                cursor={isLogOutBtn(title) ? "pointer" : "not-allowed"}
                onClick={() => isLogOutBtn(title) && handleLogOutUser()}
              >
                {title}
              </Box>
            ))
          : mySettingTitles2.map((title, index) =>
              title !== "Template Center" ? (
                <Box
                  my="12px"
                  key={index}
                  width="100%"
                  fontSize="12px"
                  _hover={{ color: "purple.500" }}
                  cursor={isLogOutBtn(title) ? "pointer" : "not-allowed"}
                >
                  {title}
                </Box>
              ) : (
                <Flex
                  my="12px"
                  key={index}
                  width="100%"
                  fontSize="12px"
                  alignItems="center"
                  cursor="not-allowed"
                >
                  <Box mr="2" _hover={{ color: "purple.500" }}>
                    {title}
                  </Box>
                  <Center
                    width="35px"
                    rounded="2px"
                    height="17px"
                    fontWeight="bold"
                    bgColor="customBlue.200"
                  >
                    New
                  </Center>
                </Flex>
              )
            )}

        <Divider my="19px" borderColor={borderColor} opacity="100%" />

        {helpTitles.map((title, index) => (
          <Box key={index}>
            {title !== "Dark mode" ? (
              <Box
                my="12px"
                width="100%"
                fontSize="12px"
                cursor="not-allowed"
                _hover={{ color: "purple.500" }}
              >
                {title}
              </Box>
            ) : (
              <Flex
                cursor="pointer"
                overflow="hidden"
                alignItems="center"
                onClick={toggleColorMode}
                justifyContent="space-between"
                _hover={{ color: "purple.500" }}
              >
                <Box>Dark mode</Box>
                <ColorModeSwitcher />
              </Flex>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
