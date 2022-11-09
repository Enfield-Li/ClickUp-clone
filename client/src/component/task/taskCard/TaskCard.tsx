import {
  Box,
  Center,
  Flex,
  Heading,
  Stack,
  Tooltip,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { Draggable } from "@hello-pangea/dnd";
import { useNavigate } from "react-router-dom";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import ExpectedDueDateDisplay from "../../taskModal/dueDateDetails/ExpectedDueDateDisplay";
import SelectPriorityPopover from "../../taskModal/priorityDetails/SelectPriorityPopover";
import { SetState, SortBy, Task } from "../../../types";
import RightClickPopover from "./RightClickPopover";

type Props = {
  task: Task;
  index: number;
  sortBy: SortBy;
  setState: SetState;
};

export default function TaskCard({ task, index, sortBy, setState }: Props) {
  const navigate = useNavigate();

  const { colorMode } = useColorMode();
  const bgColor = useColorModeValue("white", "darkMain.200");
  const headerColor = useColorModeValue("gray.700", "white");
  const { onModalOpen, setTask, isModalOpen, taskStateContext } =
    useTaskDetailContext();

  const { columnOptions } = taskStateContext!;

  function handleOpenTaskModal() {
    if (task?.id) {
      onModalOpen();
      setTask(task);
      navigate("/task/" + task.id);
    }
  }

  const noPriority = task.priority === 1;
  const taskFinished = task.priority === 0;
  const currentTaskPriority = columnOptions.priority.find(
    (priority) => priority.id === task!.priority
  );
  const priorityFlagColor = currentTaskPriority?.color;

  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
        <RightClickPopover>
          <Box
            p={4}
            my={3}
            width="full"
            rounded="sm"
            bg={bgColor}
            boxShadow="md"
            height="110px"
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={handleOpenTaskModal} // left click
            border={colorMode === "dark" ? "1px solid darkMain.300" : undefined}
            _hover={{
              backgroundColor:
                colorMode === "dark" ? "darkMain.100" : undefined,
            }}
          >
            <Stack>
              {/* Task Info */}
              <Flex>
                {/* Task title */}
                <Heading color={headerColor} fontSize="xl" fontFamily="heading">
                  {task.title}
                </Heading>

                {/* Preview description */}
                {task.description && (
                  <Center
                    ml={2}
                    opacity="70%"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Tooltip
                      p={3}
                      width="300px"
                      height="250px"
                      placement="right"
                      label={task.description}
                    >
                      <i className="bi bi-justify-left"></i>
                    </Tooltip>
                  </Center>
                )}
              </Flex>

              {/* Other info */}
              <Flex fontSize="small">
                {/* Subtask */}
                <Box mr={1} onClick={(e) => e.stopPropagation()}>
                  Sub
                </Box>

                {/* Priority */}
                {!noPriority && !taskFinished && (
                  <Box
                    mr={1}
                    color={priorityFlagColor}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <SelectPriorityPopover
                      task={task}
                      currentTaskPriority={currentTaskPriority}
                    >
                      <i className="bi bi-flag-fill"></i>
                    </SelectPriorityPopover>
                  </Box>
                )}

                {/* DueDate */}
                {task.expectedDueDate && (
                  <Box onClick={(e) => e.stopPropagation()}>
                    <ExpectedDueDateDisplay task={task} />
                  </Box>
                )}
              </Flex>
            </Stack>
          </Box>
        </RightClickPopover>
      )}
    </Draggable>
  );
}
