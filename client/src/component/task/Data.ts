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

export type Task = {
  id: number;
  title: string;
  status?: number;
  dueDate?: number;
  priority?: number;
  description?: string;
  previousItem: {
    statusId?: number;
    dueDateId?: number;
    priorityId?: number;
  };
};

export const STATUS = "status";
export const PRIORITY = "priority";
export const DUE_DATE = "dueDate";

export type SortBy = typeof STATUS | typeof PRIORITY | typeof DUE_DATE;

export type ColumnOptions = {
  status: { id: number; title: string }[];
  priority: { id: number; title: Priority }[];
  dueDate: { id: number; title: DueDate }[];
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
    dueDate: 1,
    previousItem: { statusId: 333, priorityId: 333, dueDateId: 333 },
  },
  {
    id: 555,
    title: "55555",
    status: 1,
    priority: 1,
    dueDate: 1,
    previousItem: { statusId: 444, priorityId: 444, dueDateId: 444 },
  },
  {
    id: 666,
    title: "66666",
    status: 1,
    priority: 1,
    dueDate: 1,
    previousItem: { statusId: 555, priorityId: 555, dueDateId: 555 },
  },
  {
    id: 777,
    title: "77777",
    status: 1,
    priority: 1,
    dueDate: 1,
    previousItem: { statusId: 666, priorityId: 666, dueDateId: 666 },
  },
];

export type OrderedTasks = { taskList: TaskList; id: number }[];
export type State = {
  orderedTasks: OrderedTasks;
  unorderedColumns: ColumnOptions;
};
export type SetState = React.Dispatch<React.SetStateAction<State | undefined>>;
