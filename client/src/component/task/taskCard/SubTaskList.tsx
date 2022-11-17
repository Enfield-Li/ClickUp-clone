import {
  Box,
  Center,
  Flex,
  Tooltip,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { memo } from "react";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import { Task } from "../../../types";
import ExpectedDueDateDisplay from "../../taskModal/dueDate/ExpectedDueDateDisplay";
import SelectDueDateIcon from "../../taskModal/dueDate/SelectDueDateIcon";
import SelectPriorityPopover from "../../taskModal/priority/SelectPriorityPopover";

type Props = { task: Task };

function SubTaskList({ task }: Props) {
  const { colorMode } = useColorMode();
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

        const currentTaskStatus = columnOptions.statusColumns.find(
          (statusColumn) => statusColumn.id === subTask.status
        );

        const currentTaskPriority = columnOptions.priorityColumns.find(
          (priority) => priority.id === subTask.priority
        );
        const priorityFlagColor = currentTaskPriority?.color;

        return (
          <Box
            pt={2}
            px={3}
            height="65px"
            cursor="pointer"
            key={subTask.id}
            borderLeft="2px solid"
            borderLeftColor={currentTaskStatus?.color}
            borderTop="1px solid rgb(128, 128, 128, 0.55)"
            _hover={{
              bgColor: colorMode === "dark" ? "darkMain.100" : "",
            }}
          >
            <Flex height="100%" flexDir="column" justifyContent="space-between">
              <Flex alignItems="center">
                <Box mr={1} fontSize="sm" fontStyle="bold">
                  {subTask.title}
                </Box>

                {subTask.description && (
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
                      fontSize="13px"
                      opacity="70%"
                      _hover={{
                        bgColor: "darkMain.300",
                      }}
                    >
                      <i className="bi bi-justify-left"></i>
                    </Center>
                  </Tooltip>
                )}
              </Flex>

              <Flex fontSize="12px" mb={2}>
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
                      <Box>
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
                            <Center>
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
export default memo(SubTaskList);
