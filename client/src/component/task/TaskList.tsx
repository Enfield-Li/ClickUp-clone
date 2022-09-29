import { Box, SimpleGrid } from "@chakra-ui/react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import Column from "./Column";
import {
  State,
  initialData,
  SetState,
  ColumnType,
  Columns,
  SortBy,
  OrderedTasks,
} from "./Data";
import { lookUp, processTaskBasedOnStage } from "./TaskDataProcessing";

type Props = {
  columns: Columns;
  sortBy: SortBy;
};

export default function TaskList({ columns, sortBy }: Props) {
  const [state, setState] = useState<OrderedTasks>();
  // console.log("state: ", state);
  const [isDragging, setIsDragging] = useState(false);
  const [draggingId, setDraggingId] = useState<number>();

  // Simulating getting data from api
  useEffect(() => {
    const dataFromAPI = initialData;
    const processedData = processTaskBasedOnStage(dataFromAPI, columns, sortBy);
    setState(processedData);
  }, [sortBy]);

  function isDraggingToOtherColumn(
    isDragging: boolean,
    columnId: number,
    draggingId: number | undefined
  ) {
    return isDragging && columnId !== draggingId;
  }

  if (!state) return <div>Loading</div>;

  return (
    <Box px={6} py={1}>
      <DragDropContext
        onDragEnd={(result) =>
          handleDragEnd(result, state, setState, columns, sortBy, setIsDragging)
        }
        onDragStart={(start, provided) => {
          setDraggingId(Number(start.source.droppableId));
          setIsDragging(true);
        }}
      >
        <SimpleGrid columns={columns.length} spacing={10}>
          {columns.map((column, index) => {
            return (
              <Box
                key={column.id}
                borderRadius={4}
                border={
                  isDraggingToOtherColumn(isDragging, column.id, draggingId)
                    ? "dotted"
                    : "solid transparent"
                }
              >
                <Column
                  column={column}
                  // pass down the tasklist data with stage that matches column/stage
                  tasks={state[index]}
                  isDragging={isDragging}
                  setIsDragging={setIsDragging}
                />
              </Box>
            );
          })}
        </SimpleGrid>
      </DragDropContext>
    </Box>
  );
}

function handleDragEnd(
  result: DropResult,
  state: State,
  setState: SetState,
  columns: Columns,
  sortBy: SortBy,
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>
) {
  setIsDragging(false);
  const { destination, source } = result;

  if (!destination) return;

  if (
    destination.droppableId === source.droppableId &&
    destination.index === source.index
  ) {
    return;
  }

  const sourceTaskColumnIndex = columns.findIndex(
    (column) => column.id === Number(source.droppableId)
  );
  const destinationTaskColumnIndex = columns.findIndex(
    (column) => column.id === Number(destination.droppableId)
  );

  const tasks = [...state];
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
      sourceTask.previousItem[lookUp[sortBy]] = destinationTaskBefore
        ? destinationTaskBefore.id
        : undefined;
      destinationTask.previousItem[lookUp[sortBy]] = sourceTask.id;

      if (sourceTaskAfter) {
        sourceTaskAfter.previousItem[lookUp[sortBy]] = destinationTask.id;
      }
    }

    // move down one row
    else if (moveDownOneRow) {
      destinationTask.previousItem[lookUp[sortBy]] = sourceTaskBefore
        ? sourceTaskBefore.id
        : undefined;
      sourceTask.previousItem[lookUp[sortBy]] = destinationTask.id;

      if (destinationTaskAfter) {
        destinationTaskAfter.previousItem[lookUp[sortBy]] = sourceTask.id;
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
        sourceTaskAfter.previousItem[lookUp[sortBy]] = sourceTaskBefore
          ? sourceTaskBefore.id
          : undefined;

        if (destinationTaskAfter)
          destinationTaskAfter.previousItem[lookUp[sortBy]] = sourceTask.id;
        sourceTask.previousItem[lookUp[sortBy]] = destinationTask.id;
      }

      // move up
      else {
        sourceTask.previousItem[lookUp[sortBy]] = destinationTaskBefore
          ? destinationTaskBefore.id
          : undefined;
        destinationTask.previousItem[lookUp[sortBy]] = sourceTask.id;

        if (sourceTaskAfter) {
          sourceTaskAfter.previousItem[lookUp[sortBy]] = sourceTaskBefore
            ? sourceTaskBefore.id
            : undefined;
        }
      }
    }

    sourceTasksArr.splice(source.index, 1); // delete original
    sourceTasksArr.splice(destination.index, 0, sourceTask); // insert original to new place

    return setState(tasks);

    /*
     * Drop in a different column
     */
  } else {
    // change task stage
    sourceTask.status = columns[destinationTaskColumnIndex].id;

    if (sourceTaskAfter)
      sourceTaskAfter.previousItem[lookUp[sortBy]] = sourceTaskBefore
        ? sourceTaskBefore.id
        : undefined;

    // move to an empty column or to the last position
    if (!destinationTask) {
      const lastElement = destinationTasksArr[destinationTasksArr.length - 1];
      sourceTask.previousItem[lookUp[sortBy]] = lastElement
        ? lastElement.id
        : undefined;
    }

    // move to the middle or top of the column
    else {
      destinationTask.previousItem[lookUp[sortBy]] = sourceTask.id;
      sourceTask.previousItem[lookUp[sortBy]] = destinationTaskBefore
        ? destinationTaskBefore.id
        : undefined;
    }

    sourceTasksArr.splice(source.index, 1); // delete original
    destinationTasksArr.splice(destination.index, 0, sourceTask); // insert original to new place

    return setState(tasks);
  }
}
