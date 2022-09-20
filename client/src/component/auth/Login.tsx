import { VStack } from "@chakra-ui/react";
import { Formik, FormikHelpers, Form, Field } from "formik";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Credentials } from "../../context/auth/AuthContextTypes";
import useAuthContext, { loginUser } from "../../hook/useAuthContext";
import { ROUTE } from "../../utils/constant";

type Props = {};

export default function Login({}: Props) {
  const { authState, authDispatch } = useAuthContext();
  const navigate = useNavigate();

  return (
    <Formik<Credentials>
      initialValues={{
        username: "",
        password: "",
      }}
      onSubmit={(credential: Credentials) => {
        loginUser(credential, authDispatch);
        navigate(ROUTE.HOME);
      }}
    >
      <Form>
        <VStack spacing={3}>
          <label htmlFor="username">First Name</label>
          <Field id="username" name="username" placeholder="John" />

          <label htmlFor="password">Last Name</label>
          <Field id="password" name="password" placeholder="Doe" />

          <button type="submit">Submit</button>
        </VStack>
      </Form>
    </Formik>
  );
}
