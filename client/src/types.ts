// Sorting options
export enum SortBy {
  STATUS = "status",
  PRIORITY = "priority",
  DUE_DATE = "dueDate",
}
type ColumnField = SortBy;

// Columns
export enum Priority {
  LOW = "LOW",
  NORMAL = "NORMAL",
  HIGH = "HIGH",
  URGENT = "URGENT",
  NO_PRIORITY = "NO_PRIORITY",
}

export enum CurrentWeek {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}
export enum DueDateRange {
  OVER_DUE = "OVER_DUE",
  TODAY = "TODAY",
  TOMORROW = "TOMORROW",
  FUTURE = "FUTURE",
  NO_DUE_DATE = "NO_DUE_DATE",
}
export type DueDate = CurrentWeek | DueDateRange;

export enum Columns {
  STATUS = "status",
  PRIORITY = "priority",
  DUE_DATE = "dueDate",
}

interface Column<T> {
  id?: number;
  title: T;
  color: string;
}
export type PriorityColumn = Column<Priority>;
export interface StatusColumn extends Column<string> {
  teamId: number;
  orderIndex: number;
  markAsClosed?: boolean;
}
export interface DueDateColumn extends Column<DueDate> {
  localDateStr?: string; // Format: 10/10/2022
}

export type StatusColumns = StatusColumn[];
export type PriorityColumns = PriorityColumn[];
export type DueDateColumns = DueDateColumn[];

export interface StatusCategory {
  name: string;
  statusColumns: StatusColumns;
}
export type StatusCategories = StatusCategory[];

export interface ColumnOptions {
  statusColumns: StatusColumns;
  priorityColumns: PriorityColumns;
  dueDateColumns: DueDateColumns;
}

// task
export enum ActionField {
  TITLE = "title",
  COMMENT = "comment",
  WATCHER = "watcher",
  ASSIGNEE = "assignee",
}

export type Field = ColumnField | ActionField;

interface Event {
  id?: number;
  field: Field;
  taskId: number;
  userId?: number;
  username?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserInfo {
  userId: number;
  email: string;
  username: string;
}
interface Reaction {
  id?: number;
  userId?: number;
  username?: string;
  reaction: string;
}
enum AssignmentAction {
  ADDED = "added",
  REMOVED = "removed",
}
export interface BeforeOrAfterUpdate {
  afterUpdate: string;
  beforeUpdate: string | null;
}

export type UpdateEvent = Event & BeforeOrAfterUpdate;
export interface CommentEvent extends Event {
  comment: string;
  reactions: Reaction[];
}
export interface AssignmentEvent extends Event {
  assignmentAction: AssignmentAction;
  assignedUser: UserInfo;
}

export type TaskEvent = UpdateEvent | CommentEvent | AssignmentEvent;
export type TaskEvents = TaskEvent[];

export interface Position<T> {
  name: T;
  columnId: number;
  orderIndex: number;
}

export type StatusPosition = Position<string>;
export type DueDatePosition = Position<DueDate>;
export type PriorityPosition = Position<Priority>;
export type UndeterminedPosition =
  | StatusPosition
  | DueDatePosition
  | PriorityPosition;

interface TaskPositions {
  status: StatusPosition;
  dueDate: DueDatePosition;
  priority: PriorityPosition;
}

export interface Task {
  id?: number;
  title: string;
  listId: number;
  createdAt?: Date;
  updatedAt?: Date;
  archived?: boolean;
  description?: string;
  expectedDueDate: Date | null;

  subTasks: Task[];
  creator: UserInfo;
  parentTask?: Task;
  watchers: UserInfo[];
  assignees: UserInfo[];
  taskEvents: TaskEvent[];

  status: StatusPosition;
  dueDate: DueDatePosition;
  priority: PriorityPosition;

