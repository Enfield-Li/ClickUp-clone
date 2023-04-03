import { Box, Flex, PopoverContent, useColorModeValue } from "@chakra-ui/react";
import { useTaskDetail } from "../../../context/task_detail/useTaskDetail";
import { handleDeleteTask } from "../actions/deleteTask";

type Props = {
  taskId: number;
};

export default function TaskOptions({ taskId }: Props) {
  const { removeTask } = useTaskDetail();
  const hoverBgColor = useColorModeValue("lightMain.100", "darkMain.300");

  return (
    <PopoverContent width="270px" p="2" fontSize="sm">
      <Flex
        p="5px"
        pl="10px"
        rounded="md"
        opacity="80%"
        cursor="pointer"
        _hover={{ bgColor: hoverBgColor }}
        onClick={() => handleDeleteTask(taskId, removeTask)}
      >
        <Box mr={2}>
          <i className="bi bi-trash3"></i>
        </Box>
        <Box>Delete</Box>
      </Flex>
    </PopoverContent>
  );
}
