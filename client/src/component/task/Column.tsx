import { Box, Center } from "@chakra-ui/react";
import { Droppable } from "@hello-pangea/dnd";
import ColumnHeader from "./columnDetails/ColumnHeader";
import { CreateTaskPopover } from "./CreateTaskPopover";
import TaskCard from "./TaskCard";
import {
  UndeterminedColumn,
  DueDateColumns,
  SetState,
  SortBy,
  State,
  TaskList,
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
  return (
    <Box width="280px" mx={2}>
      {/* Column header */}
      <ColumnHeader
        sortBy={sortBy}
        setState={setState}
        title={currentColumn.title}
        color={currentColumn.color}
        taskAmount={tasks?.length}
        currentColumn={currentColumn}
      />

      {/* Column card */}
      <Droppable droppableId={String(currentColumn.id)}>
        {(provided, snapshot) => (
          <Box
            height="500px"
            overflow="hidden"
            minHeight="100px"
            _hover={{ overflow: "auto" }}
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
