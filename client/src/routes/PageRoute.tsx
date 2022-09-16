import React from "react";
import { Route, Routes } from "react-router-dom";
import About from "../component/layout/About";
import Home from "../component/layout/Home";
import Login from "../component/auth/Login";
import DragDrop from "../component/dragDrop/DragDrop";
import FunctionalityTwo from "../component/functionality_two/FunctionalityTwo";
import { ROUTE } from "../utils/constant";

type Props = {};

export default function PageRoute({}: Props) {
  return (
    <Routes>
      <Route path={ROUTE.HOME} element={<Home />} />
      <Route path={ROUTE.ABOUT} element={<About />} />
      <Route path={ROUTE.LOGIN} element={<Login />} />
      <Route path={ROUTE.FUNC_ONE} element={<DragDrop />} />
      <Route path={ROUTE.FUNC_TWO} element={<FunctionalityTwo />} />
    </Routes>
  );
}
