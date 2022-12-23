import { Box, Flex } from "@chakra-ui/react";
import { memo, useState } from "react";
import Header from "./component/layout/Header";
import NavBar from "./component/layout/NavBar";
import TeamStateProvider from "./context/team/TeamContext";
import MainContent from "./routes/MainContent";

type Props = {};

export enum Section {
  HOME = "home",
  TASKS = "tasks",
  DEV = "dev",
}

export default memo(ApplicationEntry);
function ApplicationEntry({}: Props) {
  const [selectedSection, setSelectedSection] = useState<Section>(Section.HOME);

  // https://github.com/chakra-ui/chakra-ui/issues/4109#issuecomment-1306875968
  return (
    <Flex height="100vh" position="relative" overflow="hidden">
      <TeamStateProvider>
        <NavBar
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
        />
      </TeamStateProvider>

      {/* Header && Main */}
      <Flex
        width="100%"
        height="100%"
        flexDir="column"
        overflow="hidden" // https://stackoverflow.com/a/1767270/16648127
      >
        <Box role="heading">
          <Header
            selectedSection={selectedSection}
            setSelectedSection={setSelectedSection}
          />
        </Box>

        {/* Main content */}
        <Box role="main" flexGrow="1">
          <MainContent />
        </Box>
      </Flex>
    </Flex>
  );
}
