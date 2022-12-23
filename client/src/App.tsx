import { Box } from "@chakra-ui/react";
import { memo, useEffect, useState } from "react";
import CreateTeam from "./component/test-dev/CreateTeam";
import useAuthContext from "./context/auth/useAuthContext";
import useInit from "./hook/useInit";
import ApplicationEntry from "./ApplicationEntry";
import Authentication from "./routes/Authentication";
import { useNavigate } from "react-router-dom";
import { CLIENT_ROUTE } from "./constant";

export default memo(App);
function App() {
  useInit();
  const navigate = useNavigate();
  const { authState } = useAuthContext();

  useEffect(() => {
    if (!authState.user) navigate(CLIENT_ROUTE.LOGIN);
  }, [authState]);

  return (
    <Box height="100vh">
      {!authState.user ? (
        <Authentication />
      ) : authState.onboarding ? (
        <CreateTeam />
      ) : (
        <ApplicationEntry />
      )}
    </Box>
  );
}
