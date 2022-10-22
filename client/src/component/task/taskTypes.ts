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

export type DueDate =
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
  | "FRIDAY"
  | "FINISHED";

interface Column<T> {
  id: number;
  title: T;
  color: string;
}
export interface DueDateColumn extends Column<DueDate> {
  localDateStr?: string;
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
  userId: number;
  username: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type Reaction = {
  id?: number;
  userId: number;
  username: string;
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

export type Task = {
  id?: number;
  date?: Date;
  title: string;
  status?: number;
  dueDate?: number;
  priority?: number;
  createdAt?: Date;
  updatedAt?: Date;
  creatorId: number;
  creatorName: string;
  description?: string;
  watchers: UserInfo[];
  assignees: UserInfo[];
  // Determine the task order
  previousTask: PreviousTask;
  taskEvents: (UpdateEvent | CommentEvent | AssignmentEvent)[];
  // Keep previousTask record when set to finish
  previousTaskBeforeFinish?: PreviousTaskBeforeFinish;
};

export type TaskList = Task[];
export type ColumnType = Column<string>;
export type Columns = ColumnType[];
export type InitialData = { tasks: TaskList };

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

export type LookUpDueDateId = {
  [index: number]: number;
};

// Task creation types
export type TargetColumn = {
  status?: string | undefined;
  priority?: string | undefined;
  dueDate?: string | undefined;
};
export type TargetTasksInColumn = { updateSortBy: SortBy; columnId: number }[];

// DTO
export type TaskDTO = {
  id: number;
  title: string;
  dueDate?: Date;
  status?: number;
  priority?: number;
  creatorId: number;
  creatorName: string;
  description?: string;
  watchers: UserInfo[];
  assignees: UserInfo[];
  // Determine the task order
  previousTask: PreviousTask;
  taskEvents: UpdateEventDTO[];
  // Keep previousTask record when set to finish
  previousTaskBeforeFinish?: PreviousTaskBeforeFinish;
};

export type UpdateEventDTO = {
  field: Field;
  taskId: number;
  userId: number;
  username: string;

  // Comment event
  comment?: string;
  // Update event
  afterUpdate?: string;
  beforeUpdate?: string;
  // Assignment event
  assignedUser?: UserInfo;
  assignmentAction?: AssignmentAction;
};

export type UpdateTasksPositionDTO = {
  sourceTaskId: number;
  taskDtoList: TaskList;
};

export type UpdateTaskTitleDTO = {
  id: number;
  newTitle: string;
};

export type UpdateTaskDescDTO = {
  id: number;
  newDesc: string;
};
