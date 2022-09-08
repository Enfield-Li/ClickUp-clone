import React from "react";
import { Route, Routes } from "react-router-dom";
import About from "../component/About";
import Home from "../component/Home";
import Login from "../component/Login";

type Props = {};

export default function PageRoute({}: Props) {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
