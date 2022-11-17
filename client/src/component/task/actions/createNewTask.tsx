import {
  DueDateColumn,
  DueDateColumns,
  DueDateRange,
  OrderedTasks,
  Priority,
  PriorityColumn,
  PriorityColumns,
  SetTaskState,
  SortBy,
  StatusColumn,
  StatusColumns,
  TargetColumnAndId,
  Task,
  TaskDueDatePosition,
  TaskList,
  TaskPriorityPosition,
  TaskState,
  TaskStatusPosition,
  UndeterminedColumn,
  UndeterminedColumns,
} from "../../../types";
import { deepCopy } from "../../../utils/deepCopy";
import {
  getDueDateFromExpectedDueDate,
  updatePreviousIdsInColumn,
} from "./taskProcessing";

export type NewTask = {
  title: string;
  status?: number;
  priority?: number;
  expectedDueDate?: Date;
};

export async function createNewTask(
  newTaskInput: NewTask,
  state: TaskState,
  currentColumn: UndeterminedColumn,
  sortBy: SortBy,
  setState: SetTaskState
) {
  // Prepare newTask
  const { title, expectedDueDate, priority, status } = newTaskInput;

  if (isDueDateColumns(currentColumn, sortBy)) {
  } else {
    const newTask = newTaskFactory(title, expectedDueDate);
    const dueDateColumnId = getDueDateFromExpectedDueDate(
      state.columnOptions.dueDateColumns,
      expectedDueDate
    );

    // Set position under current column/sortBy
    const currentTaskList = state.orderedTasks.find(
      (orderedTaskList) => orderedTaskList.columnId === currentColumn.id
    );
    const lastTaskInCurrentTaskList =
      currentTaskList?.taskList[currentTaskList?.taskList.length];

    newTask[sortBy].columnId = currentColumn.id;
    newTask[sortBy].name = currentColumn.title;
    newTask[sortBy].orderIndex = lastTaskInCurrentTaskList
      ? lastTaskInCurrentTaskList[sortBy].orderIndex + 1
      : 1;

    // set position for other sortBys'
    const targetColumnAndId: TargetColumnAndId = newTargetStateColumnId(
      sortBy,
      dueDateColumnId,
      priority,
      status
    );

    for (let i = 0; i < Object.entries(targetColumnAndId).length; i++) {
      const stateColumnPair = Object.entries(targetColumnAndId)[i];
      const targetState = stateColumnPair[0] as SortBy;
      const columnId = stateColumnPair[1];

      const { orderIndex, columnName } = findTheLastOrderIndexInColumn(
        targetState,
        columnId,
        state
      );
      newTask[targetState].name = columnName;
      newTask[targetState].orderIndex = orderIndex;
    }
  }
}

interface OrderIndexAndName {
  orderIndex: number;
  columnName: string;
}
function findTheLastOrderIndexInColumn(
  sortBy: SortBy,
  columnId: number,
  state: TaskState
): OrderIndexAndName {
  const allTasks = collectAllTasks(state.orderedTasks);

  const allOrderIndex: number[] = [];
  const orderIndexAndName: OrderIndexAndName = {
    orderIndex: 1,
    columnName: "",
  };

  allTasks.forEach((task) => {
    if (task[sortBy].columnId === columnId) {
      allOrderIndex.push(task[sortBy].columnId);
      orderIndexAndName.columnName = task[sortBy].name;
    }
  });

  if (allOrderIndex.length) {
    orderIndexAndName.orderIndex = Math.max(...[...allOrderIndex]) + 1;
  } else {
    const undeterminedColumns = state.columnOptions[
      `${sortBy}Columns`
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
  }

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

function isStatusColumns(
  currentColumn: UndeterminedColumn,
  sortBy: SortBy
): currentColumn is StatusColumn {
  return sortBy === SortBy.STATUS;
}
function isPriorityColumns(
  currentColumn: UndeterminedColumn,
  sortBy: SortBy
): currentColumn is PriorityColumn {
  return sortBy === SortBy.PRIORITY;
}
function isDueDateColumns(
  currentColumn: UndeterminedColumn,
  sortBy: SortBy
): currentColumn is DueDateColumn {
  return sortBy === SortBy.DUE_DATE;
}

function newTargetStateColumnId(
  sortBy: SortBy,
  dueDateColumnId: number,
  status?: number,
  priority?: number
) {
  const targetColumn: TargetColumnAndId = {};
  if (sortBy === SortBy.STATUS) {
    targetColumn.dueDate = 1;
    targetColumn.priority = 1;
  } else if (sortBy === SortBy.PRIORITY) {
    targetColumn.status = 1;
    targetColumn.priority = 1;
  } else if (sortBy === SortBy.DUE_DATE) {
    targetColumn.status = 1;
    targetColumn.priority = 1;
  }
  return targetColumn;
}

function newTaskFactory(title: string, expectedDueDate?: Date): Task {
  return {
    id: Math.random(),
    title,
    expectedDueDate,
    taskEvents: [],
    watchers: [],
    assignees: [],
    subTasks: [],
    status: newTaskStatusPosition(),
    dueDate: newTaskDueDatePosition(),
    priority: newTaskPriorityPosition(),
  };
}

function newTaskStatusPosition(): TaskStatusPosition {
  return {
    name: "",
    columnId: -1,
    orderIndex: -1,
  };
}
function newTaskPriorityPosition(): TaskPriorityPosition {
  return {
    name: Priority.NO_PRIORITY,
    columnId: 1,
    orderIndex: -1,
  };
}
function newTaskDueDatePosition(): TaskDueDatePosition {
  return {
    name: DueDateRange.NO_DUE_DATE,
    columnId: 1,
    orderIndex: -1,
  };
}
