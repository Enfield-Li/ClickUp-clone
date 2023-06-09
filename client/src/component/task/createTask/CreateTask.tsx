import { Box, Center, Flex, Input, useColorModeValue } from "@chakra-ui/react";
import { memo, useState } from "react";
import { useAuth } from "../../../context/auth/useAuth";
import { useTaskDetail } from "../../../context/task_detail/useTaskDetail";
import useUnImplementedToast from "../../../hook/useFeatureNotImplemented";
import {
  DueDate,
  GroupBy,
  TaskState,
  UndeterminedColumn,
} from "../../../types";
import { useFocus } from "../../../utils/useFocus";
import { getExpectedDueDateFromWeekString } from "../actions/columnProcessing";
import { createNewTask, newCreator, NewTask } from "../actions/createNewTask";
import CreateDueDateDetails from "./createDueDate/CreateDueDateDetails";
import CreateSelectPriorityIcon from "./createPriority/CreateSelectPriorityIcon";
import SaveButton from "./SaveButton";

type Props = {
  taskState: TaskState;
  currentColumn: UndeterminedColumn;
  setHovering: React.Dispatch<React.SetStateAction<boolean>>;
};

export default memo(CreateTask);
function CreateTask({ taskState, currentColumn, setHovering }: Props) {
  const { user } = useAuth();
  const { addTask } = useTaskDetail();
  const toast = useUnImplementedToast();
  const { taskStateContext, setCreatingTask, isCreatingTask } = useTaskDetail();
  if (!taskStateContext) throw new Error("taskStateContext not initialized");
  const { groupBy } = taskStateContext;

  const [showCreateTaskForm, setShowCreateTaskForm] = useState(false);
  const cardBgColor = useColorModeValue("white", "darkMain.200");
  const hoverBgColor = useColorModeValue("lightMain.200", "darkMain.200");
  const fontColor = useColorModeValue("darkMain.200", "gray.400");

  // task name
  const [taskName, setTaskName] = useState("");
  // priority
  const initialPriority =
    groupBy === GroupBy.PRIORITY ? currentColumn.id : undefined;
  const [priority, setPriority] = useState<number | undefined>(initialPriority);
  // due date
  const weekString = currentColumn.title;
  const initialDueDate =
    groupBy === GroupBy.DUE_DATE
      ? getExpectedDueDateFromWeekString(weekString as DueDate)
      : null;
  const [expectedDueDate, setExpectedDueDate] = useState<Date | null>(
    initialDueDate
  );

  // focus element
  const { htmlElRef, setFocus } = useFocus<HTMLInputElement>();
  function handleOnBlur(e: React.FocusEvent<HTMLDivElement, Element>) {
    // Prevent firing the blur event on children: https://stackoverflow.com/a/60094794/16648127
    // blur event.relatedTarget returns null: https://stackoverflow.com/a/42764495/16648127
    if (!taskName && !e.currentTarget.contains(e.relatedTarget)) {
      resetAll();
    }
  }

  function handleCreateTask() {
    if (taskName && taskStateContext) {
      const newTask: NewTask = {
        title: taskName,
        expectedDueDate,
        priority,
      };

      createNewTask({
        addTask,
        taskState,
        groupBy: groupBy,
        currentColumn,
        newTaskInput: newTask,
        creator: newCreator(user),
        listId: taskStateContext.currentListId,
        dueDateColumn: taskState.columnOptions.dueDateColumns,
      });

      continueCreateTask();
    }
  }

  function continueCreateTask() {
    setFocus();
    setTaskName("");
    setPriority(initialPriority);
    setExpectedDueDate(initialDueDate);
  }

  function handleReset() {
    resetAll();
    setTaskName("");
  }

  function resetAll() {
    setHovering(false);
    setCreatingTask(false);
    setShowCreateTaskForm(false);
    setPriority(initialPriority);
    setExpectedDueDate(initialDueDate);
  }

  return (
    <Box my={3}>
      {!showCreateTaskForm ? (
        !isCreatingTask && (
          <Center
            px={3}
            py={1}
            rounded="md"
            fontSize="sm"
            cursor="pointer"
            color={fontColor}
            width="fit-content"
            _hover={{ bgColor: hoverBgColor }}
            onClick={() => {
              setFocus();
              setCreatingTask(true);
              setShowCreateTaskForm(true);
            }}
          >
            + New Task
          </Center>
        )
      ) : (
        <Box
          p={1}
          pb={3}
          border="1px"
          rounded="sm"
          width="100%"
          tabIndex={0}
          bgColor={cardBgColor}
          onBlur={handleOnBlur}
          borderColor="rgb(123, 104, 238)"
          onKeyPress={(e) =>
            (e.key === "Enter" || e.code === "NumpadEnter") &&
            handleCreateTask()
          }
        >
          <Flex alignItems="center" mb={4}>
            <Flex>
              {/* Close */}
              <Center
                p={1}
                opacity="70%"
                cursor="pointer"
                onClick={handleReset}
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
                  ref={htmlElRef}
                  value={taskName}
                  variant="unstyled"
                  placeholder="Task name"
                  onChange={(e) => setTaskName(e.target.value)}
                />
              </Center>
            </Flex>

            {/* Assignee */}
            <Center
              mr={2}
              opacity="75%"
              rounded="full"
              cursor="pointer"
              onClick={() => toast()}
            >
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
            <Box onClick={handleCreateTask}>
              <SaveButton taskName={taskName} />
            </Box>
          </Flex>
        </Box>
      )}
    </Box>
  );
}
