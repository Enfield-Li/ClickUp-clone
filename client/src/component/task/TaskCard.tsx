import { Box, Heading, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { Draggable } from "@hello-pangea/dnd";
import { useEffect } from "react";
import useTaskDetailContext from "../../context/task_detail/useTaskDetailContext";
import { SetState, State, Task } from "./Data";

type Props = {
  task: Task;
  index: number;
};

export default function TaskCard({ task, index }: Props) {
  const bgColor = useColorModeValue("white", "white.300");
  const headerColor = useColorModeValue("gray.700", "white");
  const { onOpen, setTask } = useTaskDetailContext();

  return (
    <>
      <Draggable draggableId={String(task.id)} index={index}>
        {(provided, snapshot) => (
          <Box
            p={4}
            my={3}
            w={"full"}
            bg={bgColor}
            rounded={"md"}
            boxShadow={"xl"}
            onClick={() => {
              onOpen();
              setTask(task);
            }}
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
    </>
  );
}
