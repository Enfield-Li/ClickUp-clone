import produce from "immer";
import { createTask } from "../../../networkCalls";
import {
  DueDateRange,
  OrderedTasks,
  Priority,
  SetTaskState,
  SortBy,
  TargetColumnAndId,
  Task,
  DueDatePosition,
  TaskList,
  PriorityPosition,
  TaskState,
  StatusPosition,
  UndeterminedColumn,
  UndeterminedColumns,
  UserInfo,
  AuthStateType,
} from "../../../types";
import { deepCopy } from "../../../utils/deepCopy";
import { getDueDateColumnIdFromExpectedDueDate } from "./taskProcessing";

export type NewTask = {
  title: string;
  status?: number;
  priority?: number;
  expectedDueDate: Date | null;
};

interface CreateNewTaskParam {
  listId: number;
  sortBy: SortBy;
  creator: UserInfo;
  newTaskInput: NewTask;
  taskState: TaskState;
  setTaskState: SetTaskState;
  currentColumn: UndeterminedColumn;
}

export async function createNewTask({
  listId,
  sortBy,
  creator,
  taskState,
  newTaskInput,
  setTaskState,
  currentColumn,
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

  // Set position under current column/sortBy
  setCurrentTaskAttribute({ newTask, sortBy, taskState, currentColumn });

  // set position for other sortBys'
  const targetColumnAndId: TargetColumnAndId = newTargetStateColumnId({
    sortBy,
    status,
    priority,
    dueDateColumnId,
  });
  setOtherColumnPosition({ targetColumnAndId, taskState, task: newTask });

  // network call
  const createdTask = await createTask(newTask);

  setTaskState(
    (taskState) =>
      taskState &&
      produce(taskState, (draftState) => {
        // update local state
        draftState.orderedTasks.forEach((orderedTask) => {
          const targetColumnId =
            sortBy === SortBy.DUE_DATE
              ? dueDateColumnId
              : sortBy === SortBy.PRIORITY
              ? priority
              : currentColumn.id;

          const isCurrentColumn = orderedTask.columnId === targetColumnId;
          if (isCurrentColumn && createdTask) {
            orderedTask.taskList.push(createdTask);
          }
        });
      })
  );
}

interface SetCurrentTaskAttributeParam {
  newTask: Task;
  sortBy: SortBy;
  taskState: TaskState;
  currentColumn: UndeterminedColumn;
}
export function setCurrentTaskAttribute({
  newTask,
  sortBy,
  taskState,
  currentColumn,
}: SetCurrentTaskAttributeParam) {
  const currentTaskList = taskState.orderedTasks.find(
    (orderedTaskList) => orderedTaskList.columnId === currentColumn.id
  );
  const lastTaskInCurrentColumn =
    currentTaskList?.taskList[currentTaskList?.taskList.length - 1];

  newTask[sortBy].columnId = currentColumn.id!;
  newTask[sortBy].name = currentColumn.title;
  newTask[sortBy].orderIndex = lastTaskInCurrentColumn
    ? lastTaskInCurrentColumn[sortBy].orderIndex + 1
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
    const targetSortBy = stateColumnPair[0] as SortBy;
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
  sortBy: SortBy,
  columnId: number,
  taskState: TaskState
): OrderIndexInColumn {
  console.log({ sortBy });

  const allTasks = collectAllTasks(taskState.orderedTasks);

  const allOrderIndex: number[] = [];
  const orderIndexAndName: OrderIndexInColumn = {
    orderIndex: 1, // default
    columnName: "",
  };

  // collect all tasks' orderIndex
  allTasks.forEach((task) => {
    if (task[sortBy].columnId === columnId) {
      allOrderIndex.push(task[sortBy].orderIndex);
      orderIndexAndName.columnName = task[sortBy].name;
    }
  });

  // override orderIndex when target column not empty
  if (allOrderIndex.length) {
    orderIndexAndName.orderIndex = Math.max(...allOrderIndex) + 1;
  }

  // override column name
  const undeterminedColumns = taskState.columnOptions[
    `${sortBy}Columns`
  ] as UndeterminedColumns;
  console.log({ undeterminedColumns });

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
  sortBy: SortBy;
  status?: number;
  priority?: number;
  dueDateColumnId: number;
}
function newTargetStateColumnId({
  sortBy,
  status,
  priority,
  dueDateColumnId,
}: NewTargetStateColumnIdParam) {
  const targetColumn: TargetColumnAndId = {};
  if (sortBy === SortBy.STATUS) {
    targetColumn.dueDate = dueDateColumnId;
    targetColumn.priority = priority ? priority : 1;
  } else if (sortBy === SortBy.PRIORITY) {
    targetColumn.status = status ? status : 1;
    targetColumn.dueDate = dueDateColumnId;
  } else if (sortBy === SortBy.DUE_DATE) {
    targetColumn.status = status ? status : 1;
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

export function newCreator(authState: AuthStateType): UserInfo {
  if (!authState.user) throw new Error("user not initialized");

  return {
    userId: authState.user.id,
    username: authState.user.username,
    email: authState.user.email,
  };
}
