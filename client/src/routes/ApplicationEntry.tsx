import { Flex, Box } from "@chakra-ui/react";
import { useState } from "react";
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

export default function ApplicationEntry({}: Props) {
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
      <Box
        width={"100%"}
        overflow="hidden" // https://stackoverflow.com/a/1767270/16648127
      >
        <Box role="heading">
          <Header
            currentSection={currentSection}
            setCurrentSection={setCurrentSection}
          />
        </Box>

        {/* Main content */}
        <Box role="main">
          <MainContent />
        </Box>
      </Box>
    </Flex>
  );
}
