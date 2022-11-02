import {
  Box,
  Center,
  Flex,
  Heading,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { Draggable } from "@hello-pangea/dnd";
import { useNavigate } from "react-router-dom";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import DueDateSwitch from "../../taskModal/dueDateDetails/DueDateSwitch";
import ExpectedDueDateDisplay from "../../taskModal/dueDateDetails/ExpectedDueDateDisplay";
import { ColumnOptions, Task } from "../taskTypes";
import PreviewDescription from "./PreviewDescription";

type Props = {
  task: Task;
  index: number;
};

export default function TaskCard({ task, index }: Props) {
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const bgColor = useColorModeValue("white", "rgb(26, 32, 44)");
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
          w="full"
          rounded="md"
          border="1px "
          bg={bgColor}
          height="150px"
          ref={provided.innerRef}
          onClick={handleOpenTaskModal}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          boxShadow={snapshot.isDragging ? "outline" : "lg"}
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

            <Flex
              fontSize="small"
              opacity="75%"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Subtask */}
              <Box mr={1}>Sub</Box>

              {/* Priority */}
              <Box mr={1} color={priorityFlagColor}>
                <i className="bi bi-flag-fill"></i>
              </Box>

              {/* DueDate */}
              {task.expectedDueDate && <ExpectedDueDateDisplay />}
            </Flex>
          </Stack>
        </Box>
      )}
    </Draggable>
  );
}
