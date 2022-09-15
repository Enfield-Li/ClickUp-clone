import { Box, Button, Link, Text, VStack } from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import useGlobalContext, { popUpError } from "../hook/useGlobalContext";
import ToastButton from "./ToastButton";

type Props = {};

export default function Home({}: Props) {
  const { globalState, globalDispatch } = useGlobalContext();

  return (
    <>
      <Box textAlign="center" fontSize="xl" p={3}>
        <VStack spacing={3}>
          <Text>Home page</Text>
          <Link color="teal.500" href="https://chakra-ui.com">
            Chakra docs
          </Link>

          <ToastButton
            text="Show error"
            description="Some custom error here"
            duration={3000}
            isClosable={true}
            status="error"
            title="Custom title"
          />

          <Button onClick={() => popUpError("Error example", globalDispatch)}>
            popUpError
          </Button>

          <Text>State: {globalState.error}</Text>

          {/* Formik docs example: https://formik.org/docs/examples/basic */}
          <Formik
            initialValues={{
              attr: "",
            }}
            onSubmit={async ({ attr }) => {
              return popUpError(attr, globalDispatch);
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
