import { useToast } from "@chakra-ui/react";
import { memo, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import ApplicationEntry from "./ApplicationEntry";
import Login from "./component/auth/Login";
import Register from "./component/auth/Register";
import About from "./component/layout/About";
import Home from "./component/layout/Home";
import CreateTeam from "./component/onboarding/CreateTeam";
import TaskView from "./component/task/TaskView";
import TestDev from "./component/test-dev/TestDev";
import { ACCESS_TOKEN, CLIENT_ROUTE } from "./constant";
import useAuthContext from "./context/auth/useAuthContext";
import { refreshUserToken } from "./networkCalls";

export default memo(App);
function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { authDispatch } = useAuthContext();
  const toast = useToast({ duration: 3000, isClosable: true });

  useEffect(() => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    // authDispatch({ type: AUTH_ACTION.LOGIN_USER, payload: { user: mockUser } });
    if (accessToken) {
      refreshUserToken(authDispatch, toast, navigate);
      setInterval(() => {
        refreshUserToken(authDispatch, toast, navigate);
      }, 1790000); // 29 min and 50 sec
    } else {
      const isNotAuthPage =
        location.pathname !== CLIENT_ROUTE.REGISTER &&
        location.pathname !== CLIENT_ROUTE.LOGIN;
      if (isNotAuthPage) {
        navigate(CLIENT_ROUTE.LOGIN);
      }
    }
  }, []);

  return (
    <Routes>
      <Route path={CLIENT_ROUTE.LOGIN} element={<Login />} />
      <Route path={CLIENT_ROUTE.REGISTER} element={<Register />} />
      <Route path={CLIENT_ROUTE.ON_BOARDING} element={<CreateTeam />} />

      <Route element={<ApplicationEntry />}>
        <Route path={CLIENT_ROUTE.HOME} element={<Home />} />
        <Route path={CLIENT_ROUTE.ABOUT} element={<About />} />
        <Route path={CLIENT_ROUTE.TEST_DEV} element={<TestDev />} />

        {/* https://stackoverflow.com/questions/70005601/alternate-way-for-optional-parameters-in-v6 */}
        <Route
          path={CLIENT_ROUTE.TASK_BOARD + "/:teamId?/:spaceId?/:listId?"}
          element={<TaskView />}
        />
      </Route>
    </Routes>
  );
}
