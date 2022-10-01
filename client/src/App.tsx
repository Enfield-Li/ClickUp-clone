import { Box, Button, Collapse, Flex, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import Header from "./component/layout/Header";
import NavBar from "./component/layout/NavBar";
import useInit from "./hook/useInit";
import PageRoute from "./routes/PageRoute";
import { motion } from "framer-motion";

export default function App() {
  useInit();
  const { getDisclosureProps, isOpen, onToggle } = useDisclosure({
    defaultIsOpen: true,
  });
  const [hidden, setHidden] = useState(!isOpen);

  return (
    <Flex height="100vh">
      {/* NavBar */}
      {/* https://chakra-ui.com/community/recipes/horizontal-collapse */}
      <motion.div
        transition={"none"}
        {...getDisclosureProps()}
        hidden={hidden}
        initial={false}
        onAnimationStart={() => setHidden(false)}
        onAnimationComplete={() => setHidden(!isOpen)}
        animate={{ width: isOpen ? 220 : 0 }}
        style={{
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        <NavBar onToggle={onToggle} />
      </motion.div>

      {/* Header & Main */}
      <Box
        width={"100%"}
        // https://stackoverflow.com/a/1767270/16648127https://stackoverflow.com/a/1767270/16648127
        overflow="hidden"
      >
        <Header isOpen={isOpen} onToggle={onToggle} />
        <PageRoute />
      </Box>
    </Flex>
  );
}
