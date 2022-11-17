import { Box, Center, Flex, Input, useColorModeValue } from "@chakra-ui/react";
import { memo, useState } from "react";
import useAuthContext from "../../../context/auth/useAuthContext";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import {
  SelectableDueDate,
  TaskState,
  UndeterminedColumn,
} from "../../../types";
import { useFocus } from "../../../utils/useFocus";
import { getExpectedDueDateFromWeekString } from "../actions/columnProcessing";
import CreateDueDateDetails from "./createDueDate/CreateDueDateDetails";
import { createNewTask, NewTask } from "../actions/createNewTask";
import CreateSelectPriorityIcon from "./createPriority/CreateSelectPriorityIcon";
import SaveButton from "./SaveButton";

type Props = {
  state: TaskState;
  isCreateTaskOpen: boolean;
  currentColumn: UndeterminedColumn;
  setIsCreateTaskOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function CreateTask({
  state,
  currentColumn,
  isCreateTaskOpen,
  setIsCreateTaskOpen,
}: Props) {
  const { authState } = useAuthContext();

  const { taskStateContext } = useTaskDetailContext();
  const { sortBy, setState } = taskStateContext!;
  const [showCreateTaskForm, setShowCreateTaskForm] = useState(false);
  const hoverBgColor = useColorModeValue("lightMain.200", "darkMain.500");
  const finishedStatusColumn = sortBy === "status" && currentColumn.id === 3;

  // task name state
  const [taskName, setTaskName] = useState("");
  // priority state
  const initialPriority = sortBy === "priority" ? currentColumn.id : null;
  const [priority, setPriority] = useState<number | null>(initialPriority);
  // due date state
  const weekString = currentColumn.title;
  const initialDueDate =
    sortBy === "dueDate"
      ? getExpectedDueDateFromWeekString(weekString as SelectableDueDate)
      : undefined;
  const [expectedDueDate, setExpectedDueDate] = useState<Date | undefined>(
    initialDueDate
  );

  // focus element
  const [htmlElRef, setFocus] = useFocus<HTMLDivElement>();
  function handleOnBlur(e: React.FocusEvent<HTMLDivElement, Element>) {
    // Prevent firing the blur event on children: https://stackoverflow.com/a/60094794/16648127
    // blur event.relatedTarget returns null: https://stackoverflow.com/a/42764495/16648127
    if (!taskName && !e.currentTarget.contains(e.relatedTarget)) {
      resetAll();
    }
  }

  function handleCancel() {
    resetAll();
    setTaskName("");
  }

  function resetAll() {
    setIsCreateTaskOpen(false);
    setShowCreateTaskForm(false);
    setPriority(initialPriority);
    setExpectedDueDate(initialDueDate);
  }

  return (
    <Box my={3}>
      {!showCreateTaskForm ? (
        !isCreateTaskOpen &&
        !finishedStatusColumn && (
          <Box
            px={2}
            rounded="md"
            color="gray.500"
            cursor="pointer"
            _hover={{ bgColor: hoverBgColor }}
            onClick={() => {
              setFocus();
              setIsCreateTaskOpen(true);
              setShowCreateTaskForm(true);
            }}
          >
            + NEW TASK
          </Box>
        )
      ) : (
        <Box
          p={1}
          pb={3}
          border="1px"
          rounded="sm"
          width="100%"
          tabIndex={0}
          ref={htmlElRef}
          onBlur={handleOnBlur}
          borderColor="rgb(123, 104, 238)"
        >
          <Flex alignItems="center" mb={4}>
            <Flex>
              {/* Close */}
              <Center
                p={1}
                opacity="70%"
                cursor="pointer"
                onClick={handleCancel}
                _hover={{ color: "purple.300" }}
              >
                <i className="bi bi-x"></i>
              </Center>

              {/* Task name input */}
              <Center>
                <Input
                  mr={2}
                  autoFocus
                  height="23px"
                  value={taskName}
                  variant="unstyled"
                  placeholder="Task name"
                  onChange={(e) => setTaskName(e.target.value)}
                />
              </Center>
            </Flex>

            {/* Assignee */}
            <Center mr={2} opacity="75%" rounded="full" cursor="pointer">
              <i className="bi bi-person"></i>
            </Center>
          </Flex>

          <Flex justifyContent="space-between" alignItems="center">
            <Flex alignItems="center">
              {/* Priority */}
              <Center ml={4} mr={6}>
                <CreateSelectPriorityIcon
                  priority={priority}
                  setPriority={setPriority}
                />
              </Center>

              {/* DueDate */}
              <Center>
                <CreateDueDateDetails
                  expectedDueDate={expectedDueDate}
                  setExpectedDueDate={setExpectedDueDate}
                />
              </Center>
            </Flex>

            {/* Save */}
            <Box
              onClick={() => {
                if (taskName) {
                  const newTask: NewTask = {
                    title: taskName,
                    expectedDueDate,
                    priority,
                  };

                  createNewTask(
                    newTask,
                    state,
                    currentColumn,
                    sortBy,
                    setState
                  );
                  handleCancel();
                }
              }}
            >
              <SaveButton taskName={taskName} />
            </Box>
          </Flex>
        </Box>
      )}
    </Box>
  );
}

export default memo(CreateTask);
