import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaHome, FaHistory, FaUser, FaSignOutAlt, FaChevronLeft, FaChevronRight, FaTimes, FaWpforms } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import logo from "../assets/images/logo.png";

const USER_STORAGE_KEYS = ["user", "hidocs_user", "currentUser", "loggedInUser"];

const getNavUser = () => {
  try {
    for (const key of USER_STORAGE_KEYS) {
      const s = localStorage.getItem(key);
      if (!s) continue;
      const p = JSON.parse(s);
      if (p && typeof p === "object") {
        return {
          name: p.name || p.username || "User",
          email: String(p.email || "").trim().toLowerCase(),
          role: p.role || "User",
        };
      }
    }
  } catch { }
  return { name: "User", email: "", role: "User" };
};

const navbarStyles = `
/* ===== NAVBAR SIDEBAR ===== */
.nb-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 50;
  width: 240px;
  height: 100vh;
  padding: 16px 12px;
  background: var(--nb-sur, #ffffff);
  border-right: 1px solid var(--nb-bdr, #e2e8f0);
  display: flex;
  flex-direction: column;
  transition: width 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s ease, background 0.2s ease;
  user-select: none;
  box-shadow: 1px 0 8px rgba(15, 23, 42, 0.03);
  box-sizing: border-box;
}

.nb-sidebar * {
  box-sizing: border-box;
}

.nb-sidebar.collapsed {
  width: 68px;
  padding: 16px 8px;
}

/* Brand Header */
.nb-brand-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 46px;
  padding: 0 4px;
  margin-bottom: 22px;
  position: relative;
}

.nb-brand-content {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  text-decoration: none;
  min-width: 0;
}

.nb-brand-logo {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 10px;
  background: color-mix(in srgb, var(--nb-pri, #2168b4) 10%, #ffffff);
  border: 1px solid color-mix(in srgb, var(--nb-pri, #2168b4) 22%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.04);
  transition: transform 0.15s ease;
}

.nb-brand-logo:hover {
  transform: scale(1.04);
}

.nb-brand-logo img {
  width: 22px;
  height: 22px;
  object-fit: contain;
}

.nb-brand-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
  transition: opacity 0.18s, width 0.18s;
}

.nb-brand-name {
  color: var(--nb-pri, #2168b4);
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -0.4px;
  line-height: 1.2;
}

.nb-brand-badge {
  font-size: 9.5px;
  font-weight: 700;
  color: var(--nb-txt3, #94a3b8);
  letter-spacing: 0.6px;
  text-transform: uppercase;
}

.nb-sidebar.collapsed .nb-brand-wrapper {
  justify-content: center;
  flex-direction: column;
  height: auto;
  gap: 8px;
  margin-bottom: 16px;
  padding: 0;
}

.nb-sidebar.collapsed .nb-brand-text {
  display: none;
}

/* Toggle Collapse Button */
.nb-collapse-btn {
  width: 26px;
  height: 26px;
  flex-shrink: 0;
  border-radius: 7px;
  border: 1px solid var(--nb-bdr, #e2e8f0);
  background: var(--nb-bg, #f8fafc);
  color: var(--nb-txt2, #64748b);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.nb-collapse-btn:hover {
  background: var(--nb-pri, #2168b4);
  color: #ffffff;
  border-color: var(--nb-pri, #2168b4);
}

.nb-sidebar.collapsed .nb-collapse-btn {
  width: 28px;
  height: 22px;
  border-radius: 6px;
  font-size: 10px;
}

/* Close button for Mobile Drawer */
.nb-mobile-close-btn {
  display: none;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: 1px solid var(--nb-bdr, #e2e8f0);
  background: var(--nb-bg, #f8fafc);
  color: var(--nb-txt2, #64748b);
  align-items: center;
  justify-content: center;
  font-size: 14px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .nb-collapse-btn {
    display: none !important;
  }
  .nb-mobile-close-btn {
    display: flex !important;
  }
}

/* Menu Section Label */
.nb-section-label {
  padding: 0 10px;
  margin-bottom: 8px;
  color: var(--nb-txt3, #94a3b8);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.9px;
  text-transform: uppercase;
  white-space: nowrap;
}

.nb-sidebar.collapsed .nb-section-label {
  display: none;
}

/* Nav Menu List */
.nb-nav-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.nb-nav-btn {
  position: relative;
  width: 100%;
  height: 42px;
  padding: 0 12px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: var(--nb-txt2, #475569);
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.nb-nav-icon {
  width: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.nb-nav-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  letter-spacing: -0.15px;
}

.nb-nav-btn:hover {
  background: var(--nb-hover-bg, #f1f5f9);
  color: var(--nb-pri, #2168b4);
}

.nb-nav-btn.active {
  background: color-mix(in srgb, var(--nb-pri, #2168b4) 10%, #ffffff);
  color: var(--nb-pri, #2168b4);
  font-weight: 700;
}

.nb-nav-btn.active::before {
  content: "";
  position: absolute;
  left: 0;
  top: 10px;
  bottom: 10px;
  width: 3.5px;
  border-radius: 0 4px 4px 0;
  background: var(--nb-pri, #2168b4);
}

/* Collapsed Item Overrides - Pixel-perfect centering */
.nb-sidebar.collapsed .nb-nav-btn {
  width: 44px;
  height: 44px;
  padding: 0;
  margin: 2px auto;
  justify-content: center;
  border-radius: 11px;
}

.nb-sidebar.collapsed .nb-nav-btn .nb-nav-label {
  display: none;
}

.nb-sidebar.collapsed .nb-nav-btn.active {
  background: color-mix(in srgb, var(--nb-pri, #2168b4) 12%, #ffffff);
  border: 1px solid color-mix(in srgb, var(--nb-pri, #2168b4) 22%, transparent);
  box-shadow: 0 2px 8px color-mix(in srgb, var(--nb-pri, #2168b4) 15%, transparent);
}

.nb-sidebar.collapsed .nb-nav-btn.active::before {
  display: none;
}

/* Sleek Tooltips in Collapsed Mode */
.nb-sidebar.collapsed .nb-tooltip-target {
  position: relative;
}

.nb-sidebar.collapsed .nb-nav-btn:hover .nb-tooltip,
.nb-sidebar.collapsed .nb-user-card:hover .nb-tooltip,
.nb-sidebar.collapsed .nb-logout-btn:hover .nb-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateY(-50%) translateX(0);
}

.nb-tooltip {
  opacity: 0;
  visibility: hidden;
  position: absolute;
  left: 54px;
  top: 50%;
  transform: translateY(-50%) translateX(-6px);
  padding: 5px 11px;
  border-radius: 7px;
  background: #0f172a;
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  z-index: 100;
  box-shadow: 0 4px 14px rgba(0,0,0,0.18);
  pointer-events: none;
  transition: opacity 0.15s ease, transform 0.15s ease, visibility 0.15s;
}

.nb-tooltip::before {
  content: "";
  position: absolute;
  left: -4px;
  top: 50%;
  transform: translateY(-50%);
  border-width: 4px 4px 4px 0;
  border-style: solid;
  border-color: transparent #0f172a transparent transparent;
}

/* Bottom Profile and Logout */
.nb-bottom-area {
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid var(--nb-bdr, #e2e8f0);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.nb-user-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 11px;
  border: 1px solid var(--nb-bdr, #e2e8f0);
  background: var(--nb-bg, #f8fafc);
  cursor: pointer;
  transition: all 0.15s ease;
  overflow: visible;
}

.nb-user-card:hover {
  border-color: color-mix(in srgb, var(--nb-pri, #2168b4) 40%, transparent);
  background: color-mix(in srgb, var(--nb-pri, #2168b4) 8%, #ffffff);
}

.nb-user-avatar {
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border-radius: 9px;
  background: linear-gradient(135deg, var(--nb-pri, #2168b4), color-mix(in srgb, var(--nb-pri, #2168b4) 65%, #60a5fa));
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 800;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  transition: transform 0.15s ease;
}

.nb-user-details {
  min-width: 0;
  flex: 1;
}

.nb-user-name {
  display: block;
  font-size: 12.5px;
  font-weight: 700;
  color: var(--nb-txt, #0f172a);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
}

.nb-user-email {
  display: block;
  font-size: 11px;
  color: var(--nb-txt3, #94a3b8);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 1px;
}

/* Collapsed Profile: ONLY THE CLEAN AVATAR */
.nb-sidebar.collapsed .nb-user-card {
  width: 44px;
  height: 44px;
  padding: 0;
  margin: 2px auto;
  border: none;
  background: transparent;
  justify-content: center;
}

.nb-sidebar.collapsed .nb-user-avatar {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  box-shadow: 0 2px 8px color-mix(in srgb, var(--nb-pri, #2168b4) 25%, transparent);
}

.nb-sidebar.collapsed .nb-user-card:hover .nb-user-avatar {
  transform: scale(1.06);
}

.nb-sidebar.collapsed .nb-user-details {
  display: none;
}

/* Logout Button */
.nb-logout-btn {
  position: relative;
  width: 100%;
  height: 38px;
  padding: 0 12px;
  border-radius: 9px;
  border: 1px solid transparent;
  background: transparent;
  color: #e11d48;
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: inherit;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.nb-logout-btn:hover {
  background: #fee2e2;
  color: #be123c;
}

.nb-logout-btn svg {
  font-size: 14px;
  flex-shrink: 0;
}

/* Collapsed Logout Button */
.nb-sidebar.collapsed .nb-logout-btn {
  width: 44px;
  height: 44px;
  padding: 0;
  margin: 2px auto;
  justify-content: center;
  border-radius: 11px;
}

.nb-sidebar.collapsed .nb-logout-btn span {
  display: none;
}

.nb-sidebar.collapsed .nb-logout-btn:hover {
  background: #fee2e2;
  color: #be123c;
}

/* Logout Dialog Modal */
.nb-dialog-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  padding: 20px;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
  animation: nbFadeIn 0.15s ease;
}

.nb-dialog-box {
  width: 100%;
  max-width: 450px;
  padding: 26px;
  border-radius: 18px;
  background: var(--nb-sur, #ffffff);
  border: 1px solid var(--nb-bdr, #e2e8f0);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.22);
  text-align: center;
  animation: nbModalIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.nb-dialog-icon {
  width: 50px;
  height: 50px;
  margin: 0 auto 15px;
  border-radius: 14px;
  background: #ffe4e6;
  color: #e11d48;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.nb-dialog-box h3 {
  margin: 0;
  color: var(--nb-txt, #0f172a);
  font-size: 17px;
  font-weight: 700;
}

.nb-dialog-box p {
  margin: 8px 0 22px;
  color: var(--nb-txt2, #64748b);
  font-size: 12.5px;
  line-height: 1.6;
}

.nb-dialog-actions {
  display: flex;
  gap: 10px;
}

.nb-dialog-btn {
  flex: 1;
  height: 40px;
  border-radius: 10px;
  font-family: inherit;
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.15s;
}

.nb-dialog-btn.cancel {
  border: 1px solid var(--nb-bdr, #e2e8f0);
  background: var(--nb-bg, #f8fafc);
  color: var(--nb-txt2, #64748b);
}

.nb-dialog-btn.cancel:hover {
  background: var(--nb-bdr, #e2e8f0);
}

.nb-dialog-btn.confirm {
  border: none;
  background: #e11d48;
  color: #ffffff;
  box-shadow: 0 3px 10px rgba(225, 29, 72, 0.28);
}

.nb-dialog-btn.confirm:hover {
  background: #be123c;
}

@keyframes nbFadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes nbModalIn {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to   { opacity: 1; transform: none; }
}

/* Dark Mode Overrides */
.dark .nb-sidebar {
  --nb-sur: #0f172a;
  --nb-bdr: #1e293b;
  --nb-bg: #0b1320;
  --nb-txt: #f8fafc;
  --nb-txt2: #94a3b8;
  --nb-txt3: #64748b;
  --nb-hover-bg: #1e293b;
}

.dark .nb-collapse-btn {
  background: #1e293b;
  border-color: #334155;
  color: #94a3b8;
}

.dark .nb-collapse-btn:hover {
  background: var(--nb-pri, #60a5fa);
  color: #0f172a;
}

.dark .nb-user-card {
  background: #0b1320;
  border-color: #1e293b;
}

.dark .nb-logout-btn {
  color: #fb7185;
}

.dark .nb-logout-btn:hover {
  background: #231215;
  color: #fda4af;
}

.dark .nb-dialog-box {
  background: #0f172a;
  border-color: #1e293b;
}

.dark .nb-dialog-box h3 { color: #f8fafc; }
.dark .nb-dialog-box p { color: #94a3b8; }
.dark .nb-dialog-btn.cancel { background: #1e293b; border-color: #334155; color: #94a3b8; }
.dark .nb-dialog-btn.cancel:hover { background: #334155; }

/* Mobile Drawer Responsive Styles */
@media (max-width: 768px) {
  .nb-sidebar {
    transform: translateX(-100%);
    width: 250px !important;
    padding: 18px 14px !important;
    box-shadow: none;
    z-index: 1000;
  }
  .nb-sidebar.mobile-open {
    transform: translateX(0);
    box-shadow: 4px 0 28px rgba(0,0,0,0.35);
  }
  .nb-sidebar .nb-brand-text {
    display: flex !important;
  }
  .nb-sidebar .nb-section-label {
    display: block !important;
  }
  .nb-sidebar .nb-nav-btn {
    width: 100% !important;
    height: 44px !important;
    padding: 0 12px !important;
    justify-content: flex-start !important;
  }
  .nb-sidebar .nb-nav-label {
    display: block !important;
  }
  .nb-sidebar .nb-user-card {
    width: 100% !important;
    height: auto !important;
    padding: 8px 10px !important;
    border: 1px solid var(--nb-bdr, #e2e8f0) !important;
    background: var(--nb-bg, #f8fafc) !important;
    justify-content: flex-start !important;
  }
  .nb-sidebar .nb-user-details {
    display: block !important;
  }
  .nb-sidebar .nb-logout-btn {
    width: 100% !important;
    height: 38px !important;
    padding: 0 12px !important;
    justify-content: flex-start !important;
  }
  .nb-sidebar .nb-logout-btn span {
    display: inline !important;
  }
  .nb-tooltip {
    display: none !important;
  }
}
`;

