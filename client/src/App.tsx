import { Box, Flex } from "@chakra-ui/react";
import Header from "./component/layout/Header";
import NavBar from "./component/layout/NavBar";
import useInit from "./hook/useInit";
import PageRoute from "./routes/PageRoute";

export default function App() {
  useInit();

  return (
    <Flex height="100vh" position="relative" bottom="5px">
      <NavBar />

      {/* Header && Main */}
      <Box
        width={"100%"}
        overflow="hidden" // https://stackoverflow.com/a/1767270/16648127
      >
        <Header />

        {/* Main content */}
        <PageRoute />
      </Box>
    </Flex>
  );
}
