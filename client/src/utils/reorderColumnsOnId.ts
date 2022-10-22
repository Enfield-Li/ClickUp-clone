import { Columns } from "../component/task/taskTypes";

// reorder column based on id
export function reorderColumnsOnId(columns: Columns) {
  columns.sort((prevColumn, currentColumn) => prevColumn.id - currentColumn.id);
}
