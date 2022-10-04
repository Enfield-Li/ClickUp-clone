import { getWeekDays } from "../../utils/getWeekDays";
import {
  ColumnOptions,
  Columns,
  LookUpDueDateId,
  lookUpPreviousTaskId,
  lookUpIsLastItem,
  OrderedTasks,
  SortBy,
  State,
  TaskList,
} from "./Data";

/* 
  Convert unordered Task[] list to OrderedTasks group by for example task.priorityId:
  Find all sorting occurrences,
    and, based on the id, generate respective nested list for that id, 
    for example:
      sortBy = "priority"

      from:
        status column data: 
          [
            { id: 1, title: "TO DO" },
            { id: 2, title: "IN PROGRESS" },
            { id: 3, title: "DONE" },
          ],
        with task data:
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

      to:
        [
          {
            id: 1, // <- priority id
            tasks: [{
              id: 111,
              title: "11111",
              status: 1,
              priority: 2,
              dueDate: 1,
              previousItem: {},
            }]
          },
          {
            id: 2, // <- priority id
            tasks: [{
              id: 222,
              title: "22222",
              status: 1,
              priority: 1,
              dueDate: 1,
              previousItem: { statusId: 111, dueDateId: 111 },
            }]
          }
        ]
*/
export function processTaskBasedOnSortBy(
  tasks: TaskList,
  columns: Columns,
  sortBy: SortBy
): OrderedTasks {
  const nestedTasks: OrderedTasks = [];

  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];

    nestedTasks[i] = { id: column.id, taskList: [] };

    const element = columns[i];
    const stageId = element.id;

    // Find the first element
    const firstTask = tasks.find(
      (task) =>
        task[sortBy] === stageId &&
        !task.previousItem[lookUpPreviousTaskId[sortBy]]
    );
    if (firstTask) nestedTasks[i].taskList[0] = firstTask;

    // Find all the entailing element based on sortBy
    for (let k = 0; k < nestedTasks[i].taskList.length; k++) {
      const currentTask = nestedTasks[i].taskList[k];

      const entailingTask = tasks.find(
        (task) =>
          task.previousItem[lookUpPreviousTaskId[sortBy]] === currentTask.id
      );

      if (entailingTask) nestedTasks[i].taskList.push(entailingTask);
    }
  }

  return nestedTasks;
}

/* 
    Reorder the dueDate columns. 
    For instance, today is WEDNESDAY, 
    
    from
      [
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
    to:
      [
        { "id": 1, "title": "NO DUE DATE" }, 
        { "id": 2, "title": "OVER DUE" },
        { "id": 5, "title": "TODAY" },      // <- rename title
        { "id": 6, "title": "TOMORROW" },   // <- rename title
        { "id": 7, "title": "FRIDAY" },
        { "id": 8, "title": "SATURDAY" },
        { "id": 9, "title": "SUNDAY" },
        { "id": 3, "title": "MONDAY" },
        { "id": 4, "title": "TUESDAY" },
        { "id": 10, "title": "FUTURE" }
      ]
 */
export function renameAndReorderColumns(
  sortingOptions: ColumnOptions,
  sortBy: SortBy
) {
  const originalColumns = sortingOptions[sortBy];
  const { todayWeekDay, tomorrowWeekDay } = getWeekDays();

  // rename columns to Today and Tomorrow
  const updatedColumns = originalColumns.map((column) => {
    if (column.title === todayWeekDay) {
      return { id: column.id, title: "TODAY" };
    } else if (column.title === tomorrowWeekDay) {
      return { id: column.id, title: "TOMORROW" };
    } else {
      return column;
    }
  });

  // put today to the front
  const columnsLength = updatedColumns.length;
  const front = updatedColumns.slice(0, 2);
  const end = updatedColumns.slice(columnsLength - 1, columnsLength + 1);

  const weekDayColumns = updatedColumns.slice(2, columnsLength - 1);

  const todayIndex = weekDayColumns.findIndex(
    (column) => column.title === "TODAY"
  );
  const weekDayEnd = weekDayColumns.slice(0, todayIndex);
  const weekDayFront = weekDayColumns.slice(
    todayIndex,
    weekDayColumns.length + 1
  );
  const weekDayColumnsFinal = [...weekDayFront, ...weekDayEnd];

  return [...front, ...weekDayColumnsFinal, ...end];
}

// Collect all tasks from OrderedTasks to Task[]
export function collectAllTasks(orderedTasks: OrderedTasks): TaskList {
  let taskList: TaskList = [];

  for (let i = 0; i < orderedTasks.length; i++) {
    const orderedTask = orderedTasks[i];
    taskList = [...taskList, ...orderedTask.taskList];
  }

  return taskList;
}

// Given sortBy and columnId, find the last element id in all the tasks in the state
export function findTheLastTaskIdOnSortByAndColumnId(
  orderedTasks: OrderedTasks,
  sortBy: SortBy,
  columnId: number
) {
  const allTasks = collectAllTasks(orderedTasks);

  const taskListBasedOnSortBy: TaskList = [];

  // Find the first element
  for (let i = 0; i < allTasks.length; i++) {
    const task = allTasks[i];

    if (task[sortBy] === columnId) {
      taskListBasedOnSortBy.push(task);
    }
  }

  // Find all the element based on sortBy
  const orderedTaskListBasedOnSortBy: TaskList = [];

  const firstTask = taskListBasedOnSortBy.find(
    (task) => !task.previousItem[`${sortBy}Id`]
  );
  if (firstTask) orderedTaskListBasedOnSortBy[0] = firstTask;

  // Find all the entailing elements
  for (let i = 0; i < orderedTaskListBasedOnSortBy.length; i++) {
    const currentTask = orderedTaskListBasedOnSortBy[i];
    const entailingTask = taskListBasedOnSortBy.find(
      (task) => task.previousItem[`${sortBy}Id`] === currentTask.id
    );

    if (entailingTask) orderedTaskListBasedOnSortBy.push(entailingTask);
  }

  // return the last element's id
  const lastTask =
    orderedTaskListBasedOnSortBy[orderedTaskListBasedOnSortBy.length - 1];

  return lastTask.id;
}

// Update target last task's lastItem attribute
export function updateLastTask(state: State, taskId: number, sortBy: SortBy) {
  state.orderedTasks.forEach((tasks) => {
    tasks.taskList.forEach((task) =>
      task.id === taskId
        ? (task.isLastItem[lookUpIsLastItem[sortBy]] = undefined)
        : task
    );
  });
}

// A lookup table that matches the sequence of an reorder and renamed columns
// after columns been processed by reorderAndRenameColumns() function
export function processLookUpDueDateId(
  orderedTasks: OrderedTasks,
  columns: Columns,
  lookUpDueDateId: LookUpDueDateId
) {
  for (let i = 0; i < orderedTasks.length; i++) {
    const tasks = orderedTasks[i];
    lookUpDueDateId[tasks.id] = columns[i].id;
  }
  return lookUpDueDateId;
}
