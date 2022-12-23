import { Box } from "@chakra-ui/react";
import { memo } from "react";
import CreateTeam from "./component/test-dev/CreateTeam";
import useAuthContext from "./context/auth/useAuthContext";
import useInit from "./hook/useInit";
import ApplicationEntry from "./routes/ApplicationEntry";
import Authentication from "./routes/Authentication";

export default memo(App);
function App() {
  useInit();
  const { authState } = useAuthContext();

  return (
    <Box height="100vh">
      {/* {authState.user ? <ApplicationEntry /> : <Authentication />} */}
      <CreateTeam />
    </Box>
  );
}
