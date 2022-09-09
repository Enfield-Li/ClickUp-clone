import { AUTH } from "../../utils/constant";

export const authInitialState: AuthStateType = { user: null };

export type AuthContextType = {
  state: AuthStateType;
  dispatch: React.Dispatch<AuthActionType>;
};

export type AuthStateType = {
  user: User | null;
};

export type User = {
  username: string;
  password: string;
};

export type AuthActionType = LogInUser | LogOutUser;

type LogInUser = { type: typeof AUTH.LOGIN_USER; payload: User };
type LogOutUser = { type: typeof AUTH.LOGOUT_USER };
