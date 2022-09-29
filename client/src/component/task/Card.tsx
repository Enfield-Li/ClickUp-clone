import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  Avatar,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  Draggable,
  DraggableStateSnapshot,
  Droppable,
} from "@hello-pangea/dnd";
import { Task } from "./Data";

type Props = {
  task: Task;
  index: number;
  columnId: number;
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Card({
  task,
  index,
  columnId,
  isDragging,
  setIsDragging,
}: Props) {
  const bgColor = useColorModeValue("white", "white.300");
  const headerColor = useColorModeValue("gray.700", "white");

  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
        <Box
          p={4}
          my={3}
          w={"full"}
          bg={bgColor}
          rounded={"md"}
          boxShadow={"xl"}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          border={snapshot.isDragging ? "1px" : ""}
          onMouseOver={() => setIsDragging(false)}
        >
          <Stack>
            <Heading color={headerColor} fontSize={"2xl"} fontFamily={"body"}>
              {task.title}
            </Heading>
            <Text color={"gray.500"}>Lorem ipsum dolor</Text>
          </Stack>
        </Box>
      )}
    </Draggable>
  );
}
