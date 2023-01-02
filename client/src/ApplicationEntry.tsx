import { Box, Flex } from "@chakra-ui/react";
import { memo, useState } from "react";
import Header from "./component/layout/Header";
import NavBar from "./component/layout/NavBar";
import CreateFolderModal from "./component/widget/createFolder/CreateFolderModal";
import CreateListModal from "./component/widget/createList/CreateListModal";
import CreateSpaceModal from "./component/widget/createSpace/CreateSpaceModal";
import TeamStateProvider from "./context/team/TeamContext";
import MainContentRoute from "./routes/MainContentRoute";

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
    <TeamStateProvider>
      <Flex height="100vh" position="relative" overflow="hidden">
        <NavBar
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
        />

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
            <MainContentRoute />
          </Box>
        </Flex>
      </Flex>

      <CreateListModal />
      <CreateSpaceModal />
      <CreateFolderModal />
    </TeamStateProvider>
  );
}
