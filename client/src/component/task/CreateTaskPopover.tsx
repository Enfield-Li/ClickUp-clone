import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Field, FieldAttributes, Form, Formik, FormikHelpers } from "formik";
import { memo, useState } from "react";
import useAuthContext from "../../context/auth/useAuthContext";
import {
  DueDateColumns,
  DUE_DATE,
  lookUpPreviousTaskId,
  PRIORITY,
  SetState,
  SortBy,
  State,
  STATUS,
  Task,
  UndeterminedColumn,
} from "../../types";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";
import { deepCopy } from "../../utils/deepCopy";
import { createTask } from "./actions/TaskActions";
import {
  getDueDateFromExpectedDueDateString,
  updatePreviousIdsInColumn,
} from "./actions/taskProcessing";

export type NewTask = {
  title: string;
  status?: string;
  priority?: string;
  dueDate?: string;
};

type Props = {
  state: State;
  sortBy: SortBy;
  currentColumn: UndeterminedColumn;
  setState: SetState;
  dueDateColumns: DueDateColumns;
};

function CreateTaskPopover({
  state,
  setState,
  currentColumn,
  sortBy,
  dueDateColumns,
}: Props) {
  const { authState } = useAuthContext();
  const [taskName, setTaskName] = useState("");
  const [showCreateTaskForm, setShowCreateTaskForm] = useState(false);

  const isTaskDone = sortBy === STATUS && currentColumn.id === 3;
  const hoverBgColor = useColorModeValue("lightMain.200", "darkMain.500");

  return (
    <>
      {!showCreateTaskForm ? (
        <Text
          px={2}
          rounded="md"
          color="gray.500"
          cursor="pointer"
          _hover={{ bgColor: hoverBgColor }}
          onClick={() => setShowCreateTaskForm(true)}
        >
          + NEW TASK
        </Text>
      ) : (
        <Box border="1px solid white" rounded="sm" width="250px" p={1} pb={3}>
          <Flex alignItems="center" mb={4}>
            <Flex>
              {/* Close */}
              <Center opacity="70%" cursor="pointer" p={1}>
                <i className="bi bi-x"></i>
              </Center>

              {/* Task name input */}
              <Center>
                <Input
                  mr={2}
                  height="23px"
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
              width="23px"
              height="23px"
              opacity="75%"
              rounded="full"
              cursor="pointer"
              border="1px solid white"
            >
              <i className="bi bi-person"></i>
            </Center>
          </Flex>

          <Flex justifyContent="space-between" alignItems="center">
            <Flex alignItems="center">
              {/* Priority */}
              <Center
                ml={4}
                mr={6}
                width="10px"
                height="10px"
                opacity="75%"
                fontSize="14px"
                cursor="pointer"
                borderRadius="50%"
              >
                <i className="bi bi-calendar2-check"></i>
              </Center>

              {/* DueDate */}
              <Center
                width="10px"
                height="10px"
                opacity="75%"
                fontSize="14px"
                cursor="pointer"
                borderRadius="50%"
              >
                <i className="bi bi-flag"></i>
              </Center>
            </Flex>

            <Center
              p={2}
              mr={2}
              pb="10px"
              rounded="sm"
              width="45px"
              height="15px"
              fontSize="12px"
              cursor="pointer"
              fontWeight="semibold"
              bgColor="customBlue.50"
            >
              SAVE
            </Center>
          </Flex>
        </Box>
      )}
    </>
  );
}

export default memo(CreateTaskPopover);

function validateName(value: string) {
  let error;
  if (!value) {
    error = "Title is required";
  }
  return error;
}

// async function submit(
//   formValues: NewTask,
//   formikHelpers: FormikHelpers<NewTask>,
//   state: State,
//   column: UndeterminedColumn,
//   sortBy: SortBy,
//   setState: SetState,
//   isTaskDone: boolean
// ) {
//   // Prepare newTask
//   const { title, dueDate, priority, status } = formValues;

//   const newTask: Task = {
//     title,
//     previousTaskIds: {},
//     taskEvents: [],
//     watchers: [],
//     assignees: [],
//     subTasks: [],
//   };

//   const targetColumn = { dueDate, priority, status };
//   // Use date picker
//   if (dueDate && dueDate.length > 1) {
//     newTask.expectedDueDate = new Date(dueDate);

//     const dueDateColumnId = getDueDateFromExpectedDueDateString(
//       state.columnOptions.dueDate,
//       dueDate
//     );

//     targetColumn.dueDate = String(dueDateColumnId);
//   }

//   // Task is finished, hide from other column options
//   if (isTaskDone) {
//     newTask.priority = 0;
//     newTask.dueDate = 0;
//   } else {
//     updatePreviousIdsInColumn(state, targetColumn, newTask);
//   }

//   // Updates for newTask's previousItem for current sortBy
//   const currentOrderedTasks = state.orderedTasks.find(
//     (task) => task.id === column.id
//   );

//   const currentTaskList = currentOrderedTasks?.taskList;
//   const currentTaskArrLength = currentTaskList?.length;

//   const previousTaskId = currentTaskArrLength
//     ? currentTaskList?.[currentTaskArrLength - 1].id
//     : undefined;

//   newTask[sortBy] = column.id;
//   newTask.previousTaskIds[lookUpPreviousTaskId[sortBy]] = previousTaskId;

//   const newTaskData = await createTask(newTask);

//   // Update state
//   setState((previousState) => {
//     // Deep copy
//     const copiedState = deepCopy(previousState) as State;

//     // Push newTask to current column array
//     const taskArr = copiedState.orderedTasks.find(
//       (task) => task.id === column.id
//     );
//     if (newTaskData) {
//       newTaskData.taskEvents = [];
//       taskArr?.taskList.push(newTaskData);
//     }
//     // taskArr?.taskList.push(newTask);

//     return copiedState;
//   });

//   formikHelpers.resetForm();
// }
