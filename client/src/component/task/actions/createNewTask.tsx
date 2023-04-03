import { createTask } from "../../../networkCalls";
import {
  AddTaskArgType,
  DueDateColumns,
  DueDateRange,
  GroupBy,
  OrderedTasks,
  Priority,
  TargetColumnAndId,
  Task,
  TaskList,
  TaskState,
  UndeterminedColumn,
  UndeterminedColumns,
  User,
  UserInfo,
} from "../../../types";
import { getDueDateColumnIdFromExpectedDueDate } from "./taskProcessing";

export type NewTask = {
  title: string;
  status?: number;
  priority?: number;
  expectedDueDate: Date | null;
};

interface CreateNewTaskParam {
  listId: number;
  groupBy: GroupBy;
  creator: UserInfo;
  newTaskInput: NewTask;
  taskState: TaskState;
  dueDateColumn: DueDateColumns;
  currentColumn: UndeterminedColumn;
  addTask: (param: AddTaskArgType) => void;
}

export async function createNewTask({
  listId,
  groupBy,
  creator,
  addTask,
  taskState,
  newTaskInput,
  currentColumn,
  dueDateColumn,
}: CreateNewTaskParam) {
  // Prepare newTask
  const { title, expectedDueDate, priority, status } = newTaskInput;
  const newTask = newTaskFactory({
    title,
    listId,
    creator,
    expectedDueDate,
  });
  const dueDateColumnId = getDueDateColumnIdFromExpectedDueDate(
    taskState.columnOptions.dueDateColumns,
    expectedDueDate
  );

  // Set position under current column/groupBy
  setCurrentTaskAttribute({ newTask, groupBy, taskState, currentColumn });

  // set position for other groupBys'
  const defaultStatusColumnId = taskState.columnOptions.statusColumns[0].id;
  const targetColumnAndId: TargetColumnAndId = newTargetStateColumnId({
    groupBy,
    status,
    priority,
    dueDateColumnId,
    defaultStatusColumnId,
  });
  setOtherColumnPosition({ targetColumnAndId, taskState, task: newTask });

  // network call
  const createdTask = await createTask(newTask);

  addTask({
    createdTask,
    currentColumn,
    dueDateColumn,
    dueDateColumnId,
    groupBy,
    priority,
  });
}

interface SetCurrentTaskAttributeParam {
  newTask: Task;
  groupBy: GroupBy;
  taskState: TaskState;
  currentColumn: UndeterminedColumn;
}
export function setCurrentTaskAttribute({
  newTask,
  groupBy,
  taskState,
  currentColumn,
}: SetCurrentTaskAttributeParam) {
  const currentTaskList = taskState.orderedTasks.find(
    (orderedTaskList) => orderedTaskList.columnId === currentColumn.id
  );
  const lastTaskInCurrentColumn =
    currentTaskList?.taskList[currentTaskList?.taskList.length - 1];

  newTask[groupBy].columnId = currentColumn.id!;
  newTask[groupBy].name = currentColumn.title;
  newTask[groupBy].orderIndex = lastTaskInCurrentColumn
    ? lastTaskInCurrentColumn[groupBy].orderIndex + 1
    : 1;
}

interface SetOtherColumnPositionParam {
  targetColumnAndId: TargetColumnAndId;
  taskState: TaskState;
  task: Task;
}
export function setOtherColumnPosition({
  targetColumnAndId,
  taskState,
  task,
}: SetOtherColumnPositionParam) {
  const numOfKeys = Object.entries(targetColumnAndId).length;
  for (let i = 0; i < numOfKeys; i++) {
    const stateColumnPair = Object.entries(targetColumnAndId)[i];
    const targetSortBy = stateColumnPair[0] as GroupBy;
    const columnId = stateColumnPair[1];

    const { orderIndex, columnName }: OrderIndexInColumn =
      findTheLastOrderIndexInColumn(targetSortBy, columnId, taskState);

    task[targetSortBy].name = columnName;
    task[targetSortBy].columnId = columnId;
    task[targetSortBy].orderIndex = orderIndex;
  }
}

export interface OrderIndexInColumn {
  orderIndex: number;
  columnName: string;
}
export function findTheLastOrderIndexInColumn(
  groupBy: GroupBy,
  columnId: number,
  taskState: TaskState
): OrderIndexInColumn {
  const allTasks = collectAllTasks(taskState.orderedTasks);

  const allOrderIndex: number[] = [];
  const orderIndexAndName: OrderIndexInColumn = {
    orderIndex: 1, // default
    columnName: "",
  };

  // collect all tasks' orderIndex
  allTasks.forEach((task) => {
    if (task[groupBy].columnId === columnId) {
      allOrderIndex.push(task[groupBy].orderIndex);
      orderIndexAndName.columnName = task[groupBy].name;
    }
  });

  // override orderIndex when target column not empty
  if (allOrderIndex.length) {
    orderIndexAndName.orderIndex = Math.max(...allOrderIndex) + 1;
  }

  // override column name
  const undeterminedColumns = taskState.columnOptions[
    `${groupBy}Columns`
  ] as UndeterminedColumns;

  const currentColumn = undeterminedColumns.find(
    (column) => column.id === columnId
  );
  if (!currentColumn) {
    throw new Error(
      "Failed to find the last orderIndex, failed to find column"
    );
  }

  orderIndexAndName.columnName = currentColumn?.title;

  return orderIndexAndName;
}

export function collectAllTasks(orderedTasks: OrderedTasks): TaskList {
  let taskList: TaskList = [];
  for (let i = 0; i < orderedTasks.length; i++) {
    const orderedTask = orderedTasks[i];
    taskList = [...taskList, ...orderedTask.taskList];
  }
  return taskList;
}

interface NewTargetStateColumnIdParam {
  groupBy: GroupBy;
  status?: number;
  priority?: number;
  dueDateColumnId: number;
  defaultStatusColumnId?: number;
}
function newTargetStateColumnId({
  groupBy,
  status,
  priority,
  dueDateColumnId,
  defaultStatusColumnId,
}: NewTargetStateColumnIdParam) {
  const targetColumn: TargetColumnAndId = {};
  if (groupBy === GroupBy.STATUS) {
    targetColumn.dueDate = dueDateColumnId;
    targetColumn.priority = priority ? priority : 1;
  } else if (groupBy === GroupBy.PRIORITY) {
    targetColumn.status = status ? status : defaultStatusColumnId;
    targetColumn.dueDate = dueDateColumnId;
  } else if (groupBy === GroupBy.DUE_DATE) {
    targetColumn.status = status ? status : defaultStatusColumnId;
    targetColumn.priority = priority ? priority : 1;
  }
  return targetColumn;
}

interface NewTaskFactoryParam {
  creator: UserInfo;
  title: string;
  listId: number;
  expectedDueDate: Date | null;
}
function newTaskFactory({
  creator,
  title,
  listId,
  expectedDueDate,
}: NewTaskFactoryParam): Task {
  return {
    id: Math.random(),
    title,
    listId,
    expectedDueDate,
    taskEvents: [],
    watchers: [creator],
    assignees: [],
    subTasks: [],
    creator,
    status: {
      name: "",
      columnId: -1,
      orderIndex: -1,
    },
    dueDate: {
      name: DueDateRange.NO_DUE_DATE,
      columnId: 1,
      orderIndex: -1,
    },
    priority: {
      name: Priority.NO_PRIORITY,
      columnId: 1,
      orderIndex: -1,
    },
  };
}

export function newCreator(user: User | null): UserInfo {
  if (!user) throw new Error("user not initialized");

  return {
    userId: user.id,
    username: user.username,
    email: user.email,
  };
}
