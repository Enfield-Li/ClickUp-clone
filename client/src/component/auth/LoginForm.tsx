import { EmailIcon, PhoneIcon, UnlockIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Link as ChakraLink,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Field, FieldAttributes, Form, Formik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CLIENT_ROUTE } from "../../constant";
import useAuthContext from "../../context/auth/useAuthContext";
import { Credentials, FieldErrors } from "../../types";
import { loginUser } from "./actions/loginUser";

type Props = {};

export default function LoginForm({}: Props) {
  const toast = useToast({ duration: 3000, isClosable: true });
  const { authState, authDispatch } = useAuthContext();
  const [errors, setErrors] = useState<FieldErrors>();
  const navigate = useNavigate();

  return (
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
          <FormControl mt={3}>
            <Field id="username" name="username">
              {({ field, form }: FieldAttributes<any>) => (
                <>
                  <FormLabel fontSize="11px">Email</FormLabel>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<EmailIcon color="gray.300" />}
                    />
                    <Input
                      {...field}
                      rounded="lg"
                      placeholder="Enter your email"
                    />
                  </InputGroup>

                  <Text textColor={"red.400"}>
                    {errors?.find((err) => err.field === "username")?.message}
                  </Text>
                </>
              )}
            </Field>

            <Field id="password" name="password">
              {({ field, form }: FieldAttributes<any>) => (
                <>
                  <FormLabel fontSize="11px" mt={6}>
                    Password
                  </FormLabel>

                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<UnlockIcon color="gray.300" />}
                    />
                    <Input
                      {...field}
                      rounded="lg"
                      type="password"
                      placeholder="Enter password"
                    />
                    <InputRightElement
                      mr="2"
                      width="fit-content"
                      children={
                        <Center
                          flexGrow="1"
                          cursor="pointer"
                          fontSize="12px"
                          color="linkColor"
                        >
                          Forgot Password?
                        </Center>
                      }
                    />
                  </InputGroup>

                  <Text textColor="red.400">
                    {errors?.find((err) => err.field === "password")?.message}
                  </Text>
                </>
              )}
            </Field>

            <Box pt="3">
              <Button
                mt="6"
                width="100%"
                type="submit"
                color="white"
                bgColor="submitBtn"
                isLoading={props.isSubmitting}
                _hover={{ bgColor: "submitBtn" }}
              >
                Submit
              </Button>
            </Box>

            <Center mt="4" cursor="pointer" fontSize="small" color="linkColor">
              or login with SSO
            </Center>
          </FormControl>
        </Form>
      )}
    </Formik>
  );
}
