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
import CreateSpaceModal from "./createSpace/CreateSpaceModal";
import Space from "./Space";

type Props = {};

export default memo(SubNavbarContent);
function SubNavbarContent({}: Props) {
  const { colorMode } = useColorMode();
  const { teamState } = useTeamStateContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const hoverBgColor = colorMode === "dark" ? "darkMain.300" : "darkMain.200";
  const currentTeam = teamState.teams.find(
    (team) => team.id === teamState.defaultTeamId
  );

  function handleClickToSeeEveryTasks(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <Box color="lightMain.200" fontWeight="semibold" pl="10px" pr="3">
      <Flex height="35px" alignItems="center" cursor="pointer" pl="2">
        <Box>Spaces</Box>
      </Flex>

      <Flex
        py="1"
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

      <Box>
        {currentTeam?.spaceList?.map((space) => (
          <Box key={space.id}>
            <Space space={space} />
          </Box>
        ))}
      </Box>

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
