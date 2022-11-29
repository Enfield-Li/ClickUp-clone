import { SpaceListStateType, SpaceListActionType } from "../../types";

export default function spaceListReducer(
  spaceListState: SpaceListStateType,
  action: SpaceListActionType
) {
  switch (action.type) {
    // case GLOBAL_ACTION.NEW_ERROR: {
    //   return { ...taskState, error: action.payload };
    // }

    // case GLOBAL_ACTION.LOADING_STATE: {
    //   return { ...taskState, loading: action.payload };
    // }

    default: {
      return spaceListState;
    }
  }
}
