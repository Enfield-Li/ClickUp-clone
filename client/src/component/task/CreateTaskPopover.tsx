import {
  Button,
  Center,
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
import { ColumnType, SetState, SortBy, State, Task } from "./Data";

type NewTask = {
  title: string;
  description?: string;
};

type Props = {
  sortBy: SortBy;
  column: ColumnType;
  setState: SetState;
};

export const PopoverForm = ({ setState, column, sortBy }: Props) => {
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
              setState((prv) => {
                const copiedTasks = JSON.parse(JSON.stringify(prv)) as State;

                const currentTaskArr = copiedTasks?.orderedTasks.find(
                  (task) => task.id === column.id
                );

                const currentTaskList = currentTaskArr?.taskList;
                const currentTaskArrLength = currentTaskList?.length;
                
                const previousTaskId = currentTaskArrLength
                  ? currentTaskList?.[currentTaskArrLength - 1].id
                  : undefined;

                const newTask: Task = {
                  id: 100,
                  title,
                  description,
                  previousItem: {},
                };
                newTask[sortBy] = column.id;
                newTask.previousItem[`${sortBy}Id`] = previousTaskId;

                currentTaskArr?.taskList.push(newTask);

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
