import * as React from "react";
import {
  Center,
  ChakraProvider,
  Grid,
  GridItem,
  theme,
} from "@chakra-ui/react";
import Header from "./component/layout/Header";
import useInit from "./hook/useInit";
import PageRoute from "./routes/PageRoute";
import NavBar from "./component/layout/NavBar";

export default function App() {
  useInit();

  return (
    <ChakraProvider theme={theme}>
      <Grid
        templateAreas={`"header header"
                  "nav main"
                  "nav main"`}
        gridTemplateRows={"50px 1fr 30px"}
        gridTemplateColumns={"150px 1fr"}
        gap="1"
      >
        <GridItem area={"header"}>
          <Header />
        </GridItem>

        <GridItem area={"nav"}>
          <NavBar />
        </GridItem>

        <GridItem area={"main"}>
          <PageRoute />
        </GridItem>
      </Grid>
    </ChakraProvider>
  );
}
