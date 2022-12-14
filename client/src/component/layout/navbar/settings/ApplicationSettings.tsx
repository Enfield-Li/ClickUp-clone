import {
  Box,
  Center,
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
  const bgColor = useColorModeValue("lightMain.100", "darkMain.100");
  const fontColor = useColorModeValue("darkMain.200", "lightMain.100");
  const borderColor = useColorModeValue("lightMain.200", "blackAlpha.600");

  const currentTeamId = teamState.activeTeamState.selectedTeamId;
  const currentTeam = teamState.teams.find((team) => team.id === currentTeamId);

  const isTeamOwner = currentTeam?.owner.id === authState.user?.id;

  return (
    <Popover isLazy placement="top-start">
      {({ onClose }: { onClose: () => void }) => (
        <>
          <PopoverTrigger>
            <Center position="relative">
              <Center
                top="-18px"
                width="30px"
                height="30px"
                rounded="full"
                fontSize="13px"
                cursor="pointer"
                position="absolute"
                fontWeight="semibold"
                color="lightMain.200"
                bgColor={currentTeam?.color}
              >
                {authState.user?.username[0].toUpperCase()}
              </Center>

              <Center bgColor="darkMain.200" zIndex="10" rounded="full">
                <Center
                  mt="2px"
                  zIndex="10"
                  width="30px"
                  height="30px"
                  rounded="full"
                  fontSize="13px"
                  cursor="pointer"
                  fontWeight="semibold"
                  color="lightMain.200"
                  bgColor={currentTeam?.color}
                >
                  {currentTeam?.name[0].toUpperCase()}
                </Center>
              </Center>
            </Center>
          </PopoverTrigger>

          <PopoverContent
            left="-0.5"
            bottom="-46px"
            fontSize="12px"
            shadow="dark-lg"
            bgColor={bgColor}
            color={fontColor}
            width={isTeamOwner ? "410px" : "225px"}
            height={isTeamOwner ? "405px" : "470px"}
          >
            <PopoverCloseButton mr="-1" />

            <Flex
              height="90%"
              borderTopRadius="md"
              borderBottomWidth="1px"
              borderColor={borderColor}
            >
              <JoinedTeamList onClose={onClose} />

              <Flex flexGrow="1" height="100%">
                {isTeamOwner && <TeamSettings currentTeam={currentTeam} />}
                <AccountSettings isTeamOwner={isTeamOwner} />
              </Flex>
            </Flex>

            <DownloadApp isTeamOwner={isTeamOwner} />
          </PopoverContent>
        </>
      )}
    </Popover>
  );
}
