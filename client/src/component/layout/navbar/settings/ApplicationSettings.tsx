import {
  Center,
  Flex,
  Popover,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  useColorModeValue,
} from "@chakra-ui/react";
import { memo } from "react";
import { useAuth } from "../../../../context/auth/useAuth";
import { useTeam } from "../../../../context/team/useTeam";
import AccountSettings from "./AccountSettings";
import DownloadApp from "./DownloadApp";
import JoinedTeamList from "./JoinedTeamList";
import TeamSettings from "./TeamSettings";

type Props = {};

export default memo(ApplicationSettings);
function ApplicationSettings({}: Props) {
  const { user } = useAuth();
  const { teamsForRender } = useTeam();
  const bgColor = useColorModeValue("lightMain.100", "darkMain.100");
  const fontColor = useColorModeValue("darkMain.200", "lightMain.100");
  const borderColor = useColorModeValue("lightMain.200", "blackAlpha.600");

  const currentTeam = teamsForRender.find((team) => team.isSelected);
  const isTeamOwner = currentTeam?.owner?.userId === user?.id;

  return (
    <Popover isLazy placement="top-start">
      {({ onClose }: { onClose: () => void }) => (
        <>
          <PopoverTrigger>
            <Center
              position="relative"
              fontSize="13px"
              cursor="pointer"
              fontWeight="semibold"
              color="lightMain.200"
            >
              <Center
                top="-18px"
                width="30px"
                height="30px"
                rounded="full"
                position="absolute"
                bgColor={user?.color}
              >
                {user?.username[0].toUpperCase()}
              </Center>

              <Center
                zIndex="10"
                rounded="full"
                overflow="hidden"
                bgColor="darkMain.200"
              >
                <Center
                  m="2px"
                  zIndex="10"
                  width="30px"
                  height="30px"
                  rounded="full"
                  backgroundSize="contain"
                  bgColor={currentTeam?.color}
                  backgroundImage={currentTeam?.avatar}
                >
                  {!currentTeam?.avatar
                    ? currentTeam?.name[0].toUpperCase()
                    : ""}
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
