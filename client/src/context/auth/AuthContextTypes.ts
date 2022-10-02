import { AUTH_ACTION } from "../../utils/constant";

export const authInitialState: AuthStateType = {};

export type AuthContextType = {
  authState: AuthStateType;
  authDispatch: React.Dispatch<AuthActionType>;
};

export type AuthStateType = {
  user?: User;
};

export type Credentials = {
  username: string;
  password: string;
};

export type FieldError = {
  field: string;
  message: string;
};

export type FieldErrors = FieldError[];

export type LogInError = {
  status: number;
  message: string;
  errors: FieldError[];
};

export type User = {
  id: number;
  username: string;
};

export type UserResponse = {
  id: number;
  username: string;
  accessToken: string;
};

export type AuthActionType = LogInUser | LogOutUser;

type LogInUser = { type: typeof AUTH_ACTION.LOGIN_USER; payload: User };
type LogOutUser = { type: typeof AUTH_ACTION.LOGOUT_USER };
