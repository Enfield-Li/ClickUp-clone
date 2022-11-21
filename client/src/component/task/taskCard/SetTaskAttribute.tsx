import { CheckIcon } from "@chakra-ui/icons";
import { Box, Center, Flex } from "@chakra-ui/react";
import { memo } from "react";
import useAuthContext from "../../../context/auth/useAuthContext";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import { SortBy, Task } from "../../../types";
import SelectDueDateIcon from "../../taskModal/dueDate/SelectDueDateIcon";
import SelectPriorityPopover from "../../taskModal/priority/SelectPriorityPopover";
import FinishTask from "../../taskModal/status/FinishTask";
import {
  newUpdateEvent,
  updateCurrentTaskStatus,
} from "../actions/updateTaskAttributes";
import ThreeDotShowOptions from "./ThreeDotShowOptions";

type Props = {
  task: Task;
  hasPriority: boolean;
  hasDueDate: Date | null;
  setIsPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default memo(SetTaskAttribute);
function SetTaskAttribute({
  task,
  hasDueDate,
  hasPriority,
  setIsPopoverOpen,
}: Props) {
  const { authState } = useAuthContext();
  const { taskStateContext } = useTaskDetailContext();
  const { sortBy, setTaskState } = taskStateContext!;

  function handleSetToFinish(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation();
    const finishedColumnId = 3;
    const newEvent = newUpdateEvent(
      authState.user!.id!,
      task!.id!,
      SortBy.STATUS,
      task!.status.columnId,
      finishedColumnId
    );

    updateCurrentTaskStatus(task!, setTaskState, finishedColumnId, newEvent);
  }

  return (
    <Flex fontSize="small" alignItems="center" justifyContent="space-between">
      <Flex>
        {/* Priority */}
        {!hasPriority && sortBy !== "priority" && (
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

        {/* More options */}
        <Center
          fontSize="lg"
          fontWeight="bold"
          onClick={(e) => e.stopPropagation()}
        >
          <ThreeDotShowOptions setIsPopoverOpen={setIsPopoverOpen} />
        </Center>
      </Flex>
    </Flex>
  );
}
