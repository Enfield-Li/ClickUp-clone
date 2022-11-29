import produce from "immer";
import { determineFolderType } from "../../component/layout/subNavbar/folderAndList/determineList";
import {
  SpaceListStateType,
  SpaceListActionType,
  SPACE_LIST_ACTION,
} from "../../types";

export default function spaceListReducer(
  spaceListState: SpaceListStateType,
  action: SpaceListActionType
) {
  switch (action.type) {
    case SPACE_LIST_ACTION.INIT_SPACE_LIST: {
      return produce(spaceListState, (draftState) => {
        const { spaceList } = action.payload;
        draftState.spaceList = spaceList;

        spaceList.forEach((space) => {
          space.allListOrFolder.forEach((listOrFolder) => {
            // isSelected list is under space
            if (listOrFolder.isSelected) {
              draftState.openedListId = listOrFolder.id;
              // isSelected list is under folder
            } else if (determineFolderType(listOrFolder)) {
              listOrFolder.allLists.forEach((list) => {
                if (list.isSelected) {
                  draftState.openedListId = list.id;
                }
              });
            }
          });
        });
      });
    }

    case SPACE_LIST_ACTION.UPDATE_OPENED_SPACE: {
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

    case SPACE_LIST_ACTION.UPDATE_OPENED_FOLDER: {
      return produce(spaceListState, (draftState) => {
        const { spaceId, folderId } = action.payload;

        draftState.spaceList?.forEach((space) => {
          if (space.id === spaceId) {
            space.allListOrFolder.forEach((listOrFolder) => {
              if (
                listOrFolder.id === folderId &&
                determineFolderType(listOrFolder)
              ) {
                listOrFolder.isOpen = true;
              }
            });
          }
        });
      });
    }

    case SPACE_LIST_ACTION.UPDATE_SELECTED_LIST: {
      return produce(spaceListState, (draftState) => {
        const { listId } = action.payload;

        draftState.openedListId = listId;
        draftState.spaceList?.forEach((space) =>
          space.allListOrFolder.forEach((listOrFolder) => {
            if (listOrFolder.id === listId) {
              listOrFolder.isSelected = false;
            }
            if (determineFolderType(listOrFolder)) {
              listOrFolder.allLists.forEach(
                (list) => list.id === listId && (list.isSelected = false)
              );
            }
          })
        );
      });
    }

    case SPACE_LIST_ACTION.UPDATE_SELECTED_FOLDER: {
      throw new Error("not implemented");
    }

    case SPACE_LIST_ACTION.UPDATE_SELECTED_SPACE: {
      throw new Error("not implemented");
    }

    default: {
      return spaceListState;
    }
  }
}
