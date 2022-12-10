import { Flex, Center, useColorModeValue } from "@chakra-ui/react";
import AppIcon from "./AppIcon";

type Props = {};

export default function DownloadApp({}: Props) {
  const fontColor = useColorModeValue("lightMain.400", "lightMain.300");
  const bgColor = useColorModeValue("lightMain.100", "darkMain.200");

  return (
    <Flex
      px="4"
      height="10%"
      fontSize="small"
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
        <AppIcon iconName="iOS">
          <i className="bi bi-apple"></i>
        </AppIcon>

        <AppIcon iconName="Android">
          <i className="bi bi-android2"></i>
        </AppIcon>

        <AppIcon iconName="Desktop">
          <i className="bi bi-display-fill"></i>
        </AppIcon>

        <AppIcon iconName="Chrome">
          <i className="bi bi-browser-chrome"></i>
        </AppIcon>
      </Flex>
    </Flex>
  );
}
