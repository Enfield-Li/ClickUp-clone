import { Box, Flex, Heading, Spacer } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";
import { ROUTE } from "../../utils/constant";

type Props = {};

export default function NavBar({}: Props) {
  return (
    <>
      <Heading size="md" alignItems="center" my={4} ml={3}>
        <Flex justifyContent={"space-between"}>
          <Link to={ROUTE.HOME}>
            <i className="bi bi-lightbulb"></i> Ideas
          </Link>
          <Box
            borderRadius={3}
            _hover={{
              background: "rgb(51, 88, 119)",
            }}
          ></Box>
        </Flex>
      </Heading>

      <Box
        my={2}
        pl={3}
        borderRadius={3}
        _hover={{
          background: "rgb(51, 88, 119)",
        }}
      >
        <i className="bi bi-house" style={{ marginRight: 6 }}></i>
        <Link to={ROUTE.HOME}>Home</Link>
      </Box>

      <Box
        my={2}
        pl={3}
        borderRadius={3}
        _hover={{
          background: "rgb(51, 88, 119)",
        }}
      >
        <i className="bi bi-hand-index-thumb" style={{ marginRight: 6 }}></i>
        <Link to={ROUTE.FUNC_ONE}>Drag and Drop</Link>
      </Box>

      <Box
        my={2}
        pl={3}
        borderRadius={3}
        _hover={{
          background: "rgb(51, 88, 119)",
        }}
      >
        <i className="bi bi-question-circle" style={{ marginRight: 6 }}></i>
        <Link to={ROUTE.FUNC_TWO}>Functionality 2</Link>
      </Box>
    </>
  );
}
