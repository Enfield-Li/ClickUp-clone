// Header config
export const BEARER = "Bearer ";
export const ACCESS_TOKEN = "access token";

// API endpoints
const LOGIN = "/login";
const LOGOUT = "/logout";
const REGISTER = "/register";
const REFRESH_TOKEN = "/refresh_token";

export const AUTH_ENDPOINT = "http://localhost:8084";
const AUTH_API_VERSION = "/authorization/v1/user";

const TASK_API_VERSION = "/api/v1/task";
const ALL_TASKS = "/all_tasks";
const UPDATE_TASK_TITLE = "/update_title";
const UPDATE_TASK_DESC = "/update_desc";

export const API_ENDPOINT = {
  AUTH_LOGIN: AUTH_API_VERSION + LOGIN,
  AUTH_LOGOUT: AUTH_API_VERSION + LOGOUT,
  AUTH_REGISTER: AUTH_API_VERSION + REGISTER,
  AUTH_REFRESH_TOKEN: AUTH_API_VERSION + REFRESH_TOKEN,

  TASK: TASK_API_VERSION,
  TASK_ALL_TASKS: TASK_API_VERSION + ALL_TASKS,
  TASK_UPDATE_TITLE: TASK_API_VERSION + UPDATE_TASK_TITLE,
  TASK_UPDATE_DESC: TASK_API_VERSION + UPDATE_TASK_DESC,
};

// Client route
export const ROUTE = {
  HOME: "/",
  ABOUT: "/about",
  LOGIN: "/login",
  REGISTER: "/register",
  TASK: "/task",
  FUNC_TWO: "/functionality_two",
};
