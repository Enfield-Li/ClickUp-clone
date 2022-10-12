import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  Avatar,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import {
  Draggable,
  DraggableStateSnapshot,
  Droppable,
} from "@hello-pangea/dnd";
import { SetState, State, Task } from "./Data";
import TaskDetails from "./taskDetails/TaskDetails";

type Props = {
  task: Task;
  state: State;
  index: number;
  setState: SetState;
  currentColumnId: number;
};

export default function Card({
  task,
  index,
  state,
  setState,
  currentColumnId,
}: Props) {
  const bgColor = useColorModeValue("white", "white.300");
  const headerColor = useColorModeValue("gray.700", "white");
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {/* Task card */}
      <Draggable draggableId={String(task.id)} index={index}>
        {(provided, snapshot) => (
          <Box
            p={4}
            my={3}
            w={"full"}
            bg={bgColor}
            rounded={"md"}
            boxShadow={"xl"}
            onClick={onOpen}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            border={snapshot.isDragging ? "1px" : ""}
          >
            <Stack>
              <Heading color={headerColor} fontSize={"2xl"} fontFamily={"body"}>
                {task.title}
              </Heading>
              <Text color={"gray.400"}>Lorem ipsum dolor</Text>
            </Stack>
          </Box>
        )}
      </Draggable>

      {/* Task details inside Modal */}
      <TaskDetails
        state={state}
        isOpen={isOpen}
        onClose={onClose}
        setState={setState}
        currentTask={task}
        currentColumnId={currentColumnId}
      />
    </>
  );
}
