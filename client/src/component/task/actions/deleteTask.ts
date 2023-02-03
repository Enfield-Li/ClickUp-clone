import produce from "immer";
import { deleteTask } from "../../../networkCalls";
import { TaskState } from "../../../types";

export function handleDeleteTask(
  taskId: number,
  setTaskState: (value: React.SetStateAction<TaskState | undefined>) => void
) {
  deleteTask(taskId);
  setTaskState((prev) =>
    produce(prev, (draftState) => {
      draftState?.orderedTasks.forEach((orderedTask) =>
        orderedTask.taskList.forEach(
          (task, index, arr) => task.id === taskId && arr.splice(index, 1)
        )
      );
    })
  );
}
