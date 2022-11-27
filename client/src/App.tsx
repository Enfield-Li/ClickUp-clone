import { Box, Flex } from "@chakra-ui/react";
import Header from "./component/layout/Header";
import NavBar from "./component/layout/NavBar";
import useTaskDetailContext from "./context/task_detail/useTaskDetailContext";
import useInit from "./hook/useInit";
import PageRoute from "./routes/PageRoute";

export default function App() {
  useInit();

  return (
    // https://github.com/chakra-ui/chakra-ui/issues/4109#issuecomment-1306875968
    <Flex height="100vh" position="relative" overflow="hidden">
      <NavBar />

      {/* Header && Main */}
      <Box
        width={"100%"}
        overflow="hidden" // https://stackoverflow.com/a/1767270/16648127
      >
        <Box role="heading">
          <Header />
        </Box>

        {/* Main content */}
        <Box role="main">
          <PageRoute />
        </Box>
      </Box>
    </Flex>
  );
}
