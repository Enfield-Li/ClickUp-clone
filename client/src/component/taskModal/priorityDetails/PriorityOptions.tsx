import { Box, Divider, Flex } from "@chakra-ui/react";
import useAuthContext from "../../../context/auth/useAuthContext";
import useTaskDetailContext, {
  updateTaskPriorityOrDueDate,
} from "../../../context/task_detail/useTaskDetailContext";
import { getRandomNumberNoLimit } from "../../../utils/getRandomNumber";
import { PriorityColumn, UpdateEvent } from "../../task/taskTypes";

type Props = { onOptionClose: () => void };

export default function PriorityOptions({ onOptionClose }: Props) {
  const { authState } = useAuthContext();
  const {
    task,
    setTask,
    isModalOpen,
    onModalOpen,
    onModalClose,
    taskStateContext,
    setTaskStateContext,
  } = useTaskDetailContext();

  const { setState, sortBy, columnOptions } = taskStateContext!;

  function selectPriority(priority: PriorityColumn) {
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

    const newEvent: UpdateEvent = {
      id: getRandomNumberNoLimit(),
      userId: authState.user?.id,
      taskId: task!.id!,
      field: "priority",
      beforeUpdate: String(task?.priority),
      afterUpdate: String(targetPriorityColumnId),
      createdAt: new Date(),
    };

    // Update modal task state
    setTask({
      ...task!,
      priority: targetPriorityColumnId,
      taskEvents: [...task!.taskEvents, newEvent],
    });
  }

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
                onClick={() => selectPriority(priority)}
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
