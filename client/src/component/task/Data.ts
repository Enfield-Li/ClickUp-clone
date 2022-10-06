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
  | "DONE";

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
  | "FRIDAY";

type Column<T> = { id: number; title: T; color: string };
export type StatusColumns = Column<string>[];
export type PriorityColumns = Column<Priority>[];
export type DueDateColumns = Column<DueDate>[];

export type ColumnOptions = {
  status: StatusColumns;
  priority: PriorityColumns;
  dueDate: DueDateColumns;
};

export const columnOptions: ColumnOptions = {
  status: [
    { id: 1, title: "TO DO", color: "gray.400" },
    { id: 2, title: "IN PROGRESS", color: "purple.400" },
    { id: 3, title: "DONE", color: "green.400" },
  ],
  priority: [
    { id: 1, title: "NO PRIORITY", color: "gray.400" },
    { id: 2, title: "URGENT", color: "red.400" },
    { id: 3, title: "HIGH", color: "yellow.400" },
    { id: 4, title: "NORMAL", color: "blue.200" },
    { id: 5, title: "LOW", color: "gray.400" },
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
  ],
};

// Tasks
export type Task = {
  id?: number;
  title: string;
  status?: number;
  dueDate?: number;
  priority?: number;
  description?: string;
  // determine the task order
  previousItem: {
    statusId?: number;
    dueDateId?: number;
    priorityId?: number;
  };
};

export type TaskList = Task[];
export type ColumnType = { id: number; title: string; color: string };
export type Columns = ColumnType[];
export type InitialData = { tasks: TaskList };

export const initialData: TaskList = [
  {
    id: 111,
    title: "11111",
    status: 1,
    priority: 2,
    dueDate: 1,
    previousItem: {},
  },
  {
    id: 222,
    title: "22222",
    status: 1,
    priority: 1,
    dueDate: 1,
    previousItem: { statusId: 111, dueDateId: 111 },
  },
  {
    id: 333,
    title: "33333",
    status: 1,
    priority: 1,
    dueDate: 1,
    previousItem: { statusId: 222, priorityId: 222, dueDateId: 222 },
  },
  {
    id: 444,
    title: "44444",
    status: 1,
    priority: 1,
    dueDate: 2,
    previousItem: { statusId: 333, priorityId: 333 },
  },
  {
    id: 555,
    title: "55555",
    status: 1,
    priority: 1,
    dueDate: 2,
    previousItem: { statusId: 444, priorityId: 444, dueDateId: 444 },
  },
  {
    id: 666,
    title: "66666",
    status: 1,
    priority: 3,
    dueDate: 1,
    previousItem: { statusId: 555, priorityId: 777, dueDateId: 333 },
  },
  {
    id: 777,
    title: "77777",
    status: 1,
    priority: 3,
    dueDate: 1,
    previousItem: { statusId: 666, dueDateId: 666 },
  },
];

// States
export type OrderedTasks = { taskList: TaskList; id: number }[];
export type State = {
  orderedTasks: OrderedTasks;
  unorderedColumns: ColumnOptions;
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
export type PreviousTaskValue = { updateSortBy: SortBy; columnId: number };
export type PreviousTaskValues = PreviousTaskValue[];
