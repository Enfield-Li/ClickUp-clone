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
import { ColumnType, SetState } from "./Data";

type NewTask = {
  title: string;
  description?: string;
};

type Props = {
  column: ColumnType;
  setState: SetState;
};

export const PopoverForm = ({ setState, column }: Props) => {
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
            onSubmit={async (values, { resetForm }) => {
              console.log(values);
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