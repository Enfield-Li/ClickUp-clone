import { CheckIcon } from "@chakra-ui/icons";
import { Flex, Center, Box, Tooltip } from "@chakra-ui/react";
import useTaskDetailContext, {
  updateCurrentTaskStatus,
} from "../../../context/task_detail/useTaskDetailContext";
import { SortBy, Task } from "../../../types";
import SelectDueDateIcon from "../../taskModal/dueDateDetails/SelectDueDateIcon";
import SelectPriorityPopover from "../../taskModal/priorityDetails/SelectPriorityPopover";
import FinishTask from "../../taskModal/statusDetails/FinishTask";
import ThreeDotShowOptions from "./ThreeDotShowOptions";

type Props = {
  task: Task;
  hasPriority: boolean;
  hasDueDate: Date | undefined;
  setIsPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SetTaskAttribute({
  task,
  hasDueDate,
  hasPriority,
  setIsPopoverOpen,
}: Props) {
  const { taskStateContext } = useTaskDetailContext();
  const { sortBy, setState } = taskStateContext!;

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
              onClick={(e) => {
                e.stopPropagation();
                updateCurrentTaskStatus(sortBy, task, setState, 3); // set to complete
              }}
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