export default function Navbar({ collapsed, onToggleCollapse, mobileOpen, onCloseMobile }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, t } = useTheme();

  const [showLogout, setShowLogout] = useState(false);

  const user = getNavUser();
  const avatarLetter = (user.name || "U").charAt(0).toUpperCase();

  const isAdminRoute = location.pathname.startsWith("/admin") || location.pathname === "/create-form";
  const isAdminUser = String(user.role || "").trim().toLowerCase() === "admin";
  const isAdmin = isAdminRoute || isAdminUser;

  const adminNavItems = [
    { key: "home", path: "/admin", icon: <FaHome />, label: t?.nav?.home || "Home" },
    { key: "forms", path: "/admin/forms", icon: <FaWpforms />, label: t?.admin?.forms || "Forms" },
    { key: "profile", path: "/admin/profile", icon: <FaUser />, label: t?.nav?.profile || "Profile" },
  ];

  const userNavItems = [
    { key: "home", path: "/dashboard", icon: <FaHome />, label: t?.nav?.home || "Home" },
    { key: "history", path: "/history", icon: <FaHistory />, label: t?.nav?.history || "History" },
    { key: "profile", path: "/profile", icon: <FaUser />, label: t?.nav?.profile || "Profile" },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  const confirmLogout = () => {
    USER_STORAGE_KEYS.forEach((k) => localStorage.removeItem(k));
    ["token", "accessToken"].forEach((k) => localStorage.removeItem(k));
    setShowLogout(false);
    navigate("/login", { replace: true });
  };

  const activeKey = (function () {
    if (isAdmin) {
      if (location.pathname === "/admin/profile") return "profile";
      if (location.pathname.startsWith("/admin/forms") || location.pathname === "/create-form") return "forms";
      if (location.pathname === "/admin" || location.pathname.startsWith("/admin/import-word")) return "home";
    }
    const matched = navItems.find((item) => location.pathname === item.path || location.pathname.startsWith(item.path + "/"));
    if (matched) return matched.key;
    return "home";
  })();

  const sidebarClasses = [
    "nb-sidebar",
    darkMode ? "dark" : "",
    collapsed ? "collapsed" : "",
    mobileOpen ? "mobile-open" : "",
  ].filter(Boolean).join(" ");

  const handleNavClick = (path) => {
    navigate(path);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      <style>{navbarStyles}</style>

      <aside className={sidebarClasses} aria-label="Main Navigation">
        {/* Brand Header */}
        <div className="nb-brand-wrapper">
          <div className="nb-brand-content" onClick={() => handleNavClick(isAdmin ? "/admin" : "/dashboard")} title="HiDocs Home">
            <div className="nb-brand-logo">
              <img src={logo} alt="HiDocs Logo" />
            </div>
            <div className="nb-brand-text">
              <span className="nb-brand-name">HiDocs!</span>
            </div>
          </div>

          <button
            type="button"
            className="nb-collapse-btn"
            onClick={onToggleCollapse}
            title={collapsed ? "Expand Menu" : "Collapse Menu"}
            aria-label={collapsed ? "Expand Menu" : "Collapse Menu"}
          >
            {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>

          <button
            type="button"
            className="nb-mobile-close-btn"
            onClick={onCloseMobile}
            title="Close Menu"
            aria-label="Close Menu"
          >
            <FaTimes />
          </button>
        </div>

        {/* Section Label */}
        <div className="nb-section-label">{t?.nav?.menu || "Menu"}</div>

        {/* Navigation Items */}
        <nav className="nb-nav-list">
          {navItems.map(({ key, path, icon, label }) => {
            const isActive = activeKey === key;
            return (
              <button
                key={key}
                type="button"
                className={`nb-nav-btn${isActive ? " active" : ""}`}
                onClick={() => handleNavClick(path)}
                aria-label={label}
              >
                <div className="nb-nav-icon">{icon}</div>
                <span className="nb-nav-label">{label}</span>
                <div className="nb-tooltip">{label}</div>
              </button>
            );
          })}
        </nav>

        {/* Bottom Profile and Logout */}
        <div className="nb-bottom-area">
          <div
            className="nb-user-card"
            style={{ cursor: "pointer" }}
            onClick={() => handleNavClick(isAdmin ? "/admin/profile" : "/profile")}
            aria-label={user.name}
          >
            <div className="nb-user-avatar">{avatarLetter}</div>
            <div className="nb-user-details">
              <span className="nb-user-name">{user.name}</span>
              <span className="nb-user-email">{user.email || (isAdmin ? "Administrator" : (t?.nav?.roleUser || "HiDocs User"))}</span>
            </div>
            <div className="nb-tooltip">{user.name} ({t?.nav?.profile || "Profile"})</div>
          </div>

          <button
            type="button"
            className="nb-logout-btn"
            onClick={() => setShowLogout(true)}
            aria-label={t?.nav?.logout || "Logout"}
          >
            <FaSignOutAlt />
            <span>{t?.nav?.logout || "Logout"}</span>
            <div className="nb-tooltip">{t?.nav?.logout || "Logout"}</div>
          </button>
        </div>
      </aside>

      {/* Logout Dialog */}
      {showLogout && (
        <div className="nb-dialog-overlay" onClick={() => setShowLogout(false)} role="dialog" aria-modal="true">
          <div className="nb-dialog-box" onClick={(e) => e.stopPropagation()}>
            <div className="nb-dialog-icon"><FaSignOutAlt /></div>
            <h3>{t?.nav?.logoutTitle || "Log Out Account"}</h3>
            <p>{t?.nav?.logoutConfirm || "Are you sure you want to log out from your HiDocs account?"}</p>
            <div className="nb-dialog-actions">
              <button type="button" className="nb-dialog-btn cancel" onClick={() => setShowLogout(false)}>
                {t?.nav?.cancel || "Cancel"}
              </button>
              <button type="button" className="nb-dialog-btn confirm" onClick={confirmLogout}>
                {t?.nav?.confirmLogout || "Log Out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
