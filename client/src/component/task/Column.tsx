import { Box, Center, Text } from "@chakra-ui/react";
import { Droppable } from "@hello-pangea/dnd";
import React, { useState } from "react";
import Card from "./Card";
import { ColumnType, TaskList } from "./Data";

type Props = {
  column: ColumnType;
  tasks: TaskList;
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Column({
  column,
  tasks,
  isDragging,
  setIsDragging,
}: Props) {
  const [isHovering, setIsHovering] = useState(false);

  // ⬇⬇⬇⬇ Potential bug ⬇⬇⬇⬇
  if (!tasks) tasks = [];
  return (
    <Box>
      <Center>
        <Text
          color={"green.500"}
          textTransform={"uppercase"}
          fontWeight={800}
          fontSize={"sm"}
          letterSpacing={1.1}
        >
          {column.title}
        </Text>
      </Center>
      <Droppable droppableId={String(column.id)}>
        {(provided, snapshot) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            minHeight={"100px"}
            height={"530px"}
            overflow={isHovering ? "auto" : "hidden"}
            onMouseOver={() => setIsHovering(true)}
            onMouseOutCapture={() => setIsHovering(false)}
          >
            {tasks.map((task, index) => (
              <Card
                task={task}
                key={task.id}
                index={index}
                columnId={column.id}
                isDragging={isDragging}
                setIsDragging={setIsDragging}
              />
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </Box>
  );
}
