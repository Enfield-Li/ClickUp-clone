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
  type: typeof GLOBAL_ACTION.NEW_ERROR;
  payload: string;
};

type IndicateLoadingState = {
  type: typeof GLOBAL_ACTION.LOADING_STATE;
  payload: boolean;
};

export const GLOBAL_ACTION = {
  NEW_ERROR: "NEW_ERROR",
  LOADING_STATE: "LOADING_STATE",
} as const;
