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

export type SortingOptions = {
  status: { id: number; title: string }[];
  priority: { id: number; title: Priority }[];
  dueDate: { id: number; title: DueDate }[];
};

export const sortingOptions: SortingOptions = {
  status: [
    { id: 0, title: "TO DO" },
    { id: 1, title: "IN PROGRESS" },
    { id: 2, title: "DONE" },
  ],
  priority: [
    { id: 0, title: "NO PRIORITY" },
    { id: 1, title: "LOW" },
    { id: 2, title: "NORMAL" },
    { id: 3, title: "HIGH" },
    { id: 4, title: "URGENT" },
    { id: 5, title: "DONE" },
  ],
  dueDate: [
    { id: 0, title: "NO DUE DATE" },
    { id: 1, title: "OVER DUE" },
    { id: 3, title: "MONDAY" },
    { id: 4, title: "TUESDAY" },
    { id: 5, title: "WEDNESDAY" },
    { id: 6, title: "THURSDAY" },
    { id: 7, title: "FRIDAY" },
    { id: 8, title: "SATURDAY" },
    { id: 9, title: "SUNDAY" },
    { id: 10, title: "FUTURE" },
    { id: 11, title: "DONE" },
  ],
};

export type TaskList = Task[];
export type ColumnType = { id: number; title: string };
export type Columns = ColumnType[];
export type InitialData = { tasks: TaskList };

export const initialData: InitialData = {
  tasks: [
    {
      id: 666,
      title: "66666",
      status: 1,
      priority: 0,
      dueDate: 0,
      previousItem: { statusId: 555, priorityId: 555, dueDateId: 555 },
    },
    {
      id: 555,
      title: "55555",
      status: 1,
      priority: 0,
      dueDate: 0,
      previousItem: { statusId: 111, priorityId: 444, dueDateId: 444 },
    },
    {
      id: 444,
      title: "44444",
      status: 2,
      priority: 0,
      dueDate: 0,
      previousItem: { statusId: 222, priorityId: 222, dueDateId: 222 },
    },
    {
      id: 222,
      title: "22222",
      status: 2,
      priority: 0,
      dueDate: 0,
      previousItem: { statusId: 777, priorityId: 111, dueDateId: 111 },
    },
    {
      id: 111,
      title: "11111",
      status: 1,
      priority: 0,
      dueDate: 0,
      previousItem: { priorityId: 777, dueDateId: 777 },
    },
    {
      id: 777,
      title: "77777",
      status: 2,
      priority: 0,
      dueDate: 0,
      previousItem: { priorityId: 333, dueDateId: 333 },
    },
    { id: 333, title: "33333", status: 0, priority: 0, previousItem: {} },
  ],
};

export type OrderedTasks = TaskList[];
export type State = OrderedTasks;
export type SetState = React.Dispatch<React.SetStateAction<State | undefined>>;
