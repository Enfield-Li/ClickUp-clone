export type InitListParam = {
  statusCategoryId: string;
  listId: string;
};

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

export type TaskStateContext = {
  groupBy: GroupBy;
  currentListId: number;
  columnOptions: ColumnOptions;
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

export type DeleteSpaceArgType = {
  deletedSpaceId: number;
  nextListId: number | null;
  nextSpaceId: number | null;
  defaultStatusCategoryId?: number;
};

export type DeleteFolderArgType = {
  deletedFolderId: number;
  nextListId?: number | null;
  defaultStatusCategoryId?: number;
};

export type DeleteListInFolderArgType = {
  folderId: number;
  deletedListId: number;
  nextListId?: number | null;
  defaultStatusCategoryId?: number;
};

export type DeleteListInSpaceArgType = {
  deletedListId: number;
  nextListId?: number | null;
  defaultStatusCategoryId?: number;
};

export type InitTaskStateArgType = {
  networkData: TaskListStatusCategoryDTO;
  groupBy: GroupBy;
  statusCategoryId: number;
  listId: number;
};

// export type DragTaskArgType = {
//   groupBy: GroupBy;
//   result: DropResult;
// };

export type AddColumnArgType = {
  lastItemIndex: number;
  dto: AddStatusColumnDTO;
  storedDefaultCategoryId: number;
  responseDTO: AddStatusColumnResponseDTO;
  updateStoredDefaultCategoryId: (newCategoryId: number) => void;
};

export type UpdateTaskAttributeArgType = {
  userId: number;
  groupBy: GroupBy;
  targetField: GroupBy;
  currentTask: Task;
  targetColumnId: number;
  expectedDueDate?: Date | null;
};

export type AddTaskArgType = {
  groupBy: GroupBy;
  dueDateColumnId: number;
  priority: number | undefined;
  createdTask: Task | undefined;
  dueDateColumn: DueDateColumns;
  currentColumn: UndeterminedColumn;
};

export type UpdateColumnTitleArgType = {
  newTitle: string | undefined;
  titleInput: string | undefined;
  currentColumn: UndeterminedColumn | undefined;
};
