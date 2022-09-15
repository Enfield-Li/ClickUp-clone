import { AUTH } from "../../utils/constant";

export const authInitialState: AuthStateType = {};

export type AuthContextType = {
  authState: AuthStateType;
  authDispatch: React.Dispatch<AuthActionType>;
};

export type AuthStateType = {
  user?: User;
};

export type User = {
  username: string;
  password: string;
};

export type AuthActionType = LogInUser | LogOutUser;

type LogInUser = { type: typeof AUTH.LOGIN_USER; payload: User };
type LogOutUser = { type: typeof AUTH.LOGOUT_USER };
