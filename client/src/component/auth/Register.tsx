import { EmailIcon, UnlockIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Field, FieldAttributes, Form, Formik } from "formik";
import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CLIENT_ROUTE } from "../../constant";
import useAuthContext from "../../context/auth/useAuthContext";
import { Credentials, FieldErrors, RegisterCredentials } from "../../types";
import { registerUser } from "./actions/registerUser";
import AuthTemplate from "./AuthTemplate";

type Props = {};

export default memo(Register);
function Register({}: Props) {
  const toast = useToast({ duration: 3000, isClosable: true });
  const { authState, authDispatch } = useAuthContext();
  const [errors, setErrors] = useState<FieldErrors>();
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  if (errors) {
    setTimeout(() => {
      setErrors([]);
    }, 5000);
  }

  return (
    <AuthTemplate isLogin={false}>
      <Box height="fit-content">
        <Formik<RegisterCredentials>
          initialValues={{
            email: "",
            username: "",
            password: "",
          }}
          onSubmit={async (credentials) => {
            const error = await registerUser(credentials, authDispatch, toast);
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
                      <FormLabel fontSize="11px" fontWeight="">
                        Full name
                      </FormLabel>

                      <InputGroup>
                        <InputLeftElement
                          pointerEvents="none"
                          children={
                            <Box color="rgb(191, 208, 230)">
                              <i className="bi bi-person-fill"></i>
                            </Box>
                          }
                        />

                        <Input {...field} rounded="lg" placeholder="John Doe" />
                      </InputGroup>

                      <Text textColor={"red.400"}>
                        {
                          errors?.find((err) => err.field === "username")
                            ?.message
                        }
                      </Text>
                    </>
                  )}
                </Field>

                <Field id="email" name="email">
                  {({ field, form }: FieldAttributes<any>) => (
                    <>
                      <FormLabel fontSize="11px" mt={6} fontWeight="">
                        Email
                      </FormLabel>

                      <InputGroup>
                        <InputLeftElement
                          pointerEvents="none"
                          children={<EmailIcon color="rgb(191, 208, 230)" />}
                        />

                        <Input
                          {...field}
                          rounded="lg"
                          type="email"
                          placeholder="example@site.com"
                        />
                      </InputGroup>

                      <Text textColor="red.400">
                        {
                          errors?.find((err) => err.field === "password")
                            ?.message
                        }
                      </Text>
                    </>
                  )}
                </Field>

                <Field id="password" name="password">
                  {({ field, form }: FieldAttributes<any>) => (
                    <>
                      <FormLabel fontSize="11px" mt={6} fontWeight="">
                        Password
                      </FormLabel>

                      <InputGroup>
                        <InputLeftElement
                          pointerEvents="none"
                          children={<UnlockIcon color="rgb(191, 208, 230)" />}
                        />

                        <Input
                          {...field}
                          rounded="lg"
                          type={show ? "text" : "password"}
                          placeholder="Minimum 8 characters"
                        />

                        <InputRightElement
                          mr="5"
                          width="fit-content"
                          children={
                            <Center
                              flexGrow="1"
                              fontSize="12px"
                              cursor="pointer"
                              color="linkColor"
                              onClick={() => setShow(!show)}
                            >
                              {show ? "Hide" : "Show"}
                            </Center>
                          }
                        />
                      </InputGroup>

                      <Text textColor="red.400">
                        {
                          errors?.find((err) => err.field === "password")
                            ?.message
                        }
                      </Text>
                    </>
                  )}
                </Field>

                <Box pt="3">
                  <Button
                    mb="1"
                    mt="6"
                    shadow="md"
                    width="100%"
                    type="submit"
                    color="white"
                    bgColor="submitBtn.100"
                    isLoading={props.isSubmitting}
                    _hover={{ bgColor: "submitBtn.200" }}
                  >
                    Submit
                  </Button>
                </Box>

                <Center mt="4" fontSize="small" color="linkColor">
                  <Box cursor="not-allowed">or login with SSO</Box>
                </Center>
              </FormControl>
            </Form>
          )}
        </Formik>
      </Box>
    </AuthTemplate>
  );
}
