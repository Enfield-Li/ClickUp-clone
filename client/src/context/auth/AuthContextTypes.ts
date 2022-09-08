import { LOGIN_USER, LOGOUT_USER } from "../../utils/constant";

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

type LogInUser = { type: typeof LOGIN_USER; payload: User };
type LogOutUser = { type: typeof LOGOUT_USER };
