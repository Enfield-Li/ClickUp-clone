import {
  Box,
  Center,
  Flex,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import useAuthContext from "../../../context/auth/useAuthContext";
import { SetTask } from "../../../context/task_detail/TaskDetailContextTypes";
import useTaskDetailContext, {
  updateTaskPriorityOrDueDate,
} from "../../../context/task_detail/useTaskDetailContext";
import { getRandomNumberNoLimit } from "../../../utils/getRandomNumber";
import {
  DUE_DATE,
  SetState,
  SortBy,
  Task,
  UpdateEvent,
} from "../../task/taskTypes";
import DueDateSwitch from "./DueDateSwitch";

type Props = {
  task: Task;
  setTask?: SetTask;
};

export default function ExpectedDueDateDisplay({ task, setTask }: Props) {
  const { authState } = useAuthContext();
  const [showDeleteButton, setShowDeleteButton] = useState(false);

  const { taskStateContext } = useTaskDetailContext();
  const { setState, sortBy } = taskStateContext!;

  const popoverContentBg = useColorModeValue("white", "darkMain.100");
  const popoverContentColor = useColorModeValue(
    "darkMain.400",
    "lightMain.200"
  );

  function clearDueDate() {
    // Update list state
    updateTaskPriorityOrDueDate(
      sortBy,
      task!,
      setState,
      DUE_DATE,
      1, // No due date
      undefined
    );

    const newEvent: UpdateEvent = {
      id: getRandomNumberNoLimit(),
      userId: authState.user?.id,
      taskId: task!.id!,
      field: DUE_DATE,
      beforeUpdate: String(task?.dueDate),
      afterUpdate: "1",
      createdAt: new Date(),
    };

    // Update modal task state
    if (setTask) {
      setTask({
        ...task!,
        expectedDueDate: undefined,
        taskEvents: [...task!.taskEvents, newEvent],
      });
    }
  }

  return (
    <Flex
      cursor="pointer"
      _hover={{ textDecoration: "underline" }}
      onMouseOverCapture={() => setShowDeleteButton(true)}
      onMouseOutCapture={() => setShowDeleteButton(false)}
    >
      <Popover>
        {({ onClose, isOpen: isOptionOpen }) => (
          // https://chakra-ui.com/docs/components/popover/usage#accessing-internal-state
          <>
            <Tooltip
              my={2}
              hasArrow
              placement="top"
              fontWeight="semibold"
              label={
                <Box>
                  Time:&nbsp;
                  {new Date(task?.expectedDueDate!).toLocaleTimeString()}
                </Box>
              }
            >
              <Box display="inline-block">
                <PopoverTrigger>
                  <Center opacity="65%">
                    {new Date(task?.expectedDueDate!).toLocaleDateString()}
                  </Center>
                </PopoverTrigger>
              </Box>
            </Tooltip>

            {/* DueDate option */}
            <PopoverContent
              width="200px"
              bgColor={popoverContentBg}
              color={popoverContentColor}
            >
              <PopoverBody shadow={"2xl"} p={0}>
                <DueDateSwitch
                  task={task}
                  setTask={setTask}
                  onClose={onClose}
                  isOptionOpen={isOptionOpen}
                />
              </PopoverBody>
            </PopoverContent>
          </>
        )}
      </Popover>

      {/* Delete button */}
      {showDeleteButton && (
        <Center
          p={1}
          color="red"
          opacity="65%"
          fontSize="8px"
          onClick={() => clearDueDate()}
        >
          <i className="bi bi-x-circle-fill"></i>
        </Center>
      )}
    </Flex>
  );
}
