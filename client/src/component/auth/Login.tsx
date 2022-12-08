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
  useToast,
} from "@chakra-ui/react";
import { Field, FieldAttributes, Form, Formik } from "formik";
import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { CLIENT_ROUTE } from "../../constant";
import useAuthContext from "../../context/auth/useAuthContext";
import { FieldErrors, LoginCredentials } from "../../types";
import { loginUser } from "./actions/loginUser";
import AuthTemplate from "./AuthTemplate";

type Props = {};

export default memo(Login);
function Login({}: Props) {
  const toast = useToast({ duration: 3000, isClosable: true });
  const { authState, authDispatch } = useAuthContext();
  const navigate = useNavigate();

  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .email("This email is not valid!")
      .required("Email Required"),
    password: Yup.string().required("Password Required"),
  });

  return (
    <AuthTemplate isLogin={true}>
      <Box height="fit-content">
        <Formik<LoginCredentials>
          validationSchema={loginSchema}
          initialValues={{
            email: "",
            password: "",
          }}
          onSubmit={async (loginCredentials, { setErrors }) => {
            const error = await loginUser(
              loginCredentials,
              authDispatch,
              toast
            );

            if (error === undefined) navigate(CLIENT_ROUTE.HOME);
            if (error) setErrors({});
          }}
        >
          {({ isSubmitting, touched, errors }) => (
            <Form>
              {/* https://chakra-ui.com/docs/components/form-control/usage#usage-with-form-libraries */}
              <FormControl mt={3}>
                {/* Username */}
                <Field id="email" name="email">
                  {({ field, form }: FieldAttributes<any>) => (
                    <>
                      <FormLabel fontSize="11px" fontWeight="">
                        Email
                      </FormLabel>

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
