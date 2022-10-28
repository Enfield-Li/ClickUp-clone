import { getDaysBefore } from "../../utils/getWeekDays";

// Sorting options
export const STATUS = "status";
export const PRIORITY = "priority";
export const DUE_DATE = "dueDate";

export type SortBy = typeof STATUS | typeof PRIORITY | typeof DUE_DATE;

// Columns
export type Status = "TO DO" | "IN PROGRESS" | "DONE";

export type Priority =
  | "LOW"
  | "NORMAL"
  | "HIGH"
  | "URGENT"
  | "NO PRIORITY"
  | "DONE"
  | "FINISHED";

export type SelectableDueDate =
  | "OVER DUE"
  | "TODAY"
  | "TOMORROW"
  | "SATURDAY"
  | "SUNDAY"
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "FUTURE"
  | "DONE"
  | "NO DUE DATE"
  | "THURSDAY"
  | "FRIDAY";

export type DueDate = SelectableDueDate | "FINISHED";

interface Column<T> {
  id: number;
  title: T;
  color: string;
}
export interface DueDateColumn extends Column<DueDate> {
  localDateStr?: string; // Format: 10/10/2022
}
export type PriorityColumn = Column<Priority>;
export type StatusColumn = {
  id: number;
  title: string;
  color: string;
  previousColumnId?: number;
};

export type StatusColumns = StatusColumn[];
export type PriorityColumns = PriorityColumn[];
export type DueDateColumns = DueDateColumn[];

export type ColumnOptions = {
  status: StatusColumns;
  priority: PriorityColumns;
  dueDate: DueDateColumns;
};

// task
type PreviousTask = {
  statusId?: number;
  dueDateId?: number;
  priorityId?: number;
};

type PreviousTaskBeforeFinish = {
  dueDateId?: number;
  priorityId?: number;
};

export const TITLE = "title";
export const COMMENT = "comment";
export const WATCHER = "watcher";
export const ASSIGNEE = "assignee";

export type Field =
  | typeof STATUS
  | typeof PRIORITY
  | typeof DUE_DATE
  | typeof TITLE
  | typeof ASSIGNEE
  | typeof WATCHER
  | typeof COMMENT;

type UserInfo = {
  userId: number;
  username: string;
};

interface BaseEvent {
  id?: number;
  field: Field;
  taskId: number;
  userId?: number;
  username?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type Reaction = {
  id?: number;
  userId?: number;
  username?: string;
  reaction: string;
};

type AssignmentAction = "added" | "removed";

export interface AssignmentEvent extends BaseEvent {
  assignmentAction: AssignmentAction;
  assignedUser: UserInfo;
}

export type BeforeOrAfterUpdate = {
  afterUpdate: string;
  beforeUpdate?: string;
};

export type UpdateEvent = BaseEvent & BeforeOrAfterUpdate;

export interface CommentEvent extends BaseEvent {
  comment: string;
  reactions: Reaction[];
}

export type TaskEvents = (UpdateEvent | CommentEvent | AssignmentEvent)[];

export type Task = {
  id?: number;
  title: string;
  status?: number; // track client column
  dueDate?: number;
  priority?: number;
  createdAt?: Date;
  updatedAt?: Date;
  creatorId?: number;
  creatorName?: string;
  description?: string;
  expectedDueDate?: Date; // server due date data

  watchers: UserInfo[];
  assignees: UserInfo[];
  // Determine the task order
  taskEvents: TaskEvents;
  previousTask: PreviousTask;
  // Keep previousTask record when set to finish
  previousTaskBeforeFinish?: PreviousTaskBeforeFinish;
};

export type TaskList = Task[];
export type InitialData = { tasks: TaskList };
export type UndeterminedColumn = Column<string>;
export type UndeterminedColumns = UndeterminedColumn[];

// States
export type OrderedTasks = { id: number; taskList: TaskList }[];
export type State = {
  orderedTasks: OrderedTasks;
  columnOptions: ColumnOptions;
};
export type SetState = React.Dispatch<React.SetStateAction<State | undefined>>;

// Look up tables
export const lookUpIsLastItem = {
  status: "inStatus",
  priority: "inPriority",
  dueDate: "inDueDate",
} as const;

export const lookUpPreviousTaskId = {
  status: "statusId",
  priority: "priorityId",
  dueDate: "dueDateId",
} as const;

export type LookUpColumnId = {
  [index: number]: number;
};

export type LookUpDueDate = {
  [index in SelectableDueDate]: Date | undefined;
};

// Task creation types
export type TargetColumn = {
  status?: string | undefined;
  priority?: string | undefined;
  dueDate?: string | undefined;
};
export type TargetTasksInColumn = { updateSortBy: SortBy; columnId: number }[];

export type UpdateTasksPositionDTO = {
  sourceTaskId: number;
  taskDtoList: TaskList;
};

export type UpdateTaskTitleDTO = {
  taskId: number;
  newTitle: string;
};

export type UpdateTaskDescDTO = {
  taskId: number;
  newDesc: string;
};
