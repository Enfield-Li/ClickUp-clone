import {
  Box,
  Center,
  Flex,
  Heading,
  Stack,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { Draggable } from "@hello-pangea/dnd";
import { useNavigate } from "react-router-dom";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import ExpectedDueDateDisplay from "../../taskModal/dueDateDetails/ExpectedDueDateDisplay";
import SelectPriorityPopover from "../../taskModal/priorityDetails/SelectPriorityPopover";
import { SetState, SortBy, Task } from "../taskTypes";
import PreviewDescription from "./PreviewDescription";

type Props = {
  task: Task;
  index: number;
  sortBy: SortBy;
  setState: SetState;
};

export default function TaskCard({ task, index, sortBy, setState }: Props) {
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();

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

  const currentTaskPriority = columnOptions.priority.find(
    (priority) => priority.id === task!.priority
  );
  const priorityFlagColor = currentTaskPriority?.color;

  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
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
          onClick={handleOpenTaskModal}
          border={colorMode === "dark" ? "1px solid darkMain.300" : undefined}
          _hover={{
            backgroundColor: colorMode === "dark" ? "darkMain.100" : undefined,
          }}
        >
          <Stack>
            {/* Task title */}
            <Flex>
              <Heading color={headerColor} fontSize="xl" fontFamily="heading">
                {task.title}
              </Heading>

              {/* Description */}
              {task.description && (
                <Center ml={2} onClick={(e) => e.stopPropagation()}>
                  <PreviewDescription
                    task={task}
                    isOpen={isOpen}
                    onOpen={onOpen}
                    onClose={onClose}
                  />
                </Center>
              )}
            </Flex>

            <Flex fontSize="small">
              {/* Subtask */}
              <Box mr={1} onClick={(e) => e.stopPropagation()}>
                Sub
              </Box>

              {/* Priority */}
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

              {/* DueDate */}
              {task.expectedDueDate && (
                <Box onClick={(e) => e.stopPropagation()}>
                  <ExpectedDueDateDisplay task={task} />
                </Box>
              )}
            </Flex>
          </Stack>
        </Box>
      )}
    </Draggable>
  );
}
