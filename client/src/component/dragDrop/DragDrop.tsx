import { Box, SimpleGrid } from "@chakra-ui/react";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import React, { useEffect, useState } from "react";
import Column from "./Column";

type Props = {};

export type Task = {
  id: number;
  content: string;
  stage: number;
  previousId?: number;
};

export type TaskList = Task[];
export type OrderedTasks = TaskList[];

export type Stage = { id: number; title: string };
export type Stages = Stage[];

export type InitialState = { tasks: TaskList; columns: Stages };

export type State = { tasks: OrderedTasks; columns: Stages };
export type SetState = React.Dispatch<React.SetStateAction<State | undefined>>;

export const initialData: InitialState = {
  tasks: [
    { id: 666, content: "66666666666", stage: 9 },
    { id: 555, content: "55555555555", stage: 8 },
    { id: 444, content: "44444444444", stage: 1, previousId: 777 },
    { id: 222, content: "22222222222", stage: 8, previousId: 555 },
    { id: 111, content: "11111111111", stage: 1, previousId: 333 },
    { id: 777, content: "77777777777", stage: 1, previousId: 111 },
    { id: 333, content: "33333333333", stage: 1 },
  ],
  columns: [
    { id: 1, title: "Stage 1" },
    { id: 9, title: "Stage 9" },
    { id: 8, title: "Stage 8" },
  ],
};

