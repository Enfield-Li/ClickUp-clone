import {
  Box,
  Flex,
  Popover,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  useColorModeValue,
} from "@chakra-ui/react";
import useAuthContext from "../../../../context/auth/useAuthContext";
import useTeamStateContext from "../../../../context/team/useTeamContext";
import AccountSettings from "./AccountSettings";
import DownloadApp from "./DownloadApp";
import JoinedTeamList from "./JoinedTeamList";
import TeamSettings from "./TeamSettings";

type Props = {};

export default function ApplicationSettings({}: Props) {
  const { authState } = useAuthContext();
  const { teamState, teamStateDispatch } = useTeamStateContext();
  const fontColor = useColorModeValue("darkMain.200", "lightMain.100");
  const bgColor = useColorModeValue("lightMain.100", "darkMain.100");
  const borderColor = useColorModeValue("lightMain.200", "blackAlpha.600");

  const currentTeamId = teamState.activeTeamState.selectedTeamId;
  const currentTeam = teamState.teams.find((team) => team.id === currentTeamId);
  const isTeamOwner = currentTeam?.owner.id === authState.user?.id;

  return (
    <Popover isLazy>
      {({ onClose }: { onClose: () => void }) => (
        <>
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
            left="-15px"
            bottom="-45px"
            shadow="dark-lg"
            position="absolute"
            bgColor={bgColor}
            color={fontColor}
            width={isTeamOwner ? "410px" : "225px"}
            height={isTeamOwner ? "410px" : "470px"}
          >
            <PopoverCloseButton mr="-1" />

            <Flex
              height="90%"
              fontSize="12px"
              borderTopRadius="md"
              borderBottomWidth="1px"
              borderColor={borderColor}
            >
              <JoinedTeamList onClose={onClose} />

              <Flex flexGrow="1" height="100%">
                {isTeamOwner && <TeamSettings />}
                <AccountSettings />
              </Flex>
            </Flex>

            <DownloadApp isTeamOwner={isTeamOwner} />
          </PopoverContent>
        </>
      )}
    </Popover>
  );
}
