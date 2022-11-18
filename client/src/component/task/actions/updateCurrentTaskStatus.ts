import produce from "immer";
import { SetTaskState, SortBy, Task } from "../../../types";
import { deepCopy } from "../../../utils/deepCopy";
import {
  findTheLastOrderIndexInColumn,
  OrderIndexAndName,
} from "./createNewTask";

export function updateCurrentTaskStatus(
  currentTask: Task,
  setState: SetTaskState,
  targetStatusColumnId: number
) {
  setState(
    (state) =>
      state &&
      deepCopy( // <- without it, immer produce won't trigger rerender, WTF ???
        produce(state, (draftState) =>
          draftState.orderedTasks.forEach((orderedTask) => {
            orderedTask.taskList.forEach((task) => {
              if (task.id === currentTask.id) {
                const { orderIndex, columnName }: OrderIndexAndName =
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
