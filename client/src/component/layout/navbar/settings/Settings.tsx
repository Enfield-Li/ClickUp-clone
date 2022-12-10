import {
  Box,
  Flex,
  Popover,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  useColorModeValue,
} from "@chakra-ui/react";
import AccountSettings from "./AccountSettings";
import DownloadApp from "./DownloadApp";
import TeamList from "./TeamList";
import TeamSettings from "./TeamSettings";

type Props = {};

export default function Settings({}: Props) {
  const fontColor = useColorModeValue("darkMain.200", "lightMain.100");
  const bgColor = useColorModeValue("lightMain.100", "darkMain.200");
  const borderColor = useColorModeValue("lightMain.200", "blackAlpha.600");

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
        width="400px"
        height="400px"
        bottom="-45px"
        shadow="dark-lg"
        position="absolute"
        bgColor={bgColor}
        color={fontColor}
        // onMouseOver={(e) => e.stopPropagation()}
      >
        <PopoverCloseButton mr="-1" />

        <Flex
          height="90%"
          fontSize="12px"
          borderTopRadius="md"
          borderBottomWidth="1px"
          borderColor={borderColor}
        >
          <TeamList />

          <Flex flexGrow="1" height="100%">
            <TeamSettings />
            <AccountSettings />
          </Flex>
        </Flex>

        <DownloadApp />
      </PopoverContent>
    </Popover>
  );
}
