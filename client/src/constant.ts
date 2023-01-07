// Header config
export const BEARER = "Bearer ";
export const ACCESS_TOKEN = "access token";

export const SERVICE_ENDPOINT = {
  GATEWAY: "http://localhost:8083",
  TASK: "http://localhost:8084",
  TEAM: "http://localhost:8088",
  AUTHORIZATION: "http://localhost:8085",
  TEAM_STATUS_CATEGORY: "http://localhost:8089",
  PANEL_ACTIVITY: "http://localhost:8090",
} as const;

const ALL_TASKS = "/all_tasks";
const UPDATE_TASK_TITLE = "/update_title";
const TASK_API_VERSION = "/api/v1/task";
const TEAM_API_VERSION = "/api/v1/team";
const SPACE_API_VERSION = "/api/v1/space";
const AUTH_API_VERSION = "/authorization/v1/user";
const TASK_EVENT_API_VERSION = "/api/v1/task_event";
const PANEL_ACTIVITY_API_VERSION = "/api/v1/panel_activity";
const STATUS_COLUMN_API_VERSION = "/api/v1/status_column";
const STATUS_CATEGORY_API_VERSION = "/api/v1/status_category";

// API endpoints
const LOGIN = "/login";
const LOGOUT = "/logout";
const REGISTER = "/register";
const REFRESH_TOKEN = "/refresh_token";
const UPDATE_TASK_DESC = "/update_desc";

export const API_ENDPOINT = {
  // auth
  AUTH_LOGIN: AUTH_API_VERSION + LOGIN,
  AUTH_LOGOUT: AUTH_API_VERSION + LOGOUT,
  AUTH_REGISTER: AUTH_API_VERSION + REGISTER,
  AUTH_REFRESH_TOKEN: AUTH_API_VERSION + REFRESH_TOKEN,

  // team
  TEAM: TEAM_API_VERSION,
  SPACE_API_VERSION: SPACE_API_VERSION,

  // task
  TASK: TASK_API_VERSION,
  TASK_ALL_TASKS: TASK_API_VERSION + ALL_TASKS,
  TASK_UPDATE_TITLE: TASK_API_VERSION + UPDATE_TASK_TITLE,
  TASK_UPDATE_DESC: TASK_API_VERSION + UPDATE_TASK_DESC,

  // task event
  TASK_EVENT: TASK_EVENT_API_VERSION,

  // panel activity
  PANEL_ACTIVITY: PANEL_ACTIVITY_API_VERSION,

  // status category
  STATUS_CATEGORY: STATUS_CATEGORY_API_VERSION,

  // status column
  STATUS_COLUMN: STATUS_COLUMN_API_VERSION,
} as const;

export const TASK_PARAM = "taskId";
export const TASK_BOARD_PARAM = "listId";

// Client route
export const CLIENT_ROUTE = {
  ENTRY: "/",
  HOME: "/home",
  TASK: "/task",
  ABOUT: "/about",
  TEST_DEV: "/test_dev",
  TASK_BOARD: "/task_board",

  LOGIN: "/login",
  REGISTER: "/register",
  ON_BOARDING: "/on_boarding",
} as const;
