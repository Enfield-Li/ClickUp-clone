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
import { memo } from "react";
import { useTaskDetail } from "../../../context/task_detail/useTaskDetail";
import { handleDeleteTask } from "../../task/actions/deleteTask";

type Props = { taskId: number };

export default memo(TaskOptions);
function TaskOptions({ taskId }: Props) {
  const { removeTask } = useTaskDetail();

  return (
    <>
      <Popover isLazy>
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
              onClick={() => handleDeleteTask(taskId, removeTask)}
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
