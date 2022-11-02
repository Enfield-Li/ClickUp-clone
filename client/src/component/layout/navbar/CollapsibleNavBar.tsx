import {
  Box,
  Center,
  Flex,
  Heading,
  Spacer,
  useMediaQuery,
} from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { CLIENT_ROUTE } from "../../../utils/constant";

type Props = {
  isOpen: boolean;
  onToggle: (props?: any) => any;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CollapsibleNavBar({
  onToggle,
  isOpen,
  setIsExpanded,
}: Props) {
  const navigate = useNavigate();

  return (
    <Box height="100vh" borderRight="1px" borderColor="teal.400">
      <Flex my={1}>
        {/* App icon */}
        <Center py={3}>
          <Heading size="md" px={5}>
            <Box cursor={"pointer"} onClick={() => navigate(CLIENT_ROUTE.HOME)}>
              Ideas
            </Box>
          </Heading>
        </Center>

        {/* Close menu icon */}
        <Center
          cursor="pointer"
          onClick={() => {
            onToggle();
            setIsExpanded(false);
          }}
          ml={6}
        >
          <Box
            py={1}
            px={2}
            _hover={{
              color: "black",
              bg: "gray.300",
            }}
            borderRadius={"md"}
          >
            <i className="bi bi-chevron-bar-left"></i>
          </Box>
        </Center>
      </Flex>

      {/* Home */}
      <Box
        py={1}
        px={5}
        borderRadius={3}
        cursor="pointer"
        _hover={{
          color: "black",
          bg: "gray.300",
        }}
        onClick={() => navigate(CLIENT_ROUTE.HOME)}
      >
        <i className="bi bi-house" style={{ marginRight: 6 }}></i>
        Home
      </Box>

      {/* Functionality ONE */}
      <Box
        py={1}
        px={5}
        borderRadius={3}
        cursor="pointer"
        _hover={{
          color: "black",
          bg: "gray.300",
        }}
        onClick={() => navigate(CLIENT_ROUTE.TASK)}
      >
        <i className="bi bi-hand-index-thumb" style={{ marginRight: 6 }}></i>
        Drag and Drop
      </Box>

      {/* Functionality TWO */}
      <Box
        py={1}
        px={5}
        borderRadius={3}
        cursor="pointer"
        _hover={{
          color: "black",
          bg: "gray.300",
        }}
        onClick={() => navigate(CLIENT_ROUTE.FUNC_TWO)}
      >
        <i className="bi bi-question-circle" style={{ marginRight: 6 }}></i>
        Functionality 2
      </Box>
    </Box>
  );
}
