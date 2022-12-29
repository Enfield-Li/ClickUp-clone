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
import { useLocation } from "react-router-dom";
import * as Yup from "yup";
import { ACCESS_TOKEN } from "../../constant";
import useAuthContext from "../../context/auth/useAuthContext";
import { getRandomSpaceColor } from "../../media/colors";
import { registerUser } from "../../networkCalls";
import { AUTH_ACTION, FieldErrors, RegisterUserDTO } from "../../types";
import AuthTemplate from "./AuthTemplate";

type Props = {};

export default memo(Register);
function Register({}: Props) {
  const location = useLocation();
  const [show, setShow] = useState(false);
  const { authDispatch } = useAuthContext();
  const initialEmail = location.state?.email ? location.state?.email : "";

  const signupSchema = Yup.object().shape({
    username: Yup.string()
      .min(4, "Username should be at least 4 characters long!")
      .max(50, "Too Long!")
      .required("Username Required"),
    password: Yup.string()
      .min(8, "Password must be 8 characters or longer!")
      .max(50, "Too Long! 50 max")
      .required("Password Required"),
    email: Yup.string()
      .email("This email is not valid!")
      .required("Email Required"),
  });

  function handleError(
    setErrors: (errors: FormikErrors<RegisterUserDTO>) => void,
    errors: FieldErrors
  ) {
    errors.forEach((error) => {
      if (error.field === "email") {
        setErrors({ email: error.message });
      }
    });
  }

  return (
    <AuthTemplate isLogin={false}>
      <Box height="fit-content">
        <Formik<RegisterUserDTO>
          validationSchema={signupSchema}
          initialValues={{
            email: initialEmail,
            username: "",
            password: "",
            color: getRandomSpaceColor(),
          }}
          onSubmit={async (registerUserDTO, { setErrors }) => {
            await registerUser(
              registerUserDTO,
              (data) => {
                // store accessToken to localStorage
                localStorage.setItem(ACCESS_TOKEN, data.accessToken);

                // update auth taskState
                authDispatch({
                  type: AUTH_ACTION.REGISTER_USER,
                  payload: { user: data },
                });
              },
              (errors) => {
                localStorage.removeItem(ACCESS_TOKEN);
                authDispatch({ type: AUTH_ACTION.LOGOUT_USER });
                handleError(setErrors, errors);
              }
            );
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              {/* https://chakra-ui.com/docs/components/form-control/usage#usage-with-form-libraries */}
              <FormControl mt={3}>
                {/* Username */}
                <Field id="username" name="username">
                  {({ field, form }: FieldAttributes<any>) => (
                    <>
                      <FormLabel fontSize="12px" fontWeight="normal">
                        Username
                      </FormLabel>

                      {/* Input */}
                      <InputGroup
                        border={
                          errors.username && touched.username ? "red" : ""
                        }
                      >
                        <InputLeftElement
                          pointerEvents="none"
                          children={
                            <Box color="rgb(191, 208, 230)">
                              <i className="bi bi-person-fill"></i>
                            </Box>
                          }
                        />

                        <Input
                          {...field}
                          autoFocus
                          rounded="lg"
                          placeholder="John Doe"
                        />
                      </InputGroup>

                      {/* Error */}
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

                {/* Email */}
                <Field id="email" name="email">
                  {({ field, form }: FieldAttributes<any>) => (
                    <>
                      <FormLabel fontSize="12px" mt={4} fontWeight="normal">
                        Email
                      </FormLabel>

                      {/* Input */}
                      <InputGroup
                        border={errors.email && touched.email ? "red" : ""}
                      >
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

                      {/* Error */}
                      <Box height="10px" fontSize="12px" color="red" ml="2">
                        {errors.email && touched.email && (
                          <Box>
                            <i className="bi bi-exclamation-triangle-fill"></i>
                            <span>&nbsp;</span>
                            {errors.email}
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
                      <FormLabel fontSize="12px" mt={4} fontWeight="normal">
                        Choose Password
                      </FormLabel>

                      {/* Input */}
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
                          pr="60px"
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

                      {/* Error */}
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

                {/* Submit button */}
                <Box pt="3">
                  <Button
                    mb="1"
                    mt="4"
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
                </Box>

                <Center mt="4" fontSize="small" color="linkColor">
                  <Box cursor="not-allowed">or sign up with SSO</Box>
                </Center>
              </FormControl>
            </Form>
          )}
        </Formik>
      </Box>
    </AuthTemplate>
  );
}
