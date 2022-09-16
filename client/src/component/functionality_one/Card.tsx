import { Draggable, Droppable } from "@hello-pangea/dnd";
import React from "react";
import { Task } from "./FunctionalityOne";

type Props = {
  task: Task;
  index: number;
};

export default function Card({ task, index }: Props) {
  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          {task.content}
        </div>
      )}
    </Draggable>
  );
}
