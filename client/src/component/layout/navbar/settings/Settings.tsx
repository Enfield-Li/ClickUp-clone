import {
  Box,
  Center,
  Flex,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import AccountSettings from "./AccountSettings";
import AppIcon from "./AppIcon";
import TeamList from "./TeamList";
import TeamSettings from "./TeamSettings";

type Props = {};

export default function Settings({}: Props) {
  return (
    <Popover>
      <PopoverTrigger>
        <Box
          width="30px"
          height="30px"
          rounded="full"
          bgColor="white"
          cursor="pointer"
        ></Box>
      </PopoverTrigger>

      <PopoverContent
        left="-20px"
        bottom="-45px"
        width="400px"
        height="400px"
        position="absolute"
      >
        <Flex height="90%">
          <TeamList />

          <Flex flexGrow="1" height="100%">
            <AccountSettings />
            <TeamSettings />
          </Flex>
        </Flex>

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
      </PopoverContent>
    </Popover>
  );
}
