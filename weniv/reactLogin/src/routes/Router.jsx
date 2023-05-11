import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import RequireAuth from "../components/RequireAuth";
import Login from "../pages/Login";
import MainPage from "../pages/MainPage";
import Missing from "../pages/Missing";
import Profile from "../pages/Profile";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="login" element={<Login />} />

          <Route element={<RequireAuth />}>
            <Route index element={<MainPage />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<Missing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
