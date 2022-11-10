import { Box, Flex, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { Draggable } from "@hello-pangea/dnd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import { SetState, Task } from "../../../types";
import AddSubTask from "./AddSubTask";
import RightClickPopover from "./RightClickPopover";
import SetTaskAttribute from "./SetTaskAttribute";
import SubTaskList from "./SubTaskList";
import TaskCardAdditionalInfo from "./TaskCardAdditionalInfo";
import TaskCardMainInfo from "./TaskCardMainInfo";

type Props = {
  task: Task;
  index: number;
  setState: SetState;
};

export default function TaskCard({ task, index, setState }: Props) {
  const navigate = useNavigate();
  const [showAddSubTask, setShowAddSubTask] = useState(true);
  const [showSubTask, setShowSubTask] = useState(true);

  const { colorMode } = useColorMode();
  const { onModalOpen, setTask } = useTaskDetailContext();
  const cardBgColor = useColorModeValue("white", "darkMain.200");

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
        <RightClickPopover>
          <Flex
            width="full"
            boxShadow="md"
            flexDir="column"
            bgColor={cardBgColor}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={handleOpenTaskModal}
            justifyContent="space-between"
            mt={3}
            borderTopRadius="sm"
            mb={showSubTask ? 0 : 3}
            height={expandCardHeight ? "110px" : "80px"}
            borderBottomRadius={showSubTask ? undefined : "sm"}
            border={colorMode === "dark" ? "1px solid darkMain.300" : undefined}
            _hover={{
              bgColor:
                colorMode === "dark" && !showAddSubTask
                  ? "darkMain.100"
                  : undefined,
            }}
          >
            <Flex
              p={3}
              pb="6px"
              flexDir="column"
              justifyContent="space-between"
              height={expandCardHeight ? "110px" : "80px"}
              onMouseOutCapture={() => setShowAddSubTask(true)}
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
                />
              )}
            </Flex>

            {/* Add subtask */}
            {showAddSubTask && (
              <Box onClick={(e) => e.stopPropagation()}>
                <AddSubTask task={task} cardBgColor={cardBgColor} />
              </Box>
            )}
          </Flex>

          {showSubTask && (
            <Box width="full" borderBottomRadius="sm">
              <SubTaskList task={task} />
            </Box>
          )}
        </RightClickPopover>
      )}
    </Draggable>
  );
}
