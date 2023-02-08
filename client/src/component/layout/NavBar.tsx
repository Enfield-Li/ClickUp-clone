import {
  Box,
  Flex,
  space,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { memo, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  CLIENT_ROUTE,
  CURRENT_STATUS_CATEGORY_ID,
  IS_SUB_NAV_OPEN,
  TEAM_ACTIVITY,
} from "../../constant";
import useAuthContext from "../../context/auth/useAuthContext";
import useTeamStateContext from "../../context/team/useTeamContext";
import { fetchTeamList } from "../../networkCalls";
import { TeamActiveStatus, TEAM_STATE_ACTION } from "../../types";
import { getTaskBoardURL } from "../../utils/getTaskBoardURL";
import FixedNavBar from "./navbar/FixedNavBar";
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

  const storedSubNavBarOpenState = localStorage.getItem(IS_SUB_NAV_OPEN);
  const defaultOpenState = storedSubNavBarOpenState
    ? JSON.parse(storedSubNavBarOpenState)
    : false;
  const [isExpanded, setIsExpanded] = useState(defaultOpenState);
  const { getDisclosureProps, isOpen, onClose, onOpen } = useDisclosure({
    defaultIsOpen: defaultOpenState,
  });

  // init spaceListState
  useEffect(() => {
    if (authState.user && teamId) {
      fetchTeamList(
        Number(teamId),
        (teams) => {
          const initTeamActivity: TeamActiveStatus = {
            teamId: Number(teamId),
            spaceId: 0,
            listId: 0,
            folderIds: [],
          };
          const storedUserActivity = localStorage.getItem(
            `${TEAM_ACTIVITY}_${teamId}`
          );

          const userActivity = storedUserActivity
            ? (JSON.parse(storedUserActivity) as TeamActiveStatus)
            : initTeamActivity;
          let { listId, spaceId } = userActivity;

          let defaultStatusCategoryId: number | undefined;
          if (listId) {
            teams.forEach(
              (team) =>
                team.id === Number(teamId) &&
                team.spaces.forEach((space) => {
                  space.listCategories.forEach((listCategory) => {
                    if (listCategory.id === listId) {
                      spaceId = space.id;
                      defaultStatusCategoryId =
                        listCategory.defaultStatusCategoryId;
                    }
                  });

                  space.folderCategories.forEach((folderCategory) =>
                    folderCategory.allLists.forEach((listCategory) => {
                      if (listCategory.id === listId) {
                        spaceId = space.id;
                        defaultStatusCategoryId =
                          listCategory.defaultStatusCategoryId;
                      }
                    })
                  );
                })
            );
          }

          navigate(getTaskBoardURL({ teamId, spaceId, listId }), {
            state: { defaultStatusCategoryId },
            replace: true,
          });

          teamStateDispatch({
            type: TEAM_STATE_ACTION.INIT_TEAM_STATE,
            payload: { teams, teamActivity: userActivity },
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
