import * as React from "react";
import {
  Box,
  Center,
  ChakraProvider,
  Collapse,
  Flex,
  Grid,
  GridItem,
  Slide,
  theme,
} from "@chakra-ui/react";
import Header from "./component/layout/Header";
import useInit from "./hook/useInit";
import PageRoute from "./routes/PageRoute";
import NavBar from "./component/layout/NavBar";
import { useState } from "react";

export default function App() {
  useInit();

  return (
    <Flex height="100vh">
      <NavBar />
      <Box width={"100%"}>
        <Header />
        <PageRoute />
      </Box>
    </Flex>
    // <Grid
    //   height="100vh"
    //   borderColor={"teal.300"}
    //   templateAreas={`"nav header"
    //               "nav main"
    //               "nav main"`}
    //   gridTemplateRows={"50px 1fr 30px"}
    //   gridTemplateColumns={"150px 1fr"}
    // >
    //   <GridItem area={"header"}>
    //     <Header />
    //   </GridItem>

    //   <GridItem area={"nav"}>
    //     <NavBar />
    //   </GridItem>

    //   <GridItem area={"main"}>
    //     <PageRoute />
    //   </GridItem>
    // </Grid>
  );
}
