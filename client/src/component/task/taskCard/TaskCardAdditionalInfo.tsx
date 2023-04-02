import { Box, Flex } from "@chakra-ui/react";
import { memo, useMemo } from "react";
import { useTaskDetail } from "../../../context/task_detail/useTaskDetail";
import { Task } from "../../../types";
import ExpectedDueDateDisplay from "../../taskModal/dueDate/ExpectedDueDateDisplay";
import SelectPriorityPopover from "../../taskModal/priority/SelectPriorityPopover";
import SubTaskIcons from "./SubTaskIcons";

type Props = {
  task: Task;
  hasSubTask: boolean;
  hasDueDate: boolean;
  hasPriority: boolean;
  setShowSubTask: React.Dispatch<React.SetStateAction<boolean>>;
};

export default memo(TaskCardAdditionalInfo);
function TaskCardAdditionalInfo({
  task,
  hasDueDate,
  hasSubTask,
  hasPriority,
  setShowSubTask,
}: Props) {
  const { taskStateContext } = useTaskDetail();
  const { columnOptions, groupBy: groupBy } = taskStateContext!;

  const currentTaskPriority = useMemo(() => {
    return columnOptions.priorityColumns.find(
      (priority) => priority.id === task.priority.columnId
    );
  }, [columnOptions.priorityColumns, task.priority]);

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
          color={currentTaskPriority?.color}
          onClick={(e) => e.stopPropagation()}
          display={groupBy !== "priority" ? "block" : "none"}
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
          display={groupBy !== "dueDate" ? "block" : "none"}
        >
          <ExpectedDueDateDisplay task={task} />
        </Box>
      )}
    </Flex>
  );
}
