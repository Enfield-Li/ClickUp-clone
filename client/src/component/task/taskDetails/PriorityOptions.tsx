import { Box, Divider, Flex } from "@chakra-ui/react";
import produce from "immer";
import { SetTask } from "../../../context/task_detail/TaskDetailContextTypes";
import { PriorityColumns, SetState, Task } from "../Data";
import { updateTaskPositionInColumn } from "../TaskDataProcessing";

type Props = {
  setTask: SetTask;
  currentTask: Task;
  setState: SetState;
  onClose: () => void;
  currentColumnId: number;
  priorityColumns: PriorityColumns;
};

export default function PriorityOptions({
  setTask,
  setState,
  currentTask,
  currentColumnId,
  priorityColumns,
  onClose,
}: Props) {
  return (
    <>
      {priorityColumns.map(
        (priority) =>
          // Hide finished task and hide current priority stage
          priority.id !== 0 &&
          currentTask.priority !== priority.id && (
            <Box key={priority.id}>
              <Flex
                p={3}
                rounded="sm"
                cursor="pointer"
                onClick={() => {
                  onClose();
                  const targetPriorityColumnId = priority.id;
                  setTask({ ...currentTask, priority: targetPriorityColumnId });
                  updateTaskPriority(
                    currentTask,
                    setState,
                    currentColumnId,
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
  currentTask: Task,
  setState: SetState,
  currentColumnId: number,
  targetPriorityColumnId: number
) {
  console.log({ currentColumnId });
  setState((previousState) => {
    if (previousState) {
      return produce(previousState, (draftState) => {
        draftState.orderedTasks.forEach((taskList) =>
          taskList.taskList.forEach((task) => {
            // Update currentTask's priority position
            const isCurrentTask = task.id === currentTask.id;
            if (isCurrentTask) {
              updateTaskPositionInColumn(
                draftState,
                { priority: String(targetPriorityColumnId) },
                task
              );
            }

            // Update sourceTaskAfter's priority position
            const sourceTaskAfterInPriority =
              task.previousTask.priorityId === currentTask.id;
            if (sourceTaskAfterInPriority) {
              task.previousTask.priorityId =
                currentTask.previousTask.priorityId;
            }
          })
        );
      });
    }
  });
}
