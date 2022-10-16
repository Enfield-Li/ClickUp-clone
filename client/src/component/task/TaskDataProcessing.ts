import {
  getNextNWeekDay,
  getTodayYMDString,
  getOneWholeWeekLocalDateString,
  getWeekDays,
} from "../../utils/getWeekDays";
import { NewTask } from "./CreateTaskPopover";
import {
  Columns,
  DueDate,
  DueDateColumns,
  DUE_DATE,
  LookUpDueDateId,
  lookUpPreviousTaskId,
  OrderedTasks,
  TargetColumn,
  TargetTasksInColumn,
  PRIORITY,
  SortBy,
  State,
  STATUS,
  Task,
  TaskList,
} from "./Data";

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
  columns: Columns,
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
        !task.previousTask[lookUpPreviousTaskId[sortBy]]
    );
    if (firstTask) orderedTasks[i].taskList[0] = firstTask;

    // Find all the entailing element based on sortBy
    for (let k = 0; k < orderedTasks[i].taskList.length; k++) {
      const currentTask = orderedTasks[i].taskList[k];

      const entailingTask = allTasks.find(
        (task) =>
          task.previousTask[lookUpPreviousTaskId[sortBy]] === currentTask.id
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

/* 
    Reorder and rename the dueDate columns. 
    For instance, today is WEDNESDAY, 
    
    from
      [
        { id: 1, title: "NO DUE DATE" },
        { id: 2, title: "OVER DUE" },
        { id: 3, title: "MONDAY" },
        { id: 4, title: "TUESDAY" },
        { id: 5, title: "WEDNESDAY" },     // <- Reorder and rename title
        { id: 6, title: "THURSDAY" },      // <- Reorder and rename title
        { id: 7, title: "FRIDAY" },
        { id: 8, title: "SATURDAY" },
        { id: 9, title: "SUNDAY" },
        { id: 10, title: "FUTURE" },
      ],
    to:
      [
        { "id": 1, "title": "NO DUE DATE" }, 
        { "id": 2, "title": "OVER DUE" },
        { "id": 5, "title": "TODAY",    localDateStr: "10/10/2022" },   // <- Reorder and rename title
        { "id": 6, "title": "TOMORROW", localDateStr: "10/11/2022" },   // <- Reorder and rename title
        { "id": 7, "title": "FRIDAY",   localDateStr: "10/12/2022" },
        { "id": 8, "title": "SATURDAY", localDateStr: "10/13/2022" },
        { "id": 9, "title": "SUNDAY",   localDateStr: "10/14/2022" },
        { "id": 3, "title": "MONDAY",   localDateStr: "10/15/2022" },
        { "id": 4, "title": "TUESDAY",  localDateStr: "10/16/2022" },
        { "id": 10, "title": "FUTURE" }
      ]
 */
export function initializeDueDataColumns(
  originalColumns: DueDateColumns
): DueDateColumns {
  // rename columns to Today and Tomorrow
  const updatedColumns = renameDueDateColumns(originalColumns);

  // put today to the front
  const columnsLength = updatedColumns.length;
  const front = updatedColumns.slice(0, 2);
  const end = updatedColumns.slice(columnsLength - 2, columnsLength);

  const weekDayColumns = updatedColumns.slice(2, columnsLength - 2);

  const todayIndex = weekDayColumns.findIndex(
    (column) => column.title === "TODAY"
  );
  const weekDayEnd = weekDayColumns.slice(0, todayIndex);
  const weekDayFront = weekDayColumns.slice(
    todayIndex,
    weekDayColumns.length + 1
  );
  const weekDayColumnsFinal = [...weekDayFront, ...weekDayEnd];

  // Adding date string identifier
  const thisWeekLocalDateString = getOneWholeWeekLocalDateString();
  for (let i = 0; i < weekDayColumnsFinal.length; i++) {
    const weekDay = weekDayColumnsFinal[i];
    weekDay.localDateStr = thisWeekLocalDateString[i];
  }

  return [...front, ...weekDayColumnsFinal, ...end] as DueDateColumns;
}

// Week of current/next day column turns to "TODAY" and "TOMORROW"
function renameDueDateColumns(dueDateColumns: DueDateColumns) {
  const { todayWeekDay, tomorrowWeekDay } = getWeekDays();

  dueDateColumns.map((column) => {
    if (column.title === todayWeekDay) {
      column.title = "TODAY";
    } else if (column.title === tomorrowWeekDay) {
      column.title = "TOMORROW";
    }
    return column;
  });

  return dueDateColumns;
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

export function getDueDateColumnFromDateString(
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

// Push task to the other sortBy id === 1 column
export function updateTaskStatsInColumn(
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

    const idResult = findLastTaskId(allTasks, updateSortBy, updateSortById);

    // Update new task
    sourceTask[updateSortBy] = updateSortById;
    sourceTask.previousTask[`${updateSortBy}Id`] = idResult;
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
    (task) => !task.previousTask[`${sortBy}Id`]
  );
  if (firstTask) orderedTaskListBasedOnSortBy[0] = firstTask;

  // Find all the entailing elements
  for (let i = 0; i < orderedTaskListBasedOnSortBy.length; i++) {
    const currentTask = orderedTaskListBasedOnSortBy[i];
    const entailingTask = taskListBasedOnSortBy.find(
      (task) => task.previousTask[`${sortBy}Id`] === currentTask.id
    );

    if (entailingTask) orderedTaskListBasedOnSortBy.push(entailingTask);
  }

  // return the last element's id
  const lastTask =
    orderedTaskListBasedOnSortBy[orderedTaskListBasedOnSortBy.length - 1];

  if (lastTask) return lastTask.id;
}
