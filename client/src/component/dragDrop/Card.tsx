import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  Avatar,
  useColorModeValue,
} from "@chakra-ui/react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { Task } from "./DragDrop";

type Props = {
  task: Task;
  index: number;
};

export default function Card({ task, index }: Props) {
  const bgColor = useColorModeValue("white", "white.300");
  const headerColor = useColorModeValue("gray.700", "white");

  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided) => (
        <Box
          p={4}
          my={3}
          w={"full"}
          rounded={"md"}
          boxShadow={"xl"}
          bg={bgColor}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <Stack>
            <Heading color={headerColor} fontSize={"2xl"} fontFamily={"body"}>
              {task.content}
            </Heading>
            <Text color={"gray.500"}>Lorem ipsum dolor</Text>
          </Stack>
        </Box>
      )}
    </Draggable>
  );
}
