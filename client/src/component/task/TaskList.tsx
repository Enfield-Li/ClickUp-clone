import { Box, Flex } from "@chakra-ui/react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useEffect } from "react";
import { useFetchTasks, useLocalTasks } from "../../hook/useFetch";
import { API_ENDPOINT } from "../../utils/constant";
import AddColumn from "./AddColumn";
import Column from "./Column";
import {
  Columns,
  LookUpDueDateId,
  lookUpPreviousTaskId,
  SortBy,
  State,
  TaskList,
} from "./Data";
import { updateTasks } from "./TaskActions";
import {
  collectAllTasks,
  processLookUpDueDateId,
  processTaskListOnSortBy,
} from "./TaskDataProcessing";

type Props = {
  sortBy: SortBy;
};

export default function TaskListView({ sortBy }: Props) {
  const { state, setState, dueDateColumns } = useLocalTasks(sortBy);
  // const { state, loading, error, setState, dueDateColumns } = useFetchTasks(API_ENDPOINT.TASK_ENDPOINT_ALL_TASKS, sortBy);
  console.log(state);

  // Sync up state with sortBy
  // column keeps the original data and restructure tasks
  useEffect(() => {
    if (state) {
      setState({
        ...state,
        // Flat list by processTaskBasedOnSortBy()
        orderedTasks: processTaskListOnSortBy(
          collectAllTasks(state.orderedTasks),
          state.unorderedColumns[sortBy],
          sortBy
        ),
      });
    }
  }, [sortBy]);

  if (!state || !dueDateColumns) return <div>Loading</div>;
  // if (!state || loading) return <div>Loading</div>;

  // Choose column to display
  let orderedColumns: Columns;
  if (sortBy === "dueDate") {
    orderedColumns = dueDateColumns;
  } else {
    orderedColumns = state.unorderedColumns[sortBy];
  }

  return (
    <Box px={3} overflowY={"auto"}>
      <DragDropContext
        onDragEnd={(result) =>
          handleDragEnd(result, state, orderedColumns, sortBy)
        }
      >
        <Flex>
          {orderedColumns.map((column, index) => (
            <Box mx={2} key={column.id} borderRadius={4}>
              <Column
                state={state}
                sortBy={sortBy}
                setState={setState}
                column={column}
                dueDateColumns={dueDateColumns}
                // Pass down list as per column.id
                tasks={
                  state.orderedTasks.find(
                    (orderedTask) => orderedTask.id === column.id
                  )?.taskList
                }
              />
            </Box>
          ))}
          {sortBy === "status" && <AddColumn />}
        </Flex>
      </DragDropContext>
    </Box>
  );
}

function handleDragEnd(
  result: DropResult,
  state: State,
  columns: Columns,
  sortBy: SortBy
) {
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

  updateTasks(taskForUpdate);
}
