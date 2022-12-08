// Header config
export const BEARER = "Bearer ";
export const ACCESS_TOKEN = "access token";

// API endpoints
const LOGIN = "/login";
const LOGOUT = "/logout";
const REGISTER = "/register";
const REFRESH_TOKEN = "/refresh_token";
const UPDATE_TASK_DESC = "/update_desc";

export const BASE_ENDPOINT = "http://localhost:8083";
export const SERVICE_ENDPOINT = {
  TASK: "http://localhost:8084",
  SPACE: "http://localhost:8088",
  AUTHORIZATION: "http://localhost:8085",
};

const ALL_TASKS = "/all_tasks";
const TASK_API_VERSION = "/api/v1/task";
const UPDATE_TASK_TITLE = "/update_title";
const AUTH_API_VERSION = "/authorization/v1/user";
const TASK_EVENT_API_VERSION = "/api/v1/task_event";

export const API_ENDPOINT = {
  AUTH_LOGIN: AUTH_API_VERSION + LOGIN,
  AUTH_LOGOUT: AUTH_API_VERSION + LOGOUT,
  AUTH_REGISTER: AUTH_API_VERSION + REGISTER,
  AUTH_REFRESH_TOKEN: AUTH_API_VERSION + REFRESH_TOKEN,

  TASK: TASK_API_VERSION,
  TASK_ALL_TASKS: TASK_API_VERSION + ALL_TASKS,
  TASK_UPDATE_TITLE: TASK_API_VERSION + UPDATE_TASK_TITLE,
  TASK_UPDATE_DESC: TASK_API_VERSION + UPDATE_TASK_DESC,
  TASK_EVENT: TASK_EVENT_API_VERSION,
};

export const TASK_PARAM = "taskId";
export const TASK_BOARD_PARAM = "listId";

// Client route
export const CLIENT_ROUTE = {
  HOME: "/",
  TASK: "/task",
  ABOUT: "/about",
  LOGIN: "/login",
  REGISTER: "/register",
  TEST_DEV: "/test_dev",
  TASK_BOARD: "/task_board",
};
