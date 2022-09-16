import { Droppable } from "@hello-pangea/dnd";
import React from "react";
import Card from "./Card";
import { column, initialData } from "./FunctionalityOne";
type Column = {
  readonly id: "column-1";
  readonly title: "To do";
  readonly taskIds: readonly ["task-1", "task-2", "task-3", "task-4"];
};

type Tasks = (
  | {
      readonly id: "task-1";
      readonly content: "Take out the garbage";
    }
  | {
      readonly id: "task-2";
      readonly content: "Watch my favorite show";
    }
  | {
      readonly id: "task-3";
      readonly content: "Charge my phone";
    }
  | {
      readonly id: "task-4";
      readonly content: "Cook dinner";
    }
)[];

type Props = { column: typeof column; tasks: Tasks };

export default function Column({ column, tasks }: Props) {
  return (
    <Droppable droppableId={column.id}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          {tasks.map((task, index) => (
            <Card key={task.id} task={task} index={index} />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
