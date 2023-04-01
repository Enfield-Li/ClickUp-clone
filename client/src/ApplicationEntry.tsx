import { Box, Flex } from "@chakra-ui/react";
import { memo } from "react";
import { Outlet } from "react-router-dom";
import Header from "./component/layout/Header";
import NavBar from "./component/layout/NavBar";
import CreateFolderModal from "./component/widget/createFolder/CreateFolderModal";
import CreateListModal from "./component/widget/createList/CreateListModal";
import CreateSpaceModal from "./component/widget/createSpace/CreateSpaceModal";
import TaskDetailProvider from "./context/task_detail/TaskDetailContext";
import TeamStateProvider from "./context/team/TeamContext";

type Props = {};

export default memo(ApplicationEntry);
function ApplicationEntry({}: Props) {
  //   const [initializing, setInitializing] = useState(true);

  //   useEffect(() => {
  //     const timeoutId = setTimeout(() => {
  //       setInitializing(false);
  //     }, 2600);

  //     return () => clearTimeout(timeoutId);
  //   }, []);

  //   if (initializing) return <LoadingSpinner />;

  // https://github.com/chakra-ui/chakra-ui/issues/4109#issuecomment-1306875968
  return (
    <Flex height="100vh" position="relative" overflow="hidden">
      <TeamStateProvider>
        <NavBar />
        <CreateListModal />
        <CreateSpaceModal />
        <CreateFolderModal />
      </TeamStateProvider>

      {/* Header && Main */}
      <Flex
        width="100%"
        height="100%"
        flexDir="column"
        overflow="hidden" // https://stackoverflow.com/a/1767270/16648127
      >
        <Box role="heading">
          <Header />
        </Box>

        {/* Main content */}
        <Box role="main" flexGrow="1">
          <TaskDetailProvider>
            <Outlet />
          </TaskDetailProvider>
        </Box>
      </Flex>
    </Flex>
  );
}
