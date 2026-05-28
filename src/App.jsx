import { Routes, Route, NavLink, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";

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
          <div className="brand-logo">S</div>
          <div>
            <h2>SMS Campaign</h2>
            <p>Marketing Panel</p>
          </div>
        </div>

        <nav className="nav-menu">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/contacts">Contacts</NavLink>
          <NavLink to="/campaign">Create Campaign</NavLink>
          <NavLink to="/history">Campaign History</NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="admin-mini">
            <div className="avatar">HY</div>
            <div>
              <strong>Himanshu Yadav</strong>
              <span>Admin</span>
            </div>
          </div>

          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="content-area">
        <header className="topbar">
          <button
            className="menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>

          <div>
            <h3>SMS Campaigning System</h3>
            <p>Manage contacts, campaigns and analytics</p>
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

      <Route
        path="/dashboard"
        element={
          <Protected>
            <Dashboard />
          </Protected>
        }
      />

      <Route
        path="/contacts"
        element={
          <Protected>
            <Contacts />
          </Protected>
        }
      />

      <Route
        path="/campaign"
        element={
          <Protected>
            <Campaign />
          </Protected>
        }
      />

      <Route
        path="/history"
        element={
          <Protected>
            <History />
          </Protected>
        }
      />
    </Routes>
  );
}