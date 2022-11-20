// Sorting options
export enum SortBy {
  STATUS = "status",
  PRIORITY = "priority",
  DUE_DATE = "dueDate",
}
type ColumnField = SortBy;

// Columns
export enum DefaultStatus {
  TO_DO = "TO DO",
  DONE = "Done",
}
export type Status = string | DefaultStatus;

export enum Priority {
  LOW = "LOW",
  NORMAL = "NORMAL",
  HIGH = "HIGH",
  URGENT = "URGENT",
  NO_PRIORITY = "NO PRIORITY",
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
  OVER_DUE = "OVER DUE",
  TODAY = "TODAY",
  TOMORROW = "TOMORROW",
  FUTURE = "FUTURE",
  NO_DUE_DATE = "NO DUE DATE",
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

interface UserInfo {
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
  beforeUpdate?: string;
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

export type TaskStatusPosition = Position<string>;
export type TaskDueDatePosition = Position<DueDate>;
export type TaskPriorityPosition = Position<Priority>;
export type UndeterminedPosition =
  | TaskStatusPosition
  | TaskDueDatePosition
  | TaskPriorityPosition;

interface TaskPositions {
  status: TaskStatusPosition;
  dueDate: TaskDueDatePosition;
  priority: TaskPriorityPosition;
}

export interface Task {
  id?: number;
  title: string;
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

  status: TaskStatusPosition;
  dueDate: TaskDueDatePosition;
  priority: TaskPriorityPosition;

  // Keep previousTask record when set to finish
  taskStateInMain?: TaskPositions;
  taskStateInListView?: TaskPositions;
}

export type TaskList = Task[];
export type InitialData = { tasks: TaskList };
export type UndeterminedColumn = Column<string>;
export type UndeterminedColumns = UndeterminedColumn[];

// States
export type OrderedTasks = {
  columnId: number;
  taskList: TaskList;
}[];
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

export type UpdateTasksPositionDTO = {
  sourceTaskId: number;
  taskDtoList: TaskList;
};

export interface UpdateTaskTitleDTO {
  taskId: number;
  newTitle: string;
}

export interface UpdateTaskDescDTO {
  taskId: number;
  newDesc: string;
}
