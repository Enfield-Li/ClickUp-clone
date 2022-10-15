import { Box, Heading, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { Draggable } from "@hello-pangea/dnd";
import { useEffect } from "react";
import useTaskDetailContext from "../../context/task_detail/useTaskDetailContext";
import { SetState, State, Task } from "./Data";

type Props = {
  task: Task;
  state: State;
  index: number;
  setState: SetState;
  currentColumnId: number;
};

export default function TaskCard({
  task,
  index,
  state,
  setState,
  currentColumnId,
}: Props) {
  const bgColor = useColorModeValue("white", "white.300");
  const headerColor = useColorModeValue("gray.700", "white");
  const { isOpen, onOpen, setTaskStateContext, setTask } =
    useTaskDetailContext();

  // Sync up taskDetail with state
  useEffect(() => {
    if (isOpen) {
      setTaskStateContext({
        columnOptions: state.columnOptions,
        setState,
        currentColumnId,
      });
    }
  }, [state, isOpen, currentColumnId]);

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
              setTaskStateContext({
                columnOptions: state.columnOptions,
                setState,
                currentColumnId,
              });
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
