import { Box, Flex, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { memo, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useAuthContext from "../../context/auth/useAuthContext";
import useTeamStateContext from "../../context/team/useTeamContext";
import { initPanelActivity } from "../../hook/mockData";
import { Section } from "../../ApplicationEntry";
import { TEAM_STATE_ACTION } from "../../types";
import { fetchTeamListLocal } from "../task/actions/fetchSpaceList";
import FixedNavBar from "./navbar/FixedNavBar";
import SubNavbar from "./subNavbar/SubNavbar";

type Props = {
  selectedSection: Section;
  setSelectedSection: React.Dispatch<React.SetStateAction<Section>>;
};

export default memo(NavBar);
function NavBar({ selectedSection, setSelectedSection }: Props) {
  const location = useLocation();
  const { authState } = useAuthContext();
  const { teamState, teamStateDispatch } = useTeamStateContext();

  const fixedNavbarWidth = "55px";
  const collapsibleBG = useColorModeValue("white", "rgb(26, 32, 44)");

  const [isExpanded, setIsExpanded] = useState(false);
  const { getDisclosureProps, isOpen, onClose, onOpen } = useDisclosure({
    defaultIsOpen: false,
  });

  // Sync up url with selectedSection taskState after user refresh page
  useEffect(() => {
    if (location.pathname.includes("task")) {
      setSelectedSection(Section.TASKS);
    } else if (location.pathname.includes("test_dev")) {
      setSelectedSection(Section.DEV);
    }
  }, []);

  // init spaceListState
  useEffect(() => {
    if (authState.user && !teamState.teams.length) {
      const { joinedTeamIds: teamIds } = authState.user;

      teamStateDispatch({
        type: TEAM_STATE_ACTION.INIT_TEAM_STATE,
        payload: {
          teams: fetchTeamListLocal(teamIds),
          panelActivity: initPanelActivity,
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
        selectedSection={selectedSection}
        fixedNavbarWidth={fixedNavbarWidth}
        setSelectedSection={setSelectedSection}
      />

      {/* Sub navbar */}
      {selectedSection === Section.TASKS && (
        <Box
          zIndex="2"
          opacity="100%"
          onMouseOverCapture={onOpen}
          backgroundColor={collapsibleBG}
          ml={isExpanded ? undefined : fixedNavbarWidth}
          position={isExpanded ? undefined : "absolute"}
        >
          <SubNavbar
            isOpen={isOpen}
            onClose={onClose}
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
            getDisclosureProps={getDisclosureProps}
          />
        </Box>
      )}
    </Flex>
  );
}
