import { getNextNWeekDay, toYYYYMMDDString } from "../../../utils/getWeekDays";
import { deepCopy } from "../../../utils/deepCopy";
import {
  UndeterminedColumns,
  DueDateColumns,
  DUE_DATE,
  LookUpColumnId,
  lookUpPreviousTaskId,
  OrderedTasks,
  PRIORITY,
  SortBy,
  State,
  STATUS,
  TargetColumn,
  TargetTasksInColumn,
  Task,
  TaskList,
} from "../taskTypes";

/* 
  Group all tasks into ordered tasks based on sortBy 
  by converting unordered Task[] list and group by for example task.priorityId:
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
export function groupTaskListOnSortBy(
  allTasks: TaskList,
  columns: UndeterminedColumns,
  sortBy: SortBy
): OrderedTasks {
  const orderedTasks: OrderedTasks = [];

  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    const columnId = column.id;

    orderedTasks[i] = { id: columnId, taskList: [] };

    // Find the first element
    const firstTask = allTasks.find(
      (task) =>
        task[sortBy] === columnId &&
        !task.previousTaskIds[lookUpPreviousTaskId[sortBy]]
    );
    if (firstTask) orderedTasks[i].taskList[0] = firstTask;

    // Find all the entailing element based on sortBy
    for (let k = 0; k < orderedTasks[i].taskList.length; k++) {
      const currentTask = orderedTasks[i].taskList[k];

      const entailingTask = allTasks.find(
        (task) =>
          task.previousTaskIds[lookUpPreviousTaskId[sortBy]] === currentTask.id
      );

      if (entailingTask) orderedTasks[i].taskList.push(entailingTask);
    }
  }

  // Collect all the finished tasks
  for (let i = 1; i < allTasks.length; i++) {
    const currentTask = allTasks[i];

    if (currentTask.status === 3) {
      const doneTasks = orderedTasks.find((tasks) => tasks.id === 0);
      doneTasks?.taskList.push(currentTask);
    }
  }

  return orderedTasks;
}

// A lookup table that matches the sequence of an reorder and renamed columns
// after columns been processed by reorderAndRenameColumns() function
/* 
    return 
    {
        orderedTask.id: column.id
    }
 */
export function processLookColumnId(
  orderedTasks: OrderedTasks,
  columns: UndeterminedColumns,
  lookUpColumnId: LookUpColumnId
) {
  for (let i = 0; i < orderedTasks.length; i++) {
    const tasks = orderedTasks[i];
    lookUpColumnId[tasks.id] = columns[i].id;
  }
}

export function getDueDateFromExpectedDueDateString(
  dueDateColumn: DueDateColumns,
  inputDateString: string
) {
  const targetColumn = dueDateColumn.find(
    (column) => column.localDateStr === inputDateString
  );
  if (targetColumn) return targetColumn?.id;

  const todayDate = new Date();
  const oneWeekLater = getNextNWeekDay(6);
  const inputDate = new Date(inputDateString);

  if (todayDate > inputDate) return 2; // Overdue
  if (inputDate > oneWeekLater) return 10; // Future

  return 1; // Default No due date
}

// Init taskEvents and convert expectedDueDate to dueDate
export function processTaskList(
  dueDateColumn: DueDateColumns,
  taskList: TaskList
) {
  return taskList.map((task) => {
    // init taskEvents
    // workaround: create and update the copy to prevent type error "dueDate" is read only
    const taskCopy = deepCopy(task) as Task;

    if (!task.taskEvents || task.taskEvents.length) taskCopy.taskEvents = [];

    // if dueDate is undefined, then override it with expectedDueDate
    if (taskCopy.dueDate === undefined) {
      // convert expectedDueDate to dueDate
      const taskExpectedDueDateString = task.expectedDueDate
        ? toYYYYMMDDString(task.expectedDueDate)
        : "";

      taskCopy.dueDate = getDueDateFromExpectedDueDateString(
        dueDateColumn,
        taskExpectedDueDateString
      );
    }

    return taskCopy;
  });
}

// Push task to the other sortBy id === 1 column
export function updatePreviousIdsInColumn(
  state: State,
  targetColumn: TargetColumn,
  sourceTask: Task
) {
  const allTasks = collectAllTasks(state.orderedTasks);

  // Updates for newTask's previousItem for other sortBy
  const previousTaskValues = collectPreviousTaskValues(targetColumn);

  updateTask(previousTaskValues, allTasks, sourceTask);
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

/* 
  Extract priority and dueDate key/value pairs:
    {
      "values": {
        "title": "1111111111111111",
        "description": "",
        "status": "2",
        "priority": "4",
        "dueDate": "6"
      }
    }
  to:
    [
      {
        updateSortBy: "status",
        id: 2,
      },
      {
        updateSortBy: "priority",
        id: 4,
      },
      {
        updateSortBy: "dueDate",
        id: 6,
      },
    ]
*/
export function collectPreviousTaskValues(
  previousTask: TargetColumn
): TargetTasksInColumn {
  const taskListForUpdate: TargetTasksInColumn = [];

  for (let i = 0; i < Object.entries(previousTask).length; i++) {
    const task = Object.entries(previousTask)[i];
    const key = task[0];
    const value = task[1];

    if (key === DUE_DATE || key === PRIORITY || key === STATUS) {
      taskListForUpdate[i] = { columnId: 0, updateSortBy: STATUS };
      taskListForUpdate[i].columnId = Number(value);
      taskListForUpdate[i].updateSortBy = key;
    }
  }

  // Clean up empty slots
  return taskListForUpdate.filter((taskList) => taskList);
}

export function updateTask(
  previousTaskValues: TargetTasksInColumn,
  allTasks: TaskList,
  sourceTask: Task
) {
  for (let i = 0; i < previousTaskValues.length; i++) {
    const previousTaskValue = previousTaskValues[i];

    const updateSortBy = previousTaskValue.updateSortBy;
    const updateSortById = previousTaskValue.columnId;

    const lastTaskIdInColumn = findLastTaskId(
      allTasks,
      updateSortBy,
      updateSortById
    );

    // Update new task
    sourceTask[updateSortBy] = updateSortById;
    // 👇 potential bug
    sourceTask.previousTaskIds[lookUpPreviousTaskId[updateSortBy]] =
      lastTaskIdInColumn;
  }
}

// Given sortBy and columnId, find the last task id in all the tasks in the state
export function findLastTaskId(
  allTasks: TaskList,
  sortBy: SortBy,
  columnId: number
): number | undefined {
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
    (task) => !task.previousTaskIds[lookUpPreviousTaskId[sortBy]]
  );
  if (firstTask) orderedTaskListBasedOnSortBy[0] = firstTask;

  // Find all the entailing elements
  for (let i = 0; i < orderedTaskListBasedOnSortBy.length; i++) {
    const currentTask = orderedTaskListBasedOnSortBy[i];
    const entailingTask = taskListBasedOnSortBy.find(
      (task) =>
        task.previousTaskIds[lookUpPreviousTaskId[sortBy]] === currentTask.id
    );

    if (entailingTask) orderedTaskListBasedOnSortBy.push(entailingTask);
  }

  // return the last element's id
  const lastTask =
    orderedTaskListBasedOnSortBy[orderedTaskListBasedOnSortBy.length - 1];

  if (lastTask) return lastTask.id;
}
