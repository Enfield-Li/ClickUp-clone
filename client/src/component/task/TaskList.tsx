import { Box, Flex } from "@chakra-ui/react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import { useLocalTasks } from "../../hook/useFetch";
import AddColumn from "./AddColumn";
import Column from "./Column";
import {
  Columns,
  LookUpDueDateId,
  lookUpPreviousTaskId,
  lookUpIsLastItem,
  SortBy,
  State,
  TaskList,
} from "./Data";
import {
  collectAllTasks,
  processLookUpDueDateId,
  processTaskBasedOnSortBy,
  renameAndReorderColumns,
} from "./TaskDataProcessing";

type Props = {
  sortBy: SortBy;
};

export default function TaskListView({ sortBy }: Props) {
  const { state, setState } = useLocalTasks(sortBy);
  // const { state, loading, error, setState } = useFetchTasks(API_ENDPOINT.TASK_ENDPOINT_ALL_TASKS, sortBy);

  const [isDragging, setIsDragging] = useState(false);
  const [draggingId, setDraggingId] = useState<number>();
  console.log(state);

  // Sync up state with sortBy
  // column keeps the original data and restructure tasks
  useEffect(() => {
    if (state) {
      setState({
        ...state,
        // Flat list by processTaskBasedOnSortBy()
        orderedTasks: processTaskBasedOnSortBy(
          collectAllTasks(state.orderedTasks),
          state.unorderedColumns[sortBy],
          sortBy
        ),
      });
    }
  }, [sortBy]);

  if (!state) return <div>Loading</div>;
  // if (!state || loading) return <div>Loading</div>;

  // Reorder columns for dueDate type
  let orderedColumns: Columns;
  if (sortBy === "dueDate") {
    orderedColumns = renameAndReorderColumns(state.unorderedColumns, sortBy);
  } else {
    orderedColumns = state.unorderedColumns[sortBy];
  }

  return (
    <Box px={3} overflowY={"auto"}>
      <DragDropContext
        onDragEnd={(result) =>
          handleDragEnd(result, state, orderedColumns, sortBy, setIsDragging)
        }
        onDragStart={(start, provided) => {
          setDraggingId(Number(start.source.droppableId));
          setIsDragging(true);
        }}
      >
        <Flex>
          {orderedColumns.map((column, index) => (
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
                state={state}
                sortBy={sortBy}
                setState={setState}
                column={column}
                // Pass down list as per column.id
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

  const lookUpDueDateId: LookUpDueDateId = {};
  if (sortBy === "dueDate") {
    processLookUpDueDateId(state.orderedTasks, columns, lookUpDueDateId);
  }

  const sourceDroppableId =
    sortBy === "dueDate"
      ? lookUpDueDateId[Number(source.droppableId)]
      : Number(source.droppableId);
  const destinationDroppableId =
    sortBy === "dueDate"
      ? lookUpDueDateId[Number(destination.droppableId)]
      : Number(destination.droppableId);

  const sourceTaskColumnIndex = columns.findIndex(
    (column) => column.id === sourceDroppableId
  );
  const destinationTaskColumnIndex = columns.findIndex(
    (column) => column.id === destinationDroppableId
  );

  const taskForUpdate: TaskList = [];

  // const tasks = [...state.orderedTasks]; // <- why will this update state with splice() IDK
  const tasks = state.orderedTasks; // This works as well

  const sourceTasksArr = tasks[sourceTaskColumnIndex];
  const destinationTasksArr = tasks[destinationTaskColumnIndex];

  const sourceTasksArrLength = sourceTasksArr.taskList.length;
  const lastTaskInSourceTasksArr =
    sourceTasksArr.taskList[sourceTasksArrLength - 1];

  const destinationTasksArrLength = destinationTasksArr.taskList.length;
  const lastTaskInDestinationTasksArr =
    destinationTasksArr.taskList[destinationTasksArrLength - 1];

  const sourceTask = sourceTasksArr.taskList[source.index];
  const sourceTaskBefore = sourceTasksArr.taskList[source.index - 1];
  const sourceTaskAfter = sourceTasksArr.taskList[source.index + 1];

  const destinationTask = destinationTasksArr.taskList[destination.index];
  const destinationTaskBefore =
    destinationTasksArr.taskList[destination.index - 1];
  const destinationTaskAfter =
    destinationTasksArr.taskList[destination.index + 1];

  /* 
     Determine the last element in array
   */
  // Drag from middle to the last in the same column
  const sourceTaskIsNotTheLastElementAndDestinationTaskExist =
    sourceTask !== lastTaskInSourceTasksArr && destinationTask;
  if (sourceTaskIsNotTheLastElementAndDestinationTaskExist) {
    sourceTask.isLastItem[lookUpIsLastItem[sortBy]] = true;
    destinationTask.isLastItem[lookUpIsLastItem[sortBy]] = undefined;
  }

  // Drag from the last to the middle of another column
  const sourceTaskIsTheLastElementAndDestinationTaskExist =
    sourceTask === lastTaskInSourceTasksArr && destinationTask;
  if (sourceTaskIsTheLastElementAndDestinationTaskExist) {
    sourceTask.isLastItem[lookUpIsLastItem[sortBy]] = undefined;

    if (sourceTaskBefore) {
      sourceTaskBefore.isLastItem[lookUpIsLastItem[sortBy]] = true;
    }
  }

  // Drag from the middle to the last of another column
  const sourceTaskIsNotTheLastElementAndDestinationTaskDoesNotExist =
    sourceTask !== lastTaskInSourceTasksArr && !destinationTask;
  if (sourceTaskIsNotTheLastElementAndDestinationTaskDoesNotExist) {
    sourceTask.isLastItem[lookUpIsLastItem[sortBy]] = true;

    if (destinationTaskBefore) {
      destinationTaskBefore.isLastItem[lookUpIsLastItem[sortBy]] = undefined;
    }
  }

  // Drag from the last to the last of another column
  const sourceTaskIsTheLastElementAndDestinationTaskDoesNotExist =
    sourceTask === lastTaskInSourceTasksArr && !destinationTask;
  if (sourceTaskIsTheLastElementAndDestinationTaskDoesNotExist) {
    // here
    sourceTask.isLastItem[lookUpIsLastItem[sortBy]] = true;

    if (sourceTaskBefore) {
      sourceTaskBefore.isLastItem[lookUpIsLastItem[sortBy]] = true;
    }

    if (destinationTaskBefore) {
      destinationTaskBefore.isLastItem[lookUpIsLastItem[sortBy]] = undefined;
    }
  }

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
      sourceTask.previousItem[lookUpPreviousTaskId[sortBy]] =
        destinationTaskBefore ? destinationTaskBefore.id : undefined;
      destinationTask.previousItem[lookUpPreviousTaskId[sortBy]] =
        sourceTask.id;
      if (sourceTaskAfter) {
        sourceTaskAfter.previousItem[lookUpPreviousTaskId[sortBy]] =
          destinationTask.id;

        taskForUpdate.push(sourceTaskAfter);
      }
    }

    // move down one row
    else if (moveDownOneRow) {
      destinationTask.previousItem[lookUpPreviousTaskId[sortBy]] =
        sourceTaskBefore ? sourceTaskBefore.id : undefined;
      sourceTask.previousItem[lookUpPreviousTaskId[sortBy]] =
        destinationTask.id;
      if (destinationTaskAfter) {
        destinationTaskAfter.previousItem[lookUpPreviousTaskId[sortBy]] =
          sourceTask.id;

        taskForUpdate.push(destinationTaskAfter);
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
        sourceTaskAfter.previousItem[lookUpPreviousTaskId[sortBy]] =
          sourceTaskBefore ? sourceTaskBefore.id : undefined;
        sourceTask.previousItem[lookUpPreviousTaskId[sortBy]] =
          destinationTask.id;
        if (destinationTaskAfter) {
          destinationTaskAfter.previousItem[lookUpPreviousTaskId[sortBy]] =
            sourceTask.id;

          taskForUpdate.push(destinationTaskAfter);
        }
      }

      // move up
      else {
        sourceTask.previousItem[lookUpPreviousTaskId[sortBy]] =
          destinationTaskBefore ? destinationTaskBefore.id : undefined;
        destinationTask.previousItem[lookUpPreviousTaskId[sortBy]] =
          sourceTask.id;
        if (sourceTaskAfter) {
          sourceTaskAfter.previousItem[lookUpPreviousTaskId[sortBy]] =
            sourceTaskBefore ? sourceTaskBefore.id : undefined;

          taskForUpdate.push(sourceTaskAfter);
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
    sourceTask[sortBy] =
      sortBy === "dueDate"
        ? Number(destination.droppableId)
        : destinationDroppableId;

    if (sourceTaskAfter) {
      sourceTaskAfter.previousItem[lookUpPreviousTaskId[sortBy]] =
        sourceTaskBefore ? sourceTaskBefore.id : undefined;

      taskForUpdate.push(sourceTaskAfter);
    }

    // move to an empty column or to the last position
    if (!destinationTask) {
      sourceTask.previousItem[lookUpPreviousTaskId[sortBy]] =
        lastTaskInDestinationTasksArr
          ? lastTaskInDestinationTasksArr.id
          : undefined;
    }

    // move to the middle or top of the column
    else {
      destinationTask.previousItem[lookUpPreviousTaskId[sortBy]] =
        sourceTask.id;
      sourceTask.previousItem[lookUpPreviousTaskId[sortBy]] =
        destinationTaskBefore ? destinationTaskBefore.id : undefined;
    }

    sourceTasksArr.taskList.splice(source.index, 1); // delete original
    destinationTasksArr.taskList.splice(destination.index, 0, sourceTask); // insert original to new place
  }

  if (destinationTask) {
    taskForUpdate.push(destinationTask);
  }
  taskForUpdate.push(sourceTask);
  // updateTasks(taskForUpdate);
}
