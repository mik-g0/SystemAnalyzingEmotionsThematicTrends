import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Analysis from "./pages/Analysis";
import History from "./pages/History";
import Trends from "./pages/Trends";
import About from "./pages/About";

export default function App() {
  return (
    <Routes>
      {/* ПУБЛИЧНЫЕ СТРАНИЦЫ (без меню Tumblr) */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ПРИВАТНЫЕ СТРАНИЦЫ (все защищены и обернуты в Tumblr Layout) */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/history" element={<History />} />
        <Route path="/trends" element={<Trends />} />
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
  );
}