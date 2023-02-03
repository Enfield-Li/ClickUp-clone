import { Box, Flex, PopoverContent, useColorModeValue } from "@chakra-ui/react";
import produce from "immer";
import React from "react";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import useTeamStateContext from "../../../context/team/useTeamContext";
import { deleteTask } from "../../../networkCalls";

type Props = {
  taskId: number;
};

export default function TaskOptions({ taskId }: Props) {
  const hoverBgColor = useColorModeValue("lightMain.100", "darkMain.300");
  const { taskStateContext } = useTaskDetailContext();
  const { setTaskState } = taskStateContext!;

  function handleDeleteTask() {
    deleteTask(taskId);
    setTaskState((prev) =>
      produce(prev, (draftState) => {
        draftState?.orderedTasks.forEach((orderedTask) =>
          orderedTask.taskList.forEach(
            (task, index, arr) => task.id === taskId && arr.splice(index, 1)
          )
        );
      })
    );
  }

  return (
    <PopoverContent width="270px" p="2" fontSize="sm">
      <Flex
        p="5px"
        pl="10px"
        rounded="md"
        opacity="80%"
        cursor="pointer"
        onClick={handleDeleteTask}
        _hover={{ bgColor: hoverBgColor }}
      >
        <Box mr={2}>
          <i className="bi bi-trash3"></i>
        </Box>
        <Box>Delete</Box>
      </Flex>
    </PopoverContent>
  );
}
