import React, { useEffect } from "react";
import { useTeam } from "../stores/useTeam";
import { shareLinkDataUrl } from "../media/imgDataUrl";
import { fetchTeamList } from "../utils/networkCalls";
import { useAuth } from "../stores/useAuth";
import { TeamActiveStatus } from "../types";
import { TEAM_ACTIVITY } from "../utils/constant";
import { retriveTeamActiveStatusToStorage } from "../utils/asyncStorage";

type Props = {};

export default function useInitTeams() {
  const { user } = useAuth();
  const { initTeamState } = useTeam();
  const teamId = user?.defaultTeamId;

  useEffect(() => {
    if (teamId) {
      fetchTeamList(user.defaultTeamId, async (teams) => {
        const initTeamActivity: TeamActiveStatus = {
          folderIds: [],
          listId: undefined,
          spaceId: undefined,
          teamId: Number(teamId),
          defaultStatusCategoryId: undefined,
        };
        const storedUserActivity = await retriveTeamActiveStatusToStorage(
          teamId
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

        initTeamState({ teams, teamActivity: userActivity });
      });
    }
  }, [teamId]);
}
