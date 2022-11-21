import { Box, Flex } from "@chakra-ui/react";
import Header from "./component/layout/Header";
import NavBar from "./component/layout/NavBar";
import useInit from "./hook/useInit";
import PageRoute from "./routes/PageRoute";

export default function App() {
  useInit();

  return (
    // https://github.com/chakra-ui/chakra-ui/issues/4109#issuecomment-1306875968
    <Flex height="100vh" position="relative" overflow="hidden">
      <NavBar />

      {/* Header && Main */}
      <Box
        width={"100%"}
        overflow="hidden"
        // https://stackoverflow.com/a/1767270/16648127
      >
        <Header />

        {/* Main content */}
        <PageRoute />
      </Box>
    </Flex>
  );
}

// import { useState } from "react";

// function App() {
//   const [count, setCount] = useState(0);
//   return (
//     <div className="App">
//       <p>count is:</p>
//       {count}
//       <button type="button" onClick={() => setCount((count) => count + 1)}>
//         Increase
//       </button>
//     </div>
//   );
// }

// export default App;
