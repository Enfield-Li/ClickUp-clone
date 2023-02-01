import { Box, Center } from "@chakra-ui/react";
import { Droppable } from "@hello-pangea/dnd";
import { memo, useMemo, useState } from "react";
import useTaskDetailContext from "../../context/task_detail/useTaskDetailContext";
import { SortBy, TaskList, TaskState, UndeterminedColumn } from "../../types";
import CreateTask from "./createTask/CreateTask";
import ColumnHeader from "./customStatusColumn/ColumnHeader";
import TaskCard from "./taskCard/TaskCard";

type Props = {
  taskList?: TaskList;
  taskState: TaskState;
  currentColumn: UndeterminedColumn;
};

export default memo(Column);
function Column({ taskState, taskList, currentColumn }: Props) {
  const [hovering, setHovering] = useState(false);
  const { taskStateContext, isCreatingTask } = useTaskDetailContext();
  if (!taskStateContext) throw new Error("taskStateContext not initialized");
  const { sortBy, columnOptions } = taskStateContext;

  const finishedColumnId = useMemo(
    () =>
      columnOptions.statusColumns.find((column) => column.markAsClosed)!.id!,
    [columnOptions]
  );

  return (
    <Box mx={3} width="250px">
      {/* Column header */}
      <ColumnHeader
        title={currentColumn.title}
        taskAmount={taskList?.length}
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
            onMouseOverCapture={() => !isCreatingTask && setHovering(true)}
            onMouseOutCapture={() => !isCreatingTask && setHovering(false)}
          >
            {/* Task list */}
            {taskList
              // hide finished task
              ?.filter((task) => {
                const isTaskFinished =
                  task.status.columnId !== finishedColumnId;
                return sortBy !== SortBy.STATUS ? isTaskFinished : true;
              })
              .map((task, index) => (
                <TaskCard task={task} key={task.id} index={index} />
              ))}
            {provided.placeholder}

            {/* Create task popover */}
            {hovering && (
              <CreateTask
                taskState={taskState}
                setHovering={setHovering}
                currentColumn={currentColumn}
              />
            )}
          </Box>
        )}
      </Droppable>
    </Box>
  );
}
