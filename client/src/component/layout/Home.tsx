import { Box, Button, Link, Text, VStack } from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import useGlobalContext, {
  indicateLoading,
  popUpError,
} from "../../hook/useGlobalContext";
import ToastButton from "../custom/ToastButton";

type Props = {};

export default function Home({}: Props) {
  const { globalState, globalDispatch } = useGlobalContext();

  return (
    <>
      <Box textAlign="center" fontSize="xl" p={3}>
        <VStack spacing={3}>
          <Text>Home page</Text>

          {/* Link to Chakra docs */}
          <Link color="teal.500" href="https://chakra-ui.com">
            Chakra docs
          </Link>

          {/* Button to manually trigger network error response */}
          <Button onClick={() => popUpError("Error example", globalDispatch)}>
            Trigger network error
          </Button>

          {/* Button to manually trigger network loading state */}
          <Button
            onClick={() =>
              indicateLoading(!globalState.loading, globalDispatch)
            }
          >
            Trigger network loading
          </Button>

          <Text>State: {globalState.error}</Text>

          {/* 
            Form to test formik
            Formik docs example: https://formik.org/docs/examples/basic 
          */}
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
