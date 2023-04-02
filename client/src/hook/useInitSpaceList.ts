import { useToast } from "@chakra-ui/toast";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { TEAM_ACTIVITY } from "../constant";
import { useAuth } from "../context/auth/useAuth";
import { useCurrentListStore } from "../context/currentListStore/useCurrentListStore";
import { useTeam } from "../context/team/useTeam";
import { fetchTeamList } from "../networkCalls";
import { TeamActiveStatus } from "../types";
import { getTaskBoardURL } from "../utils/getTaskBoardURL";

export default function useInitSpaceList() {
  const toast = useToast();
  const navigate = useNavigate();

  const { user } = useAuth();
  const { teamId, listId } = useParams();
  const { teamActiveStatus, initTeamState, updateListDefaultStatusCategoryId } =
    useTeam();
  const { storedDefaultCategoryId, updateStoredDefaultCategoryId } =
    useCurrentListStore();

  // clear stored default category id when listId changes
  useEffect(() => {
    updateStoredDefaultCategoryId(0);
  }, [listId]);

  // sync current list's defaultStatusCategoryId after adding new column
  const teamActiveStatusCategoryId = teamActiveStatus.defaultStatusCategoryId;
  useEffect(() => {
    const isStoredDefaultCategoryIdUpdated =
      storedDefaultCategoryId &&
      teamActiveStatusCategoryId &&
      teamActiveStatusCategoryId !== storedDefaultCategoryId;

    if (isStoredDefaultCategoryIdUpdated) {
      updateListDefaultStatusCategoryId(storedDefaultCategoryId);
    }
  }, [storedDefaultCategoryId, teamActiveStatusCategoryId]);

  // init spaceListState
  useEffect(() => {
    if (teamId && user) {
      fetchTeamList(
        Number(teamId),
        (teams) => {
          const initTeamActivity: TeamActiveStatus = {
            folderIds: [],
            listId: undefined,
            spaceId: undefined,
            teamId: Number(teamId),
            defaultStatusCategoryId: undefined,
          };
          const storedUserActivity = localStorage.getItem(
            `${TEAM_ACTIVITY}_${teamId}`
          );

          const userActivity = storedUserActivity
            ? (JSON.parse(storedUserActivity) as TeamActiveStatus)
            : initTeamActivity;
          let { listId, spaceId } = userActivity;

          if (listId) {
            teams.forEach(
              (team) =>
                team.id === Number(teamId) &&
                team.spaces.forEach((space) => {
                  space.listCategories.forEach((listCategory) => {
                    if (listCategory.id === listId) {
                      spaceId = space.id;
                      userActivity.defaultStatusCategoryId =
                        listCategory.defaultStatusCategoryId;
                    }
                  });

                  space.folderCategories.forEach((folderCategory) =>
                    folderCategory.allLists.forEach((listCategory) => {
                      if (listCategory.id === listId) {
                        spaceId = space.id;
                        userActivity.defaultStatusCategoryId =
                          listCategory.defaultStatusCategoryId;
                      }
                    })
                  );
                })
            );
          }

          navigate(getTaskBoardURL({ teamId, spaceId, listId }), {
            state: {
              defaultStatusCategoryId: userActivity.defaultStatusCategoryId,
            },
            replace: true,
          });
          initTeamState({ teams, teamActivity: userActivity });
        },
        (msg) => {
          toast({ description: msg });
        }
      );
    }
  }, [user, teamId]);
}
