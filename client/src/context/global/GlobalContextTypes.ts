import { GLOBAL } from "../../utils/constant";

export type GlobalContextType = {
  state: GlobalStateType;
  dispatch: React.Dispatch<GlobalActionType>;
};

export const globalInitialState: GlobalStateType = { attr: "initial state" };

export type GlobalStateType = {
  attr?: string;
};

export type GlobalActionType = UpdateGlobalState;

type UpdateGlobalState = {
  type: typeof GLOBAL.UPDATE_GLOBAL_STATE;
  payload: string;
};
