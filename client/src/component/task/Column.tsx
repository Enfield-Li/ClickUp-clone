import { Box, Center } from "@chakra-ui/react";
import { Droppable } from "@hello-pangea/dnd";
import ColumnHeader from "./customeStatusColumn/ColumnHeader";
import { CreateTaskPopover } from "./CreateTaskPopover";
import TaskCard from "./taskCard/TaskCard";
import {
  UndeterminedColumn,
  DueDateColumns,
  SetState,
  SortBy,
  State,
  TaskList,
  STATUS,
} from "./taskTypes";

type Props = {
  state: State;
  sortBy: SortBy;
  setState: SetState;
  currentColumn: UndeterminedColumn;
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
  const finishedColumnInStatus = sortBy === STATUS && currentColumn.id === 3;

  return (
    <Box width="250px" mx={3}>
      {/* Column header */}
      <ColumnHeader
        sortBy={sortBy}
        setState={setState}
        title={currentColumn.title}
        borderTopColor={currentColumn.color}
        taskAmount={tasks?.length}
        currentColumn={currentColumn}
      />

      {/* Column card */}
      <Droppable droppableId={String(currentColumn.id)}>
        {(provided, snapshot) => (
          <Box
            height="510px"
            overflow="hidden"
            minHeight="100px"
            ref={provided.innerRef}
            {...provided.droppableProps}
            _hover={{ overflow: "auto" }}
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
