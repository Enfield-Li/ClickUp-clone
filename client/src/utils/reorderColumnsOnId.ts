import { Columns } from "./../component/task/Data";

// reorder column based on id
export function reorderColumnsOnId(columns: Columns) {
  columns.sort((prevColumn, currentColumn) => prevColumn.id - currentColumn.id);
}
