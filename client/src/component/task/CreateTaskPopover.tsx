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
  Columns,
  ColumnType,
  DueDateColumns,
  lookUpIsLastItem,
  SetState,
  SortBy,
  State,
  Task,
} from "./Data";
import {
  findTheLastTaskIdOnSortByAndColumnId,
  updateLastTask,
} from "./TaskDataProcessing";

type NewTask = {
  title: string;
  description?: string;
  priority?: string;
  date?: string;
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
      closeOnBlur={false}
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
              priority: "",
              date: "",
            }}
            onSubmit={
              (values, helpers) => {
                // console.log({ title: values.title, description, priority, date });
                console.log(values);
              }
              // submit(values, helpers, state, column, sortBy, setState)
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
                <Field id="priority" name="priority" as="select">
                  {({ field, form }: FieldAttributes<any>) => (
                    <FormControl my={3}>
                      <Stack spacing={3}>
                        <Select placeholder="Priority" {...field}>
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

                {/* Task dueDate */}
                <Field id="date" name="date" as="select">
                  {({ field, form }: FieldAttributes<any>) => (
                    <FormControl my={3}>
                      <Flex justifyContent={"space-between"}>
                        {showDatePicker ? (
                          <Input {...field} type="date" width="60%" />
                        ) : (
                          <Select placeholder="Date" {...field} width="60%">
                            <option value="Date1">Date 1</option>
                            <option value="Date2">Date 2</option>
                            <option value="Date3">Date 3</option>
                          </Select>
                        )}
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
  const { title, description, priority, date } = values;

  const sortByDueDate = "dueDate";
  const dueDateId = 2;

  const sortByPriority = "priority";
  const priorityId = 3;

  const lastDueDateId = findTheLastTaskIdOnSortByAndColumnId(
    state.orderedTasks,
    sortByDueDate,
    dueDateId
  );

  const lastPriorityId = findTheLastTaskIdOnSortByAndColumnId(
    state.orderedTasks,
    sortByPriority,
    priorityId
  );

  console.log({ lastDueDateId, lastPriorityId });

  const currentOrderedTasks = state.orderedTasks.find(
    (task) => task.id === column.id
  );

  const currentTaskList = currentOrderedTasks?.taskList;
  const currentTaskArrLength = currentTaskList?.length;

  const previousTaskId = currentTaskArrLength
    ? currentTaskList?.[currentTaskArrLength - 1].id
    : undefined;

  const newTask: Task = {
    id: 123,
    title,
    description,
    previousItem: {},
    isLastItem: {},
  };

  newTask.isLastItem[lookUpIsLastItem[sortByDueDate]] = true;
  newTask[sortByDueDate] = dueDateId;
  newTask.previousItem[`${sortByDueDate}Id`] = lastDueDateId;

  newTask.isLastItem[lookUpIsLastItem[sortByPriority]] = true;
  newTask[sortByPriority] = priorityId;
  newTask.previousItem[`${sortByPriority}Id`] = lastPriorityId;

  newTask.isLastItem[lookUpIsLastItem[sortBy]] = true;
  newTask[sortBy] = column.id;
  newTask.previousItem[`${sortBy}Id`] = previousTaskId;

  setState((prv) => {
    const copiedTasks = JSON.parse(JSON.stringify(prv)) as State;

    if (lastDueDateId) {
      updateLastTask(copiedTasks, lastDueDateId, sortByDueDate);
    }
    if (lastPriorityId) {
      updateLastTask(copiedTasks, lastPriorityId, sortByPriority);
    }

    const taskArr = copiedTasks.orderedTasks.find(
      (task) => task.id === column.id
    );

    const lastTask = taskArr?.taskList[taskArr?.taskList.length - 1];

    if (lastTask) {
      lastTask.isLastItem[lookUpIsLastItem[sortBy]] = undefined;
    }

    taskArr?.taskList.push(newTask);

    return copiedTasks;
  });
  formikHelpers.resetForm();
}
