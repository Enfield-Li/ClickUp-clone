import { memo } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../component/auth/Login";
import Register from "../component/auth/Register";
import About from "../component/layout/About";
import Home from "../component/layout/Home";
import TaskView from "../component/task/TaskView";
import TaskDetailModal from "../component/taskModal/TaskDetailsModal";
import TestDev from "../component/test-dev/TestDev";
import { CLIENT_ROUTE, TASK_BOARD_PARAM, TASK_PARAM } from "../constant";

type Props = {};

export default memo(PageRoute);
function PageRoute({}: Props) {
  return (
    <Routes>
      <Route path={CLIENT_ROUTE.HOME} element={<Home />} />
      <Route path={CLIENT_ROUTE.ABOUT} element={<About />} />
      <Route path={CLIENT_ROUTE.LOGIN} element={<Login />} />
      <Route
        path={CLIENT_ROUTE.TASK_BOARD + `/:${TASK_BOARD_PARAM}`}
        element={<TaskView />}
      >
        <Route
          path={
            CLIENT_ROUTE.TASK_BOARD +
            `/:${TASK_BOARD_PARAM}` +
            CLIENT_ROUTE.TASK +
            `/:${TASK_PARAM}`
          }
          element={<TaskDetailModal />}
        />
      </Route>
      <Route path={CLIENT_ROUTE.REGISTER} element={<Register />} />
      <Route path={CLIENT_ROUTE.TEST_DEV} element={<TestDev />} />
    </Routes>
  );
}
