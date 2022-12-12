import { Flex, Box } from "@chakra-ui/react";
import { memo, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../component/layout/Header";
import NavBar from "../component/layout/NavBar";
import TeamStateProvider from "../context/team/TeamContext";
import MainContent from "./MainContent";

type Props = {};

export enum Section {
  HOME = "home",
  TASKS = "tasks",
  DEV = "dev",
}

export default memo(ApplicationEntry);
function ApplicationEntry({}: Props) {
  const [currentSection, setCurrentSection] = useState<Section>(Section.HOME);

  // https://github.com/chakra-ui/chakra-ui/issues/4109#issuecomment-1306875968
  return (
    <Flex height="100vh" position="relative" overflow="hidden">
      <TeamStateProvider>
        <NavBar
          currentSection={currentSection}
          setCurrentSection={setCurrentSection}
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
            currentSection={currentSection}
            setCurrentSection={setCurrentSection}
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
