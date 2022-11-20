import { Box, Divider, Flex, useColorModeValue } from "@chakra-ui/react";
import { memo } from "react";
import useAuthContext from "../../../context/auth/useAuthContext";
import { SetTask } from "../../../context/task_detail/TaskDetailContextTypes";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import {
  Priority,
  SetTaskState,
  SortBy,
  Task,
  UpdateEvent,
} from "../../../types";
import { getRandomNumberNoLimit } from "../../../utils/getRandomNumber";
import { reorderPriorityColumn } from "../../task/actions/taskProcessing";
import { updateTaskPriorityOrDueDate } from "../../task/actions/updateTaskPriorityOrDueDate";

type Props = {
  task: Task;
  setTask?: SetTask;
  onOptionClose: () => void;
};

export default memo(function PriorityOptions({
  task,
  setTask,
  onOptionClose,
}: Props) {
  const fontColor = useColorModeValue("black", "lightMain.200");
  const popoverContentHoverBgColor = useColorModeValue(
    "lightMain.100",
    "darkMain.200"
  );

  const { authState } = useAuthContext();
  const { taskStateContext } = useTaskDetailContext();
  const { setState, sortBy, columnOptions } = taskStateContext!;

  return (
    <>
      {reorderPriorityColumn(columnOptions.priorityColumns).map(
        (priorityColumn) => {
          const noPriority = priorityColumn.title === Priority.NO_PRIORITY;
          const taskFinished = priorityColumn.id !== 0;
          const hideCurrentPriority =
            task!.priority.columnId !== priorityColumn.id;

          return (
            // Hide finished column and current priority stage
            taskFinished &&
            hideCurrentPriority && (
              // Hide finished column and current priority stage
              <Box
                key={priorityColumn.id}
                _hover={{ backgroundColor: popoverContentHoverBgColor }}
              >
                <Flex
                  p={3}
                  rounded="sm"
                  cursor="pointer"
                  alignItems="center"
                  onClick={() =>
                    selectPriority(
                      task,
                      authState.user!.id!,
                      sortBy,
                      setState,
                      priorityColumn.id,
                      setTask,
                      onOptionClose
                    )
                  }
                >
                  {noPriority ? (
                    // Select priority
                    <Flex color="red.300">
                      <Box mr={4}>
                        <i className="bi bi-x-lg"></i>
                      </Box>
                      <Box>Clear</Box>
                    </Flex>
                  ) : (
                    // Clear priority
                    <Flex>
                      <Box color={priorityColumn.color} mr={4}>
                        <i className="bi bi-flag-fill"></i>
                      </Box>
                      <Box color={fontColor}>{priorityColumn.title}</Box>
                    </Flex>
                  )}
                </Flex>

                {/* Last row hide Divider */}
                {priorityColumn.id !== 1 && <Divider />}
              </Box>
            )
          );
        }
      )}
    </>
  );
});

export function selectPriority(
  task: Task,
  userId: number,
  sortBy: SortBy,
  setState: SetTaskState,
  targetPriorityColumnId: number,
  setTask?: SetTask,
  onOptionClose?: () => void
) {
  if (onOptionClose) onOptionClose();

  // Update list state
  updateTaskPriorityOrDueDate(task!, setState, targetPriorityColumnId, null);

  const newEvent: UpdateEvent = {
    id: getRandomNumberNoLimit(),
    userId,
    taskId: task!.id!,
    field: SortBy.PRIORITY,
    beforeUpdate: String(task?.priority),
    afterUpdate: String(targetPriorityColumnId),
    createdAt: new Date(),
  };

  //   // Update modal task state
  //   if (setTask) {
  //     setTask({
  //       ...task!,
  //       priority: targetPriorityColumnId,
  //       taskEvents: [...task!.taskEvents, newEvent],
  //     });
  //   }
}
