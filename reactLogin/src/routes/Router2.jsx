import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import RequireAuth from "../components/RequireAuth";
import Login from "../pages/Login";
import MainPage from "../pages/MainPage";
import Missing from "../pages/Missing";
import Profile from "../pages/Profile";
import RequireAuth2 from "../components/RequireAuth2";

export default function Router2() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="login" element={<Login />} />

          <Route
            index
            element={
              <RequireAuth2>
                <MainPage />
              </RequireAuth2>
            }
          />
          <Route
            path="profile"
            element={
              <RequireAuth2>
                <Profile />
              </RequireAuth2>
            }
          />

          <Route path="*" element={<Missing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
