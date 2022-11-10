import { Flex, Box, Center } from "@chakra-ui/react";
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

export default function TaskCardAdditionalInfo({
  task,
  hasDueDate,
  hasSubTask,
  hasPriority,
  setShowSubTask,
}: Props) {
  const { taskStateContext } = useTaskDetailContext();
  const { columnOptions, sortBy } = taskStateContext!;

  const currentTaskPriority = columnOptions.priority.find(
    (priority) => priority.id === task!.priority
  );
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
      {hasPriority && sortBy !== "priority" && (
        <Box
          mr={1}
          color={priorityFlagColor}
          onClick={(e) => e.stopPropagation()}
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
      {hasDueDate && sortBy !== "dueDate" && (
        <Box onClick={(e) => e.stopPropagation()}>
          <ExpectedDueDateDisplay task={task} />
        </Box>
      )}
    </Flex>
  );
}
