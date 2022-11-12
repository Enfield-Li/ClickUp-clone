import { Flex, Box, Center } from "@chakra-ui/react";
import { memo, useMemo } from "react";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import { Task } from "../../../types";
import ExpectedDueDateDisplay from "../../taskModal/dueDateDetails/ExpectedDueDateDisplay";
import SelectPriorityPopover from "../../taskModal/priorityDetails/SelectPriorityPopover";
import SubTaskIcons from "./SubTaskIcons";

type Props = {
  task: Task;
  hasSubTask: boolean;
  hasPriority: boolean;
  hasDueDate: Date | undefined;
  setShowSubTask: React.Dispatch<React.SetStateAction<boolean>>;
};

function TaskCardAdditionalInfo({
  task,
  hasDueDate,
  hasSubTask,
  hasPriority,
  setShowSubTask,
}: Props) {
  const { taskStateContext } = useTaskDetailContext();
  const { columnOptions, sortBy } = taskStateContext!;

  const currentTaskPriority = useMemo(() => {
    return columnOptions.priority.find(
      (priority) => priority.id === task!.priority
    );
  }, [columnOptions.priority, task!.priority]);
  const priorityFlagColor = currentTaskPriority?.color;

  return (
    <Flex fontSize="small">
      {/* Subtask */}
      {hasSubTask && (
        <Box mr={1} onClick={(e) => e.stopPropagation()}>
          <SubTaskIcons task={task} setShowSubTask={setShowSubTask} />
        </Box>
      )}

      {/* Priority */}
      {hasPriority && (
        <Box
          mr={1}
          color={priorityFlagColor}
          onClick={(e) => e.stopPropagation()}
          display={sortBy !== "priority" ? "block" : "none"}
        >
          <SelectPriorityPopover
            task={task}
            currentTaskPriority={currentTaskPriority}
          >
            <i className="bi bi-flag-fill"></i>
          </SelectPriorityPopover>
        </Box>
      )}

      {/* DueDate */}
      {hasDueDate && (
        <Box
          onClick={(e) => e.stopPropagation()}
          display={sortBy !== "dueDate" ? "block" : "none"}
        >
          <ExpectedDueDateDisplay task={task} />
        </Box>
      )}
    </Flex>
  );
}
export default memo(TaskCardAdditionalInfo);
