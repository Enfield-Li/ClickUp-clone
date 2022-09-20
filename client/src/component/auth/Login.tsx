import {
  Box,
  Button,
  Center,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { Formik, FormikHelpers, Form, Field, FieldAttributes } from "formik";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Credentials } from "../../context/auth/AuthContextTypes";
import useAuthContext, { loginUser } from "../../hook/useAuthContext";
import { ROUTE } from "../../utils/constant";

type Props = {};

export default function Login({}: Props) {
  const toast = useToast({ duration: 3000, isClosable: true });
  const { authState, authDispatch } = useAuthContext();
  const navigate = useNavigate();

  return (
    <Center pt={3}>
      <Box width="50%">
        <Formik<Credentials>
          initialValues={{
            username: "",
            password: "",
          }}
          onSubmit={async (credential) => {
            const isLoginSuccessful = await loginUser(
              credential,
              authDispatch,
              toast
            );

            isLoginSuccessful && navigate(ROUTE.HOME);
          }}
        >
          {(props) => (
            <Form>
              {/* https://chakra-ui.com/docs/components/form-control/usage#usage-with-form-libraries */}
              <FormControl mt={3}>
                <Field id="username" name="username">
                  {({ field, form }: FieldAttributes<any>) => (
                    <>
                      <FormLabel>Username:</FormLabel>
                      <Input {...field} placeholder="John Doe" />
                    </>
                  )}
                </Field>

                <Field id="password" name="password">
                  {({ field, form }: FieldAttributes<any>) => (
                    <>
                      <FormLabel mt={3}>Password:</FormLabel>
                      <Input {...field} type="password" />
                    </>
                  )}
                </Field>

                <Button
                  mt={3}
                  colorScheme="teal"
                  isLoading={props.isSubmitting}
                  type="submit"
                >
                  Submit
                </Button>
              </FormControl>
            </Form>
          )}
        </Formik>
      </Box>
    </Center>
  );
}
