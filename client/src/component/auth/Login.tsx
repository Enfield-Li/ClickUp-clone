import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Text,
  useToast,
  VStack,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Formik, FormikHelpers, Form, Field, FieldAttributes } from "formik";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Credentials, FieldErrors } from "../../context/auth/AuthContextTypes";
import useAuthContext, { loginUser } from "../../context/auth/useAuthContext";
import { register } from "../../serviceWorker";
import { ROUTE } from "../../utils/constant";

type Props = {};

export default function Login({}: Props) {
  const toast = useToast({ duration: 3000, isClosable: true });
  const { authState, authDispatch } = useAuthContext();
  const [errors, setErrors] = useState<FieldErrors>();
  const navigate = useNavigate();

  return (
    <Center pt={3}>
      <Box width="50%">
        <Formik<Credentials>
          initialValues={{
            username: "",
            password: "",
          }}
          onSubmit={async (credentials) => {
            const error = await loginUser(
              credentials,
              authDispatch,
              toast
            );

            if (error === undefined) navigate(ROUTE.HOME);
            if (error) setErrors(error);
          }}
        >
          {(props) => (
            <Form>
              {/* https://chakra-ui.com/docs/components/form-control/usage#usage-with-form-libraries */}
              <FormControl mt={3} isRequired>
                <Field id="username" name="username">
                  {({ field, form }: FieldAttributes<any>) => (
                    <>
                      <FormLabel>Username:</FormLabel>
                      <Input {...field} placeholder="John Doe" />

                      <Text textColor={"red.400"}>
                        {
                          errors?.find((err) => err.field === "username")
                            ?.message
                        }
                      </Text>
                    </>
                  )}
                </Field>

                <Field id="password" name="password">
                  {({ field, form }: FieldAttributes<any>) => (
                    <>
                      <FormLabel mt={3}>Password:</FormLabel>
                      <Input {...field} type="password" />

                      <Text textColor={"red.400"}>
                        {
                          errors?.find((err) => err.field === "password")
                            ?.message
                        }
                      </Text>
                    </>
                  )}
                </Field>

                <Flex justifyContent={"space-between"}>
                  <ChakraLink
                    mt={2}
                    color="teal.400"
                    onClick={() => navigate(ROUTE.REGISTER)}
                  >
                    Register now
                  </ChakraLink>
                  <Button
                    mt={3}
                    colorScheme="teal"
                    isLoading={props.isSubmitting}
                    type="submit"
                  >
                    Submit
                  </Button>
                </Flex>
              </FormControl>
            </Form>
          )}
        </Formik>
      </Box>
    </Center>
  );
}
