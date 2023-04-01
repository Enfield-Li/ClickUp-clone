import {
  UndeterminedColumn,
  GroupBy,
  StatusColumn,
  PriorityColumn,
  DueDateColumn,
} from "../types";

export function isStatusColumns(
  currentColumn: UndeterminedColumn,
  groupBy: GroupBy
): currentColumn is StatusColumn {
  return groupBy === GroupBy.STATUS;
}
export function isPriorityColumns(
  currentColumn: UndeterminedColumn,
  groupBy: GroupBy
): currentColumn is PriorityColumn {
  return groupBy === GroupBy.PRIORITY;
}
export function isDueDateColumns(
  currentColumn: UndeterminedColumn,
  groupBy: GroupBy
): currentColumn is DueDateColumn {
  return groupBy === GroupBy.DUE_DATE;
}
