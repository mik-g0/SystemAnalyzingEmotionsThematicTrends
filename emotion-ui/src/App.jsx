import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

import Layout from "./components/Layout";
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

      {/* PRIVATE (личный кабинет) */}
      <Route
        path="/analysis"
        element={
          <Layout>
            <Analysis />
          </Layout>
        }
      />

      <Route
        path="/history"
        element={
          <Layout>
            <History />
          </Layout>
        }
      />

      <Route
        path="/trends"
        element={
          <Layout>
            <Trends />
          </Layout>
        }
      />

      <Route
        path="/about"
        element={
          <Layout>
            <About />
          </Layout>
        }
      />

    </Routes>
  );
}