import produce from "immer";
import determineListType, {
  determineFolderType,
} from "../../component/layout/subNavbar/folderAndList/determineList";
import {
  TeamStateType,
  TeamStateActionType,
  TEAM_STATE_ACTION,
} from "../../types";

export default function spaceListReducer(
  spaceListState: TeamStateType,
  action: TeamStateActionType
) {
  switch (action.type) {
    case TEAM_STATE_ACTION.INIT_SPACE_LIST: {
      return produce(spaceListState, (draftState) => {
        const { spaceList } = action.payload;
        draftState.spaceList = spaceList;

        spaceList.forEach((space) => {
          space.allListOrFolder.forEach((listOrFolder) => {
            const isList = determineListType(listOrFolder);
            const isFolder = determineFolderType(listOrFolder);

            // isSelected list is under space
            if (isList) {
              // push to lookup table
              draftState.lookUpStatusColumns[listOrFolder.id] =
                listOrFolder.statusColumns;

              if (listOrFolder.isSelected) {
                draftState.openedListId = listOrFolder.id;
              }
              // isSelected list is under folder
            } else if (isFolder) {
              listOrFolder.allLists.forEach((list) => {
                // push to lookup table
                draftState.lookUpStatusColumns[list.id] = list.statusColumns;

                if (list.isSelected) {
                  draftState.openedListId = list.id;
                }
              });
            }
          });
        });
      });
    }

    case TEAM_STATE_ACTION.UPDATE_OPENED_SPACE: {
      return produce(spaceListState, (draftState) => {
        const { spaceId } = action.payload;

        draftState.spaceList?.forEach((space) => {
          // update previous space.isOpen to false
          if (space.isOpen && space.id !== spaceId) {
            space.isOpen = false;
          }
          if (space.id === spaceId) {
            space.isOpen = !space.isOpen;
          }
        });
      });
    }

    case TEAM_STATE_ACTION.UPDATE_OPENED_FOLDER: {
      return produce(spaceListState, (draftState) => {
        const { spaceId, folderId } = action.payload;

        draftState.spaceList?.forEach((space) => {
          if (space.id === spaceId) {
            space.allListOrFolder.forEach((listOrFolder) => {
              const isFolder = determineFolderType(listOrFolder);
              const isCurrentFolder = listOrFolder.id === folderId;

              if (isFolder && isCurrentFolder) {
                listOrFolder.isOpen = !listOrFolder.isOpen;
              }
            });
          }
        });
      });
    }

    case TEAM_STATE_ACTION.UPDATE_SELECTED_LIST: {
      return produce(spaceListState, (draftState) => {
        const { listId } = action.payload;

        draftState.openedListId = listId;
        // undo previous selected list
        draftState.spaceList?.forEach((space) =>
          space.allListOrFolder.forEach((listOrFolder) => {
            // list is under space
            if (!determineFolderType(listOrFolder)) {
              const list = listOrFolder;
              if (list.id !== listId) {
                list.isSelected = false;
              } else if (list.id === listId) {
                list.isSelected = true;
              }
            }

            // list is under folder
            else if (determineFolderType(listOrFolder)) {
              listOrFolder.allLists.forEach((list) => {
                if (list.id !== listId) {
                  list.isSelected = false;
                } else if (list.id === listId) {
                  list.isSelected = true;
                }
              });
            }
          })
        );
      });
    }

    case TEAM_STATE_ACTION.UPDATE_SELECTED_FOLDER: {
      throw new Error("not implemented");
    }

    case TEAM_STATE_ACTION.UPDATE_SELECTED_SPACE: {
      throw new Error("not implemented");
    }

    default: {
      return spaceListState;
    }
  }
}
