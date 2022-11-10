import { CheckIcon } from "@chakra-ui/icons";
import { Flex, Center, Box } from "@chakra-ui/react";
import useTaskDetailContext, {
  updateCurrentTaskStatus,
} from "../../../context/task_detail/useTaskDetailContext";
import { SortBy, Task } from "../../../types";
import SelectDueDateIcon from "../../taskModal/dueDateDetails/SelectDueDateIcon";
import SelectPriorityPopover from "../../taskModal/priorityDetails/SelectPriorityPopover";
import FinishTask from "../../taskModal/statusDetails/FinishTask";

type Props = {
  task: Task;
  hasPriority: boolean;
  hasDueDate: Date | undefined;
};

export default function SetTaskAttribute({
  task,
  hasPriority,
  hasDueDate,
}: Props) {
  const { taskStateContext } = useTaskDetailContext();
  const { sortBy, setState } = taskStateContext!;

  return (
    <Flex justifyContent="space-between" fontSize="small">
      <Flex>
        {!hasPriority && sortBy !== "priority" && (
          <Box mr={2} onClick={(e) => e.stopPropagation()}>
            <SelectPriorityPopover task={task}>
              <Box
                opacity="55%"
                _hover={{ color: "purple.400", opacity: "100%" }}
              >
                <i className="bi bi-flag-fill"></i>
              </Box>
            </SelectPriorityPopover>
          </Box>
        )}

        {!hasDueDate && (
          <Box mr={2} onClick={(e) => e.stopPropagation()}>
            <SelectDueDateIcon task={task}>
              <Box opacity="55%" _hover={{ opacity: "100%" }}>
                <i className="bi bi-calendar2-check"></i>
              </Box>
            </SelectDueDateIcon>
          </Box>
        )}
      </Flex>

      <Center>
        <FinishTask>
          <Center
            p={0}
            opacity="55%"
            fontSize="15px"
            fontStyle="bold"
            _hover={{ opacity: "100%", color: "green.300" }}
            onClick={(e) => {
              e.stopPropagation();
              updateCurrentTaskStatus(sortBy, task, setState, 3);
            }}
          >
            <CheckIcon fontSize="md" alignSelf="center" />
          </Center>
        </FinishTask>
      </Center>
    </Flex>
  );
}
