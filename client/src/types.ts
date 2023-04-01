// Sorting options
export enum GroupBy {
  STATUS = "status",
  PRIORITY = "priority",
  DUE_DATE = "dueDate",
}
type ColumnField = GroupBy;

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
  markAsClosed?: boolean;
}
export type PriorityColumn = Column<Priority>;
export interface StatusColumn extends Column<string> {
  orderIndex: number;
  markAsClosed?: boolean;
  isDefaultStatus?: boolean;
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
  statusCategoryId: number;
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
export type TargetTasksInColumn = { updateSortBy: GroupBy; columnId: number }[];

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

export type AuthContextType = {
  authState: AuthStateType;
  authDispatch: React.Dispatch<AuthActionType>;
};

export type AuthStateType = {
  user: User | null;
};

export type RegisterUserDTO = {
  email: string;
  color: string;
  username: string;
  password: string;
};

export type LoginUserDTO = {
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
  createdAt: Date;
  creator: UserInfo;
  orderIndex: number;
  isPrivate: boolean;
  members: UserInfo[];
  color: string | null;
  defaultStatusCategoryId: number;
}
export interface FolderCategory extends Category {
  isOpen: boolean | null; // client side
  allLists: ListCategory[];
}
export interface ListCategory extends Category {
  isSelected: boolean;
  taskAmount: number | null;
  parentFolderId: number | null;
}

export interface Space {
  id: number;
  name: string;
  color: string;
  avatar: string;
  teamId: number;
  creator: UserInfo;
  orderIndex: number;
  isPrivate: boolean;
  defaultStatusCategoryId: number;

  isOpen: boolean | null; // client side
  allListOrFolder: (FolderCategory | ListCategory)[]; // client side

