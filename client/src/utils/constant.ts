export const BEARER = "Bearer";
export const ACCESS_TOKEN = "access token";

const LOGIN = "/login";
const LOGOUT = "/logout";
const REGISTER = "/register";
const REFRESH_TOKEN = "/refresh_token";

const AUTH_ENDPOINT = "http://localhost:8083";
const AUTH_API_VERSION = "/authorization/v1/user";

export const API_ENDPOINT = {
  AUTH_ENDPOINT_LOGIN: AUTH_ENDPOINT + AUTH_API_VERSION + LOGIN,
  AUTH_ENDPOINT_LOGOUT: AUTH_ENDPOINT + AUTH_API_VERSION + LOGOUT,
  AUTH_ENDPOINT_REGISTER: AUTH_ENDPOINT + AUTH_API_VERSION + REGISTER,
  AUTH_ENDPOINT_REFRESH_TOKEN: AUTH_ENDPOINT + AUTH_API_VERSION + REFRESH_TOKEN,
};

export const ROUTE = {
  HOME: "/",
  ABOUT: "/about",
  LOGIN: "/login",
  REGISTER: "/register",
  FUNC_ONE: "/functionality_one",
  FUNC_TWO: "/functionality_two",
};

export const GLOBAL_ACTION = {
  NEW_ERROR: "NEW_ERROR",
  LOADING_STATE: "LOADING_STATE",
} as const;

export const AUTH_ACTION = {
  LOGIN_USER: "LOGIN_USER",
  LOGOUT_USER: "LOGOUT_USER",
} as const;
