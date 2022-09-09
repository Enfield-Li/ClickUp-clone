import { GLOBAL } from "../../utils/constant";
import { GlobalStateType, GlobalActionType } from "./GlobalContextTypes";

export default function globalReducer(
  state: GlobalStateType,
  action: GlobalActionType
) {
  switch (action.type) {
    case GLOBAL.UPDATE_GLOBAL_STATE: {
      return { ...state, attr: "updated to " + action.payload };
    }

    default: {
      return state;
    }
  }
}
