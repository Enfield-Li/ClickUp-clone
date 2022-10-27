import {
  getOneWholeWeekLocalDateString,
  getWeekDays,
} from "../../../utils/getWeekDays";
import { ColumnOptions, DueDateColumns, StatusColumns } from "../taskTypes";

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
