import { Box } from "@chakra-ui/react";
import { memo, useEffect, useState } from "react";
import useAuthContext from "./context/auth/useAuthContext";
import useInit from "./hook/useInit";
import ApplicationEntry from "./ApplicationEntry";
import Authentication from "./routes/Authentication";
import { useLocation, useNavigate } from "react-router-dom";
import { CLIENT_ROUTE } from "./constant";
import CreateTeam from "./component/onboarding/CreateTeam";

export default memo(App);
function App() {
  useInit();
  const navigate = useNavigate();
  const location = useLocation();
  const { authState } = useAuthContext();

//   useEffect(() => {
//     if (!authState.user) {
//       navigate(CLIENT_ROUTE.LOGIN);
//     }
//   }, [authState]);

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
