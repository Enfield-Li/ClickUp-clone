import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Link as ChakraLink,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Field, FieldAttributes, Form, Formik } from "formik";
import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Credentials, FieldErrors } from "../../context/auth/AuthContextTypes";
import useAuthContext from "../../context/auth/useAuthContext";
import { CLIENT_ROUTE } from "../../utils/constant";
import { loginUser } from "./actions/loginUser";

type Props = {};

function Login({}: Props) {
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
            const error = await loginUser(credentials, authDispatch, toast);

            if (error === undefined) navigate(CLIENT_ROUTE.HOME);
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
                    onClick={() => navigate(CLIENT_ROUTE.REGISTER)}
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

export default memo(Login);
