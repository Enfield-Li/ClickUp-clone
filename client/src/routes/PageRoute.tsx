import React from "react";
import { Route, Routes } from "react-router-dom";
import About from "../component/layout/About";
import Home from "../component/layout/Home";
import Login from "../component/auth/Login";
import FunctionalityOne from "../component/functionality_one/FunctionalityOne";
import FunctionalityTwo from "../component/functionality_two/FunctionalityTwo";

type Props = {};

export default function PageRoute({}: Props) {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/functionality_one" element={<FunctionalityOne />} />
      <Route path="/functionality_two" element={<FunctionalityTwo />} />
    </Routes>
  );
}
