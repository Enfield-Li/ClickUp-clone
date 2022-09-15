import { GLOBAL } from "../../utils/constant";
import { GlobalStateType, GlobalActionType } from "./GlobalContextTypes";

export default function globalReducer(
  state: GlobalStateType,
  action: GlobalActionType
) {
  switch (action.type) {
    case GLOBAL.NEW_ERROR: {
      return { ...state, error: action.payload };
    }

    default: {
      return state;
    }
  }
}
