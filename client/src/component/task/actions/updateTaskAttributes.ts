import produce from "immer";
import { updateTasksPosition } from "../../../networkCalls";
import {
  SetTaskState,
  GroupBy,
  Task,
  TaskPositionDTO,
  UpdateEvent,
  UpdateTasksPositionDTO,
} from "../../../types";
import { deepCopy } from "../../../utils/deepCopy";
import { getRandomNumberNoLimit } from "../../../utils/getRandomNumber";
import { newTaskPositionDTO } from "../../../utils/newTaskPositionDTO";
import {
  findTheLastOrderIndexInColumn,
  OrderIndexInColumn,
} from "./createNewTask";

type UpdateTaskAttributeParam = {
  userId: number;
  groupBy: GroupBy;
  targetField: GroupBy;
  currentTask: Task;
  setTaskState: SetTaskState;
  targetColumnId: number;
  expectedDueDate?: Date | null;
};

export function updateTaskAttribute({
  userId,
  groupBy,
  targetField,
  currentTask,
  setTaskState,
  targetColumnId,
  expectedDueDate,
}: UpdateTaskAttributeParam) {
  const updateTaskListDTO: UpdateTasksPositionDTO = {
    sourceTaskId: 0,
    taskDtoList: [],
  };

  setTaskState(
    (taskState) =>
      taskState &&
      produce(taskState, (draftState) =>
        draftState.orderedTasks.forEach((orderedTask) => {
          orderedTask.taskList.forEach((task, index, taskList) => {
            const isNewEvent =
              targetField === GroupBy.DUE_DATE ||
              task[targetField].columnId !== targetColumnId;

            if (task.id === currentTask.id && isNewEvent) {
              if (expectedDueDate !== undefined) {
                task.expectedDueDate = expectedDueDate;
              }

              const newTaskEvent = newUpdateEvent(
                userId,
                task.id!,
                targetField,
                task[targetField].columnId,
                targetColumnId
              );

              if (!task.taskEvents) task.taskEvents = [];
              task.taskEvents.push(newTaskEvent);

              const { orderIndex, columnName }: OrderIndexInColumn =
                findTheLastOrderIndexInColumn(
                  targetField,
                  targetColumnId,
                  draftState
                );

              task[targetField].name = columnName;
              task[targetField].orderIndex = orderIndex;
              task[targetField].columnId = targetColumnId;

              const updateTaskPositionDTO: TaskPositionDTO = newTaskPositionDTO(
                task,
                targetField
              );
              updateTaskListDTO.sourceTaskId = task.id!;
              updateTaskListDTO.taskDtoList = deepCopy([updateTaskPositionDTO]);

              // move task to targetColumn and delete from original column
              if (groupBy === targetField) {
                taskList.splice(index, 1);
                draftState.orderedTasks.forEach((orderedTask) => {
                  if (orderedTask.columnId === targetColumnId) {
                    orderedTask.taskList.push(task);
                  }
                });
              }
            }
          });
        })
      )
  );

  updateTasksPosition(updateTaskListDTO);
}

export function newUpdateEvent(
  userId: number,
  taskId: number,
  field: GroupBy,
  beforeUpdate: number,
  afterUpdate: number
): UpdateEvent {
  return {
    id: getRandomNumberNoLimit(),
    userId,
    taskId,
    field,
    beforeUpdate: String(beforeUpdate),
    afterUpdate: String(afterUpdate),
    createdAt: new Date(),
  };
}
