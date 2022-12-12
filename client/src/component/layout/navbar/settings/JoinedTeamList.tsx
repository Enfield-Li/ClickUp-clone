import { Box, Center, Flex, useColorModeValue } from "@chakra-ui/react";
import useTeamStateContext from "../../../../context/team/useTeamContext";
import { TEAM_STATE_ACTION } from "../../../../types";

type Props = { onClose: () => void };

export default function JoinedTeamList({ onClose }: Props) {
  const { teamState, teamStateDispatch } = useTeamStateContext();
  const bgColor = useColorModeValue("lightMain.100", "darkMain.100");
  const fontColor = useColorModeValue("darkMain.200", "lightMain.100");
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

  function handleAddTeam(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <Box
      p="1"
      bg="black"
      width="40px"
      height="100%"
      bgColor={bgColor}
      borderRightWidth="0.5px"
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
            color="lightMain.200"
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

        <Center
          my="3px"
          pb="3px"
          width="26px"
          height="26px"
          fontSize="sm"
          rounded="full"
          cursor="pointer"
          borderWidth="1px"
          color="purple.500"
          borderStyle="dashed"
          fontWeight="extrabold"
          borderColor="purple.500"
          onClick={() => handleAddTeam()}
        >
          +
        </Center>
      </Flex>
    </Box>
  );
}
