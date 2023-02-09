import {
  Box,
  Center,
  Flex,
  Heading,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { memo, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CLIENT_ROUTE,
  IS_SUB_NAV_OPEN,
  TEAM_ACTIVITY,
} from "../../../constant";
import useAuthContext from "../../../context/auth/useAuthContext";
import useTeamStateContext from "../../../context/team/useTeamContext";
import { fetchTeamList } from "../../../networkCalls";
import { TeamActiveStatus, TEAM_STATE_ACTION } from "../../../types";
import { getTaskBoardURL } from "../../../utils/getTaskBoardURL";
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
  const toast = useToast();
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { authState } = useAuthContext();
  const { teamState } = useTeamStateContext();
  const { teamStateDispatch } = useTeamStateContext();
  const currentTeam = teamState.teamsForRender.find((team) => team.isSelected);

  const [hidden, setHidden] = useState(!isOpen);

  const subNavWidth = "250px";
  const collapseIcon = useColorModeValue("white", "darkMain.200");
  const subNavBGColor = useColorModeValue("darkMain.400", "darkMain.200");
  const collapseIconBorder = useColorModeValue("gray.300", "darkMain.300");
  const collapseIconArrow = useColorModeValue("darkMain.300", "lightMain.100");

  function handleCloseSubNavbar() {
    onClose();
    setIsExpanded(false);
    localStorage.setItem(IS_SUB_NAV_OPEN, JSON.stringify(false));
  }

  // init spaceListState
  useEffect(() => {
    if (teamId && authState.user) {
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
              mt="123px"
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
