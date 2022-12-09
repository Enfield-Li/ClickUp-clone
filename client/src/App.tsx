import { Box } from "@chakra-ui/react";
import useAuthContext from "./context/auth/useAuthContext";
import useInit from "./hook/useInit";
import ApplicationEntry from "./routes/ApplicationEntry";
import Authentication from "./routes/Authentication";

export default function App() {
  useInit();
  const { authState } = useAuthContext();

  return (
    <Box height="100vh">
      <ApplicationEntry />
      {/* {authState.user ? <ApplicationEntry /> : <Authentication />} */}
    </Box>
  );
}
