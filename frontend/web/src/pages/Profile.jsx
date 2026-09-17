import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaAdjust, FaCheck, FaChevronRight, FaEnvelope, FaFileAlt, FaGlobe, FaHistory, FaImage, FaInfoCircle, FaPaintBrush, FaPen, FaQrcode, FaShieldAlt, FaSlidersH, FaTimes, FaTrashAlt, FaUndo, FaUser, FaWpforms } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import api from "../api/axiosInstance";
import logo from "../assets/images/logo.png";

const USER_STORAGE_KEYS = ["user", "hidocs_user", "currentUser", "loggedInUser"];

const PRESET_COLORS = [
  { name: "Ocean Blue",  hex: "#2168b4" },
  { name: "Indigo",      hex: "#1c12d4ff" },
  { name: "Purple",      hex: "#7c3aed" },
  { name: "Emerald",     hex: "#059669" },
  { name: "Rose",        hex: "#e11d48" },
  { name: "Amber",       hex: "#d97706" },
  { name: "Teal",        hex: "#0d9488" },
];

const LANGS = [
  { code: "id", label: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

const getCurrentUser = () => {
  try {
    for (const key of USER_STORAGE_KEYS) {
      const s = localStorage.getItem(key);
      if (!s) continue;
      const p = JSON.parse(s);
      if (!p || typeof p !== "object") continue;
      return {
        username: p.username || p.name || "HiDocs User",
        name: p.name || p.username || "HiDocs User",
        email: String(p.email || "").trim().toLowerCase(),
        role: p.role || "User",
      };
    }
  } catch {}
  return { username: "HiDocs User", name: "HiDocs User", email: "", role: "User" };
};

const profileStyles = `
.profile-page, .profile-page * { box-sizing: border-box; }
.profile-page {
  --primary: var(--hp-pri, #2168b4);
  --border: #e5ebf2; --surface: #ffffff; --background: transparent;
  --text: #1d2c3f; --text-soft: #5e7188; --text-muted: #9aa7b7;
  min-height: 100%; width: 100%;
  color: var(--text); font-family: "Inter", sans-serif; font-size: 14px;
}
.profile-main-content { width: 100%; max-width: 1040px; margin: 0 auto; padding: 32px 36px 48px; }

/* Header Banner */
.profile-header {
  position: relative; min-height: 148px; padding: 28px 32px; margin-bottom: 28px;
  overflow: hidden; border-radius: 18px;
  background: linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 70%, #4b9fe8) 100%);
  box-shadow: 0 10px 30px rgba(15, 30, 50, 0.12);
  display: flex; align-items: center; justify-content: space-between; gap: 20px;
}
.profile-header-circle-1 {
  position: absolute; width: 220px; height: 220px; right: 80px; top: -100px;
  border: 1px solid rgba(255,255,255,.14); border-radius: 50%; pointer-events: none;
}
.profile-header-circle-2 {
  position: absolute; width: 140px; height: 140px; right: -30px; bottom: -60px;
  border-radius: 50%; background: rgba(255,255,255,.08); pointer-events: none;
}
.profile-header-content { position: relative; z-index: 2; max-width: 600px; }
.profile-eyebrow {
  display: inline-flex; align-items: center; gap: 6px;
  color: rgba(255,255,255,.85); font-size: 11px; font-weight: 700;
  letter-spacing: .9px; text-transform: uppercase;
  background: rgba(255, 255, 255, 0.14); padding: 4px 10px; border-radius: 20px;
}
.profile-header h1 { margin: 8px 0 6px; color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: -.5px; }
.profile-header p { margin: 0; color: rgba(255,255,255,.88); font-size: 13px; line-height: 1.5; }

/* User Hero Card */
.profile-hero-card {
  padding: 24px; border: 1px solid var(--border); border-radius: 16px;
  background: var(--surface); display: flex; align-items: center; justify-content: space-between;
  gap: 20px; margin-bottom: 28px; box-shadow: 0 2px 10px rgba(15, 30, 50, 0.03); flex-wrap: wrap;
}
.profile-hero-left { display: flex; align-items: center; gap: 18px; min-width: 0; }
.profile-hero-avatar {
  width: 64px; height: 64px; flex-shrink: 0; border-radius: 16px;
  background: linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 65%, #60a5fa));
  color: #fff; display: flex; align-items: center; justify-content: center;
  font-size: 24px; font-weight: 800; box-shadow: 0 4px 14px rgba(15, 30, 50, 0.14);
}
.profile-hero-info h2 { margin: 0; color: var(--text); font-size: 20px; font-weight: 800; }
.profile-hero-info p { margin: 4px 0 0; color: var(--text-soft); font-size: 13px; display: flex; align-items: center; gap: 6px; }
.profile-edit-btn {
  height: 40px; padding: 0 16px; border: 1px solid var(--border); border-radius: 10px;
  background: var(--surface); color: var(--primary); font-family: inherit; font-size: 12.5px;
  font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 8px;
  transition: all .15s;
}
.profile-edit-btn:hover { background: var(--hp-pri-lt, #eef5fd); border-color: var(--primary); }

/* Settings Sections */
.profile-section-title {
  display: flex; align-items: center; gap: 8px; margin: 0 0 14px;
  color: var(--text); font-size: 16px; font-weight: 800;
}
.profile-card {
  border: 1px solid var(--border); border-radius: 16px; background: var(--surface);
  overflow: hidden; margin-bottom: 24px; box-shadow: 0 2px 10px rgba(15, 30, 50, 0.02);
}
.profile-row {
  padding: 18px 22px; display: flex; align-items: center; justify-content: space-between;
  gap: 16px; border-bottom: 1px solid var(--border);
}
.profile-row:last-child { border-bottom: none; }
.profile-row-info { flex: 1; min-width: 0; }
.profile-row-info strong { display: block; color: var(--text); font-size: 13.5px; font-weight: 700; }
.profile-row-info span { display: block; margin-top: 3px; color: var(--text-soft); font-size: 12px; }

/* Preset Colors Grid */
.profile-colors-grid {
  display: flex; flex-wrap: wrap; gap: 10px; align-items: center;
}
.profile-color-swatch {
  width: 34px; height: 34px; border-radius: 10px; border: 2px solid transparent;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 13px; transition: transform .15s, border-color .15s;
}
.profile-color-swatch:hover { transform: scale(1.1); }
.profile-color-swatch.active { border-color: #ffffff; box-shadow: 0 0 0 2.5px var(--primary); }
.profile-custom-color-btn {
  height: 34px; padding: 0 10px; border: 1px solid var(--border); border-radius: 10px;
  background: var(--surface); color: var(--text); display: inline-flex; align-items: center;
  gap: 6px; font-size: 12px; font-weight: 600; cursor: pointer; position: relative; overflow: hidden;
}
.profile-color-input-hidden {
  position: absolute; opacity: 0; width: 100%; height: 100%; left: 0; top: 0; cursor: pointer;
}

/* Header Image Upload - Compact Control */
.profile-header-img-control {
  display: flex;
  align-items: center;
  gap: 12px;
}
.profile-img-preview-box {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.profile-mini-thumbnail {
  width: 96px;
  height: 42px;
  border-radius: 8px;
  border: 1px solid var(--border);
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
  box-shadow: 0 1px 5px rgba(0,0,0,0.08);
  background: #0b1523;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.profile-mini-thumbnail:hover {
  transform: scale(1.04);
  box-shadow: 0 3px 10px rgba(0,0,0,0.15);
}
.profile-mini-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.profile-mini-tag {
  position: absolute;
  bottom: 2px;
  right: 3px;
  font-size: 8px;
  font-weight: 700;
  background: rgba(15, 23, 42, 0.75);
  color: #fff;
  padding: 1px 4px;
  border-radius: 3px;
  line-height: 1;
}
.profile-mini-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

/* Adjust Header Modal */
.profile-adjust-modal {
  width: 100%;
  max-width: 580px;
  padding: 24px;
  border-radius: 18px;
  background: var(--surface);
  border: 1px solid var(--border);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.25);
  animation: pfModalIn .2s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.profile-adjust-preview-wrapper {
  width: 100%;
  height: 165px;
  border-radius: 14px;
  overflow: hidden;
  position: relative;
  background: #0b1523;
  border: 1px solid var(--border);
  box-shadow: inset 0 0 20px rgba(0,0,0,0.3);
}
.profile-adjust-preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.04s ease, object-position 0.04s ease;
  pointer-events: none;
}
.profile-adjust-preview-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(5, 14, 26, 0.62) 0%, rgba(10, 25, 45, 0.38) 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 18px 22px;
  color: #ffffff;
  pointer-events: none;
}
.profile-adjust-mock-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 9.5px;
  font-weight: 700;
  text-transform: uppercase;
  background: rgba(255, 255, 255, 0.18);
  padding: 3px 8px;
  border-radius: 12px;
  width: fit-content;
  margin-bottom: 6px;
  backdrop-filter: blur(2px);
}
.profile-adjust-mock-h1 {
  font-size: 19px;
  font-weight: 800;
  margin: 0 0 4px;
  line-height: 1.2;
}
.profile-adjust-mock-p {
  font-size: 11px;
  margin: 0;
  color: rgba(255, 255, 255, 0.82);
  line-height: 1.4;
  max-width: 360px;
}
.profile-adjust-controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: var(--meta-bg, #f8fafc);
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid var(--border);
}
.profile-slider-row {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.profile-slider-label {
  display: flex;
  justify-content: space-between;
  font-size: 11.5px;
  font-weight: 600;
  color: var(--text);
}
.profile-slider-label span:last-child {
  color: var(--primary);
  font-weight: 700;
}
.profile-range-input {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #cbd5e1;
  outline: none;
  cursor: pointer;
  accent-color: var(--primary);
}
.profile-adjust-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.profile-adjust-actions-right {
  display: flex;
  gap: 8px;
}
.profile-action-btn {
  height: 36px; padding: 0 14px; border-radius: 9px; font-family: inherit;
  font-size: 12px; font-weight: 700; cursor: pointer; display: inline-flex;
  align-items: center; gap: 7px; transition: .15s;
}
.profile-action-btn.primary {
  border: none; background: var(--primary); color: #fff;
  box-shadow: 0 2px 8px rgba(15, 30, 50, 0.12);
}
.profile-action-btn.primary:hover { filter: brightness(1.08); }
.profile-action-btn.danger {
  border: 1px solid #fecaca; background: #fef2f2; color: #dc2626;
}
.profile-action-btn.danger:hover { background: #fee2e2; }
.profile-action-btn.secondary {
  border: 1px solid var(--border); background: var(--surface); color: var(--text);
}
.profile-action-btn.secondary:hover { background: var(--border); }

/* Language Switcher */
.profile-lang-group {
  display: flex; gap: 8px;
}
.profile-lang-btn {
  height: 36px; padding: 0 14px; border: 1px solid var(--border); border-radius: 9px;
  background: var(--surface); color: var(--text-soft); font-family: inherit; font-size: 12.5px;
  font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 7px;
  transition: all .15s;
}
.profile-lang-btn.active {
  border-color: var(--primary); background: var(--hp-pri-lt, #eef5fd); color: var(--primary); font-weight: 700;
}

/* Dark Mode Switch */
.profile-toggle-switch {
  position: relative; width: 48px; height: 26px; border-radius: 999px;
  background: #cbd5e1; cursor: pointer; transition: background .2s; border: none; padding: 0;
}
.profile-toggle-switch.active { background: var(--primary); }
.profile-toggle-thumb {
  position: absolute; left: 3px; top: 3px; width: 20px; height: 20px;
  border-radius: 50%; background: #ffffff; box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  transition: transform .2s;
}
.profile-toggle-switch.active .profile-toggle-thumb { transform: translateX(22px); }

/* Clickable Menu Rows */
.profile-menu-row {
  padding: 18px 22px; display: flex; align-items: center; justify-content: space-between;
  gap: 16px; border-bottom: 1px solid var(--border); cursor: pointer; transition: background .15s;
}
.profile-menu-row:hover { background: var(--hp-pri-lt, #eef5fd); }
.profile-menu-row:last-child { border-bottom: none; }
.profile-menu-row svg.arrow { color: var(--text-muted); font-size: 12px; }

/* Modals */
.profile-modal-overlay {
  position: fixed; inset: 0; z-index: 200; padding: 20px;
  background: rgba(5, 14, 26, 0.55); display: flex; align-items: center;
  justify-content: center; backdrop-filter: blur(5px); animation: pfFadeIn .18s ease;
}
.profile-modal {
  width: 100%; max-width: 500px; padding: 26px; border: 1px solid var(--border);
  border-radius: 18px; background: var(--surface); box-shadow: 0 24px 60px rgba(0, 0, 0, 0.22);
  animation: pfModalIn .2s cubic-bezier(0.16, 1, 0.3, 1);
}
.profile-modal-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 12px; }
.profile-modal-header h3 { margin: 0; color: var(--text); font-size: 18px; font-weight: 700; }
.profile-modal-close {
  width: 32px; height: 32px; border: 1px solid var(--border); border-radius: 9px;
  background: var(--surface); color: var(--text-soft); display: flex; align-items: center; justify-content: center; cursor: pointer;
}
.profile-modal-close:hover { background: #fee2e2; color: #dc2626; border-color: #fca5a5; }
.profile-modal-desc { margin: 0 0 16px; color: var(--text-soft); font-size: 12.5px; line-height: 1.6; }
.profile-input-group { margin-bottom: 20px; }
.profile-input-label { display: block; margin-bottom: 7px; color: var(--text); font-size: 12.5px; font-weight: 700; }
.profile-input {
  width: 100%; height: 42px; padding: 0 14px; border: 1px solid var(--border);
  border-radius: 10px; background: var(--surface); color: var(--text); font-family: inherit; font-size: 13.5px;
}
.profile-input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(33, 104, 180, 0.16); }
.profile-modal-error { color: #dc2626; font-size: 12px; margin-top: 6px; font-weight: 600; }
.profile-modal-actions { display: flex; gap: 15px; margin-top: 22px; }
.profile-modal-actions button { flex: 1; height: 40px; border-radius: 10px; font-family: inherit; font-size: 12.5px; font-weight: 700; cursor: pointer; }

/* About Modal (Synced with Android About Screen) */
.profile-about-modal {
  width: 100%;
  max-width: 520px;
  padding: 24px;
  border: 1px solid var(--border);
  border-radius: 20px;
  background: var(--surface);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.22);
  animation: pfModalIn .2s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 90vh;
  overflow-y: auto;
}
.profile-about-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}
.profile-about-app-brand {
  display: flex;
  align-items: center;
  gap: 14px;
}
.profile-about-logo-wrapper {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--hp-pri-lt, #eef5fd), var(--surface));
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(15, 30, 50, 0.06);
  flex-shrink: 0;
  overflow: hidden;
  padding: 6px;
}
.profile-about-logo-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.profile-about-app-title {
  margin: 0;
  color: var(--text);
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.3px;
}
.profile-about-app-tagline {
  margin: 3px 0 0;
  color: var(--text-soft);
  font-size: 12px;
  line-height: 1.4;
}

/* About Card with Accent Gradient */
.profile-about-card {
  padding: 16px;
  border-radius: 14px;
  background: linear-gradient(135deg, color-mix(in srgb, var(--primary) 10%, var(--surface)) 0%, color-mix(in srgb, var(--primary) 4%, var(--surface)) 100%);
  border: 1px solid color-mix(in srgb, var(--primary) 22%, var(--border));
}
.profile-about-card-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}
.profile-about-card-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: color-mix(in srgb, var(--primary) 18%, transparent);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}
.profile-about-card-title h4 {
  margin: 0;
  color: var(--text);
  font-size: 14px;
  font-weight: 700;
}
.profile-about-card-desc {
  margin: 0;
  color: var(--text-soft);
  font-size: 12.5px;
  line-height: 1.6;
}

/* Features List */
.profile-about-features-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.profile-about-features-heading {
  margin: 0;
  color: var(--text);
  font-size: 13.5px;
  font-weight: 700;
}
.profile-about-features-list {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface);
  overflow: hidden;
}
.profile-about-feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  border-bottom: 1px solid var(--border);
  transition: background 0.15s ease;
}
.profile-about-feature-item:last-child {
  border-bottom: none;
}
.profile-about-feature-item:hover {
  background: var(--hp-pri-lt, #eef5fd);
}
.profile-about-feature-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: color-mix(in srgb, var(--primary) 12%, transparent);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  flex-shrink: 0;
}
.profile-about-feature-item span {
  color: var(--text);
  font-size: 12.5px;
  font-weight: 600;
}

/* Footer & Thanks */
.profile-about-footer {
  text-align: center;
  padding-top: 4px;
}
.profile-about-thanks {
  margin: 0;
  color: var(--text);
  font-size: 12px;
  font-weight: 600;
}
.profile-about-madewith {
  display: block;
  margin-top: 4px;
  color: var(--text-muted);
  font-size: 11px;
}

@keyframes pfFadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes pfModalIn { from { opacity: 0; transform: scale(.95) translateY(10px); } to { opacity: 1; transform: none; } }

/* Dark Mode Overrides */
.dark.profile-page {
  --border: #1b2e40; --surface: #0f1c2b; --background: transparent;
  --text: #dde9f6; --text-soft: #8da4be; --text-muted: #4b6277;
}
.dark .profile-hero-card { background: #0f1c2b; border-color: #1b2e40; }
.dark .profile-card { background: #0f1c2b; border-color: #1b2e40; }
.dark .profile-row { border-color: #1b2e40; }
.dark .profile-edit-btn { background: #132235; border-color: #1b2e40; color: #60a5fa; }
.dark .profile-custom-color-btn { background: #132235; border-color: #1b2e40; color: #dde9f6; }
.dark .profile-lang-btn { background: #132235; border-color: #1b2e40; color: #8da4be; }
.dark .profile-lang-btn.active { background: #111e30; border-color: var(--primary); color: #60a5fa; }
.dark .profile-action-btn.secondary { background: #132235; border-color: #1b2e40; color: #dde9f6; }
.dark .profile-action-btn.danger { background: #231215; border-color: #4c1d22; color: #f87171; }
.dark .profile-action-btn.danger:hover { background: #35161b; color: #fca5a5; }
.dark .profile-modal { background: #0f1c2b; border-color: #1b2e40; }
.dark .profile-about-modal { background: #0f1c2b; border-color: #1b2e40; }
.dark .profile-about-logo-wrapper { background: #132235; border-color: #1b2e40; }
.dark .profile-about-features-list { background: #0f1c2b; border-color: #1b2e40; }
.dark .profile-about-feature-item { border-color: #1b2e40; }
.dark .profile-about-feature-item:hover { background: #142437; }
.dark .profile-input { background: #132235; border-color: #1b2e40; color: #dde9f6; }
.dark .profile-modal-close { background: #132235; border-color: #1b2e40; color: #8da4be; }
.dark .profile-menu-row:hover { background: #142437; }

@media (max-width: 768px) {
  .profile-main-content { padding: 20px 16px 40px; }
  .profile-header { padding: 22px 20px; }
  .profile-hero-card { flex-direction: column; align-items: flex-start; }
  .profile-row { flex-direction: column; align-items: flex-start; gap: 12px; }
  .profile-colors-grid { width: 100%; }
}
`;

export default function Profile() {
  const navigate = useNavigate();
  const {
    darkMode, toggleTheme,
    primaryColor, setPrimaryColor,
    imageDataUrl, setImageDataUrl, resetTheme,
    lang, setLang, t,
  } = useTheme();

  const [user, setUser] = useState(() => getCurrentUser());
  const avatarLetter = (user.name || user.username || "U").charAt(0).toUpperCase();

  const [showEdit, setShowEdit] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [editName, setEditName] = useState("");
  const [editError, setEditError] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/users/me");
        const u = res.data?.data || res.data || {};
        const updated = {
          username: u.name || u.username || "HiDocs User",
          name: u.name || u.username || "HiDocs User",
          email: String(u.email || "").trim().toLowerCase(),
          role: u.role || "User",
        };
        setUser(updated);
        localStorage.setItem("user", JSON.stringify({ ...u, ...updated }));
      } catch {
        setUser(getCurrentUser());
      }
    };
    load();
  }, []);

  const openEdit = () => {
    setEditName(user.username || user.name || "");
    setEditError("");
    setShowEdit(true);
  };

  const saveUsername = async (e) => {
    e.preventDefault();
    const clean = editName.trim();
    if (clean.length < 3) {
      setEditError(t?.profile?.errMin || "Minimum 3 characters.");
      return;
    }
    if (clean.length > 30) {
      setEditError(t?.profile?.errMax || "Maximum 30 characters.");
      return;
    }

    try {
      await api.put("/users/me", { name: clean });
    } catch (err) {
      console.warn("Server update failed:", err);
    }

    const updated = { ...user, username: clean, name: clean };
    setUser(updated);
    try {
      const saved = localStorage.getItem("user");
      const existing = saved ? JSON.parse(saved) : {};
      localStorage.setItem("user", JSON.stringify({ ...existing, username: clean, name: clean }));
    } catch {}

    setShowEdit(false);
  };

  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [adjustSourceImg, setAdjustSourceImg] = useState(null);
  const [zoom, setZoom] = useState(100);
  const [posY, setPosY] = useState(50);
  const [posX, setPosX] = useState(50);

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

  return (
    <div className={["profile-page", darkMode ? "dark" : ""].filter(Boolean).join(" ")}>
      <style>{profileStyles}</style>

      <main className="profile-main-content">
        {/* Header Banner */}
        <header className="profile-header">
          <div className="profile-header-circle-1" />
          <div className="profile-header-circle-2" />

          <div className="profile-header-content">
            <h1>{t?.profile?.title || "Profile"}</h1>
            <p>{t?.profile?.manageAccount || "Manage your account, theme preferences, and appearance."}</p>
          </div>
        </header>

        {/* User Hero Card */}
        <section className="profile-hero-card">
          <div className="profile-hero-left">
            <div className="profile-hero-avatar">{avatarLetter}</div>
            <div className="profile-hero-info">
              <h2>{user.name || user.username}</h2>
              <p><FaEnvelope /> {user.email || "user@hidocs.app"}</p>
            </div>
          </div>
          <button type="button" className="profile-edit-btn" onClick={openEdit}>
            <FaPen />
            <span>{t?.profile?.editProfile || "Edit Profile"}</span>
          </button>
        </section>

        {/* Theme & Appearance */}
        <h3 className="profile-section-title"><FaPaintBrush /> {t?.profile?.appearanceSection || "Appearance & Theme"}</h3>
        <section className="profile-card">
          {/* Dark Mode */}
          <div className="profile-row">
            <div className="profile-row-info">
              <strong>{darkMode ? (t?.profile?.darkMode || "Dark Mode") : (t?.profile?.lightMode || "Light Mode")}</strong>
              <span>{t?.profile?.switchAppearance || "Switch between light and dark visual themes."}</span>
            </div>
            <button
              type="button"
              className={`profile-toggle-switch${darkMode ? " active" : ""}`}
              onClick={toggleTheme}
              aria-label="Toggle Dark Mode"
            >
              <span className="profile-toggle-thumb" />
            </button>
          </div>

          {/* Theme Color Picker */}
          <div className="profile-row">
            <div className="profile-row-info">
              <strong>{t?.profile?.themeColor || "Theme Color"}</strong>
              <span>{t?.profile?.customizeTheme || "Choose the primary color for the HiDocs interface."}</span>
            </div>
            <div className="profile-colors-grid">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color.hex}
                  type="button"
                  className={`profile-color-swatch${primaryColor.toLowerCase() === color.hex.toLowerCase() ? " active" : ""}`}
                  style={{ backgroundColor: color.hex }}
                  onClick={() => setPrimaryColor(color.hex)}
                  title={color.name}
                  aria-label={color.name}
                >
                  {primaryColor.toLowerCase() === color.hex.toLowerCase() && <FaCheck />}
                </button>
              ))}
              <div className="profile-custom-color-btn" title={t?.profile?.customColor || "Custom Color"}>
                <FaPaintBrush style={{ color: primaryColor }} />
                <span>Custom</span>
                <input
                  type="color"
                  className="profile-color-input-hidden"
                  value={primaryColor || "#2168b4"}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  aria-label="Custom color picker"
                />
              </div>
            </div>
          </div>

          {/* Home Header Background Image */}
          <div className="profile-row">
            <div className="profile-row-info">
              <strong>{t?.profile?.themeImage || "Home Header Image"}</strong>
              <span>{t?.profile?.uploadBgDesc || "Upload an image to display as the background header on the Home dashboard."}</span>
            </div>
            <div className="profile-header-img-control">
              {imageDataUrl ? (
                <div className="profile-img-preview-box">
                  <div
                    className="profile-mini-thumbnail"
                    onClick={handleOpenAdjustExisting}
                    title={t?.profile?.adjustBtn || "Click to adjust position"}
                  >
                    <img src={imageDataUrl} alt="Header Preview" />
                    <span className="profile-mini-tag">Aktif</span>
                  </div>
                  <div className="profile-mini-actions">
                    <button
                      type="button"
                      className="profile-action-btn primary"
                      onClick={() => fileInputRef.current?.click()}
                      title={t?.profile?.changeBtn || "Change Image"}
                    >
                      <FaImage />
                      <span>{t?.profile?.changeBtn || "Ganti"}</span>
                    </button>
                    <button
                      type="button"
                      className="profile-action-btn danger"
                      onClick={removeHeaderImage}
                      title={t?.profile?.removeBtn || "Remove Image"}
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className="profile-action-btn primary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FaImage />
                  <span>{t?.profile?.uploadBtn || "Upload Image"}</span>
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
          <div className="profile-row">
            <div className="profile-row-info">
              <strong>{t?.profile?.language || "Language"}</strong>
              <span>{t?.profile?.selectLanguage || "Choose the application interface language."}</span>
            </div>
            <div className="profile-lang-group">
              {LANGS.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  className={`profile-lang-btn${lang === item.code ? " active" : ""}`}
                  onClick={() => setLang(item.code)}
                >
                  <span>{item.flag}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Reset Theme */}
          <div className="profile-row">
            <div className="profile-row-info">
              <strong>{t?.profile?.resetTheme || "Reset Theme"}</strong>
              <span>{t?.profile?.resetThemeDesc || "Restore theme colors and header image to defaults."}</span>
            </div>
            <button
              type="button"
              className="profile-action-btn secondary"
              onClick={() => setShowResetConfirm(true)}
            >
              <FaUndo />
              <span>{t?.profile?.resetBtn || "Reset to Default"}</span>
            </button>
          </div>
        </section>

        {/* Account Role / Switch Role */}
        <h3 className="profile-section-title"><FaShieldAlt /> Peran Akun</h3>
        <section className="profile-card">
          <div className="profile-row">
            <div className="profile-row-info">
              <strong>Mode Saat Ini: User (Responden)</strong>
              <span>Dapat mengakses form, mengisi jawaban kuis/ujian, dan melihat riwayat penilaian.</span>
            </div>
            <button
              type="button"
              className="profile-action-btn primary"
              onClick={() => navigate("/choose-role")}
              title="Ganti ke Creator / Admin"
            >
              <FaWpforms />
              <span>Ganti Peran</span>
            </button>
          </div>
        </section>

        {/* Other Details */}
        <h3 className="profile-section-title"><FaInfoCircle /> {t?.profile?.aboutSection || "Others"}</h3>
        <section className="profile-card">
          <div className="profile-menu-row" onClick={() => setShowAbout(true)}>
            <div className="profile-row-info">
              <strong>{t?.profile?.aboutApp || "About HiDocs!"}</strong>
              <span>{t?.profile?.discoverFeatures || "Application info and HiDocs platform features."}</span>
            </div>
            <FaChevronRight className="arrow" />
          </div>
        </section>
      </main>

      {/* Edit Username Modal */}
      {showEdit && (
        <div className="profile-modal-overlay" onClick={() => setShowEdit(false)} role="dialog" aria-modal="true">
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h3>{t?.profile?.editModalTitle || "Edit Profile"}</h3>
              <button type="button" className="profile-modal-close" onClick={() => setShowEdit(false)} aria-label="Close">
                <FaTimes />
              </button>
            </div>
            <p className="profile-modal-desc">{t?.profile?.onlyUsernameNote || "Only username can be changed."}</p>
            <form onSubmit={saveUsername}>
              <div className="profile-input-group">
                <label className="profile-input-label">{t?.profile?.username || "Username"}</label>
                <input
                  type="text"
                  className="profile-input"
                  value={editName}
                  onChange={(e) => { setEditName(e.target.value); if (editError) setEditError(""); }}
                  placeholder={t?.profile?.enterUsername || "Enter new username"}
                  autoFocus
                />
                {editError && <div className="profile-modal-error">{editError}</div>}
              </div>
              <div className="profile-modal-actions">
                <button type="button" className="profile-action-btn secondary" onClick={() => setShowEdit(false)}>
                  {t?.profile?.cancel || "Cancel"}
                </button>
                <button type="submit" className="profile-action-btn primary">
                  {t?.profile?.save || "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* About Modal */}
      {showAbout && (
        <div className="profile-modal-overlay" onClick={() => setShowAbout(false)} role="dialog" aria-modal="true">
          <div className="profile-about-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profile-about-header">
              <div className="profile-about-app-brand">
                <div className="profile-about-logo-wrapper">
                  <img src={logo} alt="HiDocs Logo" />
                </div>
                <div>
                  <h3 className="profile-about-app-title">HiDocs</h3>
                </div>
              </div>
              <button type="button" className="profile-modal-close" onClick={() => setShowAbout(false)} aria-label="Close">
                <FaTimes />
              </button>
            </div>

            {/* About Card */}
            <div className="profile-about-card">
              <div className="profile-about-card-title">
                <div className="profile-about-card-icon">
                  <FaInfoCircle />
                </div>
                <h4>{t?.profile?.aboutTitle || "Tentang Aplikasi"}</h4>
              </div>
              <p className="profile-about-card-desc">
                {t?.profile?.aboutHiDocsDesc || "HiDocs! adalah aplikasi yang memudahkan pengguna untuk mengakses dan mengisi form digital, kuis, dan ujian online. Pengguna dapat mengakses form melalui link atau QR Code, mengirim jawaban dengan mudah, serta melihat riwayat pengisian dan hasil respons."}
              </p>
            </div>

            {/* User Features Section */}
            <div className="profile-about-features-section">
              <h4 className="profile-about-features-heading">
                {t?.profile?.userFeaturesTitle || "Fitur Pengguna"}
              </h4>
              <div className="profile-about-features-list">
                <div className="profile-about-feature-item">
                  <div className="profile-about-feature-icon">
                    <FaQrcode />
                  </div>
                  <span>{t?.profile?.featAccessForms || "Akses Form lewat Link atau QR Code"}</span>
                </div>
                <div className="profile-about-feature-item">
                  <div className="profile-about-feature-icon">
                    <FaFileAlt />
                  </div>
                  <span>{t?.profile?.featFillForms || "Isi Form"}</span>
                </div>
                <div className="profile-about-feature-item">
                  <div className="profile-about-feature-icon">
                    <FaHistory />
                  </div>
                  <span>{t?.profile?.featViewHistory || "Lihat Riwayat Pengisian"}</span>
                </div>
              </div>
            </div>

            {/* Footer / Thank you */}
            <div className="profile-about-footer">
              <p className="profile-about-thanks">
                {t?.profile?.thanksForUsing || "Terima kasih telah menggunakan HiDocs!"}
              </p>
            </div>

            <div className="profile-modal-actions" style={{ marginTop: 6 }}>
              <button type="button" className="profile-action-btn primary" onClick={() => setShowAbout(false)}>
                {t?.profile?.close || "Tutup"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Adjust Header Image Modal */}
      {showAdjustModal && (
        <div className="profile-modal-overlay" onClick={() => setShowAdjustModal(false)} role="dialog" aria-modal="true">
          <div className="profile-adjust-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <FaSlidersH style={{ color: "var(--primary)" }} />
                <h3>{t?.profile?.adjustHeaderTitle || "Sesuaikan Gambar Header"}</h3>
              </div>
              <button type="button" className="profile-modal-close" onClick={() => setShowAdjustModal(false)} aria-label="Close">
                <FaTimes />
              </button>
            </div>
            <p className="profile-modal-desc">{t?.profile?.adjustHeaderDesc || "Geser posisi atau perbesar gambar agar sesuai dengan bingkai header Beranda."}</p>

            {/* Live Mock Header Preview */}
            <div className="profile-adjust-preview-wrapper">
              <img
                src={adjustSourceImg}
                alt="Adjust preview"
                className="profile-adjust-preview-img"
                style={{
                  objectPosition: `${posX}% ${posY}%`,
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: `${posX}% ${posY}%`,
                }}
              />
              <div className="profile-adjust-preview-overlay">
                <div className="profile-adjust-mock-eyebrow">
                  ★ {t?.profile?.previewHeader || "Pratinjau Header"}
                </div>
                <div className="profile-adjust-mock-h1">Halo, {user.name || user.username} 👋</div>
                <p className="profile-adjust-mock-p">{t?.dashboard?.welcomeSubtitle || "Akses formulir melalui link atau QR..."}</p>
              </div>
            </div>

            {/* Precision Sliders */}
            <div className="profile-adjust-controls">
              <div className="profile-slider-row">
                <div className="profile-slider-label">
                  <span>{t?.profile?.zoomScale || "Perbesar / Zoom"}</span>
                  <span>{zoom}%</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="250"
                  step="1"
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="profile-range-input"
                />
              </div>

              <div className="profile-slider-row">
                <div className="profile-slider-label">
                  <span>{t?.profile?.positionY || "Posisi Vertikal (Atas - Bawah)"}</span>
                  <span>{posY}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={posY}
                  onChange={(e) => setPosY(Number(e.target.value))}
                  className="profile-range-input"
                />
              </div>

              <div className="profile-slider-row">
                <div className="profile-slider-label">
                  <span>{t?.profile?.positionX || "Posisi Horizontal (Kiri - Kanan)"}</span>
                  <span>{posX}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={posX}
                  onChange={(e) => setPosX(Number(e.target.value))}
                  className="profile-range-input"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="profile-adjust-actions">
              <button
                type="button"
                className="profile-action-btn secondary"
                onClick={() => { setZoom(100); setPosY(50); setPosX(50); }}
                title="Reset sliders"
              >
                <FaUndo />
                <span>Reset</span>
              </button>
              <div className="profile-adjust-actions-right">
                <button type="button" className="profile-action-btn secondary" onClick={() => setShowAdjustModal(false)}>
                  {t?.profile?.cancelAdjust || "Batal"}
                </button>
                <button type="button" className="profile-action-btn primary" onClick={applyCrop}>
                  <FaCheck />
                  <span>{t?.profile?.applyHeaderBtn || "Terapkan ke Header"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reset Theme Confirmation Modal */}
      {showResetConfirm && (
        <div className="profile-modal-overlay" onClick={() => setShowResetConfirm(false)} role="dialog" aria-modal="true">
          <div className="profile-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 410, textAlign: "center", padding: 28 }}>
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
              {t?.profile?.resetConfirmTitle || "Kembalikan Tema ke Setelan Awal?"}
            </h3>
            <p style={{ margin: "0 0 24px", color: "var(--text-soft)", fontSize: 13, lineHeight: 1.6 }}>
              {t?.profile?.resetConfirmDesc || "Warna tema kustom dan gambar latar header Beranda akan dikembalikan ke setelan bawaan HiDocs."}
            </p>
            <div className="profile-modal-actions">
              <button
                type="button"
                className="profile-action-btn secondary"
                onClick={() => setShowResetConfirm(false)}
              >
                {t?.profile?.cancel || "Batal"}
              </button>
              <button
                type="button"
                className="profile-action-btn primary"
                onClick={handleConfirmReset}
              >
                <FaCheck />
                <span>{t?.profile?.confirmResetBtn || "Ya, Reset Tema"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}