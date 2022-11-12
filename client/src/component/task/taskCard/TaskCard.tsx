import { Box, Flex, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { Draggable } from "@hello-pangea/dnd";
import { memo, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import { SetState, STATUS, Task } from "../../../types";
import AddSubTask from "./AddSubTask";
import RightClickShowCardOptions from "./RightClickPopover";
import SetTaskAttribute from "./SetTaskAttribute";
import SubTaskList from "./SubTaskList";
import TaskCardAdditionalInfo from "./TaskCardAdditionalInfo";
import TaskCardMainInfo from "./TaskCardMainInfo";

type Props = {
  task: Task;
  index: number;
  setState: SetState;
};

function TaskCard({ task, index, setState }: Props) {
  const navigate = useNavigate();
  const [showSubTask, setShowSubTask] = useState(false);
  const [showAddSubTask, setShowAddSubTask] = useState(true);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Force to show addSubTask when isPopoverOpen is set to
  useEffect(() => {
    if (!isPopoverOpen) setShowAddSubTask(true);
  }, [isPopoverOpen]);

  const { colorMode } = useColorMode();
  const cardBgColor = useColorModeValue("white", "darkMain.200");

  const { onModalOpen, setTask, taskStateContext } = useTaskDetailContext();
  const { columnOptions, sortBy } = taskStateContext!;
  const currentStatus = useMemo(() => {
    return columnOptions.status.find(
      (statusColumn) => statusColumn.id === task.status
    );
  }, [columnOptions.status, task.status]);

  const noPriority = task.priority === 1;
  const taskFinished = task.priority === 0;
  const hasPriority = !noPriority && !taskFinished;
  const hasSubTask = task.subTasks.length > 0;
  const hasDueDate = task.expectedDueDate;
  const expandCardHeight = hasPriority || hasSubTask || hasDueDate;

  function handleOpenTaskModal() {
    if (task?.id) {
      onModalOpen();
      setTask(task);
      navigate("/task/" + task.id);
    }
  }

  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
        <RightClickShowCardOptions>
          <Flex
            mt={3}
            width="full"
            boxShadow="md"
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
            height={expandCardHeight ? "110px" : "80px"}
            borderLeftWidth={sortBy !== STATUS ? "3px" : ""}
            borderBottomRadius={showSubTask ? "" : "sm"}
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
              height={expandCardHeight ? "110px" : "80px"}
              onMouseOutCapture={() =>
                setShowAddSubTask(isPopoverOpen ? false : true)
              }
              onMouseOverCapture={() => setShowAddSubTask(false)}
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
              {!showAddSubTask && (
                <SetTaskAttribute
                  task={task}
                  hasDueDate={hasDueDate}
                  hasPriority={hasPriority}
                  setIsPopoverOpen={setIsPopoverOpen}
                />
              )}
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
export default memo(TaskCard);
