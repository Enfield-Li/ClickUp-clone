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
import TaskCard from "./TaskCard";
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
    <Box width={"280px"}>
      {/* Column header */}
      <Flex
        m={2}
        p={2}
        borderTop="2px"
        borderTopRadius={"sm"}
        borderColor={currentColumn.color}
      >
        {/* Title */}
        <Text
          textTransform={"uppercase"}
          fontWeight={800}
          fontSize={"sm"}
          letterSpacing={1.1}
        >
          {currentColumn.title}
        </Text>

        <Spacer />

        {/* Option */}
        <Box cursor={"pointer"}>
          <i className="bi bi-gear"></i>
        </Box>
      </Flex>

      {/* Column card */}
      <Droppable droppableId={String(currentColumn.id)}>
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
