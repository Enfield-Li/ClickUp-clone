import { ColumnOptions, Priority, DueDateRange, CurrentWeek } from "../types";

export const defaultColumnOptions: ColumnOptions = {
  statusColumns: [],
  priorityColumns: [
    { id: 1, title: Priority.NO_PRIORITY, color: "gray.400" },
    { id: 2, title: Priority.URGENT, color: "red.400" },
    { id: 3, title: Priority.HIGH, color: "yellow.400" },
    { id: 4, title: Priority.NORMAL, color: "blue.200" },
    { id: 5, title: Priority.LOW, color: "gray.400" },
  ],
  dueDateColumns: [
    { id: 1, title: DueDateRange.NO_DUE_DATE, color: "gray.400" },
    { id: 2, title: DueDateRange.OVER_DUE, color: "gray.400" },
    { id: 3, title: CurrentWeek.MONDAY, color: "gray.400" },
    { id: 4, title: CurrentWeek.TUESDAY, color: "gray.400" },
    { id: 5, title: CurrentWeek.WEDNESDAY, color: "gray.400" },
    { id: 6, title: CurrentWeek.THURSDAY, color: "gray.400" },
    { id: 7, title: CurrentWeek.FRIDAY, color: "gray.400" },
    { id: 8, title: CurrentWeek.SATURDAY, color: "gray.400" },
    { id: 9, title: CurrentWeek.SUNDAY, color: "gray.400" },
    { id: 10, title: DueDateRange.FUTURE, color: "gray.400" },
  ],
};
