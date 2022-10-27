import {
  Box,
  Center,
  Flex,
  Spacer,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Droppable } from "@hello-pangea/dnd";
import React, { useState } from "react";
import TaskCard from "./TaskCard";
import { CreateTaskPopover } from "./CreateTaskPopover";
import {
  ColumnType,
  DueDateColumns,
  SetState,
  SortBy,
  State,
  TaskList,
} from "./taskTypes";
import ColumnHeader from "./ColumnHeader";

type Props = {
  state: State;
  sortBy: SortBy;
  setState: SetState;
  currentColumn: ColumnType;
  dueDateColumns: DueDateColumns;
  tasks?: TaskList;
};

export default function Column({
  state,
  setState,
  currentColumn,
  tasks,
  sortBy,
  dueDateColumns,
}: Props) {
  return (
    <Box width="280px" mx={2}>
      {/* Column header */}
      <ColumnHeader title={currentColumn.title} color={currentColumn.color} />

      {/* Column card */}
      <Droppable droppableId={String(currentColumn.id)}>
        {(provided, snapshot) => (
          <Box
            height="500px"
            overflow="auto"
            minHeight="100px"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {/* Task list */}
            {tasks?.map((task, index) => (
              <TaskCard task={task} key={task.id} index={index} />
            ))}
            {provided.placeholder}

            {/* Create task popover */}
            <Center>
              <CreateTaskPopover
                dueDateColumns={dueDateColumns}
                state={state}
                setState={setState}
                currentColumn={currentColumn}
                sortBy={sortBy}
              />
            </Center>
          </Box>
        )}
      </Droppable>
    </Box>
  );
}
