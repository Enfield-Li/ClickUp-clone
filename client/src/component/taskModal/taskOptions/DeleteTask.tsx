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
import { useNavigate } from "react-router-dom";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import { handleDeleteTask } from "../../task/actions/deleteTask";

type Props = { taskId: number };

export default memo(TaskOptions);
function TaskOptions({ taskId }: Props) {
  const navigate = useNavigate();
  const { taskStateContext } = useTaskDetailContext();

  const { setTaskState, sortBy, columnOptions } = taskStateContext!;

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
              onClick={() => handleDeleteTask(taskId, setTaskState)}
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
