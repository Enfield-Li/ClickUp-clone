import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import React, { useState } from "react";
import Column from "./Column";

type Props = {};

export const tasks = {
  "task-1": { id: "task-1", content: "Take out the garbage" },
  "task-2": { id: "task-2", content: "Watch my favorite show" },
  "task-3": { id: "task-3", content: "Charge my phone" },
  "task-4": { id: "task-4", content: "Cook dinner" },
} as const;

export const column = {
  id: "column-1",
  title: "To do",
  taskIds: ["task-1", "task-2", "task-3", "task-4"],
} as const;

export const initialData = {
  tasks,
  columns: {
    "column-1": column,
  },
  // Facilitate reordering of the columns
  columnOrder: ["column-1"],
} as const;

export default function FunctionalityOne({}: Props) {
  const [state, setState] = useState(initialData);
  function handleDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // https://stackoverflow.com/questions/56568423/typescript-no-index-signature-with-a-parameter-of-type-string-was-found-on-ty
    const column = (state.columns as any)[source.droppableId];
    const newTaskIds = Array.from(column.taskIds);
    newTaskIds.splice(source.index, 1);
    newTaskIds.splice(destination.index, 0, draggableId);

    const newColumn = {
      ...column,
      taskIds: newTaskIds,
    };

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [newColumn.id]: newColumn,
      },
    };

    setState(newState);
  }

  return (
    <>
      <DragDropContext onDragEnd={(result) => handleDragEnd(result)}>
        {state.columnOrder.map((columnId) => {
          const column = state.columns[columnId];
          const tasks = column.taskIds.map((taskId) => state.tasks[taskId]);
          return <Column key={column.id} column={column} tasks={tasks} />;
        })}
      </DragDropContext>
    </>
  );
}
