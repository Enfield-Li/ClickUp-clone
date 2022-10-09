import { Box, Flex } from "@chakra-ui/react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useEffect } from "react";
import { User } from "../../context/auth/AuthContextTypes";
import useAuthContext from "../../context/auth/useAuthContext";
import { useFetchTasks, useLocalTasks } from "../../hook/useFetch";
import { API_ENDPOINT } from "../../utils/constant";
import AddColumn from "./AddColumn";
import Column from "./Column";
import {
  Columns,
  DUE_DATE,
  LookUpDueDateId,
  lookUpPreviousTaskId,
  TargetColumn,
  SetState,
  SortBy,
  State,
  STATUS,
  TaskList,
  OrderedTasks,
  UPDATE,
} from "./Data";
import { updateTasks } from "./TaskActions";
import {
  collectAllTasks,
  processLookUpDueDateId,
  groupTaskListOnSortBy,
  updateTaskInfoInOtherSortBy,
} from "./TaskDataProcessing";

type Props = {
  sortBy: SortBy;
};

export default function TaskListView({ sortBy }: Props) {
  // const { state, setState, dueDateColumns } = useLocalTasks(sortBy);
  const { authState } = useAuthContext();
  const { state, loading, error, setState, orderedColumns, dueDateColumns } =
    useFetchTasks(API_ENDPOINT.TASK_ALL_TASKS, sortBy);
  console.log(state);

  // Sync up state.orderedTasks with sortBy
  // column keeps the original data and restructure tasks
  useEffect(() => {
    if (state) {
      setState({
        ...state,
        // Group all tasks into ordered tasks based on sortBy
        orderedTasks: groupTaskListOnSortBy(
          collectAllTasks(state.orderedTasks),
          state.unorderedColumns[sortBy],
          sortBy
        ),
      });
    }
  }, [sortBy]);

  if (!state || !orderedColumns || !dueDateColumns) return <div>Loading</div>;

  return (
    <Box px={3} overflowY={"auto"}>
      <DragDropContext
        onDragEnd={(result) =>
          handleDragEnd(
            result,
            state,
            setState,
            orderedColumns,
            sortBy,
            authState.user
          )
        }
      >
        <Flex>
          {orderedColumns.map(
            (column, index) =>
              // Finished task is managed in sortBy === status, and hide from user in other sortBy conditions
              column.id !== 0 && (
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
              )
          )}
          {sortBy === STATUS && <AddColumn />}
        </Flex>
      </DragDropContext>
    </Box>
  );
}

async function handleDragEnd(
  result: DropResult,
  state: State,
  setState: SetState,
  columns: Columns,
  sortBy: SortBy,
  user?: User
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
  if (sortBy === DUE_DATE) {
    processLookUpDueDateId(state.orderedTasks, columns, lookUpDueDateId);
  }

  const sourceDroppableId =
    sortBy === DUE_DATE
      ? lookUpDueDateId[Number(source.droppableId)]
      : Number(source.droppableId);
  const destinationDroppableId =
    sortBy === DUE_DATE
      ? lookUpDueDateId[Number(destination.droppableId)]
      : Number(destination.droppableId);

  const sourceTaskColumnIndex = columns.findIndex(
    (column) => column.id === sourceDroppableId
  );
  const destinationTaskColumnIndex = columns.findIndex(
    (column) => column.id === destinationDroppableId
  );

  const taskForUpdate: TaskList = [];

  const orderedTasks = JSON.parse(
    JSON.stringify(state.orderedTasks)
  ) as OrderedTasks;

  const sourceTasksArr = orderedTasks[sourceTaskColumnIndex];
  const destinationTasksArr = orderedTasks[destinationTaskColumnIndex];

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
    const moveUpOneRow =
      sourceTaskBefore === destinationTask &&
      destinationTaskAfter === sourceTask;
    const moveDownOneRow =
      sourceTaskAfter === destinationTask &&
      destinationTaskBefore === sourceTask;

    // move up one row
    if (moveUpOneRow) {
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
      sortBy === DUE_DATE
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

  // Move task from unfinished to finished
  const statusColumnLen = String(state.unorderedColumns.status.length);

  const moveFromUnfinishedToFinished =
    sortBy === STATUS &&
    destination.droppableId === "3" &&
    source.droppableId !== "3";

  if (moveFromUnfinishedToFinished) {
    // Remove task from other sortBy options, by updating the sourceTaskAfter
    orderedTasks.forEach((tasks) =>
      tasks.taskList.forEach((task) => {
        const sourceTaskAfterInPriority =
          task.previousItem.priorityId === sourceTask.id;

        if (sourceTaskAfterInPriority) {
          task.previousItem.priorityId = sourceTask.previousItem.priorityId;
          taskForUpdate.push(task);
        }

        const sourceTaskAfterInDueDate =
          task.previousItem.dueDateId === sourceTask.id;

        if (sourceTaskAfterInDueDate) {
          task.previousItem.dueDateId = sourceTask.previousItem.dueDateId;
          taskForUpdate.push(task);
        }
      })
    );

    // Update sourceTask by cleaning up other sortBy's info
    sourceTask.priority = 0;
    sourceTask.dueDate = 0;
    sourceTask.previousItem.dueDateId = 0;
    sourceTask.previousItem.priorityId = 0;
  }

  // Move finished task to unfinished, and update other sortBy's info
  const moveFromFinishedToUnfinished =
    sortBy === STATUS &&
    destination.droppableId !== String(state.unorderedColumns.status.length) &&
    source.droppableId === "3";

  if (moveFromFinishedToUnfinished) {
    const previousTask: TargetColumn = { dueDate: "1", priority: "1" };
    updateTaskInfoInOtherSortBy(state, previousTask, sourceTask);
  }

  setState({ ...state, orderedTasks: orderedTasks });

  const userId = user!.id;
  const username = user!.username;

  // Override previous update events in client
  sourceTask.events = [
    {
      initiatorId: userId,
      initiatorName: username,
      eventType: UPDATE,
      updateAction: sortBy,
      updateFrom: sourceDroppableId,
      updateTo: destinationDroppableId,
      participants: [{ userId, username }],
    },
  ];

  if (destinationTask) taskForUpdate.push(destinationTask);
  taskForUpdate.push(sourceTask);
  // console.log({ sourceTask });
  // console.log({ taskForUpdate });

  const updated = await updateTasks({
    sourceTaskId: sourceTask.id!,
    taskList: taskForUpdate,
  });
  if (updated) {
    // Clear sourceTask events
    sourceTask.events = [];
  }
}
