import {
  getNextNWeekDay,
  getOneWholeWeekLocalDateString,
  getUppercaseWeekDayString,
  getWeekDays,
} from "../../../utils/getWeekDays";
import {
  ColumnOptions,
  DueDateColumns,
  SelectableDueDate,
  LookUpDueDate,
  StatusColumns,
} from "../../../types";

export function processColumns(columnOptions: ColumnOptions) {
  const dueDateColumns = initializeDueDataColumns(columnOptions.dueDate);
  const statusColumns = reorderStatusColumns(columnOptions.status);

  return { dueDateColumns, statusColumns };
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

  return dueDateColumns.map((column) => {
    if (column.title === todayWeekDay) {
      column.title = "TODAY";
    } else if (column.title === tomorrowWeekDay) {
      column.title = "TOMORROW";
    }
    return column;
  });
}

/* 
    return:
    {
        "lookUpDueDate": {
            "OVER DUE":  "2022-10-27T12:41:44.971Z",
            "TODAY":     "2022-10-28T12:41:44.971Z", // <- today
            "TOMORROW":  "2022-10-29T12:41:44.971Z",
            "SUNDAY":    "2022-10-30T12:41:44.971Z",
            "MONDAY":    "2022-10-31T12:41:44.972Z",
            "TUESDAY":   "2022-11-01T12:41:44.972Z",
            "WEDNESDAY": "2022-11-02T12:41:44.972Z",
            "FUTURE":    "2022-11-04T12:41:44.972Z",
            "THURSDAY":  "2022-11-03T12:41:44.972Z"
        }
    }
*/
export function getLookUpDueDateTable() {
  const lookUpExpectedDueDate: LookUpDueDate = {
    "NO DUE DATE": undefined,
    "OVER DUE": undefined,
    TODAY: undefined,
    TOMORROW: undefined,
    SATURDAY: undefined,
    SUNDAY: undefined,
    MONDAY: undefined,
    TUESDAY: undefined,
    WEDNESDAY: undefined,
    FUTURE: undefined,
    DONE: undefined,
    THURSDAY: undefined,
    FRIDAY: undefined,
  };

  // No due date
  //   arrOfThisWeekDay.push("NO DUE DATE");
  //   lookUpDueDate["NO DUE DATE"] = undefined;

  // OverDue (ie. yesterday)
  lookUpExpectedDueDate["OVER DUE"] = getNextNWeekDay(-1);

  // Monday to Sunday
  for (let i = 0; i < 7; i++) {
    const day = getNextNWeekDay(i);

    // today
    if (i === 0) {
      lookUpExpectedDueDate["TODAY"] = day;
    }
    // tomorrow
    else if (i === 1) {
      lookUpExpectedDueDate["TOMORROW"] = day;
    }
    // rest of the week
    else {
      const uppercaseWeekDayStr = getUppercaseWeekDayString(
        day
      ) as SelectableDueDate;

      lookUpExpectedDueDate[uppercaseWeekDayStr] = day;
    }
  }

  // future (ie. one week later)
  lookUpExpectedDueDate["FUTURE"] = getNextNWeekDay(7);

  return lookUpExpectedDueDate;
}

// Reorder based on statusColumns.previousColumnId
export function reorderStatusColumns(
  statusColumns: StatusColumns
): StatusColumns {
  const result: StatusColumns = [];

  // Find the first column
  const firstColumn = statusColumns.find((column) => !column.previousColumnId);
  if (firstColumn) result.push(firstColumn);

  // Push the nextColumn
  for (const column of result) {
    for (const nextColumn of statusColumns) {
      if (nextColumn.previousColumnId === column.id) {
        result.push(nextColumn);
      }
    }
  }

  return result;
}
