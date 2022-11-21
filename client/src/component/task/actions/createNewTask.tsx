import produce from "immer";
import {
  DueDateRange,
  OrderedTasks,
  Priority,
  SetTaskState,
  SortBy,
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
import { getDueDateColumnIdFromExpectedDueDate } from "./taskProcessing";

export type NewTask = {
  title: string;
  status?: number;
  priority?: number;
  expectedDueDate: Date | null;
};

export async function createNewTask(
  sortBy: SortBy,
  newTaskInput: NewTask,
  setTaskState: SetTaskState,
  currentColumn: UndeterminedColumn
) {
  setTaskState(
    (taskState) =>
      taskState &&
      produce(taskState, (draftState) => {
        // Prepare newTask
        const { title, expectedDueDate, priority, status } = newTaskInput;
        const newTask = newTaskFactory(title, expectedDueDate);
        const dueDateColumnId = getDueDateColumnIdFromExpectedDueDate(
          draftState.columnOptions.dueDateColumns,
          expectedDueDate
        );

        // Set position under current column/sortBy
        setCurrentTaskAttribute(newTask, sortBy, draftState, currentColumn);

        // set position for other sortBys'
        const targetColumnAndId: TargetColumnAndId = newTargetStateColumnId(
          sortBy,
          dueDateColumnId,
          priority,
          status
        );

        updateTaskOnTargetColumnAndId(targetColumnAndId, draftState, newTask);

        draftState.orderedTasks.forEach((orderedTask) => {
          const isCurrentColumn = orderedTask.columnId === currentColumn.id;
          if (isCurrentColumn) orderedTask.taskList.push(newTask);
        });
      })
  );
}

export function setCurrentTaskAttribute(
  newTask: Task,
  sortBy: SortBy,
  taskState: TaskState,
  currentColumn: UndeterminedColumn
) {
  const currentTaskList = taskState.orderedTasks.find(
    (orderedTaskList) => orderedTaskList.columnId === currentColumn.id
  );
  const lastTaskInCurrentColumn =
    currentTaskList?.taskList[currentTaskList?.taskList.length - 1];

  newTask[sortBy].columnId = currentColumn.id;
  newTask[sortBy].name = currentColumn.title;
  newTask[sortBy].orderIndex = lastTaskInCurrentColumn
    ? lastTaskInCurrentColumn[sortBy].orderIndex + 1
    : 1;
}

export function updateTaskOnTargetColumnAndId(
  targetColumnAndId: TargetColumnAndId,
  taskState: TaskState,
  task: Task
) {
  const numOfKeys = Object.entries(targetColumnAndId).length;
  for (let i = 0; i < numOfKeys; i++) {
    const stateColumnPair = Object.entries(targetColumnAndId)[i];
    const targetSortBy = stateColumnPair[0] as SortBy;
    const columnId = stateColumnPair[1];

    const { orderIndex, columnName }: OrderIndexInColumn =
      findTheLastOrderIndexInColumn(targetSortBy, columnId, taskState);
    console.log({ orderIndex, columnName });

    task[targetSortBy].name = columnName;
    task[targetSortBy].columnId = columnId;
    task[targetSortBy].orderIndex = orderIndex;
    console.log({ task: deepCopy(task) });
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

function newTargetStateColumnId(
  sortBy: SortBy,
  dueDateColumnId: number,
  status?: number,
  priority?: number
) {
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

function newTaskFactory(title: string, expectedDueDate: Date | null): Task {
  return {
    id: Math.random(),
    title,
    expectedDueDate,
    taskEvents: [],
    watchers: [],
    assignees: [],
    subTasks: [],
    creator: { userId: 0, username: "" },
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
