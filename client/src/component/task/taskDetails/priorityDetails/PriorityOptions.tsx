import { Box, Divider, Flex } from "@chakra-ui/react";
import produce from "immer";
import useTaskDetailContext from "../../../../context/task_detail/useTaskDetailContext";
import {
  PRIORITY,
  SetState,
  SortBy,
  TargetColumn,
  Task,
  lookUpPreviousTaskId,
} from "../../Data";
import { updateTaskStatsInColumn } from "../../TaskDataProcessing";

type Props = { onOptionClose: () => void };

export default function PriorityOptions({ onOptionClose }: Props) {
  const {
    task,
    isModalOpen,
    setTask,
    onModalOpen,
    onModalClose,
    taskStateContext,
    setTaskStateContext,
  } = useTaskDetailContext();

  const { setState, sortBy, columnOptions } = taskStateContext!;

  return (
    <>
      {columnOptions.priority.map(
        (priority) =>
          // Hide finished column and current priority stage
          priority.id !== 0 &&
          task!.priority !== priority.id && (
            <Box key={priority.id}>
              <Flex
                p={3}
                rounded="sm"
                cursor="pointer"
                onClick={() => {
                  onOptionClose();

                  const targetPriorityColumnId = priority.id;

                  // Update list state
                  updateTaskPriorityOrDueDate(
                    sortBy,
                    task!,
                    setState,
                    "priority",
                    targetPriorityColumnId
                  );
                  // Update modal task state
                  setTask({ ...task!, priority: targetPriorityColumnId });
                }}
                _hover={{ backgroundColor: "blue.600" }}
              >
                <Box color={priority.color} mr={4}>
                  <i className="bi bi-flag-fill"></i>
                </Box>
                {priority.title}
              </Flex>

              {/* Last row */}
              {priority.id !== 5 && <Divider />}
            </Box>
          )
      )}
    </>
  );
}

export function updateTaskPriorityOrDueDate(
  sortBy: SortBy,
  currentTask: Task,
  setState: SetState,
  targetColumnKey: keyof typeof lookUpPreviousTaskId,
  targetColumnId: number
) {
  const targetColumn: TargetColumn =
    targetColumnKey === "dueDate"
      ? { dueDate: String(targetColumnId) }
      : { priority: String(targetColumnId) };

  setState((previousState) => {
    if (previousState) {
      return produce(previousState, (draftState) => {
        // Update sourceTask's Stats
        draftState.orderedTasks.forEach((taskList) =>
          taskList.taskList.forEach((task) => {
            const isSourceTask = task.id === currentTask.id;
            if (isSourceTask) {
              updateTaskStatsInColumn(draftState, targetColumn, task);
            }

            // Update sourceTaskAfter's stats
            const isSourceTaskAfter =
              task.previousTask[lookUpPreviousTaskId[targetColumnKey]] ===
              currentTask.id;
            if (isSourceTaskAfter) {
              task.previousTask[lookUpPreviousTaskId[targetColumnKey]] =
                currentTask.previousTask[lookUpPreviousTaskId[targetColumnKey]];
            }
          })
        );

        // Update positions
        const currentColumnId = draftState.orderedTasks.find((tasks) =>
          tasks.taskList.find((task) => task.id === currentTask.id)
        )?.id;

        const sourceColumn = draftState.orderedTasks.find(
          (tasks) => tasks.id === currentColumnId
        );

        const sourceTask = sourceColumn?.taskList.find(
          (task) => task.id === currentTask.id
        );

        const destinationColumn = draftState.orderedTasks.find(
          (tasks) => tasks.id === targetColumnId
        );

        const currentTaskIndexInSourceColumn = sourceColumn?.taskList.findIndex(
          (task) => task.id === sourceTask?.id
        );

        // Remove from current column and push task to finished column
        if (sortBy === targetColumnKey) {
          const sourceTaskIndex =
            currentTaskIndexInSourceColumn ||
            currentTaskIndexInSourceColumn === 0;
          if (sourceTaskIndex && sourceTask) {
            sourceColumn?.taskList.splice(currentTaskIndexInSourceColumn, 1);

            destinationColumn?.taskList.push(sourceTask);
          }
        }
      });
    }
  });
}
