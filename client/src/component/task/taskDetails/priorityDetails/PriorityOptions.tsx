import { Box, Divider, Flex } from "@chakra-ui/react";
import useTaskDetailContext, {
  updateTaskPriorityOrDueDate,
} from "../../../../context/task_detail/useTaskDetailContext";

type Props = { onOptionClose: () => void };

export default function PriorityOptions({ onOptionClose }: Props) {
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
