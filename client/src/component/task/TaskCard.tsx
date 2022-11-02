import { Box, Heading, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { Draggable } from "@hello-pangea/dnd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useTaskDetailContext from "../../context/task_detail/useTaskDetailContext";
import { CLIENT_ROUTE } from "../../utils/constant";
import { SetState, State, Task } from "./taskTypes";

type Props = {
  task: Task;
  index: number;
};

export default function TaskCard({ task, index }: Props) {
  const navigate = useNavigate();
  const bgColor = useColorModeValue("white", "white.300");
  const headerColor = useColorModeValue("gray.700", "white");
  const { onModalOpen, setTask, isModalOpen } = useTaskDetailContext();

  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
        <Box
          p={4}
          my={3}
          w="full"
          rounded="md"
          bg={bgColor}
          onClick={() => {
            if (task?.id) {
              onModalOpen();
              setTask(task);
              navigate(CLIENT_ROUTE.TASK + "/" + task.id);
            }
          }}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          boxShadow={snapshot.isDragging ? "outline" : "lg"}
        >
          <Stack>
            <Heading color={headerColor} fontSize="2xl" fontFamily="body">
              {task.title}
            </Heading>
            <Text color="gray.400">Lorem ipsum dolor</Text>
          </Stack>
        </Box>
      )}
    </Draggable>
  );
}
