import { memo } from "react";
import { Route, Routes } from "react-router-dom";
import ApplicationEntry from "../ApplicationEntry";
import Login from "../component/auth/Login";
import Register from "../component/auth/Register";
import About from "../component/layout/About";
import Home from "../component/layout/Home";
import CreateTeam from "../component/onboarding/CreateTeam";
import TaskView from "../component/task/TaskView";
import TestDev from "../component/test-dev/TestDev";
import { CLIENT_ROUTE } from "../constant";

type Props = {};

export default memo(MainContentRoute);
function MainContentRoute({}: Props) {
  return (
    <Routes>
      <Route path={CLIENT_ROUTE.LOGIN} element={<Login />} />
      <Route path={CLIENT_ROUTE.REGISTER} element={<Register />} />
      <Route path={CLIENT_ROUTE.ON_BOARDING} element={<CreateTeam />} />

      <Route element={<ApplicationEntry />}>
        <Route path={CLIENT_ROUTE.HOME} element={<Home />} />
        <Route path={CLIENT_ROUTE.ABOUT} element={<About />} />
        <Route path={CLIENT_ROUTE.TEST_DEV} element={<TestDev />} />
        <Route path={CLIENT_ROUTE.TASK_BOARD} element={<TaskView />} />
      </Route>
    </Routes>
  );
}
