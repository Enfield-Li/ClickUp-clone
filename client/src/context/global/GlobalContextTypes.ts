import { GLOBAL } from "../../utils/constant";

export type GlobalContextType = {
  globalState: GlobalStateType;
  globalDispatch: React.Dispatch<GlobalActionType>;
};

export const globalInitialState: GlobalStateType = {};

export type GlobalStateType = {
  error?: string;
  loading?: boolean;
};

export type GlobalActionType = NewErrorState | IndicateLoadingState;

type NewErrorState = {
  type: typeof GLOBAL.NEW_ERROR;
  payload: string;
};

type IndicateLoadingState = {
  type: typeof GLOBAL.LOADING_STATE;
  payload: boolean;
};
