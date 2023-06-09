import { Box, Flex, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { Draggable } from "@hello-pangea/dnd";
import { memo, useEffect, useMemo, useState } from "react";
import { useModalControl } from "../../../context/modalControl/useModalControl";
import { useTaskDetail } from "../../../context/task_detail/useTaskDetail";
import { GroupBy, Priority, Task } from "../../../types";
import AddSubTask from "./AddSubTask";
import RightClickShowCardOptions from "./RightClickShowCardOptions";
import SetTaskAttribute from "./SetTaskAttribute";
import SubTaskList from "./SubTaskList";
import TaskCardAdditionalInfo from "./TaskCardAdditionalInfo";
import TaskCardMainInfo from "./TaskCardMainInfo";

type Props = {
  task: Task;
  index: number;
};

export default memo(TaskCard);
function TaskCard({ task, index }: Props) {
  const [showSubTask, setShowSubTask] = useState(false);
  const [showAddSubTask, setShowAddSubTask] = useState(true);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Force to show addSubTask when isPopoverOpen is set to
  useEffect(() => {
    if (!isPopoverOpen) setShowAddSubTask(true);
  }, [isPopoverOpen]);

  const { colorMode } = useColorMode();
  const cardBgColor = useColorModeValue("white", "darkMain.200");

  const { onTaskDetailModalOpen } = useModalControl();
  const { selectTask, taskStateContext } = useTaskDetail();
  const { columnOptions, groupBy } = taskStateContext!;
  const currentStatus = useMemo(() => {
    return columnOptions.statusColumns.find(
      (statusColumn) => statusColumn.id === task.status.columnId
    );
  }, [columnOptions.statusColumns, task.status]);

  const expandedHeight = "110px";
  const collapsedHeight = "90px";
  const hasSubTask = task.subTasks.length > 0;
  const hasDueDate = task.expectedDueDate !== null;
  const hasPriority = task.priority.name !== Priority.NO_PRIORITY;

  const expandCardHeightInPriority =
    groupBy === GroupBy.PRIORITY && (hasSubTask || hasDueDate);
  const expandCardHeightInDueDate =
    groupBy === GroupBy.DUE_DATE && (hasSubTask || hasPriority);
  const expandCardHeightInStatus =
    groupBy === GroupBy.STATUS && (hasPriority || hasSubTask || hasDueDate);
  const expandCardHeight =
    expandCardHeightInStatus ||
    expandCardHeightInPriority ||
    expandCardHeightInDueDate;

  function handleOpenTaskModal() {
    if (task?.id) {
      selectTask(task);
      onTaskDetailModalOpen();
    }
  }

  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
        <RightClickShowCardOptions taskId={task.id!}>
          <Flex
            mt={3}
            width="full"
            cursor="grab"
            boxShadow="md"
            role="listitem"
            flexDir="column"
            borderTopRadius="sm"
            bgColor={cardBgColor}
            ref={provided.innerRef}
            mb={showSubTask ? 0 : 3}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={handleOpenTaskModal}
            justifyContent="space-between"
            borderLeftColor={currentStatus?.color}
            borderBottomRadius={showSubTask ? "" : "sm"}
            borderLeftWidth={groupBy !== GroupBy.STATUS ? "3px" : ""}
            height={expandCardHeight ? expandedHeight : collapsedHeight}
            border={colorMode === "dark" ? "1px solid darkMain.300" : ""}
            _hover={{
              bgColor:
                colorMode === "dark" && !showAddSubTask ? "darkMain.100" : "",
            }}
          >
            <Flex
              p={3}
              pb="2px"
              flexDir="column"
              justifyContent="space-between"
              onMouseOutCapture={() =>
                setShowAddSubTask(isPopoverOpen ? false : true)
              }
              onMouseOverCapture={() => setShowAddSubTask(false)}
              height={expandCardHeight ? expandedHeight : collapsedHeight}
            >
              {/* Task info */}
              <Box>
                <TaskCardMainInfo task={task} />
                <TaskCardAdditionalInfo
                  task={task}
                  hasDueDate={hasDueDate}
                  hasSubTask={hasSubTask}
                  hasPriority={hasPriority}
                  setShowSubTask={setShowSubTask}
                />
              </Box>

              {/* Set task attribute */}
              {/* Hide component and toggle visibility: https://stackoverflow.com/a/69015230/16648127 */}
              <Box display={showAddSubTask ? "none" : ""}>
                <SetTaskAttribute
                  task={task}
                  hasDueDate={hasDueDate}
                  hasPriority={hasPriority}
                  setIsPopoverOpen={setIsPopoverOpen}
                />
              </Box>
            </Flex>

            {/* Add subtask */}
            {showAddSubTask && !isPopoverOpen && (
              <Box onClick={(e) => e.stopPropagation()}>
                <AddSubTask task={task} cardBgColor={cardBgColor} />
              </Box>
            )}
          </Flex>

          {/* Subtask list */}
          {showSubTask && !snapshot.isDragging && (
            <Box width="full" borderBottomRadius="sm">
              <SubTaskList task={task} />
            </Box>
          )}
        </RightClickShowCardOptions>
      )}
    </Draggable>
  );
}
