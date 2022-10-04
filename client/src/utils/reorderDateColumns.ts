import { ColumnOptions, SortBy, Columns } from "../component/task/Data";
import { getWeekDays } from "./getWeekDays";
import { reorderColumnsOnId } from "./reorderColumnsOnId";

/* 
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
    For instance, today is WEDNESDAY, column gets reordered to:
    [
      { "id": 1, "title": "NO DUE DATE" }, 
      { "id": 2, "title": "OVER DUE" },
      { "id": 5, "title": "TODAY" },
      { "id": 6, "title": "TOMORROW" },
      { "id": 7, "title": "FRIDAY" },
      { "id": 8, "title": "SATURDAY" },
      { "id": 9, "title": "SUNDAY" },
      { "id": 3, "title": "MONDAY" },
      { "id": 4, "title": "TUESDAY" },
      { "id": 10, "title": "FUTURE" }
    ]
 */
export function reorderAndRenameColumns(
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
