import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaCheckCircle,
  FaClipboardList,
  FaClock,
  FaFileAlt,
  FaHistory,
  FaLink,
  FaQrcode,
  FaStar,
  FaTimes,
} from "react-icons/fa";
import { Html5Qrcode } from "html5-qrcode";
import { useTheme } from "../context/ThemeContext";
import { FormContext } from "../context/FormContext";
import { getForms } from "../api/formApi";

// =========================================================
// STORAGE KEYS & CONSTANTS
// =========================================================
const FORMS_STORAGE_KEY = "hidocs_forms";
const DELETED_FORMS_STORAGE_KEY = "hidocs_deleted_forms";
const USER_STORAGE_KEYS = ["user", "hidocs_user", "currentUser", "loggedInUser"];

const DEFAULT_FORMS = [
  {
    id: 1,
    title: "Customer Feedback Survey",
    description:
      "Help us improve our services by providing your honest and detailed feedback about your recent experience.",
    questions: 5,
    duration: "10 min",
    deadline: "30 Sep 2026",
    category: "Feedback",
    submitted: false,
    accent: "blue",
    customLink: "customer-feedback-survey",
  },
  {
    id: 2,
    title: "Employee Satisfaction Survey",
    description:
      "Share your thoughts about company culture, team collaboration, leadership, and your work environment.",
    questions: 8,
    duration: "15 min",
    deadline: "15 Oct 2026",
    category: "HR",
    submitted: false,
    accent: "purple",
    customLink: "employee-satisfaction-survey",
  },
  {
    id: 3,
    title: "Product Feature Request",
    description:
      "Tell us what features and improvements you would like to see in upcoming releases and updates.",
    questions: 3,
    duration: "5 min",
    deadline: "20 Oct 2026",
    category: "Product",
    submitted: false,
    accent: "amber",
    customLink: "product-feature-request",
  },
  {
    id: 4,
    title: "Website Usability Test",
    description:
      "Evaluate the user experience, navigation clarity, and visual presentation of our newly launched portal.",
    questions: 6,
    duration: "12 min",
    deadline: "25 Oct 2026",
    category: "Research",
    submitted: false,
    accent: "rose",
    customLink: "website-usability-test",
  },
];

// =========================================================
// HELPER FUNCTIONS
// =========================================================
const getCurrentUser = () => {
  try {
    for (const key of USER_STORAGE_KEYS) {
      const stored = localStorage.getItem(key);
      if (!stored) continue;
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === "object") {
        return {
          name: parsed.name || parsed.username || "User",
          username: parsed.username || parsed.name || "User",
          email: String(parsed.email || "").trim().toLowerCase(),
          role: parsed.role || "User",
        };
      }
    }
  } catch {}
  return { name: "User", username: "User", email: "", role: "User" };
};

const getStoredArray = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

