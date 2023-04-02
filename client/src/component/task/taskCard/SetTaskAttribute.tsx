import { CheckIcon } from "@chakra-ui/icons";
import { Box, Center, Flex } from "@chakra-ui/react";
import { memo, useMemo } from "react";
import { useAuth } from "../../../context/auth/useAuth";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import { GroupBy, Task } from "../../../types";
import SelectDueDateIcon from "../../taskModal/dueDate/SelectDueDateIcon";
import SelectPriorityPopover from "../../taskModal/priority/SelectPriorityPopover";
import FinishTask from "../../taskModal/status/FinishTask";
import { updateTaskAttribute } from "../actions/updateTaskAttributes";
import ThreeDotShowOptions from "./ThreeDotShowOptions";

type Props = {
  task: Task;
  hasDueDate: boolean;
  hasPriority: boolean;
  setIsPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default memo(SetTaskAttribute);
function SetTaskAttribute({
  task,
  hasDueDate,
  hasPriority,
  setIsPopoverOpen,
}: Props) {
  const { user } = useAuth();
  const { taskStateContext } = useTaskDetailContext();
  const { groupBy: groupBy, setTaskState } = taskStateContext!;
  if (!taskStateContext) throw new Error("taskStateContext not initialized");
  const { columnOptions } = taskStateContext;

  const finishedColumnId = useMemo(
    () =>
      columnOptions.statusColumns.find((column) => column.markAsClosed)!.id!,
    [columnOptions]
  );

  function handleSetToFinish(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation();

    updateTaskAttribute({
      groupBy,
      setTaskState,
      currentTask: task,
      targetField: GroupBy.STATUS,
      userId: user!.id!,
      targetColumnId: finishedColumnId,
    });
  }

  return (
    <Flex fontSize="small" alignItems="center" justifyContent="space-between">
      <Flex>
        {/* Priority */}
        {!hasPriority && groupBy !== "priority" && (
          <Box mr={2} onClick={(e) => e.stopPropagation()}>
            <SelectPriorityPopover
              task={task}
              setIsPopoverOpen={setIsPopoverOpen}
            >
              <Box
                opacity="55%"
                _hover={{ color: "purple.400", opacity: "100%" }}
              >
                <i className="bi bi-flag-fill"></i>
              </Box>
            </SelectPriorityPopover>
          </Box>
        )}

        {/* Due date */}
        {!hasDueDate && (
          <Box mr={2} onClick={(e) => e.stopPropagation()}>
            <SelectDueDateIcon task={task} setIsPopoverOpen={setIsPopoverOpen}>
              <Box opacity="55%" _hover={{ opacity: "100%" }}>
                <i className="bi bi-calendar2-check"></i>
              </Box>
            </SelectDueDateIcon>
          </Box>
        )}
      </Flex>

      {/* Set to complete */}
      <Flex>
        {task.status.columnId !== finishedColumnId && (
          <Center mr={2}>
            <FinishTask>
              <Center
                p={0}
                opacity="55%"
                fontSize="15px"
                fontStyle="bold"
                _hover={{ opacity: "100%", color: "green.300" }}
                onClick={(e) => handleSetToFinish(e)}
              >
                <CheckIcon fontSize="md" alignSelf="center" />
              </Center>
            </FinishTask>
          </Center>
        )}

        {/* More options */}
        <Center
          fontSize="lg"
          fontWeight="bold"
          onClick={(e) => e.stopPropagation()}
        >
          <ThreeDotShowOptions
            taskId={task.id!}
            setIsPopoverOpen={setIsPopoverOpen}
          />
        </Center>
      </Flex>
    </Flex>
  );
}
