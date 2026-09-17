import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import Navbar from "./Navbar";
import logo from "../assets/images/logo.png";

const COLLAPSED_KEY = "hidocs_sidebar_collapsed";

const layoutStyles = `
/* ===== APP LAYOUT ===== */
.app-layout {
  min-height: 100vh;
  width: 100%;
  display: flex;
  background-color: var(--app-bg, #f8fafc);
  transition: background-color 0.2s ease;
  position: relative;
  box-sizing: border-box;
}

.app-layout * {
  box-sizing: border-box;
}

/* Mobile Topbar: visible only on <= 768px */
.app-mobile-topbar {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 54px;
  background: var(--app-topbar-bg, #ffffff);
  border-bottom: 1px solid var(--app-bdr, #e2e8f0);
  z-index: 40;
  padding: 0 16px;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 6px rgba(15, 23, 42, 0.04);
}

.app-mobile-topbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.app-mobile-menu-btn {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  border: 1px solid var(--app-bdr, #e2e8f0);
  background: var(--app-card-bg, #ffffff);
  color: var(--app-txt, #0f172a);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.app-mobile-menu-btn:hover {
  background: var(--app-bdr, #f1f5f9);
}

.app-mobile-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.app-mobile-brand img {
  width: 26px;
  height: 26px;
  object-fit: contain;
}

.app-mobile-brand-name {
  font-size: 17px;
  font-weight: 800;
  color: var(--nb-pri, #2168b4);
  letter-spacing: -0.4px;
}

.app-mobile-avatar {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: linear-gradient(135deg, var(--nb-pri, #2168b4), color-mix(in srgb, var(--nb-pri, #2168b4) 65%, #60a5fa));
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13.5px;
  font-weight: 800;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

/* Mobile Drawer Backdrop */
.app-mobile-backdrop {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(4px);
  z-index: 900;
  animation: appFadeIn 0.15s ease;
}

@keyframes appFadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* Main Content Area */
.app-layout-content {
  flex: 1;
  min-width: 0;
  margin-left: 240px;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

.app-layout.collapsed .app-layout-content {
  margin-left: 68px;
}

/* Responsive Rules */
@media (max-width: 768px) {
  .app-mobile-topbar {
    display: flex;
  }
  .app-mobile-backdrop.show {
    display: block;
  }
  .app-layout-content,
  .app-layout.collapsed .app-layout-content {
    margin-left: 0 !important;
    padding-top: 54px;
    width: 100%;
  }
}

/* Dark Mode Overrides */
.app-layout.dark {
  --app-bg: #0b1320;
  --app-topbar-bg: #0f172a;
  --app-card-bg: #1e293b;
  --app-bdr: #1e293b;
  --app-txt: #f8fafc;
}

.app-layout.dark .app-mobile-menu-btn {
  background: #1e293b;
  border-color: #334155;
  color: #f8fafc;
}
`;

export default function AppLayout() {
  const { darkMode, primaryColor } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // Load collapsed state from localStorage; default to false (expanded)
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(COLLAPSED_KEY) === "true";
    } catch {
      return false;
    }
  });

  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const toggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(COLLAPSED_KEY, String(next));
      } catch {}
      return next;
    });
  };

  const getUserInitial = () => {
    try {
      for (const k of ["user", "hidocs_user", "currentUser", "loggedInUser"]) {
        const s = localStorage.getItem(k);
        if (s) {
          const p = JSON.parse(s);
          if (p?.name) return p.name.charAt(0).toUpperCase();
          if (p?.username) return p.username.charAt(0).toUpperCase();
        }
      }
    } catch {}
    return "U";
  };

  const layoutClasses = [
    "app-layout",
    darkMode ? "dark" : "",
    collapsed ? "collapsed" : "",
  ].filter(Boolean).join(" ");

  const isAdmin = location.pathname.startsWith("/admin") || location.pathname === "/create-form" || (function() {
    try {
      for (const k of ["user", "hidocs_user", "currentUser", "loggedInUser"]) {
        const s = localStorage.getItem(k);
        if (s) {
          const p = JSON.parse(s);
          if (String(p?.role).toLowerCase() === "admin") return true;
        }
      }
    } catch {}
    return false;
  })();

  return (
    <div className={layoutClasses}>
      <style>{layoutStyles}</style>

      {/* Mobile Topbar */}
      <header className="app-mobile-topbar" aria-label="Mobile Navigation Bar">
        <div className="app-mobile-topbar-left">
          <button
            type="button"
            className="app-mobile-menu-btn"
            onClick={() => setMobileOpen(true)}
            aria-label="Open Navigation Menu"
          >
            <FaBars />
          </button>
          <div
            className="app-mobile-brand"
            onClick={() => navigate(isAdmin ? "/admin" : "/dashboard")}
            role="button"
            tabIndex={0}
          >
            <img src={logo} alt="HiDocs Logo" />
            <span className="app-mobile-brand-name">HiDocs!</span>
          </div>
        </div>

        <button
          type="button"
          className="app-mobile-avatar"
          onClick={() => navigate(isAdmin ? "/admin/profile" : "/profile")}
          title="Open Profile"
          aria-label="Profile"
        >
          {getUserInitial()}
        </button>
      </header>

      {/* Mobile Drawer Backdrop */}
      <div
        className={`app-mobile-backdrop${mobileOpen ? " show" : ""}`}
        onClick={() => setMobileOpen(false)}
        role="presentation"
      />

      {/* Navbar Sidebar */}
      <Navbar
        collapsed={collapsed}
        onToggleCollapse={toggleCollapse}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Page Content */}
      <main className="app-layout-content" role="main">
        <Outlet />
      </main>
    </div>
  );
}
