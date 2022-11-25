import { Field, TaskEvent } from "../types";

export function newEventDTO(
  taskId: number,
  field: Field,
  afterUpdate: string | number | undefined,
  beforeUpdate: string | number | undefined
): TaskEvent {
  return {
    field,
    taskId,
    afterUpdate: String(afterUpdate),
    beforeUpdate: String(beforeUpdate),
  };
}
