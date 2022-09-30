import { SortingOptions, SortBy, Columns } from "../component/task/Data";
import { getWeekDays } from "./getWeekDays";

export function renameDateColumns(
  sortingOptions: SortingOptions,
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
  const end = updatedColumns.slice(columnsLength - 2, columnsLength + 1);

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

  return [...front, ...weekDayColumnsFinal, ...end];
}
