import { CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  Divider,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import useAuthContext from "../../../context/auth/useAuthContext";
import { SetTask } from "../../../context/task_detail/TaskDetailContextTypes";
import useTaskDetailContext, {
  updateTaskPriorityOrDueDate,
} from "../../../context/task_detail/useTaskDetailContext";
import { getRandomNumberNoLimit } from "../../../utils/getRandomNumber";
import {
  PRIORITY,
  PriorityColumn,
  Task,
  UpdateEvent,
} from "../../task/taskTypes";

type Props = {
  task: Task;
  setTask?: SetTask;
  onOptionClose: () => void;
};

export default function PriorityOptions({
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

  function selectPriority(priority: PriorityColumn) {
    onOptionClose();

    const targetPriorityColumnId = priority.id;

    // Update list state
    updateTaskPriorityOrDueDate(
      sortBy,
      task!,
      setState,
      PRIORITY,
      targetPriorityColumnId
    );

    const newEvent: UpdateEvent = {
      id: getRandomNumberNoLimit(),
      userId: authState.user?.id,
      taskId: task!.id!,
      field: PRIORITY,
      beforeUpdate: String(task?.priority),
      afterUpdate: String(targetPriorityColumnId),
      createdAt: new Date(),
    };

    // Update modal task state
    if (setTask) {
      setTask({
        ...task!,
        priority: targetPriorityColumnId,
        taskEvents: [...task!.taskEvents, newEvent],
      });
    }
  }

  return (
    <>
      {columnOptions.priority.map((priority) => {
        const noPriority = priority.id !== 1;
        const taskFinished = priority.id !== 0;
        const hideCurrentPriority = task!.priority !== priority.id;

        return (
          // Hide finished column and current priority stage
          taskFinished &&
          hideCurrentPriority && (
            <Box
              key={priority.id}
              _hover={{ backgroundColor: popoverContentHoverBgColor }}
            >
              <Flex
                p={3}
                rounded="sm"
                cursor="pointer"
                alignItems="center"
                onClick={() => selectPriority(priority)}
              >
                {noPriority ? (
                  // Select priority
                  <Flex>
                    <Box color={priority.color} mr={4}>
                      <i className="bi bi-flag-fill"></i>
                    </Box>
                    <Box color={fontColor}>{priority.title}</Box>
                  </Flex>
                ) : (
                  // Clear priority
                  <Flex color="red.300">
                    <Box mr={4}>
                      <i className="bi bi-x-lg"></i>
                    </Box>
                    <Box>Clear</Box>
                  </Flex>
                )}
              </Flex>

              {/* Last row hide Divider */}
              {priority.id !== 5 && <Divider />}
            </Box>
          )
        );
      })}
    </>
  );
}
