import { Box, Button, Center, Flex, Spacer, Text } from "@chakra-ui/react";
import { Droppable } from "@hello-pangea/dnd";
import React, { useState } from "react";
import Card from "./Card";
import { ColumnType, SortBy, TaskList } from "./Data";

type Props = {
  sortBy: SortBy;
  column: ColumnType;
  tasks: TaskList;
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Column({
  sortBy,
  column,
  tasks,
  isDragging,
  setIsDragging,
}: Props) {
  const isSortByStatus = sortBy === "status";

  // ⬇⬇⬇ Potential bug ⬇⬇⬇
  if (!tasks) tasks = [];

  return (
    <Box width={"280px"}>
      <Flex m={2}>
        <Text
          color={"green.500"}
          textTransform={"uppercase"}
          fontWeight={800}
          fontSize={"sm"}
          letterSpacing={1.1}
        >
          {column.title}
        </Text>
        <Spacer />
        {/* {isSortByStatus && <i className="bi bi-gear"></i>} */}
        <i className="bi bi-gear"></i>
      </Flex>
      <Droppable droppableId={String(column.id)}>
        {(provided, snapshot) => (
          <Box
            my={2}
            ref={provided.innerRef}
            {...provided.droppableProps}
            minHeight={"100px"}
            height={"500px"}
            overflow={"auto"}
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
