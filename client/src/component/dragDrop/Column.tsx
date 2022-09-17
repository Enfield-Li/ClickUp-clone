import { Center, Text } from "@chakra-ui/react";
import { Droppable } from "@hello-pangea/dnd";
import React from "react";
import Card from "./Card";
import { Stage, Task } from "./DragDrop";

type Props = {
  column: Stage;
  tasks: Task[];
};

export default function Column({ column, tasks }: Props) {
  return (
    <>
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
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {tasks.map((task, index) => (
              <Card key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </>
  );
}
