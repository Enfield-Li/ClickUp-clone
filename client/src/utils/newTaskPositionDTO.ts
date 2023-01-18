import { Task, SortBy, TaskPositionDTO, UpdateEvent } from "../types";
import { deepCopy } from "./deepCopy";

export function newTaskPositionDTO(
  task: Task,
  sortBy: SortBy
): TaskPositionDTO {
  const lastUpdateEvent = task.taskEvents[0] as UpdateEvent;

  const taskPositionDto: TaskPositionDTO = {
    taskId: task.id!,
    expectedDueDate: task.expectedDueDate,
    updateEvent: lastUpdateEvent,
  };

  taskPositionDto[sortBy] = deepCopy(task[sortBy]);

  //   if (sortBy === SortBy.STATUS) {
  //     taskPositionDto[sortBy] = deepCopy(task[sortBy]);
  //   }
  //   if (sortBy === SortBy.DUE_DATE) {
  //     taskPositionDto[sortBy] = deepCopy(task[sortBy]);
  //   }
  //   if (sortBy === SortBy.PRIORITY) {
  //     taskPositionDto[sortBy] = deepCopy(task[sortBy]);
  //   }
  //   taskPositionDto[sortBy] = task[sortBy];

  return taskPositionDto;
}
