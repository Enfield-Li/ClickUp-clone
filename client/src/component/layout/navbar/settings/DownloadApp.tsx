import { Flex, Center, useColorModeValue } from "@chakra-ui/react";
import AppIcon from "./AppIcon";

type Props = { isTeamOwner: boolean };

export default function DownloadApp({ isTeamOwner }: Props) {
  const bgColor = useColorModeValue("lightMain.100", "darkMain.200");
  const fontColor = useColorModeValue("lightMain.400", "lightMain.300");

  return (
    <Flex
      px="4"
      height="10%"
      fontSize="5px"
      bgColor={bgColor}
      color={fontColor}
      alignItems="center"
      fontWeight="semibold"
      borderBottomRadius="md"
      justifyContent="space-between"
    >
      <Center cursor="not-allowed" _hover={{ color: "purple.500" }}>
        DOWNLOAD APPS:
      </Center>
      <Flex>
        <AppIcon iconName="iOS" isTeamOwner={isTeamOwner}>
          <i className="bi bi-apple"></i>
        </AppIcon>

        <AppIcon iconName="Android" isTeamOwner={isTeamOwner}>
          <i className="bi bi-android2"></i>
        </AppIcon>

        <AppIcon iconName="Desktop" isTeamOwner={isTeamOwner}>
          <i className="bi bi-display-fill"></i>
        </AppIcon>

        <AppIcon iconName="Chrome" isTeamOwner={isTeamOwner}>
          <i className="bi bi-browser-chrome"></i>
        </AppIcon>
      </Flex>
    </Flex>
  );
}