  // Keep previousTask record when set to finish
  taskPositionInMain?: TaskPositions;
  taskPositionInSpace?: TaskPositions;
  taskPositionInListView?: TaskPositions;
}

export type TaskList = Task[];
export type UndeterminedColumn = Column<string>;
export type UndeterminedColumns = UndeterminedColumn[];

// States
export interface OrderedTask {
  columnId: number;
  taskList: TaskList;
}
export type OrderedTasks = OrderedTask[];
export interface TaskState {
  orderedTasks: OrderedTasks;
  columnOptions: ColumnOptions;
}
export type SetTaskState = React.Dispatch<
  React.SetStateAction<TaskState | undefined>
>;

// Look up tables
export type LookUpReorderedColumn = {
  [index: number]: number;
};

export type LookUpExpectedDueDate = {
  [index in DueDate]: Date | null;
};

// Task creation types
export type TargetColumnAndId = {
  status?: number;
  priority?: number;
  dueDate?: number;
};
export type TargetTasksInColumn = { updateSortBy: SortBy; columnId: number }[];

export interface TaskPositionDTO {
  taskId: number;
  status?: StatusPosition;
  dueDate?: DueDatePosition;
  priority?: PriorityPosition;
  expectedDueDate: Date | null;
  updateEvent?: UpdateEvent;
}

export type TaskPositionDTOList = TaskPositionDTO[];

export interface UpdateTasksPositionDTO {
  sourceTaskId: number;
  taskDtoList: TaskPositionDTOList;
}

export interface UpdateTaskTitleDTO {
  taskId: number;
  newTitle: string;
}

export interface UpdateTaskDescDTO {
  taskId: number;
  newDesc: string;
}

// auth
export const authInitialState: AuthStateType = {
  user: null,
};

export type AuthContextType = {
  authState: AuthStateType;
  authDispatch: React.Dispatch<AuthActionType>;
};

export type AuthStateType = {
  user: User | null;
};

export type RegisterCredentials = {
  email: string;
  username: string;
  password: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type FieldError = {
  field: string;
  message: string;
};

export type FieldErrors = FieldError[];

export type ErrorResponse = {
  status: number;
  message: string;
  errors: FieldErrors;
};

export interface Category {
  id: number;
  name: string;
  spaceId: number;
  owner: UserInfo;
  createdAt: Date;
  members: UserInfo[];
  isPrivate: boolean;
  color: string | null;
}
export interface FolderCategory extends Category {
  isOpen: boolean;
  allLists: ListCategory[];
}
export interface ListCategory extends Category {
  isSelected: boolean;
  taskAmount: number | null;
  statusColumns: StatusColumns;
  parentFolderId: number | null;
  //   boardViewSetting?: unknown
  //   listViewSetting?: unknown
}

export interface SpaceType {
  id: number;
  name: string;
  teamId: number;
  isOpen: boolean;
  orderIndex: number;
  isPrivate: boolean;
  isSelected: boolean;
  color: string | null;
  allListOrFolder: (FolderCategory | ListCategory)[];
}

export type Team = {
  id: number;
  owner: User;
  name: string;
  color: string;
  member: User[];
  isPrivate: boolean;
  spaces: SpaceType[];
};

export interface CreateSpaceDTO {
  name: string;
  color: string;
  isPrivate: boolean;
  orderIndex: number;
  defaultStatusColumnId: number;
}

export interface User {
  id: number;
  email: string;
  username: string;
  teams: number[];
  defaultTeam?: number;
  defaultSpace?: number;
  defaultList?: number;
}

export interface AuthenticationResponse {
  id: number;
  email: string;
  teams: number[];
  username: string;
  accessToken: string;
}

export type AuthActionType = LogInUser | LogOutUser;

type LogInUser = {
  type: typeof AUTH_ACTION.LOGIN_USER;
  payload: { user: User };
};
type LogOutUser = { type: typeof AUTH_ACTION.LOGOUT_USER };

export const AUTH_ACTION = {
  LOGIN_USER: "login_user",
  LOGOUT_USER: "logout_user",
} as const;

export type TeamContextType = {
  teamState: TeamStateType;
  TeamStateDispatch: React.Dispatch<TeamStateActionType>;
};

export const initialTeamContextState: TeamStateType = {
  spaceList: null,
  openedListId: null,
  lookUpStatusColumns: [],
};

export type LookUpStatusColumns = { [index: number]: StatusColumns };

export type TeamStateType = {
  openedListId: number | null;
  spaceList: SpaceType[] | null;
  lookUpStatusColumns: LookUpStatusColumns;
};

export type TeamStateActionType =
  | AddList
  | AddFolder
  | FetchSpaceList
  | UpdateOpenedSpace
  | UpdateOpenedFolder
  | UpdateSelectedList
  | UpdateSelectedSpace
  | UpdateSelectedFolder;

type AddFolder = {
  payload: { spaceId: number; folderName: string };
  type: typeof TEAM_STATE_ACTION.ADD_FOLDER;
};
type AddList = {
  payload: { spaceId: number; listName: string };
  type: typeof TEAM_STATE_ACTION.ADD_LIST;
};
type FetchSpaceList = {
  payload: { spaceList: SpaceType[] };
  type: typeof TEAM_STATE_ACTION.INIT_SPACE_LIST;
};
type UpdateOpenedSpace = {
  payload: { spaceId: number };
  type: typeof TEAM_STATE_ACTION.UPDATE_OPENED_SPACE;
};
type UpdateSelectedSpace = {
  payload: { spaceId: number };
  type: typeof TEAM_STATE_ACTION.UPDATE_SELECTED_SPACE;
};
type UpdateOpenedFolder = {
  payload: { spaceId: number; folderId: number };
  type: typeof TEAM_STATE_ACTION.UPDATE_OPENED_FOLDER;
};
type UpdateSelectedFolder = {
  payload: { spaceId: number; folderId: number };
  type: typeof TEAM_STATE_ACTION.UPDATE_SELECTED_FOLDER;
};
type UpdateSelectedList = {
  payload: { listId: number };
  type: typeof TEAM_STATE_ACTION.UPDATE_SELECTED_LIST;
};

export const TEAM_STATE_ACTION = {
  ADD_LIST: "add_list",
  ADD_FOLDER: "add_folder",
  INIT_SPACE_LIST: "init_space_list",
  UPDATE_OPENED_SPACE: "update_opened_space",
  UPDATE_SELECTED_SPACE: "update_selected_space",
  UPDATE_OPENED_FOLDER: "update_opened_folder",
  UPDATE_SELECTED_FOLDER: "update_selected_folder",
  UPDATE_SELECTED_LIST: "update_selected_list",
} as const;

export enum CreateSpaceStep {
  NAME = "name",
  COLOR = "color",
  IS_PRIVATE = "is_private",
  STATUS_COLUMNS = "status_columns",
  CONFIRM = "confirm",
}
export interface CreateSpace {
  isAllSet: boolean;
  step: CreateSpaceStep | null;
  createSpaceDTO: CreateSpaceDTO;
  selectedStatusColumns: StatusColumns;
}
