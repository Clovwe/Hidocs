import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaAdjust,
  FaChartBar,
  FaCheck,
  FaCheckCircle,
  FaChevronRight,
  FaClipboardCheck,
  FaClock,
  FaDownload,
  FaEnvelope,
  FaFileAlt,
  FaFileWord,
  FaGlobe,
  FaHistory,
  FaImage,
  FaInfoCircle,
  FaPaintBrush,
  FaPen,
  FaPlus,
  FaQrcode,
  FaRandom,
  FaShieldAlt,
  FaSignOutAlt,
  FaSlidersH,
  FaTimes,
  FaTrashAlt,
  FaTrophy,
  FaUndo,
  FaUser,
  FaUserCog,
  FaWpforms,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import logo from "../assets/images/logo.png";

const PRESET_COLORS = [
  { name: "Ocean Blue", hex: "#2168b4" },
  { name: "Indigo", hex: "#1c12d4ff" },
  { name: "Purple", hex: "#7c3aed" },
  { name: "Emerald", hex: "#059669" },
  { name: "Rose", hex: "#e11d48" },
  { name: "Amber", hex: "#d97706" },
  { name: "Teal", hex: "#0d9488" },
];

const LANGS = [
  { code: "id", label: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

const getCurrentAdmin = () => {
  try {
    for (const key of ["user", "hidocs_user", "currentUser", "loggedInUser"]) {
      const s = localStorage.getItem(key);
      if (!s) continue;
      const p = JSON.parse(s);
      if (p && typeof p === "object") {
        return {
          username: p.username || p.name || "Admin",
          name: p.name || p.username || "Admin",
          email: String(p.email || "admin@hidocs.app").trim().toLowerCase(),
          role: "ADMINISTRATOR",
        };
      }
    }
  } catch {}
  return { username: "Admin", name: "Admin", email: "admin@hidocs.app", role: "ADMINISTRATOR" };
};

const adminProfileStyles = `
.admin-profile-page, .admin-profile-page * { box-sizing: border-box; }
.admin-profile-page {
  --primary: var(--hp-pri, #2168b4);
  --border: #e5ebf2; --surface: #ffffff; --background: transparent;
  --text: #1d2c3f; --text-soft: #5e7188; --text-muted: #9aa7b7;
  min-height: 100%; width: 100%;
  color: var(--text); font-family: "Inter", sans-serif; font-size: 14px;
}
.admin-profile-main { width: 100%; max-width: 1040px; margin: 0 auto; padding: 32px 36px 48px; }

/* Header Banner */
.admin-profile-header {
  position: relative; min-height: 148px; padding: 28px 32px; margin-bottom: 28px;
  overflow: hidden; border-radius: 18px;
  background: linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 70%, #4b9fe8) 100%);
  box-shadow: 0 10px 30px rgba(15, 30, 50, 0.12);
  display: flex; align-items: center; justify-content: space-between; gap: 20px;
}
.admin-profile-header-circle-1 {
  position: absolute; width: 220px; height: 220px; right: 80px; top: -100px;
  border: 1px solid rgba(255,255,255,.14); border-radius: 50%; pointer-events: none;
}
.admin-profile-header-circle-2 {
  position: absolute; width: 140px; height: 140px; right: -30px; bottom: -60px;
  border-radius: 50%; background: rgba(255,255,255,.08); pointer-events: none;
}
.admin-profile-header-content { position: relative; z-index: 2; max-width: 600px; }
.admin-profile-eyebrow {
  display: inline-flex; align-items: center; gap: 6px;
  color: rgba(255,255,255,.85); font-size: 11px; font-weight: 700;
  letter-spacing: .9px; text-transform: uppercase;
  background: rgba(255, 255, 255, 0.14); padding: 4px 10px; border-radius: 20px;
}
.admin-profile-header h1 { margin: 8px 0 6px; color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: -.5px; }
.admin-profile-header p { margin: 0; color: rgba(255,255,255,.88); font-size: 13px; line-height: 1.5; }

/* Admin Hero Card */
.admin-hero-card {
  padding: 24px; border: 1px solid var(--border); border-radius: 16px;
  background: var(--surface); display: flex; align-items: center; justify-content: space-between;
  gap: 20px; margin-bottom: 28px; box-shadow: 0 2px 10px rgba(15, 30, 50, 0.03); flex-wrap: wrap;
}
.admin-hero-left { display: flex; align-items: center; gap: 18px; min-width: 0; }
.admin-hero-avatar {
  width: 64px; height: 64px; flex-shrink: 0; border-radius: 16px;
  background: linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 65%, #60a5fa));
  color: #fff; display: flex; align-items: center; justify-content: center;
  font-size: 24px; font-weight: 800; box-shadow: 0 4px 14px rgba(15, 30, 50, 0.14);
}
.admin-hero-info h2 { margin: 0; color: var(--text); font-size: 20px; font-weight: 800; display: flex; align-items: center; gap: 8px; }
.admin-role-badge {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 10px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase;
  background: var(--hp-pri-lt, #eef5fd); color: var(--primary);
  padding: 3px 8px; border-radius: 6px; border: 1px solid color-mix(in srgb, var(--primary) 20%, transparent);
}
.admin-hero-info p { margin: 4px 0 0; color: var(--text-soft); font-size: 13px; display: flex; align-items: center; gap: 6px; }
.admin-edit-btn {
  height: 40px; padding: 0 16px; border: 1px solid var(--border); border-radius: 10px;
  background: var(--surface); color: var(--primary); font-family: inherit; font-size: 12.5px;
  font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 8px;
  transition: all .15s;
}
.admin-edit-btn:hover { background: var(--hp-pri-lt, #eef5fd); border-color: var(--primary); }

/* Settings Sections */
.admin-section-title {
  display: flex; align-items: center; gap: 8px; margin: 0 0 14px;
  color: var(--text); font-size: 16px; font-weight: 800;
}
.admin-card {
  border: 1px solid var(--border); border-radius: 16px; background: var(--surface);
  overflow: hidden; margin-bottom: 24px; box-shadow: 0 2px 10px rgba(15, 30, 50, 0.02);
}
.admin-row {
  padding: 18px 22px; display: flex; align-items: center; justify-content: space-between;
  gap: 16px; border-bottom: 1px solid var(--border);
}
.admin-row:last-child { border-bottom: none; }
.admin-row-info { flex: 1; min-width: 0; }
.admin-row-info strong { display: block; color: var(--text); font-size: 13.5px; font-weight: 700; }
.admin-row-info span { display: block; margin-top: 3px; color: var(--text-soft); font-size: 12px; }

/* Preset Colors Grid */
.admin-colors-grid {
  display: flex; flex-wrap: wrap; gap: 10px; align-items: center;
}
.admin-color-swatch {
  width: 34px; height: 34px; border-radius: 10px; border: 2px solid transparent;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 13px; transition: transform .15s, border-color .15s;
}
.admin-color-swatch:hover { transform: scale(1.1); }
.admin-color-swatch.active { border-color: #ffffff; box-shadow: 0 0 0 2.5px var(--primary); }
.admin-custom-color-btn {
  height: 34px; padding: 0 10px; border: 1px solid var(--border); border-radius: 10px;
  background: var(--surface); color: var(--text); display: inline-flex; align-items: center;
  gap: 6px; font-size: 12px; font-weight: 600; cursor: pointer; position: relative; overflow: hidden;
}
.admin-color-input-hidden {
  position: absolute; opacity: 0; width: 100%; height: 100%; left: 0; top: 0; cursor: pointer;
}

/* Header Image Upload Control */
.admin-header-img-control {
  display: flex; align-items: center; gap: 12px;
}
.admin-img-preview-box {
  display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
}
.admin-mini-thumbnail {
  width: 96px; height: 42px; border-radius: 8px; border: 1px solid var(--border);
  overflow: hidden; position: relative; flex-shrink: 0; box-shadow: 0 1px 5px rgba(0,0,0,0.08);
  background: #0b1523; cursor: pointer; transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.admin-mini-thumbnail:hover {
  transform: scale(1.04); box-shadow: 0 3px 10px rgba(0,0,0,0.15);
}
.admin-mini-thumbnail img { width: 100%; height: 100%; object-fit: cover; }
.admin-mini-tag {
  position: absolute; bottom: 2px; right: 3px; font-size: 8px; font-weight: 700;
  background: rgba(15, 23, 42, 0.75); color: #fff; padding: 1px 4px; border-radius: 3px; line-height: 1;
}
.admin-mini-actions { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }

/* Language Switcher */
.admin-lang-group { display: flex; gap: 8px; }
.admin-lang-btn {
  height: 36px; padding: 0 14px; border: 1px solid var(--border); border-radius: 9px;
  background: var(--surface); color: var(--text-soft); font-family: inherit; font-size: 12.5px;
  font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 7px;
  transition: all .15s;
}
.admin-lang-btn.active {
  border-color: var(--primary); background: var(--hp-pri-lt, #eef5fd); color: var(--primary); font-weight: 700;
}

/* Dark Mode Switch */
.admin-toggle-switch {
  position: relative; width: 48px; height: 26px; border-radius: 999px;
  background: #cbd5e1; cursor: pointer; transition: background .2s; border: none; padding: 0;
}
.admin-toggle-switch.active { background: var(--primary); }
.admin-toggle-thumb {
  position: absolute; left: 3px; top: 3px; width: 20px; height: 20px;
  border-radius: 50%; background: #ffffff; box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  transition: transform .2s;
}
.admin-toggle-switch.active .admin-toggle-thumb { transform: translateX(22px); }

/* Clickable Menu Rows */
.admin-menu-row {
  padding: 18px 22px; display: flex; align-items: center; justify-content: space-between;
  gap: 16px; border-bottom: 1px solid var(--border); cursor: pointer; transition: background .15s;
}
.admin-menu-row:hover { background: var(--hp-pri-lt, #eef5fd); }
.admin-menu-row:last-child { border-bottom: none; }
.admin-menu-row svg.arrow { color: var(--text-muted); font-size: 12px; }

/* Action Buttons */
.admin-action-btn {
  height: 36px; padding: 0 14px; border-radius: 9px; font-family: inherit;
  font-size: 12px; font-weight: 700; cursor: pointer; display: inline-flex;
  align-items: center; gap: 7px; transition: .15s;
}
.admin-action-btn.primary {
  border: none; background: var(--primary); color: #fff;
  box-shadow: 0 2px 8px rgba(15, 30, 50, 0.12);
}
.admin-action-btn.primary:hover { filter: brightness(1.08); }
.admin-action-btn.danger {
  border: 1px solid #fecaca; background: #fef2f2; color: #dc2626;
}
.admin-action-btn.danger:hover { background: #fee2e2; }
.admin-action-btn.secondary {
  border: 1px solid var(--border); background: var(--surface); color: var(--text);
}
.admin-action-btn.secondary:hover { background: var(--border); }

/* Modals */
.admin-modal-overlay {
  position: fixed; inset: 0; z-index: 200; padding: 20px;
  background: rgba(5, 14, 26, 0.55); display: flex; align-items: center;
  justify-content: center; backdrop-filter: blur(5px); animation: pfFadeIn .18s ease;
}
.admin-modal {
  width: 100%; max-width: 500px; padding: 26px; border: 1px solid var(--border);
  border-radius: 18px; background: var(--surface); box-shadow: 0 24px 60px rgba(0, 0, 0, 0.22);
  animation: pfModalIn .2s cubic-bezier(0.16, 1, 0.3, 1);
}
.admin-modal-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 12px; }
.admin-modal-header h3 { margin: 0; color: var(--text); font-size: 18px; font-weight: 700; }
.admin-modal-close {
  width: 32px; height: 32px; border: 1px solid var(--border); border-radius: 9px;
  background: var(--surface); color: var(--text-soft); display: flex; align-items: center; justify-content: center; cursor: pointer;
}
.admin-modal-close:hover { background: #fee2e2; color: #dc2626; border-color: #fca5a5; }
.admin-modal-desc { margin: 0 0 16px; color: var(--text-soft); font-size: 12.5px; line-height: 1.6; }
.admin-input-group { margin-bottom: 20px; }
.admin-input-label { display: block; margin-bottom: 7px; color: var(--text); font-size: 12.5px; font-weight: 700; }
.admin-input {
  width: 100%; height: 42px; padding: 0 14px; border: 1px solid var(--border);
  border-radius: 10px; background: var(--surface); color: var(--text); font-family: inherit; font-size: 13.5px;
}
.admin-input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(33, 104, 180, 0.16); }
.admin-modal-error { color: #dc2626; font-size: 12px; margin-top: 6px; font-weight: 600; }
.admin-modal-actions { display: flex; gap: 12px; margin-top: 22px; }
.admin-modal-actions button { flex: 1; height: 40px; border-radius: 10px; font-family: inherit; font-size: 12.5px; font-weight: 700; cursor: pointer; }

/* Adjust Header Modal */
.admin-adjust-modal {
  width: 100%; max-width: 580px; padding: 24px; border-radius: 18px;
  background: var(--surface); border: 1px solid var(--border);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.25);
  animation: pfModalIn .2s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex; flex-direction: column; gap: 16px;
}
.admin-adjust-preview-wrapper {
  width: 100%; height: 165px; border-radius: 14px; overflow: hidden;
  position: relative; background: #0b1523; border: 1px solid var(--border);
  box-shadow: inset 0 0 20px rgba(0,0,0,0.3);
}
.admin-adjust-preview-img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.04s ease, object-position 0.04s ease;
  pointer-events: none;
}
.admin-adjust-preview-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(5, 14, 26, 0.62) 0%, rgba(10, 25, 45, 0.38) 100%);
  display: flex; flex-direction: column; justify-content: center;
  padding: 18px 22px; color: #ffffff; pointer-events: none;
}
.admin-adjust-mock-eyebrow {
  display: inline-flex; align-items: center; gap: 5px; font-size: 9.5px; font-weight: 700;
  text-transform: uppercase; background: rgba(255, 255, 255, 0.18); padding: 3px 8px;
  border-radius: 12px; width: fit-content; margin-bottom: 6px; backdrop-filter: blur(2px);
}
.admin-adjust-mock-h1 { font-size: 19px; font-weight: 800; margin: 0 0 4px; line-height: 1.2; }
.admin-adjust-mock-p { font-size: 11px; margin: 0; color: rgba(255, 255, 255, 0.82); line-height: 1.4; max-width: 360px; }
.admin-adjust-controls {
  display: flex; flex-direction: column; gap: 12px; background: var(--hp-pri-lt, #f8fafc);
  padding: 14px 16px; border-radius: 12px; border: 1px solid var(--border);
}
.admin-slider-row { display: flex; flex-direction: column; gap: 5px; }
.admin-slider-label { display: flex; justify-content: space-between; font-size: 11.5px; font-weight: 600; color: var(--text); }
.admin-slider-label span:last-child { color: var(--primary); font-weight: 700; }
.admin-range-input {
  width: 100%; height: 6px; border-radius: 3px; background: #cbd5e1; outline: none; cursor: pointer; accent-color: var(--primary);
}
.admin-adjust-actions { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.admin-adjust-actions-right { display: flex; gap: 8px; }

/* Rich About Modal (Aligned with User Profile + Admin Capabilities) */
.admin-about-modal {
  width: 100%; max-width: 580px; padding: 24px; border: 1px solid var(--border);
  border-radius: 20px; background: var(--surface); box-shadow: 0 24px 60px rgba(0, 0, 0, 0.22);
  animation: pfModalIn .2s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex; flex-direction: column; gap: 16px; max-height: 90vh; overflow-y: auto;
}
.admin-about-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.admin-about-app-brand { display: flex; align-items: center; gap: 14px; }
.admin-about-logo-wrapper {
  width: 52px; height: 52px; border-radius: 14px;
  background: linear-gradient(135deg, var(--hp-pri-lt, #eef5fd), var(--surface));
  border: 1px solid var(--border); display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 12px rgba(15, 30, 50, 0.06); flex-shrink: 0; overflow: hidden; padding: 6px;
}
.admin-about-logo-wrapper img { width: 100%; height: 100%; object-fit: contain; }
.admin-about-app-title { margin: 0; color: var(--text); font-size: 20px; font-weight: 800; letter-spacing: -0.3px; }
.admin-about-app-tagline { margin: 3px 0 0; color: var(--text-soft); font-size: 12px; line-height: 1.4; }
.admin-about-card {
  padding: 16px 18px; border: 1px solid var(--border); border-radius: 14px;
  background: var(--hp-pri-lt, #f8fafc); display: flex; flex-direction: column; gap: 8px;
}
.admin-about-card-title { display: flex; align-items: center; gap: 10px; }
.admin-about-card-icon {
  width: 32px; height: 32px; border-radius: 8px; background: var(--primary);
  color: #fff; display: flex; align-items: center; justify-content: center; font-size: 14px;
}
.admin-about-card-title h4 { margin: 0; color: var(--text); font-size: 14px; font-weight: 700; }
.admin-about-card-desc { margin: 0; color: var(--text-soft); font-size: 12.5px; line-height: 1.6; }

.admin-about-features-heading { margin: 10px 0 8px; color: var(--text); font-size: 13.5px; font-weight: 700; }
.admin-about-features-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.admin-about-feature-box {
  padding: 12px; border: 1px solid var(--border); border-radius: 12px; background: var(--surface);
  display: flex; gap: 10px; align-items: flex-start;
}
.admin-about-feature-icon {
  width: 32px; height: 32px; border-radius: 8px; background: var(--hp-pri-lt, #eef5fd);
  color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0;
}
.admin-about-feature-box strong { display: block; color: var(--text); font-size: 12px; font-weight: 700; }
.admin-about-feature-box span { display: block; margin-top: 2px; color: var(--text-soft); font-size: 11px; line-height: 1.4; }

.admin-about-info-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 4px;
}
.admin-about-info-item {
  padding: 10px 14px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface);
}
.admin-about-info-item span { display: block; color: var(--text-muted); font-size: 11px; }
.admin-about-info-item strong { display: block; color: var(--text); font-size: 13px; font-weight: 700; margin-top: 2px; }

@keyframes pfFadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes pfModalIn { from { opacity: 0; transform: scale(.95) translateY(10px); } to { opacity: 1; transform: none; } }

/* Dark Mode Overrides */
.dark.admin-profile-page {
  --border: #1b2e40; --surface: #0f1c2b; --background: transparent;
  --text: #dde9f6; --text-soft: #8da4be; --text-muted: #4b6277;
}
.dark .admin-hero-card { background: #0f1c2b; border-color: #1b2e40; }
.dark .admin-card { background: #0f1c2b; border-color: #1b2e40; }
.dark .admin-row { border-color: #1b2e40; }
.dark .admin-edit-btn { background: #132235; border-color: #1b2e40; color: #60a5fa; }
.dark .admin-custom-color-btn { background: #132235; border-color: #1b2e40; color: #dde9f6; }
.dark .admin-lang-btn { background: #132235; border-color: #1b2e40; color: #8da4be; }
.dark .admin-lang-btn.active { background: #111e30; border-color: var(--primary); color: #60a5fa; }
.dark .admin-action-btn.secondary { background: #132235; border-color: #1b2e40; color: #dde9f6; }
.dark .admin-action-btn.danger { background: #231215; border-color: #4c1d22; color: #f87171; }
.dark .admin-action-btn.danger:hover { background: #35161b; color: #fca5a5; }
.dark .admin-modal { background: #0f1c2b; border-color: #1b2e40; }
.dark .admin-about-modal { background: #0f1c2b; border-color: #1b2e40; }
.dark .admin-about-logo-wrapper { background: #132235; border-color: #1b2e40; }
.dark .admin-about-card { background: #132235; border-color: #1b2e40; }
.dark .admin-about-feature-box { background: #132235; border-color: #1b2e40; }
.dark .admin-about-info-item { background: #132235; border-color: #1b2e40; }
.dark .admin-adjust-controls { background: #132235; border-color: #1b2e40; }
.dark .admin-input { background: #132235; border-color: #1b2e40; color: #dde9f6; }
.dark .admin-modal-close { background: #132235; border-color: #1b2e40; color: #8da4be; }
.dark .admin-menu-row:hover { background: #142437; }

@media (max-width: 768px) {
  .admin-profile-main { padding: 20px 16px 40px; }
  .admin-profile-header { padding: 22px 20px; }
  .admin-hero-card { flex-direction: column; align-items: flex-start; }
  .admin-row { flex-direction: column; align-items: flex-start; gap: 12px; }
  .admin-colors-grid { width: 100%; }
  .admin-about-features-grid { grid-template-columns: 1fr; }
  .admin-about-info-grid { grid-template-columns: 1fr; }
}
`;

export default function AdminProfile() {
  const navigate = useNavigate();
  const {
    darkMode,
    toggleTheme,
    primaryColor,
    setPrimaryColor,
    imageDataUrl,
    setImageDataUrl,
    resetTheme,
    lang,
    setLang,
    t,
  } = useTheme();

  const [admin, setAdmin] = useState(() => getCurrentAdmin());
  const avatarLetter = (admin.name || admin.username || "A").charAt(0).toUpperCase();

  const [showEdit, setShowEdit] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);

  const [editName, setEditName] = useState("");
  const [editError, setEditError] = useState("");
  const [savedSuccess, setSavedSuccess] = useState("");

  const fileInputRef = useRef(null);
  const [adjustSourceImg, setAdjustSourceImg] = useState(null);
  const [zoom, setZoom] = useState(100);
  const [posY, setPosY] = useState(50);
  const [posX, setPosX] = useState(50);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        const name = parsed.username || parsed.name || "Admin";
        setAdmin({
          username: name,
          name: name,
          email: parsed.email || "admin@hidocs.app",
          role: "ADMINISTRATOR",
        });
      }
    } catch {}
  }, []);

  const openEdit = () => {
    setEditName(admin.username || admin.name || "Admin");
    setEditError("");
    setShowEdit(true);
  };

  const saveUsername = (e) => {
    e.preventDefault();
    const clean = editName.trim();
    if (clean.length < 3) {
      setEditError("Username minimal 3 karakter.");
      return;
    }
    if (clean.length > 30) {
      setEditError("Username maksimal 30 karakter.");
      return;
    }

    try {
      const savedUser = localStorage.getItem("user");
      const previous = savedUser ? JSON.parse(savedUser) : {};
      const updated = {
        ...previous,
        username: clean,
        name: clean,
        email: admin.email,
        role: "ADMINISTRATOR",
      };
      localStorage.setItem("user", JSON.stringify(updated));
      setAdmin(updated);
      setShowEdit(false);
      setSavedSuccess("Username berhasil diperbarui.");
      setTimeout(() => setSavedSuccess(""), 2500);
    } catch (err) {
      console.error("Gagal menyimpan username admin:", err);
      setEditError("Username gagal disimpan.");
    }
  };

  const openAdjustModal = (dataUrl) => {
    setAdjustSourceImg(dataUrl);
    setZoom(100);
    setPosY(50);
    setPosX(50);
    setShowAdjustModal(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result;
      if (dataUrl) {
        try {
          localStorage.setItem("hidocs_raw_header_image", dataUrl);
        } catch {}
        openAdjustModal(dataUrl);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleOpenAdjustExisting = () => {
    const raw = localStorage.getItem("hidocs_raw_header_image") || imageDataUrl;
    if (raw) {
      openAdjustModal(raw);
    }
  };

  const applyCrop = () => {
    if (!adjustSourceImg) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1400;
      canvas.height = 420;
      const ctx = canvas.getContext("2d");

      const scale = zoom / 100;
      const targetRatio = canvas.width / canvas.height;
      const imgRatio = img.naturalWidth / img.naturalHeight;

      let cropW, cropH;
      if (imgRatio > targetRatio) {
        cropH = img.naturalHeight / scale;
        cropW = cropH * targetRatio;
      } else {
        cropW = img.naturalWidth / scale;
        cropH = cropW / targetRatio;
      }

      const maxOffsetX = Math.max(0, img.naturalWidth - cropW);
      const maxOffsetY = Math.max(0, img.naturalHeight - cropH);
      const sx = maxOffsetX * (posX / 100);
      const sy = maxOffsetY * (posY / 100);

      ctx.drawImage(img, sx, sy, cropW, cropH, 0, 0, canvas.width, canvas.height);
      const resultDataUrl = canvas.toDataURL("image/jpeg", 0.92);
      setImageDataUrl(resultDataUrl);
      setShowAdjustModal(false);
    };
    img.src = adjustSourceImg;
  };

  const removeHeaderImage = () => {
    setImageDataUrl(null);
    try {
      localStorage.removeItem("hidocs_raw_header_image");
    } catch {}
  };

  const handleConfirmReset = () => {
    resetTheme();
    try {
      localStorage.removeItem("hidocs_raw_header_image");
    } catch {}
    setShowResetConfirm(false);
  };

  const confirmSignOut = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login", { replace: true });
  };

  return (
    <div className={["admin-profile-page", darkMode ? "dark" : ""].filter(Boolean).join(" ")}>
      <style>{adminProfileStyles}</style>

      <main className="admin-profile-main">
        {/* Header Banner */}
        <header className="admin-profile-header">
          <div className="admin-profile-header-circle-1" />
          <div className="admin-profile-header-circle-2" />

          <div className="admin-profile-header-content">
            <span className="admin-profile-eyebrow">ADMINISTRATOR</span>
            <h1>Profil Admin</h1>
            <p>Kelola pengaturan akun administrator, tampilan tema sistem, dan preferensi aplikasi HiDocs.</p>
          </div>
        </header>

        {savedSuccess && (
          <div style={{
            padding: "12px 18px",
            marginBottom: 20,
            borderRadius: 12,
            background: "#dcfce7",
            color: "#15803d",
            fontSize: 13,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
            <FaCheckCircle />
            <span>{savedSuccess}</span>
          </div>
        )}

        {/* Admin Hero Card */}
        <section className="admin-hero-card">
          <div className="admin-hero-left">
            <div className="admin-hero-avatar">{avatarLetter}</div>
            <div className="admin-hero-info">
              <h2>
                <span>{admin.name || admin.username}</span>
                <span className="admin-role-badge">Admin</span>
              </h2>
              <p><FaEnvelope /> {admin.email || "admin@hidocs.app"}</p>
            </div>
          </div>
          <button type="button" className="admin-edit-btn" onClick={openEdit}>
            <FaPen />
            <span>Edit Profil</span>
          </button>
        </section>

        {/* Theme & Appearance */}
        <h3 className="admin-section-title"><FaPaintBrush /> Tampilan & Tema</h3>
        <section className="admin-card">
          {/* Dark Mode */}
          <div className="admin-row">
            <div className="admin-row-info">
              <strong>{darkMode ? "Mode Gelap" : "Mode Terang"}</strong>
              <span>Beralih antara tema visual terang dan gelap untuk antarmuka admin.</span>
            </div>
            <button
              type="button"
              className={`admin-toggle-switch${darkMode ? " active" : ""}`}
              onClick={toggleTheme}
              aria-label="Toggle Dark Mode"
            >
              <span className="admin-toggle-thumb" />
            </button>
          </div>

          {/* Theme Color Swatches */}
          <div className="admin-row">
            <div className="admin-row-info">
              <strong>Warna Tema</strong>
              <span>Pilih warna aksen utama yang digunakan di seluruh panel navigasi dan tombol admin.</span>
            </div>
            <div className="admin-colors-grid">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color.hex}
                  type="button"
                  className={`admin-color-swatch${primaryColor?.toLowerCase() === color.hex.toLowerCase() ? " active" : ""}`}
                  style={{ backgroundColor: color.hex }}
                  onClick={() => setPrimaryColor(color.hex)}
                  title={color.name}
                  aria-label={color.name}
                >
                  {primaryColor?.toLowerCase() === color.hex.toLowerCase() && <FaCheck />}
                </button>
              ))}
              <div className="admin-custom-color-btn" title="Pilih Warna Kustom">
                <FaPaintBrush style={{ color: primaryColor }} />
                <span>Custom</span>
                <input
                  type="color"
                  className="admin-color-input-hidden"
                  value={primaryColor || "#2168b4"}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  aria-label="Custom color picker"
                />
              </div>
            </div>
          </div>

          {/* Home Header Background Image */}
          <div className="admin-row">
            <div className="admin-row-info">
              <strong>Gambar Header Beranda</strong>
              <span>Unggah gambar kustom untuk latar belakang kartu header beranda admin.</span>
            </div>
            <div className="admin-header-img-control">
              {imageDataUrl ? (
                <div className="admin-img-preview-box">
                  <div
                    className="admin-mini-thumbnail"
                    onClick={handleOpenAdjustExisting}
                    title="Klik untuk menyesuaikan posisi"
                  >
                    <img src={imageDataUrl} alt="Header Preview" />
                    <span className="admin-mini-tag">Aktif</span>
                  </div>
                  <div className="admin-mini-actions">
                    <button
                      type="button"
                      className="admin-action-btn primary"
                      onClick={() => fileInputRef.current?.click()}
                      title="Ganti Gambar"
                    >
                      <FaImage />
                      <span>Ganti</span>
                    </button>
                    <button
                      type="button"
                      className="admin-action-btn danger"
                      onClick={removeHeaderImage}
                      title="Hapus Gambar"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className="admin-action-btn primary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FaImage />
                  <span>Unggah Gambar</span>
                </button>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                style={{ display: "none" }}
              />
            </div>
          </div>

          {/* Language Switcher */}
          <div className="admin-row">
            <div className="admin-row-info">
              <strong>Bahasa</strong>
              <span>Pilih bahasa antarmuka aplikasi HiDocs.</span>
            </div>
            <div className="admin-lang-group">
              {LANGS.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  className={`admin-lang-btn${lang === item.code ? " active" : ""}`}
                  onClick={() => setLang(item.code)}
                >
                  <span>{item.flag}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Reset Theme */}
          <div className="admin-row">
            <div className="admin-row-info">
              <strong>Reset Tema</strong>
              <span>Kembalikan warna tema dan gambar latar header ke setelan bawaan.</span>
            </div>
            <button
              type="button"
              className="admin-action-btn secondary"
              onClick={() => setShowResetConfirm(true)}
            >
              <FaUndo />
              <span>Reset ke Default</span>
            </button>
          </div>
        </section>

        {/* Other Details */}
        <h3 className="admin-section-title"><FaInfoCircle /> Informasi & Fitur</h3>
        <section className="admin-card">
          <div className="admin-menu-row" onClick={() => setShowAbout(true)}>
            <div className="admin-row-info">
              <strong>Tentang HiDocs!</strong>
              <span>Informasi platform, kemampuan administratif, dan fitur pengelola formulir.</span>
            </div>
            <FaChevronRight className="arrow" />
          </div>
        </section>

        {/* Account Role / Switch Role */}
        <h3 className="admin-section-title"><FaShieldAlt /> Peran Akun</h3>
        <section className="admin-card">
          <div className="admin-row">
            <div className="admin-row-info">
              <strong>Mode Saat Ini: Creator (Administrator)</strong>
              <span>Dapat merancang formulir, import Word, mengelola responden, dan memantau analitik skor.</span>
            </div>
            <button
              type="button"
              className="admin-action-btn primary"
              onClick={() => navigate("/choose-role")}
              title="Ganti ke User (Responden)"
            >
              <FaUser />
              <span>Ganti Peran</span>
            </button>
          </div>
        </section>

        {/* Account Session */}
        <h3 className="admin-section-title"><FaShieldAlt /> Sesi Akun</h3>
        <section className="admin-card">
          <div className="admin-row">
            <div className="admin-row-info">
              <strong>Status Sesi</strong>
              <span>Masuk sebagai Administrator ({admin.email})</span>
            </div>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              color: "#16a34a",
              fontWeight: 700,
              fontSize: 12,
            }}>
              <FaCheckCircle /> Aktif
            </span>
          </div>
          <div className="admin-row">
            <div className="admin-row-info">
              <strong>Keluar Akun</strong>
              <span>Akhiri sesi kerja administrator di peramban ini.</span>
            </div>
            <button
              type="button"
              className="admin-action-btn danger"
              onClick={() => setShowLogoutModal(true)}
            >
              <FaSignOutAlt />
              <span>Keluar</span>
            </button>
          </div>
        </section>
      </main>

      {/* Edit Username Modal */}
      {showEdit && (
        <div className="admin-modal-overlay" onClick={() => setShowEdit(false)} role="dialog" aria-modal="true">
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Edit Profil Admin</h3>
              <button type="button" className="admin-modal-close" onClick={() => setShowEdit(false)} aria-label="Close">
                <FaTimes />
              </button>
            </div>
            <p className="admin-modal-desc">Perbarui nama pengguna administrator yang tampil di dasbor.</p>
            <form onSubmit={saveUsername}>
              <div className="admin-input-group">
                <label className="admin-input-label">Username</label>
                <input
                  type="text"
                  className="admin-input"
                  value={editName}
                  onChange={(e) => { setEditName(e.target.value); if (editError) setEditError(""); }}
                  placeholder="Masukkan username admin"
                  autoFocus
                />
                {editError && <div className="admin-modal-error">{editError}</div>}
              </div>
              <div className="admin-modal-actions">
                <button type="button" className="admin-action-btn secondary" onClick={() => setShowEdit(false)}>
                  Batal
                </button>
                <button type="submit" className="admin-action-btn primary">
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rich About Modal (Admin Capabilities + App Information) */}
      {showAbout && (
        <div className="admin-modal-overlay" onClick={() => setShowAbout(false)} role="dialog" aria-modal="true">
          <div className="admin-about-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-about-header">
              <div className="admin-about-app-brand">
                <div className="admin-about-logo-wrapper">
                  <img src={logo} alt="HiDocs Logo" />
                </div>
                <div>
                  <h3 className="admin-about-app-title">HiDocs! Admin</h3>
                  <p className="admin-about-app-tagline">Platform Formulir Digital & Evaluasi Terintegrasi</p>
                </div>
              </div>
              <button type="button" className="admin-modal-close" onClick={() => setShowAbout(false)} aria-label="Close">
                <FaTimes />
              </button>
            </div>

            {/* About Card */}
            <div className="admin-about-card">
              <div className="admin-about-card-title">
                <div className="admin-about-card-icon">
                  <FaInfoCircle />
                </div>
                <h4>Pusat Kendali Administrator</h4>
              </div>
              <p className="admin-about-card-desc">
                HiDocs! menyediakan ekosistem lengkap untuk merancang form, mendistribusikan link & QR Code, melakukan impor soal dari dokumen Microsoft Word (.docx), serta memantau analitik skor dan respons secara real-time.
              </p>
            </div>

            {/* Admin Features Grid */}
            <div>
              <h4 className="admin-about-features-heading">Kemampuan & Fitur Admin</h4>
              <div className="admin-about-features-grid">
                <div className="admin-about-feature-box">
                  <div className="admin-about-feature-icon"><FaWpforms /></div>
                  <div>
                    <strong>Form Builder Interaktif</strong>
                    <span>Buat form fleksibel: pilihan ganda, essay, tanggal, dan rating.</span>
                  </div>
                </div>
                <div className="admin-about-feature-box">
                  <div className="admin-about-feature-icon"><FaFileWord /></div>
                  <div>
                    <strong>Import Dokumen Word</strong>
                    <span>Konversi berkas .docx menjadi bank soal secara otomatis.</span>
                  </div>
                </div>
                <div className="admin-about-feature-box">
                  <div className="admin-about-feature-icon"><FaQrcode /></div>
                  <div>
                    <strong>QR Code & Link Publik</strong>
                    <span>Bagikan form instan dengan QR download dan custom link.</span>
                  </div>
                </div>
                <div className="admin-about-feature-box">
                  <div className="admin-about-feature-icon"><FaChartBar /></div>
                  <div>
                    <strong>Analitik & Distribusi Skor</strong>
                    <span>Pantau rata-rata nilai, skor tertinggi/terendah, dan grafik skor.</span>
                  </div>
                </div>
                <div className="admin-about-feature-box">
                  <div className="admin-about-feature-icon"><FaClipboardCheck /></div>
                  <div>
                    <strong>Kontrol Hasil & Ulasan</strong>
                    <span>Atur visibilitas skor dan review jawaban bagi responden.</span>
                  </div>
                </div>
                <div className="admin-about-feature-box">
                  <div className="admin-about-feature-icon"><FaClock /></div>
                  <div>
                    <strong>Batas Waktu & Jadwal</strong>
                    <span>Atur durasi pengerjaan form dengan timer auto-submit.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* System Info */}
            <div>
              <h4 className="admin-about-features-heading">Informasi Aplikasi</h4>
              <div className="admin-about-info-grid">
                <div className="admin-about-info-item">
                  <span>Aplikasi</span>
                  <strong>HiDocs!</strong>
                </div>
                <div className="admin-about-info-item">
                  <span>Versi</span>
                  <strong>1.0.0</strong>
                </div>
                <div className="admin-about-info-item">
                  <span>Hak Akses</span>
                  <strong>Administrator</strong>
                </div>
                <div className="admin-about-info-item">
                  <span>Pengembang</span>
                  <strong>Kelompok 3</strong>
                </div>
              </div>
            </div>

            <div className="admin-modal-actions" style={{ marginTop: 8 }}>
              <button type="button" className="admin-action-btn primary" onClick={() => setShowAbout(false)}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Adjust Header Image Modal */}
      {showAdjustModal && (
        <div className="admin-modal-overlay" onClick={() => setShowAdjustModal(false)} role="dialog" aria-modal="true">
          <div className="admin-adjust-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <FaSlidersH style={{ color: "var(--primary)" }} />
                <h3>Sesuaikan Gambar Header</h3>
              </div>
              <button type="button" className="admin-modal-close" onClick={() => setShowAdjustModal(false)} aria-label="Close">
                <FaTimes />
              </button>
            </div>
            <p className="admin-modal-desc">Geser posisi atau perbesar gambar agar sesuai dengan bingkai header Beranda admin.</p>

            {/* Live Mock Header Preview */}
            <div className="admin-adjust-preview-wrapper">
              <img
                src={adjustSourceImg}
                alt="Adjust preview"
                className="admin-adjust-preview-img"
                style={{
                  objectPosition: `${posX}% ${posY}%`,
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: `${posX}% ${posY}%`,
                }}
              />
              <div className="admin-adjust-preview-overlay">
                <div className="admin-adjust-mock-eyebrow">
                  ★ Pratinjau Header
                </div>
                <div className="admin-adjust-mock-h1">Halo, {admin.name || admin.username} 👋</div>
                <p className="admin-adjust-mock-p">Kelola formulir, pantau respons responden, dan buat form baru.</p>
              </div>
            </div>

            {/* Precision Sliders */}
            <div className="admin-adjust-controls">
              <div className="admin-slider-row">
                <div className="admin-slider-label">
                  <span>Perbesar / Zoom</span>
                  <span>{zoom}%</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="250"
                  step="1"
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="admin-range-input"
                />
              </div>

              <div className="admin-slider-row">
                <div className="admin-slider-label">
                  <span>Posisi Vertikal (Atas - Bawah)</span>
                  <span>{posY}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={posY}
                  onChange={(e) => setPosY(Number(e.target.value))}
                  className="admin-range-input"
                />
              </div>

              <div className="admin-slider-row">
                <div className="admin-slider-label">
                  <span>Posisi Horizontal (Kiri - Kanan)</span>
                  <span>{posX}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={posX}
                  onChange={(e) => setPosX(Number(e.target.value))}
                  className="admin-range-input"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="admin-adjust-actions">
              <button
                type="button"
                className="admin-action-btn secondary"
                onClick={() => { setZoom(100); setPosY(50); setPosX(50); }}
                title="Reset sliders"
              >
                <FaUndo />
                <span>Reset</span>
              </button>
              <div className="admin-adjust-actions-right">
                <button type="button" className="admin-action-btn secondary" onClick={() => setShowAdjustModal(false)}>
                  Batal
                </button>
                <button type="button" className="admin-action-btn primary" onClick={applyCrop}>
                  <FaCheck />
                  <span>Terapkan ke Header</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reset Theme Confirmation Modal */}
      {showResetConfirm && (
        <div className="admin-modal-overlay" onClick={() => setShowResetConfirm(false)} role="dialog" aria-modal="true">
          <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 410, textAlign: "center", padding: 28 }}>
            <div style={{
              width: 52,
              height: 52,
              margin: "0 auto 16px",
              borderRadius: 14,
              background: "var(--hp-pri-lt, #eef5fd)",
              color: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
            }}>
              <FaUndo />
            </div>
            <h3 style={{ margin: "0 0 8px", color: "var(--text)", fontSize: 17, fontWeight: 700 }}>
              Kembalikan Tema ke Setelan Awal?
            </h3>
            <p style={{ margin: "0 0 24px", color: "var(--text-soft)", fontSize: 13, lineHeight: 1.6 }}>
              Warna tema kustom dan gambar latar header Beranda akan dikembalikan ke setelan bawaan HiDocs.
            </p>
            <div className="admin-modal-actions">
              <button
                type="button"
                className="admin-action-btn secondary"
                onClick={() => setShowResetConfirm(false)}
              >
                Batal
              </button>
              <button
                type="button"
                className="admin-action-btn primary"
                onClick={handleConfirmReset}
              >
                <FaCheck />
                <span>Ya, Reset Tema</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="admin-modal-overlay" onClick={() => setShowLogoutModal(false)} role="dialog" aria-modal="true">
          <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 410, textAlign: "center", padding: 28 }}>
            <div style={{
              width: 52,
              height: 52,
              margin: "0 auto 16px",
              borderRadius: 14,
              background: "#fee2e2",
              color: "#dc2626",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
            }}>
              <FaSignOutAlt />
            </div>
            <h3 style={{ margin: "0 0 8px", color: "var(--text)", fontSize: 17, fontWeight: 700 }}>
              Keluar dari Akun Admin?
            </h3>
            <p style={{ margin: "0 0 24px", color: "var(--text-soft)", fontSize: 13, lineHeight: 1.6 }}>
              Anda harus memasukkan email dan kata sandi kembali untuk mengakses panel administrator HiDocs.
            </p>
            <div className="admin-modal-actions">
              <button
                type="button"
                className="admin-action-btn secondary"
                onClick={() => setShowLogoutModal(false)}
              >
                Batal
              </button>
              <button
                type="button"
                className="admin-action-btn danger"
                onClick={confirmSignOut}
              >
                <FaSignOutAlt />
                <span>Keluar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}