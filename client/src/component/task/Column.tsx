import { Box, Center } from "@chakra-ui/react";
import { Droppable } from "@hello-pangea/dnd";
import { memo, useState } from "react";
import {
  DueDateColumns,
  TaskState,
  TaskList,
  UndeterminedColumn,
} from "../../types";
import CreateTask from "./createTask/CreateTask";
import ColumnHeader from "./customStatusColumn/ColumnHeader";
import TaskCard from "./taskCard/TaskCard";

type Props = {
  state: TaskState;
  tasks?: TaskList;
  isCreateTaskOpen: boolean;
  currentColumn: UndeterminedColumn;
  setIsCreateTaskOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default memo(function Column({
  state,
  tasks,
  currentColumn,
  isCreateTaskOpen,
  setIsCreateTaskOpen,
}: Props) {
  const [showCreateTask, setShowCreateTask] = useState(false);

  return (
    <Box width="250px" mx={3}>
      {/* Column header */}
      <ColumnHeader
        taskAmount={tasks?.length}
        title={currentColumn.title}
        currentColumn={currentColumn}
        borderTopColor={currentColumn.color}
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
              <TaskCard task={task} key={task.id} index={index} />
            ))}
            {provided.placeholder}

            {/* Create task popover */}
            <Center>
              <CreateTask
                state={state}
                currentColumn={currentColumn}
                isCreateTaskOpen={isCreateTaskOpen}
                setIsCreateTaskOpen={setIsCreateTaskOpen}
              />
            </Center>
          </Box>
        )}
      </Droppable>
    </Box>
  );
});
