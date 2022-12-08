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
import { Credentials, FieldErrors } from "../../types";
import { loginUser } from "./actions/loginUser";
import AuthTemplate from "./AuthTemplate";
import LoginSVG from "./LoginSVG";

type Props = {};

export default memo(Login);
function Login({}: Props) {
  const toast = useToast({ duration: 3000, isClosable: true });
  const { authState, authDispatch } = useAuthContext();
  const [errors, setErrors] = useState<FieldErrors>();
  const navigate = useNavigate();

  const svgString = encodeURIComponent(
    ReactDOMServer.renderToStaticMarkup(<LoginSVG />)
  );

  return (
    <AuthTemplate isLogin={true}>
      <Box height="fit-content">
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
                      <FormLabel fontSize="11px" fontWeight="">
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
                          placeholder="Enter your email"
                        />
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
