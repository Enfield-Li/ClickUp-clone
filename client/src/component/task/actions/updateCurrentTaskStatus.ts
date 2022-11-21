import produce from "immer";
import { SetTaskState, SortBy, Task, TaskEvent } from "../../../types";
import { deepCopy } from "../../../utils/deepCopy";
import {
  findTheLastOrderIndexInColumn,
  OrderIndexInColumn,
} from "./createNewTask";

export function updateCurrentTaskStatus(
  currentTask: Task,
  setTaskState: SetTaskState,
  targetStatusColumnId: number,
  newTaskEvent?: TaskEvent
) {
  setTaskState(
    (taskState) =>
      taskState &&
      deepCopy(
        // ^^ without it, immer produce won't trigger rerender, WTF ???
        produce(taskState, (draftState) =>
          draftState.orderedTasks.forEach((orderedTask) => {
            orderedTask.taskList.forEach((task) => {
              if (task.id === currentTask.id) {
                if (newTaskEvent) task.taskEvents.push(newTaskEvent);
                const { orderIndex, columnName }: OrderIndexInColumn =
                  findTheLastOrderIndexInColumn(
                    SortBy.STATUS,
                    targetStatusColumnId,
                    draftState
                  );

                task[SortBy.STATUS].name = columnName;
                task[SortBy.STATUS].orderIndex = orderIndex;
                task[SortBy.STATUS].columnId = targetStatusColumnId;
              }
            });
          })
        )
      )
  );
}
