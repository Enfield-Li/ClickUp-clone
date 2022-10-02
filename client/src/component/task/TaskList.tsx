import { Box, Flex } from "@chakra-ui/react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import { reorderAndRenameColumns } from "../../utils/reorderDateColumns";
import AddColumn from "./AddColumn";
import Column from "./Column";
import { Columns, initialData, SortBy, columnOptions, State } from "./Data";
import {
  collectAllTasks,
  lookUpId,
  processTaskBasedOnSortBy,
} from "./TaskDataProcessing";

type Props = {
  sortBy: SortBy;
};

export default function TaskList({ sortBy }: Props) {
  const [state, setState] = useState<State>();
  const [isDragging, setIsDragging] = useState(false);
  const [draggingId, setDraggingId] = useState<number>();
  // console.log(state);

  // Simulating getting data from api
  useEffect(() => {
    const columnDataFromApi = columnOptions;

    const dataFromAPI = initialData;
    const processedData = processTaskBasedOnSortBy(
      dataFromAPI,
      columnDataFromApi[sortBy],
      sortBy
    );

    setState({
      orderedTasks: processedData,
      unorderedColumns: columnDataFromApi,
    });
  }, []);

  // Sync up state with sortBy
  // column keeps the original data and restructure tasks
  useEffect(() => {
    if (state) {
      setState({
        ...state,
        orderedTasks: processTaskBasedOnSortBy(
          collectAllTasks(state.orderedTasks),
          state.unorderedColumns[sortBy],
          sortBy
        ),
      });
    }
  }, [sortBy]);

  if (!state) return <div>Loading</div>;

  // Define and reorder columns
  let columns: Columns;
  if (sortBy === "dueDate") {
    columns = reorderAndRenameColumns(state.unorderedColumns, sortBy);
  } else {
    columns = state.unorderedColumns[sortBy];
  }

  return (
    <Box px={3} overflowY={"auto"}>
      <DragDropContext
        onDragEnd={(result) =>
          handleDragEnd(result, state, columns, sortBy, setIsDragging)
        }
        onDragStart={(start, provided) => {
          setDraggingId(Number(start.source.droppableId));
          setIsDragging(true);
        }}
      >
        <Flex>
          {columns.map((column, index) => (
            <Box
              mx={2}
              key={column.id}
              borderRadius={4}
              border={
                isDraggingToOtherColumn(isDragging, column.id, draggingId)
                  ? "dotted"
                  : "solid transparent"
              }
            >
              <Column
                sortBy={sortBy}
                setState={setState}
                column={column}
                // pass down the tasklist data with stage that matches the order of the respective column
                tasks={
                  state.orderedTasks.find(
                    (orderedTask) => orderedTask.id === column.id
                  )?.taskList
                }
                isDragging={isDragging}
                setIsDragging={setIsDragging}
              />
            </Box>
          ))}
          {sortBy === "status" && <AddColumn />}
        </Flex>
      </DragDropContext>
    </Box>
  );
}

function isDraggingToOtherColumn(
  isDragging: boolean,
  columnId: number,
  draggingId: number | undefined
) {
  return isDragging && columnId !== draggingId;
}

function handleDragEnd(
  result: DropResult,
  state: State,
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

  const tasks = [...state.orderedTasks];
  const sourceTasksArr = tasks[sourceTaskColumnIndex];
  const destinationTasksArr = tasks[destinationTaskColumnIndex];

  const sourceTask = sourceTasksArr.taskList[source.index];
  const sourceTaskBefore = sourceTasksArr.taskList[source.index - 1];
  const sourceTaskAfter = sourceTasksArr.taskList[source.index + 1];

  const destinationTask = destinationTasksArr.taskList[destination.index];
  const destinationTaskBefore =
    destinationTasksArr.taskList[destination.index - 1];
  const destinationTaskAfter =
    destinationTasksArr.taskList[destination.index + 1];

  const sourceTaskIndex = sourceTasksArr.taskList.findIndex(
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
      const destinationTaskIndex = sourceTasksArr.taskList.findIndex(
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

    sourceTasksArr.taskList.splice(source.index, 1); // delete original
    sourceTasksArr.taskList.splice(destination.index, 0, sourceTask); // insert original to new place

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
      const lastElement =
        destinationTasksArr.taskList[destinationTasksArr.taskList.length - 1];
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

    sourceTasksArr.taskList.splice(source.index, 1); // delete original
    destinationTasksArr.taskList.splice(destination.index, 0, sourceTask); // insert original to new place
  }
}
