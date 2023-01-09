import {
  Box,
  Center,
  Flex,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { CLIENT_ROUTE } from "../../../../constant";
import useAuthContext from "../../../../context/auth/useAuthContext";
import useTeamStateContext from "../../../../context/team/useTeamContext";
import { AUTH_ACTION, TEAM_STATE_ACTION } from "../../../../types";

type Props = { onClose: () => void };

export default memo(JoinedTeamList);
function JoinedTeamList({ onClose }: Props) {
  const { authDispatch } = useAuthContext();
  const navigate = useNavigate();
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
            my="1px"
            key={team.id}
            rounded="full"
            cursor="pointer"
            borderStyle="solid"
            color="lightMain.200"
            borderColor="purple.500"
            onClick={() => handleSelectTeam(team.id!)}
            borderWidth={team.isSelected ? "1px" : ""}
          >
            <Center
              width="26px"
              height="26px"
              rounded="full"
              bgColor={team.color}
              backgroundSize="contain"
              backgroundImage={team.avatar}
            >
              {!team.avatar ? team.name[0].toUpperCase() : ""}
            </Center>
          </Center>
        ))}

        <Tooltip
          ml="2"
          hasArrow
          rounded="md"
          arrowSize={6}
          fontSize="small"
          placement="right"
          fontWeight="semibold"
          label="Add Workspace"
        >
          <Center
            my="3px"
            pb="3px"
            width="26px"
            height="26px"
            fontSize="sm"
            rounded="full"
            cursor="pointer"
            borderWidth="1px"
            color="purple.400"
            borderStyle="dashed"
            fontWeight="extrabold"
            borderColor="purple.400"
            onClick={() => navigate(CLIENT_ROUTE.ON_BOARDING)}
          >
            +
          </Center>
        </Tooltip>
      </Flex>
    </Box>
  );
}
