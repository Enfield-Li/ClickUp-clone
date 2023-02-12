import { useToast } from "@chakra-ui/toast";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { TEAM_ACTIVITY } from "../constant";
import useAuthContext from "../context/auth/useAuthContext";
import { useCurrentListStore } from "../context/newDefaultColumnIdStore/useCurrentListStore";
import useTeamStateContext from "../context/team/useTeamContext";
import { fetchTeamList } from "../networkCalls";
import { TeamActiveStatus, TEAM_STATE_ACTION } from "../types";
import { getTaskBoardURL } from "../utils/getTaskBoardURL";

export default function useInitSpaceList() {
  const toast = useToast();
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { authState } = useAuthContext();
  const { teamStateDispatch } = useTeamStateContext();
  const { updateDefaultCategoryId } = useCurrentListStore();

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

          updateDefaultCategoryId(defaultStatusCategoryId);
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
}
