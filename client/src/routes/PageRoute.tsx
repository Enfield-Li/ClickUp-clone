import React from "react";
import { Route, Routes } from "react-router-dom";
import About from "../component/layout/About";
import Home from "../component/layout/Home";
import Login from "../component/auth/Login";
import TaskView from "../component/task/TaskView";
import FunctionalityTwo from "../component/functionality_two/FunctionalityTwo";
import { CLIENT_ROUTE } from "../utils/constant";
import Register from "../component/auth/Register";

type Props = {};

export default function PageRoute({}: Props) {
  return (
    <Routes>
      <Route path={CLIENT_ROUTE.HOME} element={<Home />} />
      <Route path={CLIENT_ROUTE.ABOUT} element={<About />} />
      <Route path={CLIENT_ROUTE.LOGIN} element={<Login />} />
      <Route path={CLIENT_ROUTE.TASK} element={<TaskView />} />
      <Route path={CLIENT_ROUTE.REGISTER} element={<Register />} />
      <Route path={CLIENT_ROUTE.FUNC_TWO} element={<FunctionalityTwo />} />
    </Routes>
  );
}
