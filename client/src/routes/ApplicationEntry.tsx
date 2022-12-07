import { Flex, Box } from "@chakra-ui/react";
import Header from "../component/layout/Header";
import NavBar from "../component/layout/NavBar";
import MainContent from "./MainContent";

type Props = {};

export default function ApplicationEntry({}: Props) {
  // https://github.com/chakra-ui/chakra-ui/issues/4109#issuecomment-1306875968
  return (
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
          <MainContent />
        </Box>
      </Box>
    </Flex>
  );
}
