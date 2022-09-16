import { Draggable, Droppable } from "@hello-pangea/dnd";
import React from "react";

type Props = {
  task: {
    id: string;
    content: string;
  };
  index: number;
};

export default function Card({ task, index }: Props) {
  return (
    <Draggable draggableId={task.id} index={index}>
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
