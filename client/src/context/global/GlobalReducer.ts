import {
  GlobalStateType,
  GlobalActionType,
  GLOBAL_ACTION,
} from "./GlobalContextTypes";

export default function globalReducer(
  state: GlobalStateType,
  action: GlobalActionType
) {
  switch (action.type) {
    case GLOBAL_ACTION.NEW_ERROR: {
      return { ...state, error: action.payload };
    }

    case GLOBAL_ACTION.LOADING_STATE: {
      return { ...state, loading: action.payload };
    }

    default: {
      return state;
    }
  }
}
