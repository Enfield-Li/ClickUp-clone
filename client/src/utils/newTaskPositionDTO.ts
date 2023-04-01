import { Task, GroupBy, TaskPositionDTO, UpdateEvent } from "../types";
import { deepCopy } from "./deepCopy";

export function newTaskPositionDTO(
  task: Task,
  groupBy: GroupBy
): TaskPositionDTO {
  const lastUpdateEvent = task.taskEvents[0] as UpdateEvent;

  const taskPositionDto: TaskPositionDTO = {
    taskId: task.id!,
    expectedDueDate: task.expectedDueDate,
    updateEvent: lastUpdateEvent,
  };

  taskPositionDto[groupBy] = deepCopy(task[groupBy]);

  //   if (groupBy === GroupBy.STATUS) {
  //     taskPositionDto[groupBy] = deepCopy(task[groupBy]);
  //   }
  //   if (groupBy === GroupBy.DUE_DATE) {
  //     taskPositionDto[groupBy] = deepCopy(task[groupBy]);
  //   }
  //   if (groupBy === GroupBy.PRIORITY) {
  //     taskPositionDto[groupBy] = deepCopy(task[groupBy]);
  //   }
  //   taskPositionDto[groupBy] = task[groupBy];

  return taskPositionDto;
}
