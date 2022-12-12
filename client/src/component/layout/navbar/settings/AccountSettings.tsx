import {
  Box,
  Center,
  Divider,
  Flex,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import ColorModeSwitcher from "../../../../ColorModeSwitcher";
import useAuthContext from "../../../../context/auth/useAuthContext";

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
  "Log out",
];
const helpTitles: string[] = ["Help", "Hotkeys", "Dark mode"];

type Props = { isTeamOwner: boolean };

export default function AccountSettings({ isTeamOwner }: Props) {
  const { authState } = useAuthContext();
  const { toggleColorMode } = useColorMode();
  const fontColor = useColorModeValue("black", "lightMain.200");

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
          bgColor="green"
          color="lightMain.200"
        >
          {authState.user?.username[0].toUpperCase()}
        </Center>

        <Center ml="2" fontSize="12px" fontWeight="semibold">
          {authState.user?.username}
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
                cursor="not-allowed"
                _hover={{ color: "purple.500" }}
              >
                {title}
              </Box>
            ))
          : mySettingTitles2.map((title, index) => (
              <Box
                my="12px"
                key={index}
                width="100%"
                fontSize="12px"
                cursor="not-allowed"
                _hover={{ color: "purple.500" }}
              >
                {title}
              </Box>
            ))}

        <Divider my="19px" />

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
