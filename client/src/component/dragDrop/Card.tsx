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
import { Task } from "./DragDrop";

type Props = {
  task: Task;
  index: number;
  columnId: number;
  columnIdWhenDragging: number | undefined;
  setColumnIdWhenDragging: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
};

export default function Card({
  task,
  index,
  columnId,
  columnIdWhenDragging,
  setColumnIdWhenDragging,
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
          onMouseOver={() => setColumnIdWhenDragging(undefined)}
          onMouseMoveCapture={() =>
            setColumnIdWhenDragging(snapshot.isDragging ? columnId : undefined)
          }
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
