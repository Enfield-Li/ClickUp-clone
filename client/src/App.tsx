import { useToast } from "@chakra-ui/react";
import { memo, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import ApplicationEntry from "./ApplicationEntry";
import Login from "./component/auth/Login";
import Register from "./component/auth/Register";
import CreateTeam from "./component/createTeam/CreateTeam";
import UnderConstruction from "./component/layout/UnderConstruction";
import TaskView from "./component/task/TaskView";
import TestDev from "./component/test-dev/TestDev";
import { ACCESS_TOKEN, CLIENT_ROUTE } from "./constant";
import { useAuth } from "./context/auth/useAuth";
import { refreshUserToken } from "./networkCalls";

export default memo(App);
function App() {
  const authState = useAuth();
  const { user } = authState;
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast({ duration: 3000, isClosable: true });

  useEffect(() => {
    let intervalId: NodeJS.Timer;
    const accessToken = localStorage.getItem(ACCESS_TOKEN);

    const isAuthPath =
      location.pathname === CLIENT_ROUTE.REGISTER ||
      location.pathname === CLIENT_ROUTE.LOGIN;

    if (accessToken) {
      refreshUserToken(authState, toast, navigate, isAuthPath);

      intervalId = setInterval(() => {
        refreshUserToken(authState, toast, navigate, isAuthPath);
      }, 1790000); // 29 min and 50 sec
    } else if (!isAuthPath && !accessToken) {
      navigate(CLIENT_ROUTE.LOGIN);
    }

    return () => clearInterval(intervalId);
  }, []);

  // redirect to onboarding
  useEffect(() => {
    if (user && !user.defaultTeamId && !user.joinedTeamCount) {
      navigate(CLIENT_ROUTE.ON_BOARDING);
    }
  }, [user]);

  return (
    <Routes>
      <Route path={CLIENT_ROUTE.LOGIN} element={<Login />} />
      <Route path={CLIENT_ROUTE.REGISTER} element={<Register />} />
      <Route path={CLIENT_ROUTE.ON_BOARDING} element={<CreateTeam />} />

      <Route path="/:teamId" element={<ApplicationEntry />}>
        <Route path="*" element={<UnderConstruction />} />
        <Route path={CLIENT_ROUTE.HOME} element={<UnderConstruction />} />
        <Route path={CLIENT_ROUTE.TEST_DEV} element={<TestDev />} />

        {/* https://stackoverflow.com/questions/70005601/alternate-way-for-optional-parameters-in-v6 */}
        <Route path={CLIENT_ROUTE.TASK_BOARD} element={<TaskView />} />
        <Route
          path={CLIENT_ROUTE.TASK_BOARD + "/:spaceId"}
          element={<TaskView />}
        />
        <Route
          path={CLIENT_ROUTE.TASK_BOARD + "/:spaceId/:listId"}
          element={<TaskView />}
        />
      </Route>
    </Routes>
  );
}
