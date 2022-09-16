import { Box, SimpleGrid } from "@chakra-ui/react";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import React, { useState } from "react";
import Column from "./Column";

type Props = {};

export type Task = { id: number; content: string; stage: number };
export type Stage = { id: number; title: string };
export type State = { tasks: Task[]; columns: Stage[] };
export type SetState = React.Dispatch<React.SetStateAction<State>>;

export const initialData: State = {
  tasks: [
    { id: 11, content: "Take out the garbage", stage: 1 },
    { id: 25, content: "Watch my favorite show", stage: 3 },
    { id: 32, content: "Charge my phone", stage: 1 },
    { id: 43, content: "Cook dinner", stage: 2 },
    { id: 45, content: "55555555555", stage: 3 },
    { id: 65, content: "56666666666", stage: 2 },
    { id: 57, content: "77777777777", stage: 1 },
  ],
  columns: [
    { id: 1, title: "Stage 1" },
    { id: 2, title: "Stage 2" },
    { id: 3, title: "Stage 3" },
  ],
};

export default function FunctionalityOne({}: Props) {
  const [state, setState] = useState(initialData);

  return (
    <>
      <DragDropContext
        onDragEnd={(result) => handleDragEnd(result, state, setState)}
      >
        <SimpleGrid columns={3} spacing={10}>
          {state.columns.map((column, index) => {
            return (
              <Box key={column.id} height="1.5">
                <Column
                  column={column}
                  tasks={state.tasks.filter((task) =>
                    task.stage === column.id ? task : null
                  )}
                />
              </Box>
            );
          })}
        </SimpleGrid>
      </DragDropContext>
    </>
  );
}

function handleDragEnd(result: DropResult, state: State, setState: SetState) {
  const { destination, source } = result;

  if (!destination) return;

  if (
    destination.droppableId === source.droppableId &&
    destination.index === source.index
  ) {
    return;
  }
  const oldPositionInStage = source.index;
  const newPositionInStage = destination.index;

  const taskListInSourceStage = state.tasks.filter((task) =>
    task.stage === Number(source.droppableId) ? task : null
  );

  const taskListInDestinationStage = state.tasks.filter((task) =>
    task.stage === Number(destination.droppableId) ? task : null
  );

  const newTasks = [...state.tasks];
  const sourceTask = taskListInSourceStage[oldPositionInStage];

  /*
   * Drop in the same column
   */
  const isDropInTheSameColumn = source.droppableId === destination.droppableId;
  if (isDropInTheSameColumn) {
    const indexOfSourceTaskInOriginalState = state.tasks.findIndex(
      (task) => task.id === sourceTask.id
    );
    newTasks.splice(indexOfSourceTaskInOriginalState, 1);

    const targetTask = taskListInSourceStage[newPositionInStage];
    const indexOfTargetTaskInOriginalState = state.tasks.findIndex(
      (task) => task.id === targetTask.id
    );

    newTasks.splice(indexOfTargetTaskInOriginalState, 0, sourceTask);
    setState({ ...state, tasks: newTasks });
    return;
  } else {
    /*
     * Drop in a different column
     */
    // Switch column by changing stage
    sourceTask.stage = Number(destination.droppableId);

    const indexOfSourceTaskInOriginalState = state.tasks.findIndex(
      (task) => task.id === sourceTask.id
    );
    newTasks.splice(indexOfSourceTaskInOriginalState, 1);

    // Append to the column
    const isDroppingToTheLastIndexOfTargetColumn =
      newPositionInStage === taskListInDestinationStage.length &&
      taskListInDestinationStage.length !== 0;
    if (isDroppingToTheLastIndexOfTargetColumn) {
      const targetTask =
        taskListInDestinationStage[taskListInDestinationStage.length - 1].id;

      const indexOfTargetTaskInOriginalState = state.tasks.findIndex(
        (task) => task.id === targetTask
      );

      newTasks.splice(indexOfTargetTaskInOriginalState + 1, 0, sourceTask);
      setState({ ...state, tasks: newTasks });
      return;
    }

    // Drop in an empty column
    const isDroppingToEmptyColumn = taskListInDestinationStage.length === 0;
    if (isDroppingToEmptyColumn) {
      newTasks.unshift(sourceTask);
      setState({ ...state, tasks: newTasks });
      return;
    }

    // Normal situation
    const targetTask = taskListInDestinationStage[newPositionInStage];
    const indexOfTargetTaskInOriginalState = state.tasks.findIndex(
      (task) => task.id === targetTask.id
    );

    // Check if the source task's index in the original tasks list comes before or after the target task's index
    const isDroppingBeforeTargetInOriginalState =
      indexOfTargetTaskInOriginalState > indexOfSourceTaskInOriginalState;
    if (isDroppingBeforeTargetInOriginalState) {
      newTasks.splice(indexOfTargetTaskInOriginalState - 1, 0, sourceTask);
    } else {
      newTasks.splice(indexOfTargetTaskInOriginalState, 0, sourceTask);
    }

    setState({ ...state, tasks: newTasks });
  }
}
