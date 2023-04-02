import { Box } from "@chakra-ui/react";
import { Droppable } from "@hello-pangea/dnd";
import { memo, useMemo, useState } from "react";
import { useTaskDetail } from "../../context/task_detail/useTaskDetail";
import { GroupBy, TaskList, TaskState, UndeterminedColumn } from "../../types";
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
  const { taskStateContext, isCreatingTask } = useTaskDetail();
  if (!taskStateContext) throw new Error("taskStateContext not initialized");
  const { groupBy, columnOptions } = taskStateContext;

  const finishedColumnId = useMemo(
    () => columnOptions.statusColumns.find((column) => column.markAsClosed)?.id,
    [columnOptions]
  );

  const taskAmount = useMemo(
    () =>
      groupBy !== GroupBy.STATUS
        ? taskList?.filter((task) => task.status.columnId !== finishedColumnId)
            .length
        : taskList?.length,
    [taskList, finishedColumnId, groupBy]
  );

  return (
    <Box mx={3} width="250px">
      {/* Column header */}
      <ColumnHeader
        taskAmount={taskAmount}
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
            onMouseOverCapture={() => !isCreatingTask && setHovering(true)}
            onMouseOutCapture={() => !isCreatingTask && setHovering(false)}
          >
            {/* Task list */}
            {taskList
              ?.filter((task) => {
                // hide finished task
                const isTaskFinished =
                  task.status.columnId !== finishedColumnId;
                return groupBy !== GroupBy.STATUS ? isTaskFinished : true;
              })
              .map((task, index) => (
                <TaskCard task={task} key={task.id} index={index} />
              ))}
            {provided.placeholder}

            {/* Create task popover */}
            {hovering && !currentColumn.markAsClosed && (
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
