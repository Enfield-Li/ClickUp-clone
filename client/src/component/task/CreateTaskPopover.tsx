import {
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Popover,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Select,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Field, FieldAttributes, Form, Formik, FormikHelpers } from "formik";
import { useRef, useState } from "react";
import FocusLock from "react-focus-lock";
import useAuthContext from "../../context/auth/useAuthContext";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";
import { deepCopy } from "../../utils/deepCopy";
import { createTask } from "./actions/TaskActions";
import {
  getDueDateFromExpectedDueDateString,
  updatePreviousIdsInColumn,
} from "./actions/taskProcessing";
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
} from "./taskTypes";

export type NewTask = {
  title: string;
  status?: string;
  description?: string;
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

export const CreateTaskPopover = ({
  state,
  setState,
  currentColumn,
  sortBy,
  dueDateColumns,
}: Props) => {
  const focusRef = useRef(null);
  const { authState } = useAuthContext();
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const isTaskDone = sortBy === STATUS && currentColumn.id === 3;

  return (
    <Popover
      isOpen={isOpen}
      initialFocusRef={focusRef}
      onOpen={onOpen}
      onClose={onClose}
      placement="bottom"
      closeOnBlur={true}
    >
      {/* Trigger */}
      <PopoverTrigger>
        <Text color="gray.500" cursor={"pointer"}>
          + NEW TASK
        </Text>
      </PopoverTrigger>

      {/* Content */}
      <PopoverContent p={3}>
        <FocusLock returnFocus persistentFocus={false}>
          <PopoverArrow />
          <PopoverCloseButton />

          {/* Form */}
          <Formik<NewTask>
            initialValues={{
              title: "",
              description: "",
              status: "1",
              priority: "1",
              dueDate: "1",
            }}
            onSubmit={(values, helpers) =>
              submit(
                values,
                helpers,
                state,
                currentColumn,
                sortBy,
                setState,
                isTaskDone
              )
            }
          >
            {(props) => (
              <Form>
                {/* Task title */}
                <Field id="title" name="title" Required validate={validateName}>
                  {({ field, form }: FieldAttributes<any>) => (
                    <FormControl
                      my={3}
                      isInvalid={form.errors.title && form.touched.title}
                    >
                      <FormLabel>Title:</FormLabel>
                      <Input {...field} />
                      <FormErrorMessage>{form.errors.title}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                {/* Task description */}
                <Field id="description" name="description">
                  {({ field, form }: FieldAttributes<any>) => (
                    <FormControl my={3}>
                      <FormLabel>Description:</FormLabel>
                      <Input {...field} />
                    </FormControl>
                  )}
                </Field>

                {/* Task priority */}
                {sortBy !== PRIORITY && !isTaskDone && (
                  <Field id={PRIORITY} name={PRIORITY} as="select">
                    {({ field, form }: FieldAttributes<any>) => (
                      <FormControl my={3}>
                        <Stack spacing={3}>
                          <Select {...field}>
                            {state.columnOptions.priority.map((priority) => (
                              <option value={priority.id} key={priority.id}>
                                {capitalizeFirstLetter(priority.title)}
                              </option>
                            ))}
                          </Select>
                        </Stack>
                      </FormControl>
                    )}
                  </Field>
                )}

                {/* Task dueDate */}
                {sortBy !== DUE_DATE && !isTaskDone && (
                  <Field id={DUE_DATE} name={DUE_DATE} as="select">
                    {({ field, form }: FieldAttributes<any>) => (
                      <FormControl my={3}>
                        {/* Pick dueDate */}
                        <Flex justifyContent={"space-between"}>
                          {showDatePicker ? (
                            // Date picker
                            <Input
                              {...field}
                              width="60%"
                              type="datetime-local"
                            />
                          ) : (
                            // Days select
                            <Select {...field} width="60%">
                              {dueDateColumns.map((dueDate) => (
                                <option value={dueDate.id} key={dueDate.id}>
                                  {capitalizeFirstLetter(dueDate.title)}
                                </option>
                              ))}
                            </Select>
                          )}

                          {/* Toggle show pick day/date */}
                          <Center>
                            <Text
                              fontSize="xs"
                              color="blue.300"
                              cursor="pointer"
                              onClick={() => setShowDatePicker(!showDatePicker)}
                            >
                              {showDatePicker ? "Hide" : "Show"} date picker
                            </Text>
                          </Center>
                        </Flex>
                      </FormControl>
                    )}
                  </Field>
                )}

                <Button
                  width={"100%"}
                  mt={3}
                  colorScheme="teal"
                  isLoading={props.isSubmitting}
                  type="submit"
                  onClick={onClose}
                >
                  Create task
                </Button>
              </Form>
            )}
          </Formik>
        </FocusLock>
      </PopoverContent>
    </Popover>
  );
};

function validateName(value: string) {
  let error;
  if (!value) {
    error = "Title is required";
  }
  return error;
}

async function submit(
  formValues: NewTask,
  formikHelpers: FormikHelpers<NewTask>,
  state: State,
  column: UndeterminedColumn,
  sortBy: SortBy,
  setState: SetState,
  isTaskDone: boolean
) {
  // Prepare newTask
  const { title, description, dueDate, priority, status } = formValues;

  const newTask: Task = {
    title,
    description,
    previousTaskIds: {},
    taskEvents: [],
    watchers: [],
    assignees: [],
  };

  const targetColumn = { dueDate, priority, status };
  // Use date picker
  if (dueDate && dueDate.length > 1) {
    newTask.expectedDueDate = new Date(dueDate);

    const dueDateColumnId = getDueDateFromExpectedDueDateString(
      state.columnOptions.dueDate,
      dueDate
    );

    targetColumn.dueDate = String(dueDateColumnId);
  }

  // Task is finished, hide from other column options
  if (isTaskDone) {
    newTask.priority = 0;
    newTask.dueDate = 0;
  } else {
    updatePreviousIdsInColumn(state, targetColumn, newTask);
  }

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

  const newTaskData = await createTask(newTask);

  // Update state
  setState((previousState) => {
    // Deep copy
    const copiedState = deepCopy(previousState) as State;

    // Push newTask to current column array
    const taskArr = copiedState.orderedTasks.find(
      (task) => task.id === column.id
    );
    if (newTaskData) {
      newTaskData.taskEvents = [];
      taskArr?.taskList.push(newTaskData);
    }
    // taskArr?.taskList.push(newTask);

    return copiedState;
  });

  formikHelpers.resetForm();
}
