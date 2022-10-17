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
interface DueDateColumn extends Column<DueDate> {
  localDateStr?: string;
}
export type StatusColumn = {
  id: number;
  title: string;
  color: string;
  previousColumnId?: number;
};
export type StatusColumns = StatusColumn[];
export type PriorityColumns = Column<Priority>[];
export type DueDateColumns = DueDateColumn[];

export type ColumnOptions = {
  status: StatusColumns;
  priority: PriorityColumns;
  dueDate: DueDateColumns;
};

export const columnOptions: ColumnOptions = {
  status: [
    { id: 1, title: "TO DO", color: "linkedin.400" },
    { id: 2, title: "IN PROGRESS", color: "purple.400", previousColumnId: 1 },
    { id: 3, title: "DONE", color: "green.400", previousColumnId: 2 },
  ],
  priority: [
    { id: 1, title: "NO PRIORITY", color: "linkedin.400" },
    { id: 2, title: "URGENT", color: "red.400" },
    { id: 3, title: "HIGH", color: "yellow.400" },
    { id: 4, title: "NORMAL", color: "blue.200" },
    { id: 5, title: "LOW", color: "gray.400" },
    { id: 0, title: "FINISHED", color: "null" },
  ],
  dueDate: [
    { id: 1, title: "NO DUE DATE", color: "gray.400" },
    { id: 2, title: "OVER DUE", color: "gray.400" },
    { id: 3, title: "MONDAY", color: "gray.400" },
    { id: 4, title: "TUESDAY", color: "gray.400" },
    { id: 5, title: "WEDNESDAY", color: "gray.400" },
    { id: 6, title: "THURSDAY", color: "gray.400" },
    { id: 7, title: "FRIDAY", color: "gray.400" },
    { id: 8, title: "SATURDAY", color: "gray.400" },
    { id: 9, title: "SUNDAY", color: "gray.400" },
    { id: 10, title: "FUTURE", color: "gray.400" },
    { id: 0, title: "FINISHED", color: "null" },
  ],
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

export const UPDATE = "UPDATE";
export const COMMENT = "COMMENT";
type EventType = typeof UPDATE | typeof COMMENT;

type UpdateAction = keyof ColumnOptions;

type Participant = {
  userId: number;
  username: string;
};
type TaskEvent = {
  id?: number;
  taskId: number;
  createdAt?: Date;
  updatedAt?: Date;
  initiatorId: number;
  initiatorName: string;
  updateTo?: number;
  updateFrom?: number;
  eventType?: EventType;
  updateAction?: UpdateAction;
  commentContent?: string;
  participants: Participant[];
};

// Tasks
export type Task = {
  id?: number;
  title: string;
  status?: number;
  dueDate?: number;
  date?: Date;
  priority?: number;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  creatorId: number;
  creatorName: string;
  taskEvents: TaskEvent[];
  watchers: Participant[];
  assignees: Participant[];
  // Determine the task order
  previousTask: PreviousTask;
  // Keep previousTask record when set to finish
  previousTaskBeforeFinish?: PreviousTaskBeforeFinish;
};

export type TaskList = Task[];
export type ColumnType = Column<string>;
export type Columns = ColumnType[];
export type InitialData = { tasks: TaskList };

export const initialData: TaskList = [
  {
    id: 111,
    title: "11111",
    status: 1,
    priority: 2,
    dueDate: 1,
    previousTask: {},
    taskEvents: [],
    creatorId: 1,
    creatorName: "abc",
    watchers: [],
    assignees: [],
    previousTaskBeforeFinish: {},
  },
  {
    id: 222,
    title: "22222",
    status: 1,
    priority: 1,
    dueDate: 1,
    previousTask: { statusId: 111, dueDateId: 111 },
    taskEvents: [],
    creatorId: 1,
    creatorName: "abc",
    watchers: [],
    assignees: [],
    previousTaskBeforeFinish: {},
  },
  {
    id: 333,
    title: "33333",
    status: 1,
    priority: 1,
    dueDate: 1,
    previousTask: { statusId: 222, priorityId: 222, dueDateId: 222 },
    taskEvents: [],
    creatorId: 1,
    creatorName: "abc",
    watchers: [],
    assignees: [],
    previousTaskBeforeFinish: {},
  },
  {
    id: 444,
    title: "44444",
    status: 1,
    priority: 1,
    dueDate: 2,
    previousTask: { statusId: 333, priorityId: 333 },
    taskEvents: [],
    creatorId: 1,
    creatorName: "abc",
    watchers: [],
    assignees: [],
    previousTaskBeforeFinish: {},
  },
  {
    id: 555,
    title: "55555",
    status: 1,
    priority: 1,
    dueDate: 2,
    previousTask: { statusId: 444, priorityId: 444, dueDateId: 444 },
    taskEvents: [],
    creatorId: 1,
    creatorName: "abc",
    watchers: [],
    assignees: [],
    previousTaskBeforeFinish: {},
  },
  {
    id: 666,
    title: "66666",
    status: 1,
    priority: 3,
    dueDate: 1,
    previousTask: { statusId: 555, priorityId: 777, dueDateId: 333 },
    taskEvents: [],
    creatorId: 1,
    creatorName: "abc",
    watchers: [],
    assignees: [],
    previousTaskBeforeFinish: {},
  },
  {
    id: 777,
    title: "77777",
    status: 1,
    priority: 3,
    dueDate: 1,
    previousTask: { statusId: 666, dueDateId: 666 },
    taskEvents: [],
    creatorId: 1,
    creatorName: "abc",
    watchers: [],
    assignees: [],
    previousTaskBeforeFinish: {},
  },
];

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
export type UpdateListTaskDTO = {
  sourceTaskId: number;
  taskList: TaskList;
};

export type UpdateTaskTitleDTO = {
  id: number;
  newTitle: string;
};

export type UpdateTaskDescDTO = {
  id: number;
  newDesc: string;
};
