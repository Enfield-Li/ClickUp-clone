import { Box, Center, Flex, useColorModeValue } from "@chakra-ui/react";
import useTeamStateContext from "../../../../context/team/useTeamContext";
import { TEAM_STATE_ACTION } from "../../../../types";

type Props = { onClose: () => void };

export default function TeamList({ onClose }: Props) {
  const { teamState, teamStateDispatch } = useTeamStateContext();
  const fontColor = useColorModeValue("darkMain.200", "lightMain.100");
  const bgColor = useColorModeValue("lightMain.100", "darkMain.200");
  const borderColor = useColorModeValue("lightMain.200", "blackAlpha.600");

  function handleSelectTeam(teamId: number) {
    onClose();

    // Performance hack
    setTimeout(() => {
      teamStateDispatch({
        type: TEAM_STATE_ACTION.SELECT_TEAM,
        payload: { teamId },
      });
    }, 100);
  }

  return (
    <Box
      p="1"
      bg="black"
      width="43px"
      height="100%"
      bgColor={bgColor}
      borderRightWidth="1px"
      borderTopLeftRadius="md"
      borderColor={borderColor}
    >
      <Flex color={fontColor} flexDir="column" alignItems="center">
        {teamState.teams.map((team) => (
          <Center
            p="2px"
            my="3px"
            key={team.id}
            rounded="full"
            cursor="pointer"
            borderStyle="solid"
            borderColor="purple.500"
            onClick={() => handleSelectTeam(team.id)}
            borderWidth={
              team.id === teamState.activeTeamState.selectedTeamId ? "1px" : ""
            }
          >
            <Center
              width="26px"
              height="26px"
              rounded="full"
              bgColor={team.color}
            >
              {team.name[0].toUpperCase()}
            </Center>
          </Center>
        ))}
      </Flex>
    </Box>
  );
}
