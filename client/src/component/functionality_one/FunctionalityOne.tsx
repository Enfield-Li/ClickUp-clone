import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import React, { useState } from "react";
import Column from "./Column";

type Props = {};

export type Task = { id: number; content: string; stage: number };
export type Stage = { id: number; title: string };
export type State = { tasks: Task[]; columns: Stage[] };
export type SetState = React.Dispatch<React.SetStateAction<State>>;

const tasks = [
  { id: 1, content: "Take out the garbage", stage: 1 },
  { id: 2, content: "Watch my favorite show", stage: 1 },
  { id: 3, content: "Charge my phone", stage: 2 },
  { id: 4, content: "Cook dinner", stage: 1 },
];

const stage1 = {
  id: 1,
  title: "Stage 1",
};

export const initialData: State = {
  tasks: [
    { id: 1, content: "Take out the garbage", stage: 1 },
    { id: 2, content: "Watch my favorite show", stage: 1 },
    { id: 3, content: "Charge my phone", stage: 1 },
    { id: 4, content: "Cook dinner", stage: 1 },
  ],
  columns: [stage1],
};

export default function FunctionalityOne({}: Props) {
  const [state, setState] = useState(initialData);

  return (
    <>
      <DragDropContext
        onDragEnd={(result) => handleDragEnd(result, state, setState)}
      >
        {state.columns.map((column, index) => {
          return (
            <Column
              key={column.id}
              column={column}
              tasks={state.tasks.filter((task) =>
                task.stage === column.id ? task : null
              )}
            />
          );
        })}
      </DragDropContext>
    </>
  );
}

function handleDragEnd(result: DropResult, state: State, setState: SetState) {
  const { destination, source, draggableId } = result;

  if (!destination) return;

  if (
    destination.droppableId === source.droppableId &&
    destination.index === source.index
  ) {
    return;
  }
  console.log(draggableId);

  const oldPosition = source.index;
  const newPosition = destination.index;

  const newTasks = [...state.tasks];
  const item = newTasks[oldPosition];

  // swap location inside array
  newTasks.splice(oldPosition, 1);
  newTasks.splice(newPosition, 0, item);

  setState({ ...state, tasks: newTasks });
}
