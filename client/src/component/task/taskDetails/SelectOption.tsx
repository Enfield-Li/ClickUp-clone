import { Box, Flex } from "@chakra-ui/react";
import produce from "immer";
import React from "react";
import {
  ColumnType,
  SetState,
  State,
  StatusColumns,
  TargetColumn,
  Task,
} from "../Data";
import { updateTaskPositionInColumn } from "../TaskDataProcessing";

type Props = {
  currentTask: Task;
  setState: SetState;
  currentColumnId: number;
  statusColumns: StatusColumns;
};

export default function SelectOption({
  setState,
  currentTask,
  statusColumns,
  currentColumnId,
}: Props) {
  return (
    <>
      {statusColumns.map((column) => (
        <Box
          my="1"
          key={column.id}
          rounded="sm"
          cursor="pointer"
          _hover={{ backgroundColor: column.color }}
          onClick={() =>
            updateCurrentTask(currentTask, setState, column.id, currentColumnId)
          }
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
      ))}
    </>
  );
}

export function updateCurrentTask(
  currentTask: Task,
  setState: SetState,
  columnId: number,
  currentColumnId: number
) {
  // Check if task moved to other column
  if (currentColumnId === columnId) return;

  setState((previousState) => {
    if (previousState) {
      return produce(previousState, (draftState) => {
        const currentTaskCopy = JSON.parse(JSON.stringify(currentTask)) as Task;

        // Delete sourceTask from original column
        const originalColumn = draftState.orderedTasks.find(
          (tasks) => tasks.id === currentColumnId
        );

        if (originalColumn) {
          const currentTaskIndexInOriginalColumn =
            originalColumn?.taskList.findIndex(
              (task) => task.id === currentTaskCopy.id
            );

          if (
            currentTaskIndexInOriginalColumn ||
            currentTaskIndexInOriginalColumn === 0
          ) {
            originalColumn.taskList.splice(currentTaskIndexInOriginalColumn, 1);

            // Update sourceTaskAfter
            const sourceTaskAfter = originalColumn.taskList.find(
              (task) => task.previousTask.statusId === currentTaskCopy.id
            );

            if (sourceTaskAfter) {
              sourceTaskAfter.previousTask.statusId =
                currentTaskCopy.previousTask.statusId;
            }
          }
        }

        // Task sets to finished
        const isSetToFinished = columnId === 3;
        if (isSetToFinished) {
          draftState.orderedTasks.forEach((tasks) =>
            tasks.taskList.forEach((taskAfter) => {
              const sourceTaskAfterInPriority =
                taskAfter.previousTask.priorityId === currentTaskCopy.id;

              if (sourceTaskAfterInPriority) {
                taskAfter.previousTask.priorityId =
                  currentTaskCopy.previousTask.priorityId;
              }

              const sourceTaskAfterInDueDate =
                taskAfter.previousTask.dueDateId === currentTaskCopy.id;

              if (sourceTaskAfterInDueDate) {
                taskAfter.previousTask.dueDateId =
                  currentTaskCopy.previousTask.dueDateId;
              }
            })
          );

          // Update currentTaskCopy by cleaning up other sortBy's info
          if (!currentTaskCopy.previousTaskBeforeFinish) {
            currentTaskCopy.previousTaskBeforeFinish = {};
          }
          currentTaskCopy.previousTaskBeforeFinish.dueDateId =
            currentTaskCopy.dueDate;
          currentTaskCopy.previousTaskBeforeFinish.priorityId =
            currentTaskCopy.priority;
          currentTaskCopy.priority = 0;
          currentTaskCopy.dueDate = 0;
          currentTaskCopy.previousTask.dueDateId = 0;
          currentTaskCopy.previousTask.priorityId = 0;
        }

        // Task sets to unfinished
        const isSetToUnfinished = currentColumnId === 3;
        if (isSetToUnfinished) {
          const previousDueDateIdBeforeFinish =
            currentTaskCopy.previousTaskBeforeFinish?.dueDateId;

          const previousPriorityIdBeforeFinish =
            currentTaskCopy.previousTaskBeforeFinish?.priorityId;

          const targetColumn: TargetColumn = {
            dueDate: previousDueDateIdBeforeFinish
              ? String(previousDueDateIdBeforeFinish)
              : "1",
            priority: previousPriorityIdBeforeFinish
              ? String(previousPriorityIdBeforeFinish)
              : "1",
          };

          updateTaskPositionInColumn(draftState, targetColumn, currentTaskCopy);
        }

        // update sourceTask with value in the new column
        updateTaskPositionInColumn(
          draftState,
          { status: String(columnId) },
          currentTaskCopy
        );

        const targetColumn = draftState.orderedTasks.find(
          (tasks) => tasks.id === columnId
        );

        // Insert currentTaskCopy into new column
        if (targetColumn) targetColumn.taskList.push(currentTaskCopy);
      });
    }
  });
}
