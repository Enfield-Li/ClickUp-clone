import { UndeterminedColumns } from "../types";

// reorder column based on id
export function reorderColumnsOnId(columns: UndeterminedColumns) {
  columns.sort((prevColumn, currentColumn) => prevColumn.id - currentColumn.id);
}
