import {
  Box,
  Center,
  Flex,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import Header from "./component/layout/Header";
import ToggleNavBar from "./component/layout/ToggleNavBar";
import useInit from "./hook/useInit";
import PageRoute from "./routes/PageRoute";

export default function App() {
  useInit();

  const collapsibleBG = useColorModeValue("white", "rgb(26, 32, 44)");

  const [isExpanded, setIsExpanded] = useState(false);
  const { getDisclosureProps, isOpen, onToggle, onClose, onOpen } =
    useDisclosure({
      defaultIsOpen: false,
    });

  return (
    <Flex height="100vh" position="relative" bottom="5px">
      {/* NavBar */}
      <Flex
        onMouseOverCapture={onOpen}
        onMouseOutCapture={!isExpanded ? onClose : undefined}
      >
        {/* Fixed navbar */}
        <Box width="45px" borderRight={"1px"} borderColor={"teal.300"}>
          {!isExpanded && (
            <Center
              cursor="pointer"
              onClick={() => {
                onOpen();
                setIsExpanded(true);
              }}
            >
              <Center
                ml="45px"
                mt="70px"
                zIndex="99"
                width="20px"
                height="20px"
                color="white"
                rounded="full"
                fontSize="10px"
                position="absolute"
                backgroundColor="rgb(91, 67, 234)"
              >
                <i className="bi bi-chevron-right"></i>
              </Center>
            </Center>
          )}
        </Box>

        {/* Collapsible navbar */}
        <Box
          zIndex="2"
          opacity="100%"
          backgroundColor={collapsibleBG}
          ml={!isExpanded ? "45px" : undefined}
          position={!isExpanded ? "absolute" : undefined}
        >
          <ToggleNavBar
            isOpen={isOpen}
            onToggle={onToggle}
            setIsExpanded={setIsExpanded}
            getDisclosureProps={getDisclosureProps}
          />
        </Box>
      </Flex>

      {/* Header & Main */}
      <Box
        width={"100%"}
        overflow="hidden" // https://stackoverflow.com/a/1767270/16648127
      >
        {/* Header */}
        <Header />

        {/* Main content */}
        <PageRoute />
      </Box>
    </Flex>
  );
}
