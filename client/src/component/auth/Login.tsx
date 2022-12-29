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
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { CLIENT_ROUTE } from "../../constant";
import useAuthContext from "../../context/auth/useAuthContext";
import { FieldErrors, LoginUserDTO } from "../../types";
import { loginUser } from "./actions/loginUser";
import AuthTemplate from "./AuthTemplate";

type Props = {};

export default memo(Login);
function Login({}: Props) {
  const navigate = useNavigate();
  const { authDispatch } = useAuthContext();

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
          initialValues={{
            email: "",
            password: "",
          }}
          onSubmit={async (loginUserDTO, { setErrors }) => {
            const errors = await loginUser(loginUserDTO, authDispatch);

            if (!errors) {
              navigate(CLIENT_ROUTE.HOME);
            } else if (errors) {
              handleError(setErrors, errors);
            }
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
                        border={errors.email && touched.email ? "red" : ""}
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
                        color="red"
                        height="10px"
                        fontSize="12px"
                        cursor="pointer"
                        onClick={() =>
                          errors.email?.includes("Email not found") &&
                          handleRegisterWithEmail(values.email)
                        }
                      >
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
                      <FormLabel fontSize="12px" fontWeight="normal" mt={4}>
                        Password
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
