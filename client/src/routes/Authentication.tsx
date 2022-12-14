import React, { memo } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../component/auth/Login";
import Register from "../component/auth/Register";
import { CLIENT_ROUTE } from "../constant";

type Props = {};

export default memo(Authentication);
function Authentication({}: Props) {
  return (
    <Routes>
      <Route path={CLIENT_ROUTE.LOGIN} element={<Login />} />
      <Route path={CLIENT_ROUTE.REGISTER} element={<Register />} />
    </Routes>
  );
}
