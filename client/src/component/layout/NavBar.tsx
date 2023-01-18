import {
  Box,
  Flex,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { memo, useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { CLIENT_ROUTE } from "../../constant";
import useAuthContext from "../../context/auth/useAuthContext";
import useTeamStateContext from "../../context/team/useTeamContext";
import { fetchTeamList } from "../../networkCalls";
import { TEAM_STATE_ACTION } from "../../types";
import { getTaskBoardURL } from "../../utils/getTaskBoardURL";
import FixedNavBar from "./navbar/FixedNavBar";
import { determineFolderType } from "./subNavbar/folderAndList/determineList";
import SubNavbar from "./subNavbar/SubNavbar";

type Props = {};

export default memo(NavBar);
function NavBar({}: Props) {
  const toast = useToast();
  const { teamId } = useParams();
  const location = useLocation();
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
        Number(teamId),
        (initTeamListDTO) => {
          const { teams, teamActivity } = initTeamListDTO;
          const { listId, teamId, spaceId } = teamActivity;

          let defaultStatusCategoryId;
          if (listId) {
            const statusCategoryId = teams
              .find((team) => team.id === teamId)
              ?.spaces.find((space) => space.id === spaceId)
              ?.listCategories.find(
                (list) => list.id === listId
              )?.defaultStatusCategoryId;

            if (Number(statusCategoryId)) {
              defaultStatusCategoryId = statusCategoryId;
            }
          }

          navigate(getTaskBoardURL({ teamId, spaceId, listId }), {
            state: { defaultStatusCategoryId },
          });

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
      {location.pathname.includes(CLIENT_ROUTE.TASK_BOARD) && (
        <Box
          zIndex="2"
          left="55px"
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
      )}
    </Flex>
  );
}
