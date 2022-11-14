import {
  Box,
  Center,
  Flex,
  Input,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FormikHelpers } from "formik";
import { memo, useState } from "react";
import useAuthContext from "../../../context/auth/useAuthContext";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import {
  lookUpPreviousTaskId,
  SelectableDueDate,
  SetState,
  SortBy,
  State,
  TargetColumn,
  Task,
  UndeterminedColumn,
} from "../../../types";
import { deepCopy } from "../../../utils/deepCopy";
import { useFocus } from "../../../utils/useFocus";
import { getExpectedDueDateFromWeekString } from "../actions/columnProcessing";
import { createTask } from "../actions/networkActions";
import {
  getDueDateFromExpectedDueDate,
  updatePreviousIdsInColumn,
} from "../actions/taskProcessing";
import CreateDueDateDetails from "./createDueDate/CreateDueDateDetails";
import CreateSelectPriorityIcon from "./createPriority/CreateSelectPriorityIcon";
import SaveButton from "./SaveButton";

type Props = {
  state: State;
  currentColumn: UndeterminedColumn;
};

function CreateTask({ state, currentColumn }: Props) {
  const { authState } = useAuthContext();

  const { taskStateContext } = useTaskDetailContext();
  const { sortBy, setState } = taskStateContext!;

  const initialPriority = sortBy === "priority" ? currentColumn.id : null;

  const weekString = currentColumn.title;
  const initialDueDate =
    sortBy === "dueDate"
      ? getExpectedDueDateFromWeekString(weekString as SelectableDueDate)
      : undefined;

  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState<number | null>(initialPriority);
  const [expectedDueDate, setExpectedDueDate] = useState<Date | undefined>(
    initialDueDate
  );
  // initialDueDate
  const [showCreateTaskForm, setShowCreateTaskForm] = useState(false);
  const hoverBgColor = useColorModeValue("lightMain.200", "darkMain.500");

  const [htmlElRef, setFocus] = useFocus<HTMLInputElement>();
  function handleOnBlur(e: React.FocusEvent<HTMLDivElement, Element>) {
    // Prevent firing the blur event on children:
    //        https://stackoverflow.com/a/60094794/16648127
    // blur event.relatedTarget returns null:
    //        https://stackoverflow.com/a/42764495/16648127
    if (!taskName && !e.currentTarget.contains(e.relatedTarget)) {
      setShowCreateTaskForm(false);
      setPriority(initialPriority);
      setExpectedDueDate(initialDueDate);
    }
  }

  return (
    <Box mt={3}>
      {!showCreateTaskForm ? (
        <Box
          px={2}
          rounded="md"
          color="gray.500"
          cursor="pointer"
          _hover={{ bgColor: hoverBgColor }}
          onClick={() => {
            setFocus();
            setShowCreateTaskForm(true);
          }}
        >
          + NEW TASK
        </Box>
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
                _hover={{ color: "purple.300" }}
                onClick={() => setShowCreateTaskForm(false)}
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
              onClick={() =>
                taskName &&
                createNewTask(
                  { title: taskName, expectedDueDate, priority },
                  state,
                  currentColumn,
                  sortBy,
                  setState
                )
              }
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

export type NewTask = {
  title: string;
  expectedDueDate?: Date;
  priority: number | null;
};

async function createNewTask(
  newTaskInput: NewTask,
  state: State,
  column: UndeterminedColumn,
  sortBy: SortBy,
  setState: SetState
) {
  // Prepare newTask
  const { title, expectedDueDate, priority } = newTaskInput;

  const newTask: Task = {
    id: Math.random(),
    title,
    expectedDueDate,
    previousTaskIds: {},
    taskEvents: [],
    watchers: [],
    assignees: [],
    subTasks: [],
  };

  const targetColumn: TargetColumn = {};

  if (priority) targetColumn.priority = String(priority);
  if (expectedDueDate) {
    newTask.expectedDueDate = new Date(expectedDueDate);

    const dueDateColumnId = getDueDateFromExpectedDueDate(
      state.columnOptions.dueDate,
      expectedDueDate
    );

    targetColumn.dueDate = String(dueDateColumnId);
  }

  updatePreviousIdsInColumn(state, targetColumn, newTask);

  // Updates for newTask's previousItem for current sortBy
  const currentOrderedTasks = state.orderedTasks.find(
    (task) => task.id === column.id
  );

  const currentTaskList = currentOrderedTasks?.taskList;
  const currentTaskArrLength = currentTaskList?.length;

  const previousTaskId = currentTaskArrLength
    ? currentTaskList?.[currentTaskArrLength - 1].id
    : undefined;

  newTask[sortBy] = column.id;
  newTask.previousTaskIds[lookUpPreviousTaskId[sortBy]] = previousTaskId;

  //   const newTaskData = await createTask(newTask);

  // Update state
  setState((previousState) => {
    // Deep copy
    const copiedState = deepCopy(previousState) as State;

    // Push newTask to current column array
    const taskArr = copiedState.orderedTasks.find(
      (task) => task.id === column.id
    );
    // if (newTaskData) {
    //   newTaskData.taskEvents = [];
    //   taskArr?.taskList.push(newTaskData);
    // }
    taskArr?.taskList.push(newTask);

    return copiedState;
  });
}
