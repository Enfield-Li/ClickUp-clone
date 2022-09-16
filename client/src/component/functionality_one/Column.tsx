import { Droppable } from "@hello-pangea/dnd";
import React from "react";
import Card from "./Card";
import { Stage, Task } from "./FunctionalityOne";

type Props = {
  column: Stage;
  tasks: Task[];
};

export default function Column({ column, tasks }: Props) {
  return (
    <>
      {column.title}
      <Droppable droppableId={String(column.id)}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {tasks.map((task, index) => (
              <Card key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </>
  );
}
