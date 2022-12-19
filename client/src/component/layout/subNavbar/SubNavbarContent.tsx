import {
  Box,
  Center,
  Flex,
  Text,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { memo } from "react";
import useTeamStateContext from "../../../context/team/useTeamContext";
import CreateSpaceModal from "../../widget/createSpace/CreateSpaceModal";
import Space from "./Space";

type Props = {};

export default memo(SubNavbarContent);
function SubNavbarContent({}: Props) {
  const { colorMode } = useColorMode();
  const { teamState } = useTeamStateContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const hoverBgColor = colorMode === "dark" ? "darkMain.300" : "darkMain.200";
  const currentTeam = teamState.teams.find(
    (team) => team.id === teamState.activeTeamState.selectedTeamId
  );

  function handleClickToSeeEveryTasks(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <Box
      pr="3"
      pl="10px"
      fontSize="15px"
      color="lightMain.200"
      fontWeight="semibold"
    >
      <Flex height="35px" alignItems="center" cursor="pointer" pl="2">
        <Box>Spaces</Box>
      </Flex>

      <Flex
        py="2"
        pl="2"
        rounded="4px"
        cursor="pointer"
        alignItems="center"
        _hover={{ bgColor: hoverBgColor }}
        onClick={handleClickToSeeEveryTasks}
      >
        <Box mr="1">
          <i className="bi bi-grid"></i>
        </Box>
        <Box>Everything</Box>
      </Flex>

      {currentTeam?.spaceList.length ? (
        <Box>
          {currentTeam?.spaceList?.map((space) => (
            <Box key={space.id}>
              <Space space={space} />
            </Box>
          ))}
        </Box>
      ) : (
        <Flex alignItems="center" flexDir="row" px="4" opacity="80%">
          <Box display="inline" fontWeight="bold" mr="4" opacity="60%">
            &#8212;
          </Box>
          No Spaces found
        </Flex>
      )}

      <Flex
        onClick={onOpen}
        cursor="pointer"
        alignItems="center"
        color="lightMain.300"
        _hover={{ color: "purple.500" }}
      >
        <Center fontWeight="bold" fontSize="xl" mx="1">
          +
        </Center>
        <Text fontWeight="normal" fontSize="sm">
          Add Space
        </Text>
      </Flex>

      <CreateSpaceModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}
