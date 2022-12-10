import {
  Box,
  Flex,
  Popover,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import AccountSettings from "./AccountSettings";
import DownloadApp from "./DownloadApp";
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
        width="400px"
        height="400px"
        bottom="-45px"
        shadow="dark-lg"
        position="absolute"
      >
        <PopoverCloseButton mr="-1" />

        <Flex height="90%" borderTopRadius="md">
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
