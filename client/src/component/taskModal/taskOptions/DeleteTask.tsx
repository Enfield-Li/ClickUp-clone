import {
  Box,
  Center,
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import produce from "immer";
import React from "react";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import { deepCopy } from "../../../utils/deepCopy";
import { deleteTask } from "../../task/actions/TaskActions";
import {
  lookUpPreviousTaskId,
  PreviousTaskIds,
  SortBy,
  TaskList,
} from "../../task/taskTypes";

type Props = {};

export default function TaskOptions({}: Props) {
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

  function handleDeleteTask() {
    let taskListForUpdate: TaskList = [];

    setState(
      (prev) =>
        prev &&
        task &&
        produce(prev, (draftState) => {
          const columns: (keyof PreviousTaskIds)[] = [
            "inStatus",
            "inDueDate",
            "inPriority",
          ];

          for (const column of columns) {
            draftState.orderedTasks.forEach((tasks) => {
              tasks.taskList.forEach((currentTask, index, currentArray) => {
                const sourceTaskAfter = currentTask;
                const isSourceTaskAfter =
                  sourceTaskAfter.previousTaskIds[column] === task.id;

                // assign new previousTaskIds for sourceTaskAfter
                if (isSourceTaskAfter) {
                  sourceTaskAfter.previousTaskIds[column] =
                    task.previousTaskIds[column];

                  // push to the taskListForUpdate
                  const sourceTaskAfterExist = taskListForUpdate.find(
                    (task) => task.id === sourceTaskAfter.id
                  );

                  if (!sourceTaskAfterExist) {
                    taskListForUpdate.push(deepCopy(sourceTaskAfter));
                  } else if (sourceTaskAfterExist) {
                    taskListForUpdate = deepCopy(
                      taskListForUpdate.map((taskForUpdate) =>
                        taskForUpdate.id === sourceTaskAfter.id
                          ? sourceTaskAfter
                          : taskForUpdate
                      )
                    );
                  }
                }
              });
            });

            // Delete sourceTask from state
            // https://stackoverflow.com/a/24813338/16648127
            draftState.orderedTasks.forEach((tasks) => {
              tasks.taskList.forEach(
                (currentTask, index, currentArray) =>
                  currentTask.id === task.id && currentArray.splice(index, 1)
              );
            });
          }
        })
    );

    deleteTask(task!.id!, taskListForUpdate);
  }

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <Center px={3} py={1} cursor="pointer">
            <i className="bi bi-three-dots"></i>
          </Center>
        </PopoverTrigger>

        <PopoverContent width="200px">
          <PopoverArrow />

          <PopoverBody>
            <Flex
              p={1}
              px={2}
              rounded="sm"
              opacity="80%"
              cursor="pointer"
              _hover={{ backgroundColor: "blackAlpha.300" }}
              onClick={() => handleDeleteTask()}
            >
              <Box mr={2}>
                <i className="bi bi-trash3"></i>
              </Box>
              <Box>Delete</Box>
            </Flex>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
}
