import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Popover,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Field, FieldAttributes, Form, Formik } from "formik";
import { useRef } from "react";
import FocusLock from "react-focus-lock";
import {
  ColumnType,
  lookUpInSortBy,
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
};

type Props = {
  state: State;
  sortBy: SortBy;
  column: ColumnType;
  setState: SetState;
};

export const PopoverForm = ({ state, setState, column, sortBy }: Props) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const focusRef = useRef(null);

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
            }}
            onSubmit={async ({ title, description }, { resetForm }) => {
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

              newTask.isLastItem[lookUpInSortBy[sortByDueDate]] = true;
              newTask[sortByDueDate] = dueDateId;
              newTask.previousItem[`${sortByDueDate}Id`] = lastDueDateId;

              newTask.isLastItem[lookUpInSortBy[sortByPriority]] = true;
              newTask[sortByPriority] = priorityId;
              newTask.previousItem[`${sortByPriority}Id`] = lastPriorityId;

              newTask.isLastItem[lookUpInSortBy[sortBy]] = true;
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

                const lastTask =
                  taskArr?.taskList[taskArr?.taskList.length - 1];

                if (lastTask) {
                  lastTask.isLastItem[lookUpInSortBy[sortBy]] = undefined;
                }

                taskArr?.taskList.push(newTask);

                return copiedTasks;
              });
              resetForm();
            }}
          >
            {(props) => (
              <Form>
                <FormControl mt={3}>
                  <Field id="title" name="title" Required>
                    {({ field, form }: FieldAttributes<any>) => (
                      <>
                        <FormLabel>Title:</FormLabel>
                        <Input {...field} />
                      </>
                    )}
                  </Field>

                  <Field id="description" name="description">
                    {({ field, form }: FieldAttributes<any>) => (
                      <>
                        <FormLabel mt={3}>Description:</FormLabel>
                        <Input {...field} />
                      </>
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
                </FormControl>
              </Form>
            )}
          </Formik>
        </FocusLock>
      </PopoverContent>
    </Popover>
  );
};
