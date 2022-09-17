import { Box, Flex } from "@chakra-ui/react";
import Header from "./component/layout/Header";
import NavBar from "./component/layout/NavBar";
import useInit from "./hook/useInit";
import PageRoute from "./routes/PageRoute";

export default function App() {
  useInit();

  return (
    <Flex height="100vh">
      <NavBar />
      <Box width={"100%"}>
        <Header />
        <PageRoute />
      </Box>
    </Flex>
  );
}
