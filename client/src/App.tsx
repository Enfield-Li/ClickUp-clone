import * as React from "react";
import {
  Box,
  Center,
  ChakraProvider,
  Collapse,
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
    <ChakraProvider theme={theme}>
      <Grid
        templateAreas={`"nav header"
                  "nav main"
                  "nav main"`}
        gridTemplateRows={"50px 1fr 30px"}
        gridTemplateColumns={"150px 1fr"}
        gap="1"
      >
        <GridItem area={"header"}>
          <Header />
        </GridItem>

        {/* <Box as={Slide} in={openNav} w="100%" direction="left"> */}
        <GridItem area={"nav"}>
          <NavBar />
        </GridItem>
        {/* </Box> */}

        <GridItem area={"main"}>
          <PageRoute />
        </GridItem>
      </Grid>
    </ChakraProvider>
  );
}
