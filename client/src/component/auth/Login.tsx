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
import { Form, Field, FieldAttributes, Formik } from "formik";
import { memo, useState } from "react";
import * as ReactDOMServer from "react-dom/server";
import { useNavigate } from "react-router-dom";
import { CLIENT_ROUTE } from "../../constant";
import useAuthContext from "../../context/auth/useAuthContext";
import { LoginCredentials, FieldErrors } from "../../types";
import { loginUser } from "./actions/loginUser";
import AuthTemplate from "./AuthTemplate";
import LoginSVG from "./LoginSVG";
import * as Yup from "yup";

type Props = {};

export default memo(Login);
function Login({}: Props) {
  const toast = useToast({ duration: 3000, isClosable: true });
  const { authState, authDispatch } = useAuthContext();
  const [errors, setErrors] = useState<FieldErrors>();
  const navigate = useNavigate();

  const loginSchema = Yup.object().shape({
    username: Yup.string()
      .min(4, "Username should be at least 4 characters long")
      .max(50, "Too Long!")
      .required("Username Required"),
    password: Yup.string()
      .min(8, "Password must be 8 characters or longer!")
      .max(50, "Too Long! 50 max")
      .required("Password Required"),
  });

  return (
    <AuthTemplate isLogin={true}>
      <Box height="fit-content">
        <Formik<LoginCredentials>
          validationSchema={loginSchema}
          initialValues={{
            username: "",
            password: "",
          }}
          onSubmit={async (loginCredentials) => {
            const error = await loginUser(
              loginCredentials,
              authDispatch,
              toast
            );

            if (error === undefined) navigate(CLIENT_ROUTE.HOME);
            if (error) setErrors(error);
          }}
        >
          {({ isSubmitting, touched, errors }) => (
            <Form>
              {/* https://chakra-ui.com/docs/components/form-control/usage#usage-with-form-libraries */}
              <FormControl mt={3}>
                {/* Username */}
                <Field id="username" name="username">
                  {({ field, form }: FieldAttributes<any>) => (
                    <>
                      <FormLabel fontSize="11px" fontWeight="">
                        Email
                      </FormLabel>

                      <InputGroup
                        border={
                          errors.username && touched.username ? "red" : ""
                        }
                      >
                        <InputLeftElement
                          pointerEvents="none"
                          children={<EmailIcon color="rgb(191, 208, 230)" />}
                        />
                        <Input
                          {...field}
                          autoFocus
                          rounded="lg"
                          placeholder="Enter your email"
                        />
                      </InputGroup>

                      <Box height="10px" fontSize="12px" color="red" ml="2">
                        {errors.username && touched.username && (
                          <Box>
                            <i className="bi bi-exclamation-triangle-fill"></i>
                            <span>&nbsp;</span>
                            {errors.username}
                          </Box>
                        )}
                      </Box>
                    </>
                  )}
                </Field>

                {/* Password */}
                <Field id="password" name="password">
                  {({ field, form }: FieldAttributes<any>) => (
                    <>
                      <FormLabel fontSize="11px" mt={4} fontWeight="">
                        Password
                      </FormLabel>

                      <InputGroup
                        border={
                          errors.password && touched.password ? "red" : ""
                        }
                      >
                        <InputLeftElement
                          pointerEvents="none"
                          children={<UnlockIcon color="rgb(191, 208, 230)" />}
                        />
                        <Input
                          {...field}
                          rounded="lg"
                          type="password"
                          placeholder="Enter password"
                        />
                        <InputRightElement
                          mr="4"
                          width="fit-content"
                          children={
                            <Center
                              flexGrow="1"
                              fontSize="12px"
                              color="linkColor"
                              cursor="not-allowed"
                            >
                              Forgot Password?
                            </Center>
                          }
                        />
                      </InputGroup>

                      <Box height="10px" fontSize="12px" color="red" ml="2">
                        {errors.password && touched.password && (
                          <Box>
                            <i className="bi bi-exclamation-triangle-fill"></i>
                            <span>&nbsp;</span>
                            {errors.password}
                          </Box>
                        )}
                      </Box>
                    </>
                  )}
                </Field>

                <Box pt="3">
                  <Button
                    mt="6"
                    shadow="md"
                    width="100%"
                    type="submit"
                    color="white"
                    bgColor="submitBtn.100"
                    isLoading={isSubmitting}
                    _hover={{ bgColor: "submitBtn.200" }}
                  >
                    Submit
                  </Button>
                </Box>

                <Center mt="4" mb="1" fontSize="small" color="linkColor">
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
