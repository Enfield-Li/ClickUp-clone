import { SortBy, TaskEvents } from "../types";

export function newEventDTO(
  taskId: number,
  field: SortBy,
  afterUpdate: string | number | undefined,
  beforeUpdate: string | number | undefined
): TaskEvents {
  return [
    {
      taskId,
      field: field,
      afterUpdate: String(afterUpdate),
      beforeUpdate: String(beforeUpdate),
    },
  ];
}