export default function DragDrop({}: Props) {
  const [state, setState] = useState<State>();
  const [columnIdWhenDragging, setColumnIdWhenDragging] = useState<number>();

  function isDraggingToOtherColumn(currentColumnId: number) {
    return columnIdWhenDragging && currentColumnId !== columnIdWhenDragging;
  }

  useEffect(() => {
    setState({ ...initialData, tasks: processState(initialData) });
  }, []);

  if (!state) return <div>Loading</div>;

  return (
    <>
      <DragDropContext
        // dragging functionality inside handleDragEnd()
        onDragEnd={(result) => handleDragEnd(result, state, setState)}
      >
        <SimpleGrid columns={3} spacing={10}>
          {state?.columns.map((column, index) => {
            return (
              <Box
                key={column.id}
                borderRadius={4}
                border={
                  isDraggingToOtherColumn(column.id)
                    ? "dotted"
                    : "solid transparent"
                }
              >
                <Column
                  column={column}
                  // pass down the tasklist data with stage that matches column/stage
                  tasks={state.tasks[index]}
                  columnIdWhenDragging={columnIdWhenDragging}
                  setColumnIdWhenDragging={setColumnIdWhenDragging}
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

  const sourceTaskColumnIndex = state.columns.findIndex(
    (column) => column.id === Number(source.droppableId)
  );
  const destinationTaskColumnIndex = state.columns.findIndex(
    (column) => column.id === Number(destination.droppableId)
  );

  const tasks = [...state.tasks];
  const sourceTasksArr = tasks[sourceTaskColumnIndex];
  const destinationTasksArr = tasks[destinationTaskColumnIndex];

  const sourceTask = sourceTasksArr[source.index];
  const sourceTaskBefore = sourceTasksArr[source.index - 1];
  const sourceTaskAfter = sourceTasksArr[source.index + 1];

  const destinationTask = destinationTasksArr[destination.index];
  const destinationTaskBefore = destinationTasksArr[destination.index - 1];
  const destinationTaskAfter = destinationTasksArr[destination.index + 1];

  const sourceTaskIndex = sourceTasksArr.findIndex(
    (task) => task.id === sourceTask.id
  );

  /*
   * Drop in the same column
   */
  const isDropInTheSameColumn = source.droppableId === destination.droppableId;
  if (isDropInTheSameColumn) {
    const movingUpOneRow =
      sourceTaskBefore === destinationTask &&
      destinationTaskAfter === sourceTask;
    const moveDownOneRow =
      sourceTaskAfter === destinationTask &&
      destinationTaskBefore === sourceTask;

    // move up one row
    if (movingUpOneRow) {
      sourceTask.previousId = destinationTaskBefore
        ? destinationTaskBefore.id
        : undefined;
      destinationTask.previousId = sourceTask.id;

      if (sourceTaskAfter) {
        sourceTaskAfter.previousId = destinationTask.id;
      }
    }

    // move down one row
    else if (moveDownOneRow) {
      destinationTask.previousId = sourceTaskBefore
        ? sourceTaskBefore.id
        : undefined;
      sourceTask.previousId = destinationTask.id;

      if (destinationTaskAfter) {
        destinationTaskAfter.previousId = sourceTask.id;
      }
    }

    // move up or down multiple rows
    else {
      const destinationTaskIndex = sourceTasksArr.findIndex(
        (task) => task.id === destinationTask.id
      );

      // move down
      const isMoveDown = sourceTaskIndex < destinationTaskIndex;
      if (isMoveDown) {
        sourceTaskAfter.previousId = sourceTaskBefore
          ? sourceTaskBefore.id
          : undefined;

        if (destinationTaskAfter)
          destinationTaskAfter.previousId = sourceTask.id;
        sourceTask.previousId = destinationTask.id;
      }

      // move up
      else {
        sourceTask.previousId = destinationTaskBefore
          ? destinationTaskBefore.id
          : undefined;
        destinationTask.previousId = sourceTask.id;

        if (sourceTaskAfter) {
          sourceTaskAfter.previousId = sourceTaskBefore
            ? sourceTaskBefore.id
            : undefined;
        }
      }
    }

    sourceTasksArr.splice(source.index, 1); // delete original
    sourceTasksArr.splice(destination.index, 0, sourceTask); // insert original to new place

    return setState({
      ...state!,
      tasks: tasks,
    });

    /*
     * Drop in a different column
     */
  } else {
    // change task stage
    sourceTask.stage = state.columns[destinationTaskColumnIndex].id;

    if (sourceTaskAfter)
      sourceTaskAfter.previousId = sourceTaskBefore
        ? sourceTaskBefore.id
        : undefined;

    // move to an empty column or to the last position
    if (!destinationTask) {
      const lastElement = destinationTasksArr[destinationTasksArr.length - 1];
      sourceTask.previousId = lastElement ? lastElement.id : undefined;
    }

    // move to the middle or top of the column
    else {
      destinationTask.previousId = sourceTask.id;
      sourceTask.previousId = destinationTaskBefore
        ? destinationTaskBefore.id
        : undefined;
    }

    sourceTasksArr.splice(source.index, 1); // delete original
    destinationTasksArr.splice(destination.index, 0, sourceTask); // insert original to new place

    return;
  }
}

/* 
  Convert Task[] to nested Task[][] array group by task.stage:
  [
    [task1, task2], // <- task with stage 1 and ordered by previousId
    [task3, task4] // <- task with stage 2 and ordered by previousId
  ]
*/
function processState(state: InitialState) {
  const tasks = state.tasks;
  const columns = state.columns;

  const taskStageArr: number[] = [];
  const nestedTasks: Task[][] = [];

  // find all stages and collect it into "taskStageArr"
  for (let i = 0; i < columns.length; i++) {
    const element = columns[i];
    taskStageArr.push(element.id);
  }

  // forming a nested structure from type Task[] to Task[][]
  for (let i = 0; i < taskStageArr.length; i++) {
    const stageId = taskStageArr[i];

    if (!nestedTasks[i]) nestedTasks[i] = [];

    // add the first item by initializing the first task in the array with previousId === undefined
    for (let j = 0; j < tasks.length; j++) {
      const task = tasks[j];

      if (task.stage === stageId && !task.previousId) {
        nestedTasks[i][0] = task;
      }
    }

    // pushing the entailing task based on previousId
    for (let j = 0; j < nestedTasks[i].length; j++) {
      const currentTask = nestedTasks[i][j];

      const entailingTask = tasks.find(
        (task) => task.previousId === currentTask.id
      );

      if (entailingTask) nestedTasks[i].push(entailingTask);
    }
  }

  return nestedTasks;
}

function reorderTasks(tasks: TaskList, columns: Stages) {}
