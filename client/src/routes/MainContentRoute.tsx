import { memo } from "react";
import { Route, Routes } from "react-router-dom";
import About from "../component/layout/About";
import Home from "../component/layout/Home";
import TaskView from "../component/task/TaskView";
import TaskDetailModal from "../component/taskModal/TaskDetailsModal";
import TestDev from "../component/test-dev/TestDev";
import { CLIENT_ROUTE, TASK_BOARD_PARAM, TASK_PARAM } from "../constant";

type Props = {};

export default memo(MainContentRoute);
function MainContentRoute({}: Props) {
  return (
    <Routes>
      <Route path={CLIENT_ROUTE.HOME} element={<Home />} />
      <Route path={CLIENT_ROUTE.ABOUT} element={<About />} />
      <Route path={CLIENT_ROUTE.TEST_DEV} element={<TestDev />} />
      <Route path={CLIENT_ROUTE.TASK_BOARD} element={<TaskView />} />
    </Routes>
  );
}
