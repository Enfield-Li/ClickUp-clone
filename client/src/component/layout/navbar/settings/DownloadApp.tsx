import { Flex, Center } from "@chakra-ui/react";
import AppIcon from "./AppIcon";

type Props = {};

export default function DownloadApp({}: Props) {
  return (
    <Flex
      px="4"
      height="10%"
      color="black"
      fontSize="small"
      alignItems="center"
      fontWeight="semibold"
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
