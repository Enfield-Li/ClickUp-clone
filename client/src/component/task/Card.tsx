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
import { SetState, Task } from "./Data";
import TaskDetails from "./TaskDetails";

type Props = {
  task: Task;
  index: number;
  columnId: number;
  setState: SetState;
};

export default function Card({ task, index, columnId, setState }: Props) {
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
        isOpen={isOpen}
        onClose={onClose}
        setState={setState}
        task={task}
      />
    </>
  );
}
