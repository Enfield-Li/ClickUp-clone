// Sorting options
export enum SortBy {
  STATUS = "status",
  PRIORITY = "priority",
  DUE_DATE = "dueDate",
}
type ColumnField = SortBy;

// Columns
export enum DefaultStatus {
  TO_DO = "TO_DO",
  DONE = "Done",
}
export type Status = string | DefaultStatus;

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
  id: number;
  title: T;
  color: string;
  listId: number;
}
export type PriorityColumn = Column<Priority>;
export interface StatusColumn extends Column<Status> {
  orderIndex: number;
}
export interface DueDateColumn extends Column<DueDate> {
  localDateStr?: string; // Format: 10/10/2022
}

export type StatusColumns = StatusColumn[];
export type PriorityColumns = PriorityColumn[];
export type DueDateColumns = DueDateColumn[];

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

interface BaseEvent {
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

export type UpdateEvent = BaseEvent & BeforeOrAfterUpdate;
export interface CommentEvent extends BaseEvent {
  comment: string;
  reactions: Reaction[];
}
export interface AssignmentEvent extends BaseEvent {
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
  taskStateInMain?: TaskPositions;
  taskStateInListView?: TaskPositions;
}

export type TaskList = Task[];
export type InitialData = { tasks: TaskList };
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
  openedListId: undefined,
};

export type AuthContextType = {
  authState: AuthStateType;
  authDispatch: React.Dispatch<AuthActionType>;
};

export type AuthStateType = {
  user: User | null;
  openedListId: number | undefined;
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

export interface BaseList {
  id: number;
  name: string;
  spaceId: number;
  owner: UserInfo;
  createdAt: Date;
  member: UserInfo[];
  isPrivate: boolean;
  isSelected: boolean;
  color: string | null;
}

export interface FolderType extends BaseList {
  isOpen: boolean;
  allLists: ListType[];
}
export interface ListType extends BaseList {
  taskAmount: number | null;
  allStatuses: StatusColumns;
  parentFolderId: number | null;
  //   boardViewSetting?: unknown
  //   listViewSetting?: unknown
}

export interface Space {
  id: number;
  name: string;
  isOpen: boolean;
  isPrivate: boolean;
  isSelected: boolean;
  orderIndex: number;
  color: string | null;
  allListOrFolder: (FolderType | ListType)[]; // client side
}

export interface User {
  id: number;
  spaces: Space[];
  username: string;
}

export interface UserResponse {
  id: number;
  spaces: Space[];
  username: string;
  accessToken: string;
}

export type AuthActionType =
  | LogInUser
  | LogOutUser
  | UpdateOpenedSpace
  | UpdateOpenedFolder
  | UpdateSelectedList
  | UpdateSelectedSpace
  | UpdateSelectedFolder;

type LogInUser = { type: typeof AUTH_ACTION.LOGIN_USER; payload: User };
type LogOutUser = { type: typeof AUTH_ACTION.LOGOUT_USER };
type UpdateOpenedSpace = {
  type: typeof AUTH_ACTION.UPDATE_OPENED_SPACE;
  payload: { spaceId: number };
};
type UpdateSelectedSpace = {
  type: typeof AUTH_ACTION.UPDATE_SELECTED_SPACE;
  payload: { spaceId: number };
};
type UpdateOpenedFolder = {
  type: typeof AUTH_ACTION.UPDATE_OPENED_FOLDER;
  payload: { spaceId: number; folderId: number };
};
type UpdateSelectedFolder = {
  type: typeof AUTH_ACTION.UPDATE_SELECTED_FOLDER;
  payload: { spaceId: number; folderId: number };
};
type UpdateSelectedList = {
  type: typeof AUTH_ACTION.UPDATE_SELECTED_LIST;
  payload: { spaceId: number; folderId: number | undefined; listId: number };
};

export const AUTH_ACTION = {
  LOGIN_USER: "login_user",
  LOGOUT_USER: "logout_user",
  UPDATE_OPENED_SPACE: "update_opened_space", //
  UPDATE_SELECTED_SPACE: "update_selected_space",
  UPDATE_OPENED_FOLDER: "update_opened_folder", //
  UPDATE_SELECTED_FOLDER: "update_selected_folder",
  UPDATE_SELECTED_LIST: "update_selected_list",
} as const;
