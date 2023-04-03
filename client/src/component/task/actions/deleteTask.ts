import { deleteTask } from "../../../networkCalls";

export function handleDeleteTask(
  taskId: number,
  removeTask: (taskId: number) => void
) {
  deleteTask(taskId);
  removeTask(taskId);
}
