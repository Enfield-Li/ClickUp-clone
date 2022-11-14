import {
  Box,
  Center,
  Flex,
  Input,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { memo, useState } from "react";
import useAuthContext from "../../../context/auth/useAuthContext";
import { State, UndeterminedColumn } from "../../../types";
import { useFocus } from "../../../utils/useFocus";
import CreateDueDateDetails from "./createDueDate/CreateDueDateDetails";
import CreateSelectPriorityIcon from "./createPriority/CreateSelectPriorityIcon";
import SaveButton from "./SaveButton";

export type NewTask = {
  title: string;
  status?: string;
  priority?: string;
  dueDate?: string;
};

type Props = {
  state: State;
  currentColumn: UndeterminedColumn;
};

function CreateTask({ state, currentColumn }: Props) {
  const { authState } = useAuthContext();
  
  
  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState<number | null>(null);
  const [expectedDueDate, setExpectedDueDate] = useState<Date | undefined>();
  const [showCreateTaskForm, setShowCreateTaskForm] = useState(false);

  const [htmlElRef, setFocus] = useFocus<HTMLInputElement>();

  const hoverBgColor = useColorModeValue("lightMain.200", "darkMain.500");

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
          tabIndex={0}
          width="250px"
          ref={htmlElRef}
          borderColor="rgb(123, 104, 238)"
          onBlur={(e) => {
            // Prevent firing the blur event on children:
            //        https://stackoverflow.com/a/60094794/16648127
            // blur event.relatedTarget returns null:
            //        https://stackoverflow.com/a/42764495/16648127
            if (!taskName && !e.currentTarget.contains(e.relatedTarget)) {
              setPriority(null);
              setExpectedDueDate(undefined);
              setShowCreateTaskForm(false);
            }
          }}
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
            <SaveButton taskName={taskName} />
          </Flex>
        </Box>
      )}
    </Box>
  );
}

export default memo(CreateTask);

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
