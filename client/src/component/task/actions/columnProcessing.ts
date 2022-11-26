import {
  ColumnOptions,
  DueDate,
  DueDateColumns,
  DueDateRange,
  LookUpExpectedDueDate,
  StatusColumns,
} from "../../../types";
import { deepCopy } from "../../../utils/deepCopy";
import {
  getMonthAndDay,
  getNextNWeekDay,
  getOneWholeWeekLocalDateString,
  getUppercaseWeekDayString,
  getWeekDays,
  toYYYYMMDDString,
} from "../../../utils/getWeekDays";

export function initColumns(columnOptions: ColumnOptions) {
  const reorderedDueDateColumns = initDueDateColumns(
    columnOptions.dueDateColumns
  );
  const reorderedStatusColumns = reorderStatusColumns(
    deepCopy(columnOptions.statusColumns)
  );

  return { reorderedDueDateColumns, reorderedStatusColumns };
}

// Reorder based on statusColumns.previousColumnId
export function reorderStatusColumns(
  statusColumns: StatusColumns
): StatusColumns {
  statusColumns.sort((prev, current) => prev.orderIndex - current.orderIndex);
  return statusColumns;
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
export function initDueDateColumns(
  originalColumns: DueDateColumns
): DueDateColumns {
  // rename columns to Today and Tomorrow
  const updatedColumns = renameDueDateColumns(originalColumns);

  // put today to the front
  const columnsLength = updatedColumns.length;
  const front = updatedColumns.slice(0, 2);
  const end = updatedColumns.slice(columnsLength - 1, columnsLength);

  const weekDayColumns = updatedColumns.slice(2, columnsLength - 1);

  const todayIndex = weekDayColumns.findIndex(
    (column) => column.title === DueDateRange.TODAY
  );
  const weekDayEnd = weekDayColumns.slice(0, todayIndex);
  const weekDayFront = weekDayColumns.slice(
    todayIndex,
    weekDayColumns.length + 1
  );
  //   const weekDayColumnsFinal = [...weekDayFront, ...weekDayEnd];
  const weekDayColumnsFinal = deepCopy([...weekDayFront, ...weekDayEnd]); // hack fix

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
      column.title = DueDateRange.TODAY;
    } else if (column.title === tomorrowWeekDay) {
      column.title = DueDateRange.TOMORROW;
    }
    return column;
  });
}

export function calculateDueDateInThisWeek(
  expectedDueDate: Date,
  dueDateColumns: DueDateColumns
) {
  return dueDateColumns.find(
    (column) => column.localDateStr === toYYYYMMDDString(expectedDueDate)
  );
}

export function getDueDateString(
  expectedDueDate: Date,
  dueDateColumns: DueDateColumns
): DueDate | undefined | string {
  const dueDate = calculateDueDateInThisWeek(expectedDueDate, dueDateColumns);
  return dueDate ? dueDate.title : getMonthAndDay(expectedDueDate);
}

export function getExpectedDueDateFromWeekString(weekString: DueDate) {
  const lookUpDueDate = getLookUpDueDateTable();
  return lookUpDueDate[weekString];
}

/* 
    return:
    {
        "lookUpExpectedDueDate": {
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
  const lookUpExpectedDueDate: LookUpExpectedDueDate = {
    "NO_DUE_DATE": null,
    "OVER_DUE": null,
    TODAY: null,
    TOMORROW: null,
    SATURDAY: null,
    SUNDAY: null,
    MONDAY: null,
    TUESDAY: null,
    WEDNESDAY: null,
    FUTURE: null,
    THURSDAY: null,
    FRIDAY: null,
  };

  // OverDue (ie. yesterday)
  lookUpExpectedDueDate[DueDateRange.OVER_DUE] = getNextNWeekDay(-1);

  // Monday to Sunday
  for (let i = 0; i < 7; i++) {
    const day = getNextNWeekDay(i);

    // today
    if (i === 0) {
      lookUpExpectedDueDate[DueDateRange.TODAY] = day;
    }
    // tomorrow
    else if (i === 1) {
      lookUpExpectedDueDate[DueDateRange.TOMORROW] = day;
    }
    // rest of the week
    else {
      const uppercaseWeekDayStr = getUppercaseWeekDayString(day) as DueDate;
      lookUpExpectedDueDate[uppercaseWeekDayStr] = day;
    }
  }

  // future (ie. one week later)
  lookUpExpectedDueDate[DueDateRange.FUTURE] = getNextNWeekDay(7);

  return lookUpExpectedDueDate;
}
