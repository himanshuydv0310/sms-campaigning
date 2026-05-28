import { Routes, Route, NavLink, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";

import {
  FaHome,
  FaUsers,
  FaBullhorn,
  FaHistory,
  FaSignOutAlt,
  FaBars,
  FaBell,
  FaSms,
} from "react-icons/fa";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Contacts from "./pages/Contacts";
import Campaign from "./pages/Campaign";
import History from "./pages/History";

function Layout({ children }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="app-layout">
      <aside className={sidebarOpen ? "sidebar open" : "sidebar"}>
        <div className="brand-box">
          <div className="brand-logo">
            <FaSms />
          </div>

          <div>
            <h2>SMS Campaign</h2>
            <p>Professional Panel</p>
          </div>
        </div>

        <nav className="nav-menu">
          <NavLink to="/dashboard">
            <FaHome /> <span>Dashboard</span>
          </NavLink>

          <NavLink to="/contacts">
            <FaUsers /> <span>Contacts</span>
          </NavLink>

          <NavLink to="/campaign">
            <FaBullhorn /> <span>Create Campaign</span>
          </NavLink>

          <NavLink to="/history">
            <FaHistory /> <span>Campaign History</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="admin-mini">
            <div className="avatar">HY</div>
            <div>
              <strong>Himanshu Yadav</strong>
              <span>Project Admin</span>
            </div>
          </div>

          <button className="logout-btn" onClick={logout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      <main className="content-area">
        <header className="topbar">
          <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FaBars />
          </button>

          <div>
            <h3>SMS Campaigning System</h3>
            <p>Smart customer marketing dashboard</p>
          </div>

          <div className="topbar-right">
            <div className="live-dot">
              <span></span> Live
            </div>

            <button className="notification-btn">
              <FaBell />
            </button>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}

function Protected({ children }) {
  const token = localStorage.getItem("token");
  return token ? <Layout>{children}</Layout> : <Navigate to="/" />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
      <Route path="/contacts" element={<Protected><Contacts /></Protected>} />
      <Route path="/campaign" element={<Protected><Campaign /></Protected>} />
      <Route path="/history" element={<Protected><History /></Protected>} />
    </Routes>
  );
}