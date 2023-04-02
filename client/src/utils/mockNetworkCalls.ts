import { ACCESS_TOKEN } from "../constant";
import { AuthActionType, RegisterUserDTO } from "../types";
import { teams } from "./mockData";

export function fetchTeamListLocal() {
  //   return { teams, initPanelActivity };
}

export async function registerUserLocal(
  registerCredentials: RegisterUserDTO,
  dispatch: React.Dispatch<AuthActionType>
) {
  const { email, username } = registerCredentials;

  localStorage.setItem(ACCESS_TOKEN, "abc");
  //   dispatch({
  //     type: AUTH_ACTION.LOGIN_USER,
  //     payload: {
  //       user: {
  //         id: 1,
  //         email,
  //         username,
  //         accessToken: "a",
  //         color: "yellow",
  //         joinedTeamCount: 1,
  //       },
  //     },
  //   });
}

export async function refreshUserTokenLocal(
  dispatch: React.Dispatch<AuthActionType>
) {
  // store accessToken to localStorage
  localStorage.setItem(ACCESS_TOKEN, "abc");

  // update auth taskState
  //   dispatch({
  //     type: AUTH_ACTION.LOGIN_USER,
  //     payload: {
  //       user: {
  //         id: 1,
  //         username: "mockUser",
  //         email: "mockUser@email.com",
  //         joinedTeamCount: 1,
  //         accessToken: "abc",
  //         color: "blue",
  //       },
  //     },
  //   });
}
