import {
  Box,
  Center,
  Flex,
  Spacer,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Droppable } from "@hello-pangea/dnd";
import React from "react";
import Card from "./Card";
import { CreateTaskPopover } from "./CreateTaskPopover";
import {
  ColumnType,
  DueDateColumns,
  SetState,
  SortBy,
  State,
  TaskList,
} from "./Data";

type Props = {
  state: State;
  sortBy: SortBy;
  setState: SetState;
  column: ColumnType;
  dueDateColumns: DueDateColumns;
  tasks?: TaskList;
};

export default function Column({
  state,
  setState,
  column,
  tasks,
  sortBy,
  dueDateColumns,
}: Props) {
  return (
    <Box width={"280px"}>
      {/* Column header */}
      <Flex m={2} p={2}>
        {/* Title */}
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

        {/* Option */}
        <Box cursor={"pointer"}>
          <i className="bi bi-gear"></i>
        </Box>
      </Flex>

      {/* Column card */}
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
            {/* Task list */}
            {tasks?.map((task, index) => (
              <Card
                task={task}
                key={task.id}
                index={index}
                columnId={column.id}
              />
            ))}
            {provided.placeholder}

            {/* Create task popover */}
            <Center>
              <CreateTaskPopover
                dueDateColumns={dueDateColumns}
                state={state}
                setState={setState}
                column={column}
                sortBy={sortBy}
              />
            </Center>
          </Box>
        )}
      </Droppable>
    </Box>
  );
}
