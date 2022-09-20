export const BEARER = "Bearer";
export const ACCESS_TOKEN = "access token";

const LOGIN = "/login";
const LOGOUT = "/logout";
const REGISTER = "/register";
const REFRESH_TOKEN = "/refresh_token";

const AUTH_ENDPOINT = "http://localhost:8083";
const AUTH_VERSION = "/authorization/v1/user";

export const AUTH_ENDPOINT_LOGIN = AUTH_ENDPOINT + AUTH_VERSION + LOGIN;
export const AUTH_ENDPOINT_LOGOUT = AUTH_ENDPOINT + AUTH_VERSION + LOGOUT;
export const AUTH_ENDPOINT_REGISTER = AUTH_ENDPOINT + AUTH_VERSION + REGISTER;
export const AUTH_ENDPOINT_REFRESH_TOKEN =
  AUTH_ENDPOINT + AUTH_VERSION + REFRESH_TOKEN;

export const ROUTE = {
  HOME: "/",
  ABOUT: "/about",
  LOGIN: "/login",
  FUNC_ONE: "/functionality_one",
  FUNC_TWO: "/functionality_two",
};

export const GLOBAL = {
  NEW_ERROR: "NEW_ERROR",
  LOADING_STATE: "LOADING_STATE",
} as const;

export const AUTH = {
  LOGIN_USER: "LOGIN_USER",
  LOGOUT_USER: "LOGOUT_USER",
} as const;
