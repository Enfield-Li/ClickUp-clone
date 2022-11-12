import { Box, Center } from "@chakra-ui/react";
import { Droppable } from "@hello-pangea/dnd";
import ColumnHeader from "./customStatusColumn/ColumnHeader";
import TaskCard from "./taskCard/TaskCard";
import {
  UndeterminedColumn,
  DueDateColumns,
  SetState,
  SortBy,
  State,
  TaskList,
  STATUS,
} from "../../types";
import { memo, useState } from "react";
import CreateTaskPopover from "./CreateTaskPopover";

type Props = {
  state: State;
  sortBy: SortBy;
  tasks?: TaskList;
  setState: SetState;
  currentColumn: UndeterminedColumn;
  dueDateColumns: DueDateColumns;
};

function Column({
  state,
  tasks,
  sortBy,
  setState,
  currentColumn,
  dueDateColumns,
}: Props) {
  const [showCreateTask, setShowCreateTask] = useState(false);

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
            _hover={{ overflowY: "auto", overflowX: "hidden" }}
          >
            {/* Task list */}
            {tasks?.map((task, index) => (
              <TaskCard
                task={task}
                key={task.id}
                index={index}
                setState={setState}
              />
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

export default memo(Column);
