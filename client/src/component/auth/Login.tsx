import { VStack } from "@chakra-ui/react";
import { Formik, FormikHelpers, Form, Field } from "formik";
import React from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../../context/auth/AuthContextTypes";
import useAuthContext, { logInUser } from "../../hook/useAuthContext";

type Props = {};

export default function Login({}: Props) {
  const { authState, authDispatch } = useAuthContext();
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{
        username: "",
        password: "",
      }}
      onSubmit={(credential: User, { setSubmitting }: FormikHelpers<User>) => {
        logInUser(credential, authDispatch);
        navigate("/");
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
