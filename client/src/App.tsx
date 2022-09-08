import * as React from "react";
import { ChakraProvider, theme } from "@chakra-ui/react";
import NavBar from "./component/NavBar";
import useInit from "./hook/useInit";
import PageRoute from "./routes/PageRoute";

export default function App() {
  useInit();

  return (
    <ChakraProvider theme={theme}>
      <NavBar />
      <PageRoute />
    </ChakraProvider>
  );
}
