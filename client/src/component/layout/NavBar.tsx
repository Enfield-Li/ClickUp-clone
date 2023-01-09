import {
  Box,
  Flex,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { memo, useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { CLIENT_ROUTE } from "../../constant";
import useAuthContext from "../../context/auth/useAuthContext";
import useTeamStateContext from "../../context/team/useTeamContext";
import { fetchTeamList } from "../../networkCalls";
import { TEAM_STATE_ACTION } from "../../types";
import { getTaskBoardURL } from "../../utils/getTaskBoardURL";
import FixedNavBar from "./navbar/FixedNavBar";
import SubNavbar from "./subNavbar/SubNavbar";

type Props = {};

export default memo(NavBar);
function NavBar({}: Props) {
  const toast = useToast();
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { authState, authDispatch } = useAuthContext();
  const { teamStateDispatch } = useTeamStateContext();

  const collapsibleBG = useColorModeValue("white", "rgb(26, 32, 44)");

  const [isExpanded, setIsExpanded] = useState(false);
  const { getDisclosureProps, isOpen, onClose, onOpen } = useDisclosure({
    defaultIsOpen: false,
  });

  // init spaceListState
  useEffect(() => {
    if (authState.user && teamId) {
      fetchTeamList(
        teamId,
        (initTeamListDTO) => {
          const { listId, teamId, spaceId } = initTeamListDTO.teamActivity;
          navigate(getTaskBoardURL({ teamId, spaceId, listId }));

          teamStateDispatch({
            type: TEAM_STATE_ACTION.INIT_TEAM_STATE,
            payload: initTeamListDTO,
          });
        },
        (msg) => {
          toast({ description: msg });
        }
      );
    }
  }, [authState.user, teamId]);

  return (
    <Flex as="nav" onMouseOutCapture={isExpanded ? undefined : onClose}>
      {/* Fixed navbar */}
      <FixedNavBar
        onOpen={onOpen}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
      />

      {/* Sub navbar */}
      <NavLink to={CLIENT_ROUTE.TASK_BOARD}>
        {({ isActive }) =>
          isActive && (
            <Box
              zIndex="2"
              opacity="100%"
              onMouseOverCapture={onOpen}
              backgroundColor={collapsibleBG}
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
          )
        }
      </NavLink>
    </Flex>
  );
}
