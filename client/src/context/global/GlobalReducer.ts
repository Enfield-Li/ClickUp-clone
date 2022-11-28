import {
  GlobalStateType,
  GlobalActionType,
  GLOBAL_ACTION,
} from "./GlobalContextTypes";

export default function globalReducer(
  taskState: GlobalStateType,
  action: GlobalActionType
) {
  switch (action.type) {
    case GLOBAL_ACTION.NEW_ERROR: {
      return { ...taskState, error: action.payload };
    }

    case GLOBAL_ACTION.LOADING_STATE: {
      return { ...taskState, loading: action.payload };
    }

    default: {
      throw new Error("Illegal action performed in globalReducer");
    }
  }
}
