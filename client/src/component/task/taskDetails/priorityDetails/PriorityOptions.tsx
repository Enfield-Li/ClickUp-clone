import { Box, Divider, Flex } from "@chakra-ui/react";
import useTaskDetailContext from "../../../../context/task_detail/useTaskDetailContext";
import { SetState, Task } from "../../Data";

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
                  // updateTaskPriority(
                  //   currentTask,
                  //   setState,
                  //   targetPriorityColumnId
                  // );
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
  targetPriorityColumnId: number
) {
  // setState((previousState) => {
  //   if (previousState) {
  //     return produce(previousState, (draftState) => {
  //       draftState.orderedTasks.forEach((taskList) =>
  //         taskList.taskList.forEach((task) => {
  //           // Update currentTask's priority position
  //           const isCurrentTask = task.id === currentTask.id;
  //           if (isCurrentTask) {
  //             updateTaskPositionInColumn(
  //               draftState,
  //               { priority: String(targetPriorityColumnId) },
  //               task
  //             );
  //           }
  //           // Update sourceTaskAfter's priority position
  //           const sourceTaskAfterInPriority =
  //             task.previousTask.priorityId === currentTask.id;
  //           if (sourceTaskAfterInPriority) {
  //             task.previousTask.priorityId =
  //               currentTask.previousTask.priorityId;
  //           }
  //         })
  //       );
  //     });
  //   }
  // });
}
