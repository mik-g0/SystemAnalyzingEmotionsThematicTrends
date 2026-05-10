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

      {/* PUBLIC */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* PRIVATE */}
      <Route
        path="/analysis"
        element={
          <ProtectedRoute>
            <Layout>
              <Analysis />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <Layout>
              <History />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/trends"
        element={
          <ProtectedRoute>
            <Layout>
              <Trends />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/about"
        element={
          <ProtectedRoute>
            <Layout>
              <About />
            </Layout>
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}