const extractQrIdentifier = (input) => {
  if (!input) return "";
  let val = String(input).trim();
  try {
    const parsed = JSON.parse(val);
    if (parsed && typeof parsed === "object") {
      val = parsed.code || parsed.custom_url || parsed.customLink || parsed.id || val;
    }
  } catch {}
  val = String(val).trim().replace(/^["']|["']$/g, "");
  try {
    if (val.startsWith("http://") || val.startsWith("https://")) {
      const parsedUrl = new URL(val);
      const pathname = parsedUrl.pathname.replace(/\/+$/, "");
      const segments = pathname.split("/").filter(Boolean);
      if (segments.length > 0) {
        return decodeURIComponent(segments[segments.length - 1]);
      }
    }
  } catch {}
  const cleaned = val.split("?")[0].split("#")[0].replace(/\/+$/, "");
  const parts = cleaned.split("/").filter(Boolean);
  return parts.length > 0 ? parts[parts.length - 1] : val;
};

// =========================================================
// SCOPED STYLES
// =========================================================
const dashboardStyles = `
.dashboard-page, .dashboard-page * { box-sizing: border-box; }
.dashboard-page {
  --primary: var(--hp-pri, #2168b4);
  --border: #e5ebf2;
  --surface: #ffffff;
  --background: transparent;
  --text: #1d2c3f;
  --text-soft: #5e7188;
  --text-muted: #9aa7b7;
  min-height: 100%;
  width: 100%;
  color: var(--text);
  font-family: "Inter", sans-serif;
  font-size: 14px;
}
.dashboard-main-content {
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 32px 36px 48px;
}

/* Header Banner Card */
.dashboard-hero {
  position: relative;
  min-height: 160px;
  padding: 30px 34px;
  margin-bottom: 24px;
  overflow: hidden;
  border-radius: 18px;
  background: linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 70%, #4b9fe8) 100%);
  box-shadow: 0 10px 30px rgba(15, 30, 50, 0.12);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}
.dashboard-hero.has-bg {
  background: #0b1523;
}
.dashboard-hero-bg-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
  z-index: 1;
  opacity: .88;
}
.dashboard-hero-bg-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background: linear-gradient(135deg, rgba(8, 20, 36, 0.72) 0%, rgba(15, 30, 50, 0.45) 100%);
}
.dashboard-circle-1 {
  position: absolute;
  width: 220px;
  height: 220px;
  right: 90px;
  top: -110px;
  border: 1px solid rgba(255,255,255,.14);
  border-radius: 50%;
  pointer-events: none;
  z-index: 2;
}
.dashboard-circle-2 {
  position: absolute;
  width: 140px;
  height: 140px;
  right: -20px;
  bottom: -70px;
  border-radius: 50%;
  background: rgba(255,255,255,.08);
  pointer-events: none;
  z-index: 2;
}
.dashboard-hero-content {
  position: relative;
  z-index: 3;
  max-width: 670px;
}
.dashboard-greeting-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: rgba(255,255,255,.9);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .8px;
  text-transform: uppercase;
  background: rgba(255, 255, 255, 0.14);
  padding: 4px 10px;
  border-radius: 20px;
  backdrop-filter: blur(4px);
}
.dashboard-hero h1 {
  margin: 10px 0 6px;
  color: #ffffff;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -.5px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.dashboard-wave {
  display: inline-block;
  animation: waveAnim 2s infinite ease-in-out;
  transform-origin: 70% 70%;
}
@keyframes waveAnim {
  0%, 100% { transform: rotate(0deg); }
  20%, 60% { transform: rotate(14deg); }
  40%, 80% { transform: rotate(-14deg); }
}
.dashboard-hero p {
  margin: 0;
  color: rgba(255,255,255,.9);
  font-size: 13.5px;
  line-height: 1.5;
}

/* 2 Action Cards (Scan QR & Paste Link) */
.dashboard-actions-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 28px;
}
.dashboard-action-card {
  padding: 22px 24px;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--surface);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(15, 30, 50, 0.02);
  transition: all .2s ease;
  text-align: left;
}
.dashboard-action-card:hover {
  transform: translateY(-2px);
  border-color: var(--primary);
  box-shadow: 0 10px 24px rgba(15, 30, 50, 0.08);
  background: var(--hp-pri-lt, #f8fbff);
}
.dashboard-action-left {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
}
.dashboard-action-icon {
  width: 50px;
  height: 50px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
  color: #ffffff;
  transition: transform .18s ease;
}
.dashboard-action-card:hover .dashboard-action-icon {
  transform: scale(1.05);
}
.dashboard-action-card.scan .dashboard-action-icon,
.dashboard-action-card.link .dashboard-action-icon {
  background: linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 70%, #60a5fa));
  box-shadow: 0 4px 14px color-mix(in srgb, var(--primary) 25%, transparent);
}
.dashboard-action-text {
  min-width: 0;
}
.dashboard-action-text h3 {
  margin: 0;
  color: var(--text);
  font-size: 16px;
  font-weight: 800;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dashboard-action-text p {
  margin: 3px 0 0;
  color: var(--text-soft);
  font-size: 12.5px;
  line-height: 1.4;
}
.dashboard-action-arrow {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--border);
  color: var(--text-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
  transition: all .18s ease;
}
.dashboard-action-card:hover .dashboard-action-arrow {
  background: var(--primary);
  color: #ffffff;
  transform: translateX(3px);
}

/* Recent Forms (Finished Today) Section */
.dashboard-recent-section {
  margin-top: 8px;
}
.dashboard-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
  flex-wrap: wrap;
}
.dashboard-section-eyebrow {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .8px;
  color: var(--primary);
  margin-bottom: 4px;
}
.dashboard-section-header h2 {
  margin: 0;
  color: var(--text);
  font-size: 18px;
  font-weight: 800;
}
.dashboard-section-header p {
  margin: 3px 0 0;
  color: var(--text-soft);
  font-size: 12.5px;
}
.dashboard-view-all-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 10px;
  background: var(--hp-pri-lt, #eef5fd);
  color: var(--primary);
  font-size: 12.5px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all .15s ease;
}
.dashboard-view-all-btn:hover {
  background: var(--primary);
  color: #ffffff;
  gap: 9px;
}

/* Recent Forms Grid */
.dashboard-recent-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}
.dashboard-recent-card {
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--surface);
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 2px 10px rgba(15, 30, 50, 0.02);
  transition: all .18s ease;
}
.dashboard-recent-card:hover {
  transform: translateY(-2px);
  border-color: var(--primary);
  box-shadow: 0 8px 24px rgba(15, 30, 50, 0.08);
}
.dashboard-recent-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
}
.dashboard-recent-category {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .6px;
  padding: 3px 8px;
  border-radius: 6px;
  background: var(--hp-pri-lt, #eef5fd);
  color: var(--primary);
}
.dashboard-recent-status {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
  background: #ecfdf5;
  color: #059669;
}
.dashboard-recent-body h3 {
  margin: 0 0 6px;
  color: var(--text);
  font-size: 15px;
  font-weight: 800;
  line-height: 1.4;
}
.dashboard-recent-time {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-soft);
  font-size: 12px;
  margin-bottom: 14px;
}
.dashboard-recent-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 10px 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  margin-bottom: 14px;
  font-size: 11.5px;
  color: var(--text-muted);
}
.dashboard-recent-meta span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.dashboard-recent-action {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 10px 16px;
  border-radius: 10px;
  background: var(--primary);
  color: #ffffff;
  font-size: 12.5px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all .15s ease;
}
.dashboard-recent-action:hover {
  filter: brightness(1.08);
  transform: translateY(-1px);
}
.dashboard-recent-action svg {
  transition: transform .15s ease;
}
.dashboard-recent-action:hover svg {
  transform: translateX(3px);
}

/* Empty State */
.dashboard-empty-recent {
  grid-column: 1 / -1;
  text-align: center;
  padding: 48px 24px;
  background: var(--surface);
  border: 1px dashed var(--border);
  border-radius: 16px;
  color: var(--text-soft);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.dashboard-empty-icon {
  width: 54px;
  height: 54px;
  border-radius: 16px;
  background: var(--hp-pri-lt, #eef5fd);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 14px;
}
.dashboard-empty-recent h3 {
  margin: 0 0 6px;
  color: var(--text);
  font-size: 16px;
  font-weight: 800;
}
.dashboard-empty-recent p {
  margin: 0;
  font-size: 13px;
  max-width: 420px;
  line-height: 1.5;
}

/* Modals (QR Scanner & Paste Link) */
.dashboard-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  padding: 20px;
  background: rgba(5, 14, 26, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
  animation: dbFadeIn .18s ease;
}
.dashboard-modal {
  width: 100%;
  max-width: 500px;
  max-height: calc(100vh - 40px);
  padding: 24px;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 18px;
  background: var(--surface);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.22);
  animation: dbModalIn .2s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
}
.dashboard-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}
.dashboard-modal-title {
  display: flex;
  align-items: center;
  gap: 11px;
}
.dashboard-modal-title-icon {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 11px;
  background: var(--hp-pri-lt, #eef5fd);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}
.dashboard-modal-title h3 {
  margin: 0;
  color: var(--text);
  font-size: 17px;
  font-weight: 700;
}
.dashboard-modal-close {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border: 1px solid var(--border);
  border-radius: 9px;
  background: var(--surface);
  color: var(--text-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: .15s;
}
.dashboard-modal-close:hover {
  background: #fee2e2;
  color: #dc2626;
  border-color: #fca5a5;
}
.dashboard-modal-desc {
  margin: 0 0 16px;
  color: var(--text-soft);
  font-size: 12.5px;
  line-height: 1.6;
}

/* QR Camera Box */
.dashboard-qr-reader-box {
  position: relative;
  width: 100%;
  min-height: 280px;
  max-height: 340px;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: #0b1523;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dashboard-qr-reader {
  width: 100%;
  height: 100%;
}
.dashboard-qr-reader video {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover;
}
.dashboard-qr-loading {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #8da4be;
  font-size: 13px;
  background: #0b1523;
  z-index: 10;
  pointer-events: none;
}
.dashboard-qr-spinner {
  width: 34px;
  height: 34px;
  border: 3px solid rgba(255,255,255,.2);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: dbSpin .8s linear infinite;
}
.dashboard-qr-status {
  margin-top: 12px;
  padding: 10px 14px;
  border-radius: 10px;
  background: #ecfdf5;
  color: #065f46;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
}
.dashboard-qr-error {
  margin-top: 12px;
  padding: 10px 14px;
  border-radius: 10px;
  background: #fef2f2;
  color: #991b1b;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
}

/* Link Modal Inputs */
.dashboard-input-group {
  margin-bottom: 16px;
}
.dashboard-input-label {
  display: block;
  margin-bottom: 7px;
  color: var(--text);
  font-size: 12.5px;
  font-weight: 700;
}
.dashboard-input {
  width: 100%;
  height: 42px;
  padding: 0 14px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--surface);
  color: var(--text);
  font-family: inherit;
  font-size: 13.5px;
}
.dashboard-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(33, 104, 180, 0.16);
}
.dashboard-input-hint {
  margin-top: 6px;
  color: var(--text-muted);
  font-size: 11.5px;
}

.dashboard-modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 18px;
}
.dashboard-btn-secondary,
.dashboard-btn-primary {
  flex: 1;
  height: 40px;
  border-radius: 10px;
  font-family: inherit;
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
  transition: .15s;
}
.dashboard-btn-secondary {
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-soft);
}
.dashboard-btn-secondary:hover {
  background: var(--border);
}
.dashboard-btn-primary {
  border: none;
  background: var(--primary);
  color: #ffffff;
  box-shadow: 0 3px 10px rgba(15, 30, 50, 0.15);
}
.dashboard-btn-primary:hover {
  filter: brightness(1.08);
}

@keyframes dbFadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes dbModalIn { from { opacity: 0; transform: scale(.95) translateY(10px); } to { opacity: 1; transform: none; } }
@keyframes dbSpin { to { transform: rotate(360deg); } }

/* Dark Mode Harmonization */
.dark .dashboard-action-card,
.dark .dashboard-recent-card,
.dark .dashboard-empty-recent,
.dark .dashboard-modal {
  background: var(--app-card, #0f1c2b);
  border-color: var(--app-border, #1b2e40);
}
.dark .dashboard-action-text h3,
.dark .dashboard-recent-body h3,
.dark .dashboard-section-header h2,
.dark .dashboard-empty-recent h3,
.dark .dashboard-modal-title h3,
.dark .dashboard-input-label {
  color: var(--app-text, #dde9f6);
}
.dark .dashboard-action-text p,
.dark .dashboard-section-header p,
.dark .dashboard-recent-time,
.dark .dashboard-empty-recent p,
.dark .dashboard-modal-desc {
  color: #9aa7b7;
}
.dark .dashboard-recent-meta {
  border-color: var(--app-border, #1b2e40);
}
.dark .dashboard-action-arrow {
  background: #132235;
  color: #8da4be;
}
.dark .dashboard-action-card:hover .dashboard-action-arrow {
  background: var(--primary);
  color: #ffffff;
}
.dark .dashboard-modal-close,
.dark .dashboard-btn-secondary {
  background: #132235;
  border-color: #1b2e40;
  color: #8da4be;
}
.dark .dashboard-input {
  background: #132235;
  border-color: #1b2e40;
  color: #dde9f6;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-main-content {
    padding: 20px 16px 36px;
  }
  .dashboard-hero {
    padding: 24px 20px;
  }
  .dashboard-actions-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .dashboard-recent-grid {
    grid-template-columns: 1fr;
  }
}
`;

// =========================================================
// DASHBOARD COMPONENT
// =========================================================
function Dashboard() {
  const navigate = useNavigate();
  const { darkMode, imageDataUrl, t, lang } = useTheme();
  const { submittedForms = [] } = useContext(FormContext) || {};

  const [forms, setForms] = useState([]);
  const [currentUser, setCurrentUser] = useState(getCurrentUser);
  const [currentDate] = useState(new Date());

  // Background image for header: from useTheme imageDataUrl or local storage fallback
  const [headerBg, setHeaderBg] = useState(
    () => imageDataUrl || localStorage.getItem("hidocs_dashboard_bg") || ""
  );

  useEffect(() => {
    if (imageDataUrl) {
      setHeaderBg(imageDataUrl);
    }
  }, [imageDataUrl]);

  // QR Scanner Modal State
  const [showScanner, setShowScanner] = useState(false);
  const [scannerRunning, setScannerRunning] = useState(false);
  const [scannerStatus, setScannerStatus] = useState("");
  const [scannerError, setScannerError] = useState("");
  const scannerRef = useRef(null);
  const scanHandledRef = useRef(false);

  // Paste Link Modal State
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkInput, setLinkInput] = useState("");
  const [linkError, setLinkError] = useState("");

  // Update greeting and time info
  const timeGreeting = useMemo(() => {
    const hour = currentDate.getHours();
    if (hour >= 5 && hour < 12) {
      return { title: t?.dashboard?.greetingMorning || "Selamat Pagi"};
    }
    if (hour >= 12 && hour < 17) {
      return { title: t?.dashboard?.greetingAfternoon || "Selamat Siang"};
    }
    if (hour >= 17 && hour < 21) {
      return { title: t?.dashboard?.greetingEvening || "Selamat Sore"};
    }
    return { title: t?.dashboard?.greetingNight || "Selamat Malam"};
  }, [currentDate, t]);

  const refreshCurrentUser = useCallback(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  // Load forms from backend API + localStorage
  const loadForms = useCallback(async () => {
    try {
      const deletedForms = getStoredArray(DELETED_FORMS_STORAGE_KEY, []);
      const localForms = getStoredArray(FORMS_STORAGE_KEY, DEFAULT_FORMS);

      let apiForms = [];
      try {
        const res = await getForms();
        apiForms = Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data)
          ? res.data
          : [];
      } catch (err) {
        console.warn("API getForms failed, falling back to local data", err);
      }

      const mergedMap = new Map();

      // Add local default forms
      localForms.forEach((f, idx) => {
        mergedMap.set(String(f.id ?? idx), {
          ...f,
          id: f.id ?? idx,
          category: f.category || f.type || "General",
          questions: Array.isArray(f.questions) ? f.questions.length : Number(f.questions) || 0,
        });
      });

      // Add backend forms
      apiForms.forEach((f) => {
        mergedMap.set(String(f.id), {
          ...f,
          id: f.id,
          title: f.title || "Untitled Form",
          category: f.category || f.type || "General",
          questions: Array.isArray(f.questions)
            ? f.questions.length
            : Number(f.question_count || f.questions) || 0,
          customLink: f.custom_url || f.customLink || String(f.id),
        });
      });

      // Filter deleted
      const finalForms = Array.from(mergedMap.values()).filter((f) => {
        if (deletedForms.includes(f.id) || deletedForms.includes(String(f.id))) {
          return false;
        }
        return true;
      });

      setForms(finalForms);
    } catch (err) {
      console.error("Failed to load forms for dashboard", err);
      setForms(DEFAULT_FORMS);
    }
  }, []);

  useEffect(() => {
    loadForms();
    refreshCurrentUser();

    const handleStorage = (e) => {
      if (e.key === FORMS_STORAGE_KEY || e.key === DELETED_FORMS_STORAGE_KEY) {
        loadForms();
      }
      if (USER_STORAGE_KEYS.includes(e.key)) {
        refreshCurrentUser();
      }
      if (e.key === "hidocs_dashboard_bg") {
        setHeaderBg(e.newValue || "");
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [loadForms, refreshCurrentUser]);

  // =========================================================
  // RECENT FORMS (FINISHED TODAY)
  // =========================================================
  const todayRecentForms = useMemo(() => {
    const rawSubmissions = [
      ...(Array.isArray(submittedForms) ? submittedForms : []),
      ...getStoredArray("hidocs_submissions", []),
      ...getStoredArray("hidocs_responses", []),
    ];

    const todayList = [];
    const seenFormIds = new Set();

    const now = new Date();
    const isToday = (dateVal) => {
      if (!dateVal) return false;
      const d = new Date(dateVal);
      if (Number.isNaN(d.getTime())) return false;
      return (
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate()
      );
    };

    // Sort by submittedAt descending
    const sorted = [...rawSubmissions].sort((a, b) => {
      const tA = new Date(a.submittedAt || a.createdAt || a.timestamp || 0).getTime();
      const tB = new Date(b.submittedAt || b.createdAt || b.timestamp || 0).getTime();
      return tB - tA;
    });

    for (const sub of sorted) {
      const formId = String(sub.formId || sub.form_id || sub.id || "");
      if (!formId || seenFormIds.has(formId)) continue;

      const subTime = sub.submittedAt || sub.createdAt || sub.timestamp;
      if (!isToday(subTime)) continue;

      seenFormIds.add(formId);

      // Find matching form details
      const relatedForm = forms.find(
        (f) => String(f.id) === formId || String(f.customLink || f.custom_url) === formId
      );

      const title = sub.title || relatedForm?.title || "Untitled Form";
      const category = relatedForm?.category || "General";
      const questionsCount = relatedForm?.questions || sub.totalQuestions || 0;
      const formattedTime = subTime
        ? new Intl.DateTimeFormat(lang === "en" ? "en-US" : "id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date(subTime))
        : "";

      todayList.push({
        formId,
        submissionId: sub.submissionId || sub.id,
        title,
        category,
        questions: questionsCount,
        formattedTime,
        submittedAt: subTime,
      });
    }

    return todayList;
  }, [submittedForms, forms, lang]);

  // =========================================================
  // QR SCANNER FUNCTIONS
  // =========================================================
  const stopScanner = useCallback(async () => {
    const s = scannerRef.current;
    if (!s) {
      setScannerRunning(false);
      return;
    }
    try {
      if (s.isScanning) await s.stop();
    } catch {}
    try {
      await s.clear();
    } catch {}
    scannerRef.current = null;
    setScannerRunning(false);
  }, []);

  const closeScanner = useCallback(async () => {
    await stopScanner();
    setShowScanner(false);
    setScannerStatus("");
    setScannerError("");
    scanHandledRef.current = false;
  }, [stopScanner]);

  const findFormFromIdentifier = useCallback(
    (identifier) => {
      const id = extractQrIdentifier(identifier).toLowerCase();
      if (!id) return null;
      return (
        forms.find((f) => {
          const fid = String(f.id || "").toLowerCase();
          const cl = String(f.customLink || f.custom_url || "").toLowerCase();
          return fid === id || cl === id;
        }) || null
      );
    },
    [forms]
  );

  const handleScanSuccess = useCallback(
    async (decoded) => {
      if (scanHandledRef.current) return;
      scanHandledRef.current = true;

      const matched = findFormFromIdentifier(decoded);
      if (!matched) {
        setScannerError(t?.dashboard?.errNotFound || "Link formulir tidak ditemukan.");
        scanHandledRef.current = false;
        return;
      }

      setScannerStatus(matched.title);
      await stopScanner();
      setTimeout(() => {
        closeScanner();
        navigate(`/form-details/${matched.id}`);
      }, 600);
    },
    [findFormFromIdentifier, stopScanner, closeScanner, navigate, t]
  );

  const startScanner = useCallback(async () => {
    setScannerError("");
    setScannerStatus("");
    scanHandledRef.current = false;
    try {
      await stopScanner();
      const el = document.getElementById("dashboard-qr-reader");
      if (!el) throw new Error("Reader element not found");
      const scanner = new Html5Qrcode("dashboard-qr-reader");
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 230, height: 230 }, aspectRatio: 1 },
        handleScanSuccess,
        () => {}
      );
      setScannerRunning(true);
    } catch (err) {
      console.warn("Scanner start failed:", err);
      scannerRef.current = null;
      setScannerRunning(false);
      setScannerStatus("");
      setScannerError(t?.dashboard?.cameraError || "Camera error.");
    }
  }, [stopScanner, handleScanSuccess, t]);

  useEffect(() => {
    if (!showScanner) return;
    const timer = setTimeout(() => startScanner(), 250);
    return () => clearTimeout(timer);
  }, [showScanner, startScanner]);

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, [stopScanner]);

  // =========================================================
  // PASTE LINK FUNCTIONS
  // =========================================================
  const openLinkModal = () => {
    setLinkInput("");
    setLinkError("");
    setShowLinkModal(true);
  };

  const closeLinkModal = () => {
    setShowLinkModal(false);
    setLinkInput("");
    setLinkError("");
  };

  const handleOpenLink = (e) => {
    e.preventDefault();
    const clean = linkInput.trim();
    if (!clean) {
      setLinkError(t?.dashboard?.errEmptyLink || "Masukkan link form terlebih dahulu.");
      return;
    }

    const matched = findFormFromIdentifier(clean);
    if (!matched) {
      // Fallback: if it looks like an ID or custom URL, try opening directly
      const extracted = extractQrIdentifier(clean);
      if (extracted) {
        closeLinkModal();
        navigate(`/form-details/${extracted}`);
        return;
      }
      setLinkError(t?.dashboard?.errNotFound || "Link formulir tidak ditemukan.");
      return;
    }

    closeLinkModal();
    navigate(`/form-details/${matched.id}`);
  };

  return (
    <div className={["dashboard-page", darkMode ? "dark" : ""].filter(Boolean).join(" ")}>
      <style>{dashboardStyles}</style>

      <main className="dashboard-main-content">
        {/* ===================================================
            HERO WELCOME BANNER (KALENDER DIHILANGKAN, GAMBAR BISA DIGANTI DARI PROFILE)
        =================================================== */}
        <header className={`dashboard-hero${headerBg ? " has-bg" : ""}`}>
          {headerBg && <img src={headerBg} alt="Header Background" className="dashboard-hero-bg-img" />}
          {headerBg && <div className="dashboard-hero-bg-overlay" />}

          <div className="dashboard-circle-1" />
          <div className="dashboard-circle-2" />

          <div className="dashboard-hero-content">
            <span className="dashboard-greeting-badge">
              <FaStar />
              {timeGreeting.title} {timeGreeting.emoji}
            </span>
            <h1>
              {t?.dashboard?.hello || "Halo"}, {currentUser.name || currentUser.username}!
              <span className="dashboard-wave"> 👋</span>
            </h1>
            <p>
              {t?.dashboard?.welcomeSubtitle ||
                "Akses formulir melalui link atau QR, kirim respons anda, dan kelola pengisian anda di satu tempat."}
            </p>
          </div>
        </header>

        {/* ===================================================
            2 CARD DI BAWAH HEADER: SCAN QR & MASUKIN VIA LINK
        =================================================== */}
        <section className="dashboard-actions-grid">
          {/* Card 1: Scan QR */}
          <div
            className="dashboard-action-card scan"
            onClick={() => setShowScanner(true)}
            role="button"
            tabIndex={0}
          >
            <div className="dashboard-action-left">
              <div className="dashboard-action-icon">
                <FaQrcode />
              </div>
              <div className="dashboard-action-text">
                <h3>{t?.dashboard?.scanQr || "Pindai Kode QR"}</h3>
                <p>{t?.dashboard?.scanQrDesc || "Buka formulir menggunakan QR"}</p>
              </div>
            </div>
            <div className="dashboard-action-arrow">
              <FaArrowRight />
            </div>
          </div>

          {/* Card 2: Masukin via Link */}
          <div
            className="dashboard-action-card link"
            onClick={openLinkModal}
            role="button"
            tabIndex={0}
          >
            <div className="dashboard-action-left">
              <div className="dashboard-action-icon">
                <FaLink />
              </div>
              <div className="dashboard-action-text">
                <h3>{t?.dashboard?.pasteLink || "Tempel Link Formulir"}</h3>
                <p>{t?.dashboard?.pasteLinkDesc || "Masukkan link formulir secara langsung"}</p>
              </div>
            </div>
            <div className="dashboard-action-arrow">
              <FaArrowRight />
            </div>
          </div>
        </section>

        {/* ===================================================
            RECENT FORM (FORM YG BARU SELESAI KITA KERJAIN DI HARI ITU)
        =================================================== */}
        <section className="dashboard-recent-section">
          <div className="dashboard-section-header">
            <div>
              <span className="dashboard-section-eyebrow">
                {lang === "en" ? "Today's Activity" : "Aktivitas Hari Ini"}
              </span>
              <h2>{t?.dashboard?.recentForms || "Formulir Terbaru"}</h2>
              <p>
                {lang === "en"
                  ? "Forms you have completed today."
                  : "Formulir yang baru selesai Anda kerjakan hari ini."}
              </p>
            </div>
            <button
              type="button"
              className="dashboard-view-all-btn"
              onClick={() => navigate("/history")}
            >
              <span>{t?.dashboard?.viewAll || "Lihat Semua"}</span>
              <FaArrowRight />
            </button>
          </div>

          <div className="dashboard-recent-grid">
            {todayRecentForms.length === 0 ? (
              <div className="dashboard-empty-recent">
                <div className="dashboard-empty-icon">
                  <FaHistory />
                </div>
                <h3>{t?.dashboard?.noRecentForms || "Belum Ada Formulir Terbaru"}</h3>
                <p>{t?.dashboard?.noRecentDesc || "Formulir yang baru saja Anda isi akan muncul di sini."}</p>
              </div>
            ) : (
              todayRecentForms.map((item) => (
                <article className="dashboard-recent-card" key={item.submissionId || item.formId}>
                  <div>
                    <div className="dashboard-recent-top">
                      <span className="dashboard-recent-category">
                        <FaFileAlt />
                        {item.category}
                      </span>
                      <span className="dashboard-recent-status">
                        <FaCheckCircle />
                        {t?.dashboard?.submitted || "Sudah Dikirim"}
                      </span>
                    </div>

                    <div className="dashboard-recent-body">
                      <h3>{item.title}</h3>
                      {item.formattedTime && (
                        <div className="dashboard-recent-time">
                          <FaClock />
                          <span>{item.formattedTime}</span>
                        </div>
                      )}
                    </div>

                    <div className="dashboard-recent-meta">
                      <span>
                        <FaClipboardList />
                        {item.questions} {t?.dashboard?.questions || "Pertanyaan"}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="dashboard-recent-action"
                    onClick={() => navigate(`/form-details/${item.formId}`)}
                  >
                    <span>{t?.dashboard?.viewSubmittedForm || "Lihat Formulir Terkirim"}</span>
                    <FaArrowRight />
                  </button>
                </article>
              ))
            )}
          </div>
        </section>
      </main>

      {/* ===================================================
          MODAL SCANNER QR
      =================================================== */}
      {showScanner && (
        <div className="dashboard-modal-overlay" onClick={closeScanner} role="dialog" aria-modal="true">
          <div className="dashboard-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dashboard-modal-header">
              <div className="dashboard-modal-title">
                <div className="dashboard-modal-title-icon">
                  <FaQrcode />
                </div>
                <h3>{t?.dashboard?.scanModalTitle || "Pindai Kode QR"}</h3>
              </div>
              <button
                type="button"
                className="dashboard-modal-close"
                onClick={closeScanner}
                aria-label="Close"
              >
                <FaTimes />
              </button>
            </div>
            <p className="dashboard-modal-desc">
              {t?.dashboard?.scanModalDesc || "Arahkan kamera ke QR Code formulir HiDocs."}
            </p>

            <div className="dashboard-qr-reader-box">
              <div id="dashboard-qr-reader" className="dashboard-qr-reader" />
              {!scannerRunning && !scannerError && (
                <div className="dashboard-qr-loading">
                  <div className="dashboard-qr-spinner" />
                  <span>{t?.dashboard?.preparingCamera || "Menyiapkan kamera..."}</span>
                </div>
              )}
            </div>

            {scannerStatus && <div className="dashboard-qr-status">{scannerStatus}</div>}
            {scannerError && <div className="dashboard-qr-error">{scannerError}</div>}

            <div className="dashboard-modal-actions">
              <button type="button" className="dashboard-btn-secondary" onClick={closeScanner}>
                {t?.common?.cancel || "Batal"}
              </button>
              {scannerError && (
                <button
                  type="button"
                  className="dashboard-btn-primary"
                  onClick={() => {
                    setScannerError("");
                    setScannerStatus("");
                    scanHandledRef.current = false;
                    startScanner();
                  }}
                >
                  {t?.dashboard?.tryAgain || "Coba Lagi"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================
          MODAL TEMPEL LINK FORMULIR
      =================================================== */}
      {showLinkModal && (
        <div className="dashboard-modal-overlay" onClick={closeLinkModal} role="dialog" aria-modal="true">
          <div className="dashboard-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dashboard-modal-header">
              <div className="dashboard-modal-title">
                <div className="dashboard-modal-title-icon">
                  <FaLink />
                </div>
                <h3>{t?.dashboard?.linkModalTitle || "Tempel Link Formulir"}</h3>
              </div>
              <button
                type="button"
                className="dashboard-modal-close"
                onClick={closeLinkModal}
                aria-label="Close"
              >
                <FaTimes />
              </button>
            </div>
            <p className="dashboard-modal-desc">
              {t?.dashboard?.linkModalDesc ||
                "Tempel tautan formulir HiDocs di bawah untuk membukanya secara langsung."}
            </p>

            <form onSubmit={handleOpenLink}>
              <div className="dashboard-input-group">
                <label className="dashboard-input-label" htmlFor="dashboard-link-input">
                  {t?.dashboard?.linkInputLabel || "Tautan Formulir"}
                </label>
                <input
                  id="dashboard-link-input"
                  type="text"
                  className="dashboard-input"
                  placeholder={t?.dashboard?.linkPlaceholder || "Tempel link formulir di sini..."}
                  value={linkInput}
                  onChange={(e) => {
                    setLinkInput(e.target.value);
                    if (linkError) setLinkError("");
                  }}
                  autoFocus
                />
                <p className="dashboard-input-hint">
                  {t?.dashboard?.linkExample || "Contoh: hidocs.app/r/abc123 atau /form-details/abc123"}
                </p>
                {linkError && <div className="dashboard-qr-error">{linkError}</div>}
              </div>

              <div className="dashboard-modal-actions">
                <button
                  type="button"
                  className="dashboard-btn-secondary"
                  onClick={closeLinkModal}
                >
                  {t?.common?.cancel || "Batal"}
                </button>
                <button type="submit" className="dashboard-btn-primary">
                  {t?.dashboard?.openForm || "Buka Formulir"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;