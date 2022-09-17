import { Center, Text } from "@chakra-ui/react";
import { Droppable } from "@hello-pangea/dnd";
import React, { useState } from "react";
import Card from "./Card";
import { Stage, Task } from "./DragDrop";

type Props = {
  column: Stage;
  tasks: Task[];
  columnIdWhenDragging: number | undefined;
  setColumnIdWhenDragging: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
};

export default function Column({
  column,
  tasks,
  columnIdWhenDragging,
  setColumnIdWhenDragging,
}: Props) {
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
      <Droppable droppableId={String(column.id)} >
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {tasks.map((task, index) => (
              <Card
                task={task}
                key={task.id}
                index={index}
                columnId={column.id}
                columnIdWhenDragging={columnIdWhenDragging}
                setColumnIdWhenDragging={setColumnIdWhenDragging}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </>
  );
}
