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
import { ROUTE } from "../../utils/constant";

type Props = {
  onToggle: (props?: any) => any;
};

export default function NavBar({ onToggle }: Props) {
  const navigate = useNavigate();

  return (
    <Box height={"full"} borderRight={"1px"} borderColor={"teal.400"}>
      <Flex my={1}>
        {/* App icon */}
        <Center py={3}>
          <Heading size="md" px={5}>
            <Box cursor={"pointer"} onClick={() => navigate(ROUTE.HOME)}>
              <i className="bi bi-lightbulb" style={{ marginRight: 6 }}></i>
              Ideas
            </Box>
          </Heading>
        </Center>

        {/* Close menu icon */}
        <Center cursor={"pointer"} onClick={() => onToggle()} ml={6}>
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
        cursor={"pointer"}
        _hover={{
          color: "black",
          bg: "gray.300",
        }}
        onClick={() => navigate(ROUTE.HOME)}
      >
        <i className="bi bi-house" style={{ marginRight: 6 }}></i>
        Home
      </Box>

      {/* Functionality ONE */}
      <Box
        py={1}
        px={5}
        borderRadius={3}
        cursor={"pointer"}
        _hover={{
          color: "black",
          bg: "gray.300",
        }}
        onClick={() => navigate(ROUTE.FUNC_ONE)}
      >
        <i className="bi bi-hand-index-thumb" style={{ marginRight: 6 }}></i>
        Drag and Drop
      </Box>

      {/* Functionality TWO */}
      <Box
        py={1}
        px={5}
        borderRadius={3}
        cursor={"pointer"}
        _hover={{
          color: "black",
          bg: "gray.300",
        }}
        onClick={() => navigate(ROUTE.FUNC_TWO)}
      >
        <i className="bi bi-question-circle" style={{ marginRight: 6 }}></i>
        Functionality 2
      </Box>
    </Box>
  );
}
