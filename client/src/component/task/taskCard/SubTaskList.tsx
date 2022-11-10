import {
  Box,
  Center,
  Flex,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import { Task } from "../../../types";
import ExpectedDueDateDisplay from "../../taskModal/dueDateDetails/ExpectedDueDateDisplay";
import SelectDueDateIcon from "../../taskModal/dueDateDetails/SelectDueDateIcon";
import SelectPriorityPopover from "../../taskModal/priorityDetails/SelectPriorityPopover";

type Props = { task: Task };

export default function SubTaskList({ task }: Props) {
  const cardBgColor = useColorModeValue("white", "darkMain.200");
  const { taskStateContext } = useTaskDetailContext();
  const { columnOptions, sortBy } = taskStateContext!;

  return (
    <Box bgColor={cardBgColor}>
      {task.subTasks.map((subTask) => {
        const noPriority = subTask.priority === 1;
        const taskFinished = subTask.priority === 0;
        const hasPriority = !noPriority && !taskFinished;
        const hasDueDate = subTask.expectedDueDate;

        const currentTaskPriority = columnOptions.priority.find(
          (priority) => priority.id === subTask.priority
        );
        const priorityFlagColor = currentTaskPriority?.color;

        return (
          <Box
            pt={1}
            px={3}
            height="65px"
            cursor="pointer"
            key={subTask.id}
            borderTop="1px solid rgb(128, 128, 128, 0.55)"
          >
            <Flex height="100%" flexDir="column" justifyContent="space-between">
              <Flex alignItems="center">
                <Box mr={1}>{subTask.title}</Box>

                <Tooltip
                  p={3}
                  width="300px"
                  height="250px"
                  placement="right"
                  label={subTask.description}
                >
                  <Center
                    width="16px"
                    height="16px"
                    fontSize="15px"
                    opacity="70%"
                    _hover={{
                      bgColor: "darkMain.300",
                    }}
                  >
                    <i className="bi bi-justify-left"></i>
                  </Center>
                </Tooltip>
              </Flex>

              <Flex fontSize="small" mb={2}>
                {/* Priority */}
                {hasPriority && sortBy !== "priority" && (
                  <Box
                    mr={2}
                    color={priorityFlagColor}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <SelectPriorityPopover
                      task={subTask}
                      currentTaskPriority={currentTaskPriority}
                    >
                      <Box fontSize="13px">
                        <i className="bi bi-flag-fill"></i>
                      </Box>
                    </SelectPriorityPopover>
                  </Box>
                )}

                {/* DueDate */}
                {sortBy !== "dueDate" && (
                  <Box mr={2}>
                    {hasDueDate ? (
                      <Box onClick={(e) => e.stopPropagation()}>
                        <ExpectedDueDateDisplay task={subTask} />
                      </Box>
                    ) : (
                      <Box onClick={(e) => e.stopPropagation()}>
                        <SelectDueDateIcon task={subTask}>
                          <Center opacity="55%" _hover={{ opacity: "100%" }}>
                            <Center fontSize="13px">
                              <i className="bi bi-calendar2-check"></i>
                            </Center>
                          </Center>
                        </SelectDueDateIcon>
                      </Box>
                    )}
                  </Box>
                )}
              </Flex>
            </Flex>
          </Box>
        );
      })}
    </Box>
  );
}
