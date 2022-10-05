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

export type StatusColumns = { id: number; title: string }[];
export type PriorityColumns = { id: number; title: Priority }[];
export type DueDateColumns = { id: number; title: DueDate }[];

export type ColumnOptions = {
  status: StatusColumns;
  priority: PriorityColumns;
  dueDate: DueDateColumns;
};

export const columnOptions: ColumnOptions = {
  status: [
    { id: 1, title: "TO DO" },
    { id: 2, title: "IN PROGRESS" },
    { id: 3, title: "DONE" },
  ],
  priority: [
    { id: 1, title: "NO PRIORITY" },
    { id: 2, title: "URGENT" },
    { id: 3, title: "HIGH" },
    { id: 4, title: "NORMAL" },
    { id: 5, title: "LOW" },
  ],
  dueDate: [
    { id: 1, title: "NO DUE DATE" },
    { id: 2, title: "OVER DUE" },
    { id: 3, title: "MONDAY" },
    { id: 4, title: "TUESDAY" },
    { id: 5, title: "WEDNESDAY" },
    { id: 6, title: "THURSDAY" },
    { id: 7, title: "FRIDAY" },
    { id: 8, title: "SATURDAY" },
    { id: 9, title: "SUNDAY" },
    { id: 10, title: "FUTURE" },
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
  isLastItem: { // determine if the task is the last task in the column
    inStatus?: boolean;
    inPriority?: boolean;
    inDueDate?: boolean;
  };
  previousItem: { // determine if the task is the first task in the column
    statusId?: number;
    dueDateId?: number;
    priorityId?: number;
  };
};

export type TaskList = Task[];
export type ColumnType = { id: number; title: string };
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
    isLastItem: { inPriority: true },
  },
  {
    id: 222,
    title: "22222",
    status: 1,
    priority: 1,
    dueDate: 1,
    previousItem: { statusId: 111, dueDateId: 111 },
    isLastItem: {},
  },
  {
    id: 333,
    title: "33333",
    status: 1,
    priority: 1,
    dueDate: 1,
    previousItem: { statusId: 222, priorityId: 222, dueDateId: 222 },
    isLastItem: {},
  },
  {
    id: 444,
    title: "44444",
    status: 1,
    priority: 1,
    dueDate: 2,
    previousItem: { statusId: 333, priorityId: 333 },
    isLastItem: {},
  },
  {
    id: 555,
    title: "55555",
    status: 1,
    priority: 1,
    dueDate: 2,
    previousItem: { statusId: 444, priorityId: 444, dueDateId: 444 },
    isLastItem: { inDueDate: true },
  },
  {
    id: 666,
    title: "66666",
    status: 1,
    priority: 3,
    dueDate: 1,
    previousItem: { statusId: 555, priorityId: 777, dueDateId: 333 },
    isLastItem: { inPriority: true },
  },
  {
    id: 777,
    title: "77777",
    status: 1,
    priority: 3,
    dueDate: 1,
    previousItem: { statusId: 666, dueDateId: 666 },
    isLastItem: { inStatus: true, inDueDate: true },
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
