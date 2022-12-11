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
import useAuthContext from "../../../context/auth/useAuthContext";
import useTeamStateContext from "../../../context/team/useTeamContext";
import { TEAM_STATE_ACTION } from "../../../types";
import { fetchTeamListLocal } from "../../task/actions/fetchSpaceList";
import SubNavbarContent from "./SubNavbarContent";

type Props = {
  isOpen: boolean;
  isExpanded: boolean;
  onClose: () => void;
  getDisclosureProps: (props?: any) => any;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectable: React.Dispatch<React.SetStateAction<boolean>>;
};

export default memo(SubNavbar);
function SubNavbar({
  isOpen,
  onClose,
  isExpanded,
  setIsExpanded,
  setSelectable,
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

  // sync up url with openedListId
  useEffect(() => {
    if (teamState.teams.length) {
      navigate(
        CLIENT_ROUTE.TASK_BOARD +
          `/${teamState.activeTeamState.selectedListId}`,
        {
          replace: true,
          state: {
            isNewUser: location.state?.isNewUser,
            statusColumns: teamState.activeTeamState.currentStatusColumns,
          },
        }
      );
    }
  }, [teamState]);

  function handleCloseSubNavbar() {
    onClose();
    setIsExpanded(false);
    setSelectable(false);

    // Prevent subNav from Collapsing right after opening task page
    setTimeout(() => setSelectable(true), 300);
  }

  return (
    // https://chakra-ui.com/community/recipes/horizontal-collapse
    <motion.div
      {...getDisclosureProps()}
      hidden={hidden}
      initial={false}
      transition="none"
      onAnimationStart={() => setHidden(false)}
      onAnimationComplete={() => setHidden(!isOpen)}
      animate={{ width: isOpen ? subNavWidth : 0 }}
      style={{ overflow: "hidden", whiteSpace: "nowrap" }}
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
        <SubNavbarContent />
      </Box>
    </motion.div>
  );
}
