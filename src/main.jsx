import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "mdb-ui-kit/css/mdb.min.css";
import "./index.css";
import HomePage from "./pages/HomePage.jsx";
import TimerModePage from "./pages/TimerModePage.jsx";
import MatchModePage from "./pages/MatchModePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import { BrowserRouter, Routes, Route } from "react-router";

import "bootstrap/dist/css/bootstrap.min.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/timer-mode" element={<TimerModePage />} />
        <Route path="/match-mode" element={<MatchModePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
