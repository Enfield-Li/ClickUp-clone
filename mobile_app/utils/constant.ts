// Header config
export const BEARER = "Bearer ";
export const ACCESS_TOKEN = "access token";
export const TEAM_ACTIVITY = "team_activity";
export const IS_SUB_NAV_OPEN = "is_sub_nav_open";
export const CURRENT_STATUS_CATEGORY_ID = "current_status_category_id";

// 1.12.70.249
export const SERVICE_ENDPOINT = {
  GATEWAY: "http://1.12.70.249:8083",
  //   TASK: "http://10.0.2.2:8084",
  //   TEAM: "http://10.0.2.2:8088",
  //   AUTHORIZATION: "http://10.0.2.2:8085",
  //   TEAM_STATUS_CATEGORY: "http://10.0.2.2:8089",
  //   TASK: "http://localhost:8084",
  //   TEAM: "http://localhost:8088",
  //   AUTHORIZATION: "http://localhost:8085",
  //   TEAM_STATUS_CATEGORY: "http://localhost:8089",
} as const;

const ALL_TASKS = "/all_tasks";
const UPDATE_TASK_TITLE = "/update_title";
const TASK_API_VERSION = "/api/v1/task";

// team
const TEAM_API_VERSION = "/api/v1/team";
const List_API_VERSION = TEAM_API_VERSION + "/list";
const SPACE_API_VERSION = TEAM_API_VERSION + "/space";
const Folder_API_VERSION = TEAM_API_VERSION + "/folder";

const AUTH_API_VERSION = "/authorization/v1/user";
const TASK_EVENT_API_VERSION = "/api/v1/task_event";
const PANEL_ACTIVITY_API_VERSION = "/api/v1/panel_activity";
const STATUS_COLUMN_API_VERSION = "/api/v1/status_column";
const TEAM_ACTIVITY_API_VERSION = "/api/v1/team_activity";
const STATUS_CATEGORY_API_VERSION = "/api/v1/status_category";

// API endpoints
const LOGIN = "/login";
const LOGOUT = "/logout";
const REGISTER = "/register";
const REFRESH_TOKEN = "/refresh_token";
const UPDATE_TASK_DESC = "/update_desc";

export const API_ENDPOINT = {
  // auth
  AUTH: AUTH_API_VERSION,
  AUTH_LOGIN: AUTH_API_VERSION + LOGIN,
  AUTH_LOGOUT: AUTH_API_VERSION + LOGOUT,
  AUTH_REGISTER: AUTH_API_VERSION + REGISTER,
  AUTH_REFRESH_TOKEN: AUTH_API_VERSION + REFRESH_TOKEN,

  // team
  TEAM: TEAM_API_VERSION,
  SPACE: SPACE_API_VERSION,
  FOLDER: Folder_API_VERSION,
  LIST: List_API_VERSION,

  // task
  TASK: TASK_API_VERSION,
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

  // team activity
  TEAM_ACTIVITY: TEAM_ACTIVITY_API_VERSION,
} as const;

export const TASK_PARAM = "taskId";
export const TASK_BOARD_PARAM = "listId";

// Client route
export const CLIENT_ROUTE = {
  LOGIN: "/login",
  REGISTER: "/register",
  ON_BOARDING: "/on_boarding",

  HOME: "home",
  TEST_DEV: "test_dev",
  SEARCH: "search",
  TASK_BOARD: "task_board",
  NOTIFICATIONS: "notifications",
  DASHBOARDS: "dashboards",
  DOCS: "docs",
  PULSE: "pulse",
  GOALS: "goals",
  HELP: "help",
  OPTIONS: "options",
} as const;

const UN_INPLEMENTED_TOAST_OPTIONS = {
  type: "danger",
  duration: 1500,
  placement: "bottom",
};
