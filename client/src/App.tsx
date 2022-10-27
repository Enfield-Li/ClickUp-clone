import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import Header from "./component/layout/Header";
import ToggleNavBar from "./component/layout/ToggleNavBar";
import useInit from "./hook/useInit";
import PageRoute from "./routes/PageRoute";

export default function App() {
  useInit();
  const { getDisclosureProps, isOpen, onToggle } = useDisclosure({
    defaultIsOpen: false,
  });

  return (
    <Flex height="100vh">
      {/* NavBar */}
      <ToggleNavBar
        isOpen={isOpen}
        onToggle={onToggle}
        getDisclosureProps={getDisclosureProps}
      />

      {/* Header & Main */}
      <Box
        width={"100%"}
        // https://stackoverflow.com/a/1767270/16648127
        overflow="hidden"
      >
        <Header isOpen={isOpen} onToggle={onToggle} />
        <PageRoute />
      </Box>
    </Flex>
  );
}
