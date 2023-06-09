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
} from "@chakra-ui/react";
import { Field, FieldAttributes, Form, Formik, FormikErrors } from "formik";
import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { ACCESS_TOKEN, CLIENT_ROUTE } from "../../constant";
import { useAuth } from "../../context/auth/useAuth";
import { login } from "../../networkCalls";
import { FieldErrors, LoginUserDTO } from "../../types";
import AuthTemplate from "./AuthTemplate";

type Props = {};

export default memo(Login);
function Login({}: Props) {
  const navigate = useNavigate();
  const { loginUser, logoutUser } = useAuth();
  const [emailError, setEmailError] = useState<string>();

  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .email("This email is not valid!")
      .required("Email Required"),
    password: Yup.string().required("Password Required"),
  });

  function handleError(
    setErrors: (errors: FormikErrors<LoginUserDTO>) => void,
    errors: FieldErrors
  ) {
    errors.forEach((error) => {
      if (error.field === "email") {
        setEmailError(error.message);
        setErrors({ email: error.message });
      } else if (error.field === "password") {
        setErrors({ password: error.message });
      }
    });
  }

  function handleRegisterWithEmail(email: string) {
    navigate(CLIENT_ROUTE.REGISTER, { state: { email } });
  }

  return (
    <AuthTemplate isLogin={true}>
      <Box height="fit-content">
        <Formik<LoginUserDTO>
          validationSchema={loginSchema}
          initialValues={{ email: "", password: "" }}
          onSubmit={async (loginUserDTO, { setErrors }) => {
            await login(
              loginUserDTO,
              (authResponse) => {
                // store accessToken to localStorage
                const { defaultTeamId, joinedTeamCount, accessToken } =
                  authResponse;
                localStorage.setItem(ACCESS_TOKEN, accessToken);

                // update auth taskState
                loginUser(authResponse);
                navigate(
                  joinedTeamCount > 0 && defaultTeamId
                    ? `/${defaultTeamId}/` + CLIENT_ROUTE.TASK_BOARD
                    : CLIENT_ROUTE.ON_BOARDING
                );
              },
              (errors) => {
                // clear local auth taskState and accessToken
                logoutUser();
                handleError(setErrors, errors);
                localStorage.removeItem(ACCESS_TOKEN);
              }
            );
          }}
        >
          {({ isSubmitting, touched, errors, values }) => (
            <Form>
              {/* https://chakra-ui.com/docs/components/form-control/usage#usage-with-form-libraries */}
              <FormControl mt={3}>
                {/* Email */}
                <Field id="email" name="email">
                  {({ field, form }: FieldAttributes<any>) => (
                    <>
                      <FormLabel fontSize="12px" fontWeight="normal">
                        Email
                      </FormLabel>

                      {/* Input */}
                      <InputGroup
                        border={errors.email && touched.email ? "red.500" : ""}
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

                      {/* Error */}
                      <Box
                        ml="2"
                        color="red.500"
                        height="10px"
                        fontSize="12px"
                        cursor="pointer"
                        onClick={() => {
                          emailError && handleRegisterWithEmail(values.email);
                        }}
                      >
                        {(emailError || errors.email) && touched.email && (
                          <Box>
                            <i className="bi bi-exclamation-triangle-fill"></i>
                            <span>&nbsp;</span>
                            {emailError || errors.email}
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
                      <FormLabel fontSize="12px" fontWeight="normal" mt={4}>
                        Password
                      </FormLabel>

                      {/* Input */}
                      <InputGroup
                        border={
                          errors.password && touched.password ? "red.500" : ""
                        }
                      >
                        <InputLeftElement
                          pointerEvents="none"
                          children={<UnlockIcon color="rgb(191, 208, 230)" />}
                        />
                        <Input
                          {...field}
                          pr="115px"
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

                      {/* Error */}
                      <Box height="10px" fontSize="12px" color="red.500" ml="2">
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

                {/* Submit button */}
                <Button
                  mt="6"
                  shadow="md"
                  width="100%"
                  type="submit"
                  color="white"
                  bgColor="customBlue.200"
                  isLoading={isSubmitting}
                  _hover={{ bgColor: "customBlue.100" }}
                  _active={{}}
                  _focus={{}}
                >
                  Submit
                </Button>

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
