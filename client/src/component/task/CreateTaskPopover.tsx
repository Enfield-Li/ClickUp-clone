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
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";
import {
  ColumnType,
  DueDateColumns,
  lookUpIsLastItem,
  SetState,
  SortBy,
  State,
  Task,
} from "./Data";
import { createTask } from "./TaskActions";
import {
  collectAllTasks,
  updateNewTask,
  collectPreviousTaskValues,
} from "./TaskDataProcessing";

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
  column: ColumnType;
  setState: SetState;
  dueDateColumns: DueDateColumns;
};

export const CreateTaskPopover = ({
  state,
  setState,
  column,
  sortBy,
  dueDateColumns,
}: Props) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const focusRef = useRef(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

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
              submit(values, helpers, state, column, sortBy, setState)
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
                {sortBy !== "priority" && (
                  <Field id="priority" name="priority" as="select">
                    {({ field, form }: FieldAttributes<any>) => (
                      <FormControl my={3}>
                        <Stack spacing={3}>
                          <Select {...field}>
                            {state.unorderedColumns.priority.map((priority) => (
                              <option value={priority.id} key={priority.id}>
                                {capitalizeFirstLetter(
                                  priority.title.toLowerCase()
                                )}
                              </option>
                            ))}
                          </Select>
                        </Stack>
                      </FormControl>
                    )}
                  </Field>
                )}

                {/* Task dueDate */}
                {sortBy !== "dueDate" && (
                  <Field id="dueDate" name="dueDate" as="select">
                    {({ field, form }: FieldAttributes<any>) => (
                      <FormControl my={3}>
                        {/* Pick dueDate */}
                        <Flex justifyContent={"space-between"}>
                          {showDatePicker ? (
                            // Date picker
                            <Input {...field} type="date" width="60%" />
                          ) : (
                            // Days select
                            <Select {...field} width="60%">
                              {dueDateColumns.map((dueDate) => (
                                <option value={dueDate.id} key={dueDate.id}>
                                  {capitalizeFirstLetter(
                                    dueDate.title.toLowerCase()
                                  )}
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
  values: NewTask,
  formikHelpers: FormikHelpers<NewTask>,
  state: State,
  column: ColumnType,
  sortBy: SortBy,
  setState: SetState
) {
  // Prepare newTask
  const { title, description } = values;
  const newTask: Task = {
    title,
    description,
    previousItem: {},
  };
  const allTasks = collectAllTasks(state.orderedTasks);

  // Updates for newTask's previousItem for other sortBy
  const previousTaskValues = collectPreviousTaskValues(values);

  updateNewTask(previousTaskValues, allTasks, newTask);

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
  newTask.previousItem[`${sortBy}Id`] = previousTaskId;

  const taskData = await createTask(newTask);

  // Update state
  setState((prv) => {
    // Deep copy
    const copiedTasks = JSON.parse(JSON.stringify(prv)) as State;

    // Push newTask to current column array
    const taskArr = copiedTasks.orderedTasks.find(
      (task) => task.id === column.id
    );
    if (taskData) taskArr?.taskList.push(taskData);

    return copiedTasks;
  });

  formikHelpers.resetForm();
}
