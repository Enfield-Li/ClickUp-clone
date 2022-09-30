import { Box, SimpleGrid } from "@chakra-ui/react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import { reorderAndRenameDateColumns } from "../../utils/reorderDateColumns";
import Column from "./Column";
import {
  Columns,
  initialData,
  OrderedTasks,
  SetState,
  SortBy,
  sortingOptions,
  State,
} from "./Data";
import { lookUpId, processTaskBasedOnSortBy } from "./TaskDataProcessing";

type Props = {
  sortBy: SortBy;
};

export default function TaskList({ sortBy }: Props) {
  const [orderedTasks, setOrderedTasks] = useState<OrderedTasks>();
  const [isDragging, setIsDragging] = useState(false);
  const [draggingId, setDraggingId] = useState<number>();

  // Simulating getting data from api
  useEffect(() => {
    const dataFromAPI = initialData;
    const processedData = processTaskBasedOnSortBy(
      dataFromAPI,
      columns,
      sortBy
    );
    setOrderedTasks(processedData);
  }, []);

  // Restructure task based on sortBy
  useEffect(() => {
    if (orderedTasks) {
      setOrderedTasks(
        processTaskBasedOnSortBy(orderedTasks.flat(), columns, sortBy)
      );
    }
  }, [sortBy]);

  // Define columns
  let columns: Columns;
  if (sortBy === "dueDate") {
    columns = reorderAndRenameDateColumns(sortingOptions, sortBy);
  } else {
    columns = sortingOptions[sortBy];
  }

  function isDraggingToOtherColumn(
    isDragging: boolean,
    columnId: number,
    draggingId: number | undefined
  ) {
    return isDragging && columnId !== draggingId;
  }

  if (!orderedTasks) return <div>Loading</div>;

  return (
    <Box px={6} py={1} height={"580px"} overflow={"hidden"}>
      <DragDropContext
        onDragEnd={(result) =>
          handleDragEnd(
            result,
            orderedTasks,
            setOrderedTasks,
            columns,
            sortBy,
            setIsDragging
          )
        }
        onDragStart={(start, provided) => {
          setDraggingId(Number(start.source.droppableId));
          setIsDragging(true);
        }}
      >
        <SimpleGrid columns={columns.length} spacing={10}>
          {columns.map((column, index) => (
            <Box
              height={"580px"}
              overflow={"auto"}
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
                // pass down the tasklist data with stage that matches the order of the respective column
                tasks={orderedTasks[index]}
                isDragging={isDragging}
                setIsDragging={setIsDragging}
              />
            </Box>
          ))}
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
      sourceTask.previousItem[lookUpId[sortBy]] = destinationTaskBefore
        ? destinationTaskBefore.id
        : undefined;
      destinationTask.previousItem[lookUpId[sortBy]] = sourceTask.id;

      if (sourceTaskAfter) {
        sourceTaskAfter.previousItem[lookUpId[sortBy]] = destinationTask.id;
      }
    }

    // move down one row
    else if (moveDownOneRow) {
      destinationTask.previousItem[lookUpId[sortBy]] = sourceTaskBefore
        ? sourceTaskBefore.id
        : undefined;
      sourceTask.previousItem[lookUpId[sortBy]] = destinationTask.id;

      if (destinationTaskAfter) {
        destinationTaskAfter.previousItem[lookUpId[sortBy]] = sourceTask.id;
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
        sourceTaskAfter.previousItem[lookUpId[sortBy]] = sourceTaskBefore
          ? sourceTaskBefore.id
          : undefined;

        if (destinationTaskAfter)
          destinationTaskAfter.previousItem[lookUpId[sortBy]] = sourceTask.id;
        sourceTask.previousItem[lookUpId[sortBy]] = destinationTask.id;
      }

      // move up
      else {
        sourceTask.previousItem[lookUpId[sortBy]] = destinationTaskBefore
          ? destinationTaskBefore.id
          : undefined;
        destinationTask.previousItem[lookUpId[sortBy]] = sourceTask.id;

        if (sourceTaskAfter) {
          sourceTaskAfter.previousItem[lookUpId[sortBy]] = sourceTaskBefore
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
    sourceTask[sortBy] = columns[destinationTaskColumnIndex].id;

    if (sourceTaskAfter)
      sourceTaskAfter.previousItem[lookUpId[sortBy]] = sourceTaskBefore
        ? sourceTaskBefore.id
        : undefined;

    // move to an empty column or to the last position
    if (!destinationTask) {
      const lastElement = destinationTasksArr[destinationTasksArr.length - 1];
      sourceTask.previousItem[lookUpId[sortBy]] = lastElement
        ? lastElement.id
        : undefined;
    }

    // move to the middle or top of the column
    else {
      destinationTask.previousItem[lookUpId[sortBy]] = sourceTask.id;
      sourceTask.previousItem[lookUpId[sortBy]] = destinationTaskBefore
        ? destinationTaskBefore.id
        : undefined;
    }

    sourceTasksArr.splice(source.index, 1); // delete original
    destinationTasksArr.splice(destination.index, 0, sourceTask); // insert original to new place

    return setState(tasks);
  }
}
