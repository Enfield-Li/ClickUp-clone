import { Box, Flex, Heading, Spacer } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { ROUTE } from "../../utils/constant";

type Props = {};

export default function NavBar({}: Props) {
  const navigate = useNavigate();

  return (
    <Box borderRight={"1px"} borderColor={"teal.400"} height={"full"}>
      <Heading size="md" alignItems="center" my={4} ml={3}>
        <Box cursor={"pointer"} onClick={() => navigate(ROUTE.HOME)}>
          <i className="bi bi-lightbulb" style={{ marginRight: 6 }}></i>
          Ideas
        </Box>
      </Heading>

      {/* Home */}
      <Box
        my={2}
        pl={3}
        borderRadius={3}
        cursor={"pointer"}
        _hover={{
          color: "black",
          bg: "gray.400",
        }}
        onClick={() => navigate(ROUTE.HOME)}
      >
        <i className="bi bi-house" style={{ marginRight: 6 }}></i>
        Home
      </Box>

      {/* Functionality ONE */}
      <Box
        my={2}
        pl={3}
        borderRadius={3}
        cursor={"pointer"}
        _hover={{
          color: "black",
          bg: "gray.400",
        }}
        onClick={() => navigate(ROUTE.FUNC_ONE)}
      >
        <i className="bi bi-hand-index-thumb" style={{ marginRight: 6 }}></i>
        Drag and Drop
      </Box>

      {/* Functionality TWO */}
      <Box
        my={2}
        pl={3}
        borderRadius={3}
        cursor={"pointer"}
        _hover={{
          color: "black",
          bg: "gray.400",
        }}
        onClick={() => navigate(ROUTE.FUNC_TWO)}
      >
        <i className="bi bi-question-circle" style={{ marginRight: 6 }}></i>
        Functionality 2
      </Box>
    </Box>
  );
}
