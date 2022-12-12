import { Box, Button, Center, Flex, useColorModeValue } from "@chakra-ui/react";
import { Team } from "../../../../types";

const teamSettingsTitles: string[] = [
  "Settings",
  "Import/Export",
  "People",
  "ClickApps",
  "Spaces",
  "Integrations",
  "Template Center",
  "Trash",
  "Upgrade",
  "Security & Permissions",
];

type Props = { currentTeam: Team | undefined };

export default function TeamSettings({ currentTeam }: Props) {
  const fontColor = useColorModeValue("black", "lightMain.200");
  const borderColor = useColorModeValue("lightMain.200", "blackAlpha.600");

  return (
    <Box
      px="5"
      py="4"
      width="50%"
      height="100%"
      color={fontColor}
      borderRightWidth="0.5px"
      borderColor={borderColor}
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
          {currentTeam?.name[0].toUpperCase()}
        </Center>

        <Center ml="2" fontSize="12px" fontWeight="semibold">
          {currentTeam?.name}
        </Center>
      </Flex>

      <Box>
        {teamSettingsTitles.map((title, index) => (
          <Box key={index}>
            {title !== "Upgrade" ? (
              <Box
                my="11px"
                width="100%"
                fontSize="12px"
                cursor="not-allowed"
                _hover={{ color: "purple.500" }}
              >
                {title}
              </Box>
            ) : (
              <Button
                _focus={{}}
                rounded="sm"
                _active={{}}
                width="100%"
                height="25px"
                fontWeight=""
                type="submit"
                color="white"
                fontSize="12px"
                cursor="not-allowed"
                bgColor="customBlue.200"
                _hover={{ bgColor: "customBlue.100" }}
              >
                {title}
              </Button>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
