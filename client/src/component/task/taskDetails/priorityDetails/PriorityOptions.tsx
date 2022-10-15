import { Box, Divider, Flex } from "@chakra-ui/react";
import produce from "immer";
import useTaskDetailContext from "../../../../context/task_detail/useTaskDetailContext";
import { PRIORITY, SetState, SortBy, Task } from "../../Data";
import { updateTaskPositionInColumn } from "../../TaskDataProcessing";

type Props = { onOptionClose: () => void };

export default function PriorityOptions({ onOptionClose }: Props) {
  const {
    task,
    isOpen,
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
                  setTask({ ...task!, priority: targetPriorityColumnId });
                  updateTaskPriority(
                    sortBy,
                    task!,
                    setState,
                    targetPriorityColumnId
                  );
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

function updateTaskPriority(
  sortBy: SortBy,
  currentTask: Task,
  setState: SetState,
  targetPriorityColumnId: number
) {
  setState((previousState) => {
    if (previousState) {
      return produce(previousState, (draftState) => {
        // Update Stats
        draftState.orderedTasks.forEach((taskList) =>
          taskList.taskList.forEach((task) => {
            const isSourceTask = task.id === currentTask.id;
            if (isSourceTask) {
              updateTaskPositionInColumn(
                draftState,
                { priority: String(targetPriorityColumnId) },
                task
              );
            }

            // Update sourceTaskAfter's priority stats
            const isSourceTaskAfter =
              task.previousTask.priorityId === currentTask.id;
            if (isSourceTaskAfter) {
              task.previousTask.priorityId =
                currentTask.previousTask.priorityId;
            }
          })
        );

        // Update positions
        const currentColumnId = draftState.orderedTasks.find((tasks) =>
          tasks.taskList.find((task) => task.id === currentTask.id)
        )?.id;

        // Delete sourceTask from original column
        const sourceColumn = draftState.orderedTasks.find(
          (tasks) => tasks.id === currentColumnId
        );

        const sourceTask = sourceColumn?.taskList.find(
          (task) => task.id === currentTask.id
        );

        const destinationColumn = draftState.orderedTasks.find(
          (tasks) => tasks.id === targetPriorityColumnId
        );

        const currentTaskIndexInSourceColumn = sourceColumn?.taskList.findIndex(
          (task) => task.id === sourceTask?.id
        );

        // Remove from current column and push task to finished column
        if (sortBy === PRIORITY) {
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
