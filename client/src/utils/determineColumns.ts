import {
  UndeterminedColumn,
  SortBy,
  StatusColumn,
  PriorityColumn,
  DueDateColumn,
} from "../types";

export function isStatusColumns(
  currentColumn: UndeterminedColumn,
  sortBy: SortBy
): currentColumn is StatusColumn {
  return sortBy === SortBy.STATUS;
}
export function isPriorityColumns(
  currentColumn: UndeterminedColumn,
  sortBy: SortBy
): currentColumn is PriorityColumn {
  return sortBy === SortBy.PRIORITY;
}
export function isDueDateColumns(
  currentColumn: UndeterminedColumn,
  sortBy: SortBy
): currentColumn is DueDateColumn {
  return sortBy === SortBy.DUE_DATE;
}
