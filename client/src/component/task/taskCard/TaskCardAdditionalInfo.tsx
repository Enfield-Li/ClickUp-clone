import { Flex, Box, Center } from "@chakra-ui/react";
import { memo, useMemo } from "react";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import { Task } from "../../../types";
import ExpectedDueDateDisplay from "../../taskModal/dueDate/ExpectedDueDateDisplay";
import SelectPriorityPopover from "../../taskModal/priority/SelectPriorityPopover";
import SubTaskIcons from "./SubTaskIcons";

type Props = {
  task: Task;
  hasSubTask: boolean;
  hasPriority: boolean;
  hasDueDate: Date | undefined;
  setShowSubTask: React.Dispatch<React.SetStateAction<boolean>>;
};

export default memo(function TaskCardAdditionalInfo({
  task,
  hasDueDate,
  hasSubTask,
  hasPriority,
  setShowSubTask,
}: Props) {
  const { taskStateContext } = useTaskDetailContext();
  const { columnOptions, sortBy } = taskStateContext!;

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
});
