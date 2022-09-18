import { Box, Button, Collapse, Flex, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import Header from "./component/layout/Header";
import NavBar from "./component/layout/NavBar";
import useInit from "./hook/useInit";
import PageRoute from "./routes/PageRoute";
import { motion } from "framer-motion";

export default function App() {
  useInit();
  const { getDisclosureProps, isOpen, onToggle } = useDisclosure();
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
          top: "0",
          right: "0",
          height: "100vh",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        <NavBar onToggle={onToggle} />
      </motion.div>

      {/* Header & Main */}
      <Box width={"100%"}>
        <Header isOpen={isOpen} onToggle={onToggle} />
        <PageRoute />
      </Box>
    </Flex>
  );
}
