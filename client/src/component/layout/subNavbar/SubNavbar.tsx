import {
  Box,
  Center,
  Flex,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { memo, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CLIENT_ROUTE } from "../../../constant";
import useTeamStateContext from "../../../context/team/useTeamContext";
import SubNavbarContent from "./SubNavbarContent";

type Props = {
  isOpen: boolean;
  isExpanded: boolean;
  onClose: () => void;
  getDisclosureProps: (props?: any) => any;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
};

export default memo(SubNavbar);
function SubNavbar({
  isOpen,
  onClose,
  isExpanded,
  setIsExpanded,
  getDisclosureProps,
}: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const { teamState } = useTeamStateContext();
  const [hidden, setHidden] = useState(!isOpen);

  const subNavWidth = "250px";
  const collapseIcon = useColorModeValue("white", "darkMain.200");
  const subNavBGColor = useColorModeValue("darkMain.400", "darkMain.200");
  const collapseIconBorder = useColorModeValue("gray.300", "darkMain.300");
  const collapseIconArrow = useColorModeValue("darkMain.300", "lightMain.100");

  const currentTeam = teamState.teams.find(
    (team) => team.id === teamState.activeTeamState.selectedTeamId
  );
  //   console.log(currentTeam);

  const selectedListId = teamState.activeTeamState.selectedListId
    ? teamState.activeTeamState.selectedListId
    : currentTeam?.spaces.length
    ? 0
    : -1;

  // sync up url with openedListId
  useEffect(() => {
    if (teamState.teams.length) {
      navigate(CLIENT_ROUTE.TASK_BOARD + `/${selectedListId}`, {
        replace: true,
        state: selectedListId
          ? {
              statusColumns: teamState.activeTeamState.currentStatusColumns,
            }
          : null,
      });
    }
  }, [teamState]);

  function handleCloseSubNavbar() {
    onClose();
    setIsExpanded(false);
  }

  return (
    // https://chakra-ui.com/community/recipes/horizontal-collapse
    <motion.div
      {...getDisclosureProps()}
      hidden={hidden}
      initial={false}
      transition="none"
      onAnimationStart={() => setHidden(false)}
      animate={{ width: isOpen ? subNavWidth : 0 }}
      onAnimationComplete={() => setHidden(!isOpen)}
      style={{ overflow: !isExpanded ? "hidden" : "", whiteSpace: "nowrap" }}
    >
      <Box
        height="100vh"
        borderRightWidth="1px"
        borderColor="darkMain.400"
        backgroundColor={subNavBGColor}
      >
        {/* Close icon */}
        {isExpanded && (
          <Center cursor="pointer" onClick={handleCloseSubNavbar}>
            <Center
              zIndex="3"
              pr="1.5px"
              mt="128px"
              ml={subNavWidth}
              border="1px"
              width="20px"
              height="20px"
              rounded="full"
              fontSize="11px"
              position="absolute"
              color={collapseIconArrow}
              backgroundColor={collapseIcon}
              borderColor={collapseIconBorder}
            >
              <i className="bi bi-chevron-left"></i>
            </Center>
          </Center>
        )}

        <Flex>
          {/* App icon */}
          <Center py={3}>
            <Heading size="md" px={5}>
              <Box cursor="pointer" onClick={() => navigate(CLIENT_ROUTE.HOME)}>
                Ideas
              </Box>
            </Heading>
          </Center>
        </Flex>

        {/* Content */}
        <SubNavbarContent currentTeam={currentTeam} />
      </Box>
    </motion.div>
  );
}
