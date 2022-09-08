import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import React from "react";
import useGlobalContext, { updateGlobalState } from "../hook/useGlobalContext";

type Props = {};

export default function Home({}: Props) {
  const { state, dispatch } = useGlobalContext();

  return (
    <>
      <Box textAlign="center" fontSize="xl" p={3}>
        <VStack spacing={3}>
          <Text>Home page</Text>
          <Link color="teal.500" href="https://chakra-ui.com">
            Chakra docs
          </Link>

          <Text>State: {state.attr}</Text>

          {/* Formik docs example: https://formik.org/docs/examples/basic */}
          <Formik
            initialValues={{
              attr: "",
            }}
            onSubmit={async ({ attr }) => {
              return updateGlobalState(attr, dispatch);
            }}
          >
            <Form>
              <VStack spacing={3}>
                <label>update state: </label>
                <Field id="attr" name="attr" />

                <button type="submit">Submit</button>
              </VStack>
            </Form>
          </Formik>
        </VStack>
      </Box>
    </>
  );
}
