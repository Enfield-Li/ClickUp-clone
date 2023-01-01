import { WritableDraft } from "immer/dist/internal";
import { determineFolderType } from "../../component/layout/subNavbar/folderAndList/determineList";
import { TeamStateType, Team, ListCategory } from "../../types";
import { deepCopy } from "../../utils/deepCopy";
import { errorMsg } from "./TeamReducer";

type UpdateCurrentTeamParam = {
  draftState: WritableDraft<TeamStateType>;
  teamId: number;
};

export function updateActiveTeamState(
  updateCurrentTeamParam: UpdateCurrentTeamParam
) {
  const { draftState, teamId } = updateCurrentTeamParam;

  const targetTeam = draftState.teams.find((team) => team.id === teamId);
  const targetTeamActivity = draftState.panelActivity!.teamActivities.find(
    (teamActivity) => teamActivity.teamId === teamId
  );
  if (!targetTeam || !targetTeamActivity)
    throw new Error(
      errorMsg + "target team or targetTeamActivity does not exist"
    );

  const { folderIds, listId, spaceId } = targetTeamActivity;
  validateTeamActivities({
    draftState,
    teamId,
    spaceId,
    folderIds,
    listId,
  });

  // Selected state
  draftState.activeTeamState.selectedListId = listId;
  draftState.activeTeamState.selectedTeamId = teamId;

  // Opened state
  draftState.teams.forEach(
    (team) =>
      team.id === teamId &&
      team.spaces.forEach((space) => {
        if (space.id === spaceId) {
          space.isOpen = true;

          space.allListOrFolder.forEach((listOrFolder) => {
            const isFolder = determineFolderType(listOrFolder);

            if (isFolder && folderIds.includes(listOrFolder.id)) {
              listOrFolder.isOpen = true;

              listOrFolder.allLists.forEach((list) => {
                initStatusColumnAndSelectedSpaceId(
                  draftState,
                  team,
                  list,
                  listId,
                  space.id
                );
              });
            } else if (!isFolder) {
              initStatusColumnAndSelectedSpaceId(
                draftState,
                team,
                listOrFolder,
                listId,
                space.id
              );
            }
          });
        }
      })
  );
}

function initStatusColumnAndSelectedSpaceId(
  draftState: WritableDraft<TeamStateType>,
  team: WritableDraft<Team>,
  list: ListCategory,
  selectedListId: number | null,
  spaceId: number
) {
  if (list.id === selectedListId) {
    draftState.activeTeamState.selectedSpaceId = spaceId;

    const statusColumnCategory = team.teamStatusColumns?.find(
      (category) => category.id === list.statusColumnsCategoryId
    );
    if (!statusColumnCategory) throw new Error(errorMsg);

    draftState.activeTeamState.currentStatusColumns =
      statusColumnCategory.statusColumns;
  }
}

type ValidateTeamParam = {
  draftState: WritableDraft<TeamStateType>;
  teamId: number;
  folderIds: number[];
  listId: number | null;
  spaceId: number | null;
};

function validateTeamActivities({
  draftState,
  teamId,
  spaceId,
  folderIds,
  listId,
}: ValidateTeamParam) {
  const targetTeam = draftState.teams.find((team) => team.id === teamId);
  if (!targetTeam) throw new Error(errorMsg + "target team does not exist!");

  const targetSpace = targetTeam.spaces.find((space) => space.id === spaceId);
  if (spaceId !== null && !targetSpace)
    throw new Error(errorMsg + "target space does not exist!");

  for (const folderId of folderIds) {
    const allFolderOrLists: number[] = [];

    targetTeam.spaces.forEach((space) => {
      space.allListOrFolder.forEach((listOrFolder) => {
        const isFolder = determineFolderType(listOrFolder);
        allFolderOrLists.push(listOrFolder.id);

        if (isFolder) {
          listOrFolder.allLists.forEach((list) =>
            allFolderOrLists.push(list.id)
          );
        }
      });
    });

    const isFolderIdExist = allFolderOrLists.find(
      (allFolderOrListsId) => allFolderOrListsId === folderId
    );
    const isListIdExist = allFolderOrLists.find(
      (allFolderOrListsId) => allFolderOrListsId === listId
    );

    if (!isFolderIdExist || !isListIdExist)
      throw new Error(errorMsg + "target folder or list does not exist!");
  }
}
