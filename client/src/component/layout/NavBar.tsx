import { Box, Flex, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { memo, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CLIENT_ROUTE } from "../../constant";
import useAuthContext from "../../context/auth/useAuthContext";
import TeamStateProvider from "../../context/team/TeamContext";
import useTeamStateContext from "../../context/team/useTeamContext";
import { Section } from "../../routes/ApplicationEntry";
import { TEAM_STATE_ACTION } from "../../types";
import { fetchTeamListLocal } from "../task/actions/fetchSpaceList";
import FixedNavBar from "./navbar/FixedNavBar";
import SubNavbar from "./subNavbar/SubNavbar";

type Props = {
  currentSection: Section;
  setCurrentSection: React.Dispatch<React.SetStateAction<Section>>;
};

export default memo(NavBar);
function NavBar({ currentSection, setCurrentSection }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const { authState } = useAuthContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const [subNavOpenable, setSubNavOpenable] = useState(true);
  const { teamStateDispatch, teamState } = useTeamStateContext();

  const fixedNavbarWidth = "55px";
  const collapsibleBG = useColorModeValue("white", "rgb(26, 32, 44)");
  const { getDisclosureProps, isOpen, onClose, onOpen } = useDisclosure({
    defaultIsOpen: false,
  });

  // Sync up url with currentSection taskState after user refresh page
  useEffect(() => {
    if (location.pathname.includes("task")) {
      setCurrentSection(Section.TASKS);
    } else if (location.pathname.includes("test_dev")) {
      setCurrentSection(Section.DEV);
    }
  }, []);

  // init spaceListState
  useEffect(() => {
    if (authState.user && !teamState.teams.length) {
      const {
        teamIds,
        defaultTeamId,
        defaultSpaceId,
        defaultFolderId,
        defaultListId,
      } = authState.user;

      teamStateDispatch({
        type: TEAM_STATE_ACTION.INIT_TEAM_STATE,
        payload: {
          teams: fetchTeamListLocal(teamIds),
          defaultTeamId,
          defaultSpaceId,
          defaultFolderId,
          defaultListId,
        },
      });
    }
  }, [authState.user, teamState]);

  return (
    <Flex as="nav" onMouseOutCapture={isExpanded ? undefined : onClose}>
      {/* Fixed navbar */}
      <FixedNavBar
        onOpen={onOpen}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        currentSection={currentSection}
        fixedNavbarWidth={fixedNavbarWidth}
        setCurrentSection={setCurrentSection}
      />

      {/* Sub navbar */}
      {currentSection === Section.TASKS && (
        <Box
          zIndex="2"
          opacity="100%"
          backgroundColor={collapsibleBG}
          ml={isExpanded ? undefined : fixedNavbarWidth}
          position={isExpanded ? undefined : "absolute"}
          onMouseOverCapture={subNavOpenable ? onOpen : undefined}
        >
          <SubNavbar
            isOpen={isOpen}
            onClose={onClose}
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
            setSelectable={setSubNavOpenable}
            getDisclosureProps={getDisclosureProps}
          />
        </Box>
      )}
    </Flex>
  );
}
