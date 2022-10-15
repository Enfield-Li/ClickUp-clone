import { Box, Flex } from "@chakra-ui/react";
import useTaskDetailContext from "../../../../context/task_detail/useTaskDetailContext";
import { SetState, Task } from "../../Data";

type Props = { onOptionClose: () => void };

export default function StatusOptions({ onOptionClose }: Props) {
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
      {columnOptions.status.map(
        (column) =>
          task!.status !== column.id && (
            // Hide current column option
            <Box
              my="1"
              rounded="sm"
              key={column.id}
              cursor="pointer"
              _hover={{ backgroundColor: column.color }}
              onClick={() => {
                onOptionClose();
                const targetStatusColumnId = column.id;

                // Update task state in taskDetail
                setTask({ ...task!, status: targetStatusColumnId });
                // Update task in state
                // updateCurrentTaskStatus(
                //   currentTask  ,
                //   setState,
                //   targetStatusColumnId
                // );
              }}
            >
              <Flex alignItems="center">
                <Box
                  ml="3"
                  mr="2"
                  rounded="sm"
                  width="10px"
                  height="10px"
                  backgroundColor={column.color}
                ></Box>

                {/* Title */}
                <Box>{column.title}</Box>
              </Flex>
            </Box>
          )
      )}
    </>
  );
}

export function updateCurrentTaskStatus(
  currentTask: Task,
  setState: SetState,
  targetStatusColumnId: number
) {
  // setState((previousState) => {
  //   if (previousState) {
  //     return produce(previousState, (draftState) => {
  //       const currentTaskCopy = JSON.parse(JSON.stringify(currentTask)) as Task;
  //       // Delete sourceTask from original column
  //       const originalColumn = draftState.orderedTasks.find(
  //         (tasks) => tasks.id === currentColumnId
  //       );
  //       if (originalColumn) {
  //         const currentTaskIndexInOriginalColumn =
  //           originalColumn?.taskList.findIndex(
  //             (task) => task.id === currentTaskCopy.id
  //           );
  //         originalColumn.taskList.splice(currentTaskIndexInOriginalColumn, 1);
  //         // Update sourceTaskAfter
  //         const sourceTaskAfter = originalColumn.taskList.find(
  //           (task) => task.previousTask.statusId === currentTaskCopy.id
  //         );
  //         if (sourceTaskAfter) {
  //           sourceTaskAfter.previousTask.statusId =
  //             currentTaskCopy.previousTask.statusId;
  //         }
  //       }
  //       // Task sets to finished
  //       const isSetToFinished = targetStatusColumnId === 3;
  //       if (isSetToFinished) {
  //         draftState.orderedTasks.forEach((tasks) =>
  //           tasks.taskList.forEach((taskAfter) => {
  //             const sourceTaskAfterInPriority =
  //               taskAfter.previousTask.priorityId === currentTaskCopy.id;
  //             if (sourceTaskAfterInPriority) {
  //               taskAfter.previousTask.priorityId =
  //                 currentTaskCopy.previousTask.priorityId;
  //             }
  //             const sourceTaskAfterInDueDate =
  //               taskAfter.previousTask.dueDateId === currentTaskCopy.id;
  //             if (sourceTaskAfterInDueDate) {
  //               taskAfter.previousTask.dueDateId =
  //                 currentTaskCopy.previousTask.dueDateId;
  //             }
  //           })
  //         );
  //         // Update currentTaskCopy by cleaning up other sortBy's info
  //         if (!currentTaskCopy.previousTaskBeforeFinish) {
  //           currentTaskCopy.previousTaskBeforeFinish = {};
  //         }
  //         currentTaskCopy.previousTaskBeforeFinish.dueDateId =
  //           currentTaskCopy.dueDate;
  //         currentTaskCopy.previousTaskBeforeFinish.priorityId =
  //           currentTaskCopy.priority;
  //         currentTaskCopy.priority = 0;
  //         currentTaskCopy.dueDate = 0;
  //         currentTaskCopy.previousTask.dueDateId = 0;
  //         currentTaskCopy.previousTask.priorityId = 0;
  //       }
  //       // Task sets to unfinished
  //       const isSetToUnfinished = currentColumnId === 3;
  //       if (isSetToUnfinished) {
  //         const previousDueDateIdBeforeFinish =
  //           currentTaskCopy.previousTaskBeforeFinish?.dueDateId;
  //         const previousPriorityIdBeforeFinish =
  //           currentTaskCopy.previousTaskBeforeFinish?.priorityId;
  //         const targetColumn: TargetColumn = {
  //           dueDate: previousDueDateIdBeforeFinish
  //             ? String(previousDueDateIdBeforeFinish)
  //             : "1",
  //           priority: previousPriorityIdBeforeFinish
  //             ? String(previousPriorityIdBeforeFinish)
  //             : "1",
  //         };
  //         updateTaskPositionInColumn(draftState, targetColumn, currentTaskCopy);
  //       }
  //       // update sourceTask with value in the new column
  //       updateTaskPositionInColumn(
  //         draftState,
  //         { status: String(targetStatusColumnId) },
  //         currentTaskCopy
  //       );
  //       const targetColumn = draftState.orderedTasks.find(
  //         (tasks) => tasks.id === targetStatusColumnId
  //       );
  //       // Insert currentTaskCopy into new column
  //       if (targetColumn) targetColumn.taskList.push(currentTaskCopy);
  //     });
  //   }
  // });
}