  listCategories: ListCategory[]; // server side
  folderCategories: FolderCategory[]; // server side
}

export interface StatusCategory {
  id: number;
  name: string;
  teamId: number;
  statusColumns: StatusColumns;
  isSelected?: boolean; // client side
}
export type StatusCategories = StatusCategory[];

export type Team = {
  id?: number;
  name: string;
  color: string;
  avatar?: string;
  spaces: Space[];
  owner?: UserInfo;
  isPrivate: boolean;
  isSelected: boolean; // client side
  members: UserInfo[];
  statusCategoryState?: StatusCategories;
};

export interface User {
  id: number;
  email: string;
  color?: string;
  username: string;
  defaultTeamId: number;
  joinedTeamCount: number;
}

export interface AuthenticationResponse {
  id: number;
  color: string;
  email: string;
  username: string;
  accessToken: string;
  defaultTeamId: number;
  joinedTeamCount: number;
}

export interface RegistrationResponse {
  id: number;
  color: string;
  email: string;
  username: string;
  accessToken: string;
  defaultTeamId: number;
  joinedTeamCount: number;
  initTeamUIState: TeamActiveStatus;
}

export type AuthActionType =
  | LogInUser
  | LogOutUser
  | RegisterUser
  | OpenOnboarding
  | UpdateTeamCount
  | CloseOnboarding;

type LogInUser = {
  type: typeof AUTH_ACTION.LOGIN_USER;
  payload: { user: AuthenticationResponse };
};
type RegisterUser = {
  type: typeof AUTH_ACTION.REGISTER_USER;
  payload: { registrationResponse: RegistrationResponse };
};
type UpdateTeamCount = {
  type: typeof AUTH_ACTION.UPDATE_TEAM_COUNT;
  payload: { isAddTeam: boolean; teamId: number };
};
type LogOutUser = { type: typeof AUTH_ACTION.LOGOUT_USER };
type OpenOnboarding = { type: typeof AUTH_ACTION.OPEN_ONBOARDING };
type CloseOnboarding = { type: typeof AUTH_ACTION.CLOSE_ONBOARDING };

export const AUTH_ACTION = {
  LOGIN_USER: "login_user",
  LOGOUT_USER: "logout_user",
  REGISTER_USER: "register_user",
  OPEN_ONBOARDING: "open_onboarding",
  CLOSE_ONBOARDING: "close_onboarding",
  UPDATE_TEAM_COUNT: "update_team_count",
} as const;

export type TeamActiveStatus = {
  teamId?: number;
  folderIds: number[];
  listId?: number | null;
  spaceId?: number | null;
  defaultStatusCategoryId?: number; // client
};

export type CreateListInfo = {
  spaceId: number;
  folderId?: number;
  orderIndex?: number;
  defaultStatusCategoryId: number;
  currentLevelLists?: ListCategory[];
};
export type CreateFolderInfo = {
  spaceId: number;
  currentLevelFolders?: FolderCategory[];
  defaultStatusCategoryId?: number;
};

export type ModalControls = {
  isCreateListModalOpen: boolean;
  onCreateListModalOpen: () => void;
  onCreateListModalClose: () => void;

  isCreateFolderModalOpen: boolean;
  onCreateFolderModalOpen: () => void;
  onCreateFolderModalClose: () => void;

  isCreateSpaceModalOpen: boolean;
  onCreateSpaceModalOpen: () => void;
  onCreateSpaceModalClose: () => void;
};

export type TeamStateType = {
  teamsForRender: Team[];
  originalTeams: Team[];
  teamActiveStatus: TeamActiveStatus;
  createListInfo: CreateListInfo | null;
  createFolderInfo: CreateFolderInfo | null;
};

export type TeamContextType = {
  teamState: TeamStateType;
  teamStateDispatch: React.Dispatch<TeamStateActionType>;
};

export const TEAM_STATE_ACTION = {
  INIT_TEAM_STATE: "init_team_state",
  CREATE_TEAM: "create_team",
  CREATE_SPACE: "create_space",
  CREATE_FOLDER: "create_folder",
  CREATE_LIST: "create_list",

  DELETE_TEAM: "delete_team",
  DELETE_LIST_IN_SPACE: "delete_list_in_space",
  DELETE_LIST_IN_FOLDER: "delete_list_in_folder",
  DELETE_SPACE: "delete_space",
  DELETE_FOLDER: "delete_folder",

  SET_CREATE_FOLDER_INFO: "set_create_folder_INFO",
  SET_CREATE_LIST_INFO: "set_create_list_INFO",

  SELECT_LIST: "select_list",
  SELECT_TEAM: "select_team",
  SELECT_SPACE: "select_space",
  SELECT_FOLDER: "select_folder",

  OPEN_FOLDER: "open_folder",
  OPEN_SPACE: "open_space",

  UPDATE_LIST_DEFAULT_STATUS_CATEGORY_ID:
    "update_list_default_status_category_id",
} as const;

export type TeamStateActionType =
  | SelectTeam
  | InitTeamState
  | UpdateOpenedSpace
  | UpdateOpenedFolder
  | CreateTeam
  | SelectList
  | SelectSpace
  | CreateSpace
  | CreateList
  | CreateFolder
  | SelectFolder
  | SetCreateListInfo
  | SetCreateFolderInfo
  | DeleteSpace
  | DeleteFolder
  | DeleteTeam
  | DeleteListInSpace
  | DeleteListInFolder
  | UpdateListDefaultStatusCategoryId;

type UpdateListDefaultStatusCategoryId = {
  type: typeof TEAM_STATE_ACTION.UPDATE_LIST_DEFAULT_STATUS_CATEGORY_ID;
  payload: { newDefaultStatusCategoryId: number };
};
type DeleteSpace = {
  type: typeof TEAM_STATE_ACTION.DELETE_SPACE;
  payload: {
    deletedSpaceId: number;
    nextListId: number | null;
    nextSpaceId: number | null;
    defaultStatusCategoryId?: number;
  };
};
type DeleteFolder = {
  type: typeof TEAM_STATE_ACTION.DELETE_FOLDER;
  payload: {
    deletedFolderId: number;
    // nextFolderId: number;
    nextListId?: number | null;
    defaultStatusCategoryId?: number;
  };
};
type DeleteListInFolder = {
  type: typeof TEAM_STATE_ACTION.DELETE_LIST_IN_FOLDER;
  payload: {
    folderId: number;
    deletedListId: number;
    nextListId?: number | null;
    defaultStatusCategoryId?: number;
  };
};
type DeleteListInSpace = {
  type: typeof TEAM_STATE_ACTION.DELETE_LIST_IN_SPACE;
  payload: {
    deletedListId: number;
    nextListId?: number | null;
    defaultStatusCategoryId?: number;
  };
};
type DeleteTeam = {
  type: typeof TEAM_STATE_ACTION.DELETE_TEAM;
  //   payload: { deletedSpaceId: number; nextSpaceId: number; nextListId?: number };
};

type InitTeamState = {
  type: typeof TEAM_STATE_ACTION.INIT_TEAM_STATE;
  payload: TeamsResponseDTO;
};

type SetCreateListInfo = {
  type: typeof TEAM_STATE_ACTION.SET_CREATE_LIST_INFO;
  payload: CreateListInfo;
};
type SetCreateFolderInfo = {
  type: typeof TEAM_STATE_ACTION.SET_CREATE_FOLDER_INFO;
  payload: CreateFolderInfo;
};

type CreateList = {
  type: typeof TEAM_STATE_ACTION.CREATE_LIST;
  payload: ListCategory;
};

type CreateTeam = {
  type: typeof TEAM_STATE_ACTION.CREATE_TEAM;
  payload: CreateTeamResponseDTO;
};

type CreateSpace = {
  type: typeof TEAM_STATE_ACTION.CREATE_SPACE;
  payload: Space;
};

type CreateFolder = {
  type: typeof TEAM_STATE_ACTION.CREATE_FOLDER;
  payload: FolderCategory;
};

// Select
type SelectTeam = {
  type: typeof TEAM_STATE_ACTION.SELECT_TEAM;
  payload: { teamId: number };
};
type SelectSpace = {
  type: typeof TEAM_STATE_ACTION.SELECT_SPACE;
  payload: { spaceId: number };
};
type SelectFolder = {
  type: typeof TEAM_STATE_ACTION.SELECT_FOLDER;
  payload: { folderId: number };
};
type SelectList = {
  type: typeof TEAM_STATE_ACTION.SELECT_LIST;
  payload: { list: ListCategory };
};

// Open
type UpdateOpenedSpace = {
  type: typeof TEAM_STATE_ACTION.OPEN_SPACE;
  payload: { spaceId: number | null };
};
type UpdateOpenedFolder = {
  type: typeof TEAM_STATE_ACTION.OPEN_FOLDER;
  payload: { folderId: number };
};

export type CreateListDTO = {
  name: string;
  spaceId: number;
  folderId?: number;
  orderIndex: number;
  defaultStatusCategoryId: number;
};

export interface CreateSpaceDTO {
  name: string;
  color: string;
  teamId: number;
  avatar: string;
  isPrivate: boolean;
  orderIndex: number;
  defaultStatusCategoryId: number;
}
export enum CreateSpaceStep {
  NAME = "name",
  COLOR = "color",
  IS_PRIVATE = "is_private",
  STATUS_COLUMNS = "status_columns",
  CONFIRM = "confirm",
}
export interface CreateSpaceState {
  isAllSet: boolean;
  step: CreateSpaceStep | null;
  createSpaceDTO: CreateSpaceDTO;
  selectedStatusColumns: StatusColumns;
  teamStatusCategories: StatusCategories;
}

export interface CreateFolderDTO {
  name: string;
  spaceId: number;
  orderIndex: number;
  isPrivate: boolean;
  allListNames: string[];
  defaultStatusCategoryId: number;
}
export enum CreateFolderStep {
  ENTRY = "entry",
  LISTS = "lists",
  SHARE = "share",
  STATUS = "status",
}
export type CreateFolderNameError = {
  isError: boolean;
  errorMsg: string;
};
export interface CreateFolderState {
  step: CreateFolderStep;
  createFolderDTO: CreateFolderDTO;
  selectedStatusColumns: StatusColumns;
  folderNameError: CreateFolderNameError;
  teamStatusCategories: StatusCategories;
}

export type InitTeamListDTO = {
  teams: Team[];
  //   teamActivity: TeamActivity;
};

export type TaskDetailContextType = {
  task: Task | null;
  modalState: ModalState;
  isCreatingTask: boolean;
  taskStateContext: TaskStateContext | null;
  setTask: React.Dispatch<React.SetStateAction<Task | null>>;
  setIsCreatingTask: React.Dispatch<React.SetStateAction<boolean>>;
  setTaskStateContext: React.Dispatch<
    React.SetStateAction<TaskStateContext | null>
  >;
};

export type ModalState = {
  isModalOpen: boolean;
  onModalOpen: () => void;
  onModalClose: () => void;
};

export type TaskStateContext = {
  groupBy: GroupBy;
  currentListId: number;
  setTaskState: SetTaskState;
  columnOptions: ColumnOptions;
};

export type ModalControlContextType = {
  isCreateListModalOpen: boolean;
  onCreateListModalOpen: () => void;
  onCreateListModalClose: () => void;
  isCreateFolderModalOpen: boolean;
  onCreateFolderModalOpen: () => void;
  onCreateFolderModalClose: () => void;
  isCreateSpaceModalOpen: boolean;
  onCreateSpaceModalOpen: () => void;
  onCreateSpaceModalClose: () => void;
};

export type StatusCategoryState = {
  categories: StatusCategories;
  errorMsg: string;
};

export type UpdateStatusColumnTitleDTO = {
  id: number;
  title: string;
};

export type UpdateStatusColumnColorDTO = {
  id: number;
  color: string;
};

export type UpdateStatusCategoryNameDTO = {
  id: number;
  name: string;
};

export type CreateStatusCategoryDTO = {
  name: string;
  teamId: number;
  statusColumns: StatusColumns;
};

export type TeamsResponseDTO = {
  teams: Team[];
  teamActivity: TeamActiveStatus;
};

export type CreateTeamResponseDTO = {
  team: Team;
  teamActivity: TeamActiveStatus;
};

export type TaskListStatusCategoryDTO = {
  statusCategory: StatusCategory;
  taskList: TaskList;
};

export type GetTaskListDTO = {
  listId: number;
  defaultStatusCategoryId: number;
};

export type UpdateTeamActivityDTO = {
  teamId: number;
  spaceId?: number;
  folderIds?: number[];
  listId?: number | null;
  userId?: number;
};

export type UpdateStatusColumnDTO = {
  id: number;
  title: string;
  color: string;
  orderIndex: number;
};

export type CreateStatusColumnDTO = {
  title: string;
  color: string;
  orderIndex: number;
  statusCategoryId: number;
};

export type AddStatusColumnDTO = {
  title: string;
  color: string;
  listId: number;
  orderIndex: number;
  statusCategoryId: number;
};

interface OldNewStatusPairs {
  [key: number]: number;
}

export type AddStatusColumnResponseDTO = {
  statusColumnId: number;
  statusCategoryId: number;
  oldNewStatusPairs: OldNewStatusPairs;
};

export type createNewFolderOrListInfo = {
  spaceId: number;
  folderId?: number;
};
