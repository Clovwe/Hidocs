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
  FaEye,
  FaFileAlt,
  FaHourglassHalf,
  FaLayerGroup,
  FaLock,
  FaQrcode,
  FaRegCalendarAlt,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import { Html5Qrcode } from "html5-qrcode";
import { FormContext } from "../context/FormContext";
import { useTheme } from "../context/ThemeContext";
import { getForms } from "../api/formApi";

const userFormsStyles = `
.user-forms-page, .user-forms-page * { box-sizing: border-box; }
.user-forms-page {
  --primary: var(--hp-pri, #2168b4);
  --border: #e5ebf2; --surface: #ffffff; --background: transparent;
  --text: #1d2c3f; --text-soft: #5e7188; --text-muted: #9aa7b7;
  min-height: 100%; width: 100%;
  color: var(--text); font-family: "Inter", sans-serif; font-size: 14px;
}
.user-forms-main-content { width: 100%; max-width: 1240px; margin: 0 auto; padding: 32px 36px 48px; }

/* Header Banner */
.user-forms-header {
  position: relative; min-height: 148px; padding: 28px 32px; margin-bottom: 24px;
  overflow: hidden; border-radius: 18px;
  background: linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 70%, #4b9fe8) 100%);
  box-shadow: 0 10px 30px rgba(15, 30, 50, 0.12);
  display: flex; align-items: center; justify-content: space-between; gap: 20px;
}
.user-forms-header-circle-1 {
  position: absolute; width: 220px; height: 220px; right: 80px; top: -100px;
  border: 1px solid rgba(255,255,255,.14); border-radius: 50%; pointer-events: none;
}
.user-forms-header-circle-2 {
  position: absolute; width: 140px; height: 140px; right: -30px; bottom: -60px;
  border-radius: 50%; background: rgba(255,255,255,.08); pointer-events: none;
}
.user-forms-header-content { position: relative; z-index: 2; max-width: 650px; }
.user-forms-eyebrow {
  display: inline-flex; align-items: center; gap: 6px;
  color: rgba(255,255,255,.85); font-size: 11px; font-weight: 700;
  letter-spacing: .9px; text-transform: uppercase;
  background: rgba(255, 255, 255, 0.14); padding: 4px 10px; border-radius: 20px;
}
.user-forms-header h1 {
  margin: 8px 0 6px; color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: -.5px;
}
.user-forms-header p {
  margin: 0; color: rgba(255,255,255,.88); font-size: 13px; line-height: 1.5;
}
.user-forms-scan-btn {
  position: relative; z-index: 2; height: 44px; padding: 0 18px;
  border: none; border-radius: 12px; background: #ffffff; color: var(--primary);
  display: inline-flex; align-items: center; gap: 9px;
  font-family: inherit; font-size: 13px; font-weight: 700; cursor: pointer;
  box-shadow: 0 4px 14px rgba(0,0,0,0.12); flex-shrink: 0;
  transition: transform .15s, box-shadow .15s;
}
.user-forms-scan-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.18); }

/* Toolbar: Search and Counts */
.user-forms-toolbar {
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  margin-bottom: 20px; flex-wrap: wrap;
}
.user-forms-toolbar-info h2 { margin: 0; color: var(--text); font-size: 18px; font-weight: 800; }
.user-forms-toolbar-info p { margin: 3px 0 0; color: var(--text-soft); font-size: 12px; }

.user-forms-search {
  position: relative; width: 100%; max-width: 360px; min-width: 240px;
}
.user-forms-search-icon {
  position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
  color: var(--text-muted); font-size: 14px; pointer-events: none;
}
.user-forms-search input {
  width: 100%; height: 42px; padding: 0 36px 0 38px; border: 1px solid var(--border);
  border-radius: 12px; background: var(--surface); color: var(--text);
  font-family: inherit; font-size: 13px; transition: border-color .15s, box-shadow .15s;
}
.user-forms-search input:focus {
  outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(33, 104, 180, 0.16);
}
.user-forms-search-clear {
  position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
  border: none; background: transparent; color: var(--text-muted); font-size: 13px;
  cursor: pointer; padding: 5px; display: flex; align-items: center; justify-content: center;
}
.user-forms-search-clear:hover { color: var(--text); }

/* Forms Grid */
.user-forms-grid {
  display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 16px;
}
.user-form-card {
  position: relative; min-width: 0; min-height: 220px; padding: 20px;
  border: 1px solid var(--border); border-radius: 16px; background: var(--surface);
  display: flex; flex-direction: column; overflow: hidden;
  box-shadow: 0 3px 12px rgba(15, 30, 50, 0.03);
  transition: transform .2s, box-shadow .2s, border-color .2s;
}
.user-form-card::before { content: ""; position: absolute; top: 0; bottom: 0; left: 0; width: 4px; background: var(--primary); }
.user-form-card.purple::before { background: #7c3aed; }
.user-form-card.green::before { background: #10b981; }
.user-form-card:hover { transform: translateY(-2px); border-color: var(--primary); box-shadow: 0 10px 24px rgba(15, 30, 50, 0.08); }

.user-form-card-header { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 14px; }
.user-form-icon {
  width: 40px; height: 40px; flex-shrink: 0; border-radius: 11px;
  background: var(--hp-pri-lt, #eef5fd); color: var(--primary);
  display: flex; align-items: center; justify-content: center; font-size: 17px;
}
.user-form-card.purple .user-form-icon { background: #f5f3ff; color: #7c3aed; }
.user-form-card.green .user-form-icon { background: #ecfdf5; color: #10b981; }
.user-form-card.submitted .user-form-icon { background: #ecfdf5; color: #059669; }

.user-form-status { min-height: 25px; padding: 0 10px; border-radius: 999px; display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; }
.user-form-status.available { border: 1px solid #c7dcf1; background: var(--hp-pri-lt, #edf5fd); color: var(--primary); }
.user-form-status.submitted { border: 1px solid #a7f3d0; background: #ecfdf5; color: #059669; }
.user-form-status.not-open { border: 1px solid #fde68a; background: #fffbeb; color: #b45309; }
.user-form-status.closed { border: 1px solid #fecaca; background: #fef2f2; color: #b91c1c; }
.user-form-status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

.user-form-card-content { min-width: 0; flex: 1; }
.user-form-category { display: inline-flex; align-items: center; gap: 5px; color: var(--text-soft); font-size: 11px; font-weight: 600; }
.user-form-card-content h3 { margin: 8px 0 6px; color: var(--text); font-size: 16px; line-height: 1.4; font-weight: 700; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.user-form-card-content p { margin: 0; color: var(--text-soft); font-size: 12px; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

.user-form-meta { display: flex; flex-wrap: wrap; gap: 8px; margin: 14px 0 16px; }
.user-form-meta span {
  min-height: 26px; padding: 0 9px; border-radius: 7px;
  background: var(--meta-bg, #f1f5f9); color: var(--text-soft);
  display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 600;
}

.user-form-action {
  width: 100%; height: 40px; flex-shrink: 0; padding: 0 14px;
  border: none; border-radius: 10px; background: var(--primary);
  color: #fff; display: flex; align-items: center; justify-content: center;
  gap: 7px; font-family: inherit; font-size: 12px; font-weight: 700;
  cursor: pointer; box-shadow: 0 4px 12px rgba(15, 30, 50, 0.12);
  transition: transform .15s, box-shadow .15s, filter .15s;
}
.user-form-action:hover { transform: translateY(-1px); filter: brightness(1.06); box-shadow: 0 6px 16px rgba(15, 30, 50, 0.18); }
.user-form-action.submitted { background: #059669; }
.user-form-action-arrow { margin-left: auto; }

/* Empty State */
.user-forms-empty {
  grid-column: 1/-1; min-height: 240px; border: 1.5px dashed var(--border);
  border-radius: 16px; background: var(--surface); display: flex;
  align-items: center; justify-content: center; flex-direction: column; text-align: center; padding: 40px 20px;
}
.user-forms-empty-icon {
  width: 54px; height: 54px; border-radius: 16px; background: var(--hp-pri-lt, #eef5fd);
  color: var(--primary); display: flex; align-items: center; justify-content: center;
  font-size: 24px; margin-bottom: 14px;
}
.user-forms-empty h3 { margin: 0; color: var(--text); font-size: 16px; font-weight: 700; }
.user-forms-empty p { margin: 7px 0 18px; color: var(--text-soft); font-size: 13px; max-width: 440px; line-height: 1.5; }
.user-forms-empty-btn {
  padding: 8px 16px; border: 1px solid var(--border); border-radius: 10px;
  background: var(--surface); color: var(--text); font-size: 12.5px; font-weight: 700; cursor: pointer;
  transition: background .15s;
}
.user-forms-empty-btn:hover { background: var(--border); }

/* QR Scanner Modal */
.user-qr-overlay {
  position: fixed; inset: 0; z-index: 200; padding: 20px;
  background: rgba(5, 14, 26, 0.55); display: flex; align-items: center;
  justify-content: center; backdrop-filter: blur(5px); animation: qrOverlayIn .18s ease;
}
.user-qr-modal {
  width: 100%; max-width: 520px; max-height: calc(100vh - 40px); padding: 24px;
  overflow: hidden; border: 1px solid var(--border); border-radius: 18px;
  background: var(--surface); box-shadow: 0 24px 60px rgba(0, 0, 0, 0.22);
  animation: qrModalIn .2s cubic-bezier(0.16, 1, 0.3, 1);
}
.user-qr-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 8px; }
.user-qr-title { display: flex; align-items: center; gap: 11px; }
.user-qr-title-icon {
  width: 40px; height: 40px; flex-shrink: 0; border-radius: 11px;
  background: var(--hp-pri-lt, #eef5fd); color: var(--primary);
  display: flex; align-items: center; justify-content: center; font-size: 18px;
}
.user-qr-title h3 { margin: 0; color: var(--text); font-size: 17px; font-weight: 700; }
.user-qr-close {
  width: 32px; height: 32px; flex-shrink: 0; border: 1px solid var(--border);
  border-radius: 9px; background: var(--surface); color: var(--text-soft);
  display: flex; align-items: center; justify-content: center; cursor: pointer; transition: .15s;
}
.user-qr-close:hover { background: #fee2e2; color: #dc2626; border-color: #fca5a5; }
.user-qr-description { margin: 0 0 16px; color: var(--text-soft); font-size: 12.5px; line-height: 1.6; }

.user-qr-reader-wrapper {
  position: relative; width: 100%; min-height: 280px; max-height: 340px;
  overflow: hidden; border: 1px solid var(--border); border-radius: 14px; background: #0b1523;
  display: flex; align-items: center; justify-content: center;
}
.user-qr-reader { width: 100%; height: 100%; }
.user-qr-reader video { width: 100% !important; height: 100% !important; object-fit: cover; }
.user-qr-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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
.user-qr-loading span {
  text-align: center;
  font-weight: 500;
  letter-spacing: 0.2px;
}
.user-qr-loading-icon { width: 34px; height: 34px; border: 3px solid rgba(255,255,255,.2); border-top-color: var(--primary); border-radius: 50%; animation: qrSpin .8s linear infinite; }

.user-qr-status { margin-top: 12px; padding: 10px 14px; border-radius: 10px; background: #ecfdf5; color: #065f46; font-size: 12px; font-weight: 600; text-align: center; }
.user-qr-error { margin-top: 12px; padding: 10px 14px; border-radius: 10px; background: #fef2f2; color: #991b1b; font-size: 12px; font-weight: 600; text-align: center; }

.user-qr-actions { display: flex; gap: 10px; margin-top: 20px; }
.user-qr-cancel, .user-qr-retry {
  flex: 1; height: 40px; border-radius: 10px; font-family: inherit; font-size: 12.5px; font-weight: 700; cursor: pointer; transition: .15s;
}
.user-qr-cancel { border: 1px solid var(--border); background: var(--surface); color: var(--text-soft); }
.user-qr-cancel:hover { background: var(--border); }
.user-qr-retry { border: none; background: var(--primary); color: #fff; box-shadow: 0 3px 10px rgba(15, 30, 50, 0.15); }
.user-qr-retry:hover { filter: brightness(1.08); }

@keyframes qrOverlayIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes qrModalIn { from { opacity: 0; transform: scale(.95) translateY(10px); } to { opacity: 1; transform: none; } }
@keyframes qrSpin { to { transform: rotate(360deg); } }

/* Dark Mode */
.dark.user-forms-page {
  --border: #1b2e40; --surface: #0f1c2b; --background: transparent;
  --text: #dde9f6; --text-soft: #8da4be; --text-muted: #4b6277;
  --meta-bg: #132235;
}
.dark .user-form-card { background: #0f1c2b; border-color: #1b2e40; }
.dark .user-form-card:hover { border-color: var(--primary); }
.dark .user-forms-search input { background: #0f1c2b; border-color: #1b2e40; color: #dde9f6; }
.dark .user-forms-empty { background: #0f1c2b; border-color: #1b2e40; }
.dark .user-forms-empty-btn { background: #132235; border-color: #1b2e40; color: #dde9f6; }
.dark .user-qr-modal { background: #0f1c2b; border-color: #1b2e40; }
.dark .user-qr-close { background: #132235; border-color: #1b2e40; color: #8da4be; }
.dark .user-qr-cancel { background: #132235; border-color: #1b2e40; color: #8da4be; }

@media (max-width: 768px) {
  .user-forms-main-content { padding: 20px 16px 40px; }
  .user-forms-header { flex-direction: column; align-items: flex-start; gap: 16px; padding: 22px 20px; }
  .user-forms-toolbar { flex-direction: column; align-items: stretch; gap: 12px; }
  .user-forms-search { max-width: 100%; }
  .user-forms-grid { grid-template-columns: 1fr; }
}
`;

const ACCENTS = ["blue", "purple", "green"];
const DATE_OPTIONS = { day: "2-digit", month: "short", year: "numeric" };

const formatDate = (value) => {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  const valid = Number.isNaN(date.getTime()) ? new Date(value) : date;
  if (Number.isNaN(valid.getTime())) return String(value);
  return new Intl.DateTimeFormat("en-GB", DATE_OPTIONS).format(valid);
};

const formatScheduleDateTime = (dateValue, timeValue) => {
  if (!dateValue) return "";
  const fDate = formatDate(dateValue) || dateValue;
  return timeValue ? `${fDate}, ${timeValue}` : fDate;
};

const createScheduleDateTime = (dateValue, timeValue, endOfDay = false) => {
  if (!dateValue) return null;
  const time = timeValue
    ? String(timeValue).length === 5 ? `${timeValue}:00` : String(timeValue)
    : endOfDay ? "23:59:59" : "00:00:00";
  const dt = new Date(`${dateValue}T${time}`);
  return Number.isNaN(dt.getTime()) ? null : dt;
};

const getFormScheduleStatus = (form, now = new Date()) => {
  const openAt = createScheduleDateTime(form.openDate, form.openTime);
  const closeAt = createScheduleDateTime(form.closeDate, form.closeTime, true);
  if (!openAt && !closeAt) return { status: "unscheduled", isOpen: true };
  const t = now.getTime();
  if (openAt && t < openAt.getTime()) return { status: "not-open", isOpen: false };
  if (closeAt && t > closeAt.getTime()) return { status: "closed", isOpen: false };
  return { status: "open", isOpen: true };
};

const getAccessSettings = (form) => {
  const accessMode = form.accessMode ?? form.settings?.accessMode ?? "public";
  const qrOnly = form.qrOnly ?? form.settings?.qrOnly ?? accessMode === "qr-only";
  const showInUserList = form.showInUserList ?? form.settings?.showInUserList ?? !qrOnly;
  return { accessMode, qrOnly, showInUserList };
};

const isFormActive = (form) => form.active !== false;

const isPublicUserForm = (form) => {
  const { qrOnly, showInUserList } = getAccessSettings(form);
  return !qrOnly && showInUserList;
};

const getFormDuration = (form) => {
  const timer = form.settings?.timer && typeof form.settings.timer === "object" ? form.settings.timer : null;
  const enabled = form.timerEnabled ?? form.settings?.timerEnabled ?? timer?.enabled;
  if (enabled === false) return null;
  const raw = form.timerDuration ?? form.settings?.timerDuration ?? timer?.duration ?? form.duration ?? form.settings?.duration;
  if (raw == null || raw === "") return null;
  const num = Number(raw);
  return Number.isFinite(num) && num > 0 ? `${num} min` : String(raw).trim() || null;
};

const normalizeAdminForm = (form, index) => {
  const { accessMode, qrOnly, showInUserList } = getAccessSettings(form);
  return {
    ...form,
    id: form.id ?? Date.now() + index,
    title: String(form.title || "").trim() || "Untitled Form",
    description: String(form.description || "").trim() || "Complete this form and submit your response.",
    category: form.category || form.type || "Form",
    questions: Array.isArray(form.questions) ? form.questions.length : Number(form.questions) || 0,
    duration: getFormDuration(form),
    deadline: form.closeDate ? formatDate(form.closeDate) : form.deadline ? formatDate(form.deadline) : null,
    createdAt: form.createdAt || new Date(Date.now() + index).toISOString(),
    active: isFormActive(form),
    accent: form.accent || ACCENTS[index % ACCENTS.length],
    customLink: String(form.custom_url || form.customLink || "").trim(),
    custom_url: form.custom_url || "",
    accessMode, qrOnly, showInUserList,
    openDate: form.openDate || "",
    closeDate: form.closeDate || "",
    openTime: form.openTime || "",
    closeTime: form.closeTime || "",
  };
};

const getSubmittedFormId = (item) => item?.formId ?? item?.form_id ?? item?.form?.id ?? item?.id;

const extractQrIdentifier = (scannedValue) => {
  const clean = String(scannedValue || "").trim();
  if (!clean) return "";
  try {
    const parsed = new URL(/^https?:\/\//i.test(clean) ? clean : `https://${clean}`);
    const parts = parsed.pathname.split("/").filter(Boolean);
    const detailIdx = parts.findIndex((p) => p.toLowerCase() === "form-details");
    if (detailIdx !== -1 && parts[detailIdx + 1]) return decodeURIComponent(parts[detailIdx + 1]);
    const rIdx = parts.findIndex((p) => p.toLowerCase() === "r");
    if (rIdx !== -1 && parts[rIdx + 1]) return decodeURIComponent(parts[rIdx + 1]);
    return decodeURIComponent(parts[parts.length - 1] || clean);
  } catch {
    return decodeURIComponent(
      clean.replace(/^https?:\/\//i, "").replace(/^.*\/form-details\//i, "").replace(/^.*\/r\//i, "").replace(/^\/+/, "").split("?")[0].split("#")[0]
    );
  }
};

function UserFormCard({ form, t }) {
  const navigate = useNavigate();

  const getStatusInfo = () => {
    if (form.submitted) {
      return {
        label: t?.forms?.submittedBadge || "Submitted",
        className: "submitted",
        icon: <FaCheckCircle />,
        description: t?.dashboard?.alreadySubmittedDesc || "You have already submitted this form.",
        buttonText: t?.forms?.viewSubmitted || "View Submitted Form",
      };
    }
    if (form.scheduleStatus === "not-open") {
      const openText = formatScheduleDateTime(form.openDate, form.openTime);
      return {
        label: t?.forms?.notOpenBadge || "Not Open Yet",
        className: "not-open",
        icon: <FaHourglassHalf />,
        description: openText ? `${t?.dashboard?.opensOn || "Opens on"} ${openText}.` : (t?.forms?.notOpenBadge || "Not open yet."),
        buttonText: t?.forms?.viewSchedule || "View Schedule",
      };
    }
    if (form.scheduleStatus === "closed") {
      const closeText = formatScheduleDateTime(form.closeDate, form.closeTime);
      return {
        label: t?.forms?.closedBadge || "Closed",
        className: "closed",
        icon: <FaLock />,
        description: closeText ? `${t?.dashboard?.closedOn || "Closed on"} ${closeText}.` : (t?.forms?.closedBadge || "Already closed."),
        buttonText: t?.forms?.viewClosed || "View Closed Form",
      };
    }
    return {
      label: t?.forms?.availableBadge || "Available",
      className: "available",
      icon: null,
      description: form.description,
      buttonText: t?.forms?.viewDetails || "View Form Details",
    };
  };

  const status = getStatusInfo();
  const cardClass = [
    "user-form-card",
    form.accent !== "blue" ? form.accent : "",
    form.submitted ? "submitted" : "",
  ].filter(Boolean).join(" ");

  return (
    <article className={cardClass}>
      <div className="user-form-card-header">
        <div className="user-form-icon"><FaFileAlt /></div>
        <span className={`user-form-status ${status.className}`}>
          {status.icon || <span className="user-form-status-dot" />}
          {status.label}
        </span>
      </div>
      <div className="user-form-card-content">
        <span className="user-form-category"><FaLayerGroup />{form.category}</span>
        <h3>{form.title}</h3>
        <p>{status.description}</p>
        <div className="user-form-meta">
          <span><FaRegCalendarAlt />{form.deadline || t?.dashboard?.noDeadline || "No deadline"}</span>
          <span><FaClock />{form.duration || t?.dashboard?.noTimer || "No timer"}</span>
          <span><FaFileAlt />{form.questions} {t?.dashboard?.questions || "Questions"}</span>
        </div>
      </div>
      <button
        type="button"
        className={`user-form-action${form.submitted ? " submitted" : ""}`}
        onClick={() => navigate(`/form-details/${form.id}`)}
      >
        <FaEye />
        {status.buttonText}
        <FaArrowRight className="user-form-action-arrow" />
      </button>
    </article>
  );
}

export default function UserForms() {
  const navigate = useNavigate();
  const { submittedForms = [] } = useContext(FormContext) || {};
  const { darkMode, t } = useTheme();

  const [forms, setForms] = useState([]);
  const [search, setSearch] = useState("");
  const [currentDate] = useState(new Date());

  const [showScanner, setShowScanner] = useState(false);
  const [scannerRunning, setScannerRunning] = useState(false);
  const [scannerStatus, setScannerStatus] = useState("");
  const [scannerError, setScannerError] = useState("");

  const scannerRef = useRef(null);
  const scanHandledRef = useRef(false);

  const loadForms = useCallback(async () => {
    try {
      const res = await getForms();
      const raw = Array.isArray(res?.data?.data) ? res.data.data : Array.isArray(res?.data) ? res.data : [];
      setForms(
        raw.map((f, i) => normalizeAdminForm(f, i))
          .filter((f) => isFormActive(f) && isPublicUserForm(f))
          .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      );
    } catch {
      setForms([]);
    }
  }, []);

  useEffect(() => {
    loadForms();
  }, [loadForms]);

  const stopScanner = useCallback(async () => {
    const s = scannerRef.current;
    if (!s) { setScannerRunning(false); return; }
    try { if (s.isScanning) await s.stop(); } catch { }
    try { await s.clear(); } catch { }
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

  const findFormFromQr = useCallback((scannedValue) => {
    const id = extractQrIdentifier(scannedValue).toLowerCase();
    if (!id) return null;
    return forms.find((f) => {
      const fid = String(f.id || "").toLowerCase();
      const cl = String(f.customLink || f.custom_url || "").toLowerCase();
      return fid === id || cl === id;
    }) || null;
  }, [forms]);

  const handleScanSuccess = useCallback(async (decoded) => {
    if (scanHandledRef.current) return;
    scanHandledRef.current = true;
    const matched = findFormFromQr(decoded);
    if (!matched) {
      setScannerError(t?.dashboard?.errNotFound || "Formulir tidak ditemukan.");
      scanHandledRef.current = false;
      return;
    }
    setScannerStatus(matched.title);
    await stopScanner();
    setTimeout(() => {
      closeScanner();
      navigate(`/form-details/${matched.id}`);
    }, 600);
  }, [findFormFromQr, stopScanner, closeScanner, navigate, t]);

  const startScanner = useCallback(async () => {
    setScannerError("");
    setScannerStatus("");
    scanHandledRef.current = false;
    try {
      await stopScanner();
      const el = document.getElementById("user-form-qr-reader");
      if (!el) throw new Error("Reader element not found");
      const scanner = new Html5Qrcode("user-form-qr-reader");
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 230, height: 230 }, aspectRatio: 1 },
        handleScanSuccess,
        () => { }
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
    return () => { stopScanner(); };
  }, [stopScanner]);

  const isSubmitted = useCallback(
    (formId) => Array.isArray(submittedForms) && submittedForms.some((item) => String(getSubmittedFormId(item)) === String(formId)),
    [submittedForms]
  );

  const formsWithStatus = useMemo(() =>
    forms.map((form) => {
      const schedule = getFormScheduleStatus(form, currentDate);
      const submitted = isSubmitted(form.id);
      return { ...form, scheduleStatus: schedule.status, scheduleOpen: schedule.isOpen, submitted };
    }),
    [forms, currentDate, isSubmitted]
  );

  const filteredForms = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return formsWithStatus;
    return formsWithStatus.filter((f) =>
      (f.title || "").toLowerCase().includes(q) ||
      (f.category || "").toLowerCase().includes(q) ||
      (f.customLink || "").toLowerCase().includes(q)
    );
  }, [formsWithStatus, search]);

  return (
    <div className={["user-forms-page", darkMode ? "dark" : ""].filter(Boolean).join(" ")}>
      <style>{userFormsStyles}</style>

      <main className="user-forms-main-content">
        {/* Header Banner */}
        <header className="user-forms-header">
          <div className="user-forms-header-circle-1" />
          <div className="user-forms-header-circle-2" />

          <div className="user-forms-header-content">
            <span className="user-forms-eyebrow">{t?.forms?.eyebrow || "Form Directory"}</span>
            <h1>{t?.forms?.title || "Explore Forms"}</h1>
            <p>{t?.forms?.subtitle || "Search available forms or scan a QR Code to open a private form."}</p>
          </div>

          <button type="button" className="user-forms-scan-btn" onClick={() => setShowScanner(true)}>
            <FaQrcode />
            <span>{t?.forms?.scanQr || "Scan QR"}</span>
          </button>
        </header>

        {/* Toolbar */}
        <section className="user-forms-toolbar">
          <div className="user-forms-toolbar-info">
            <h2>{t?.forms?.allForms || "All Forms"}</h2>
            <p>{filteredForms.length} {t?.forms?.displayed || "of"} {forms.length} {t?.forms?.formsCount || "forms displayed"}</p>
          </div>

          <div className="user-forms-search">
            <span className="user-forms-search-icon"><FaSearch /></span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t?.forms?.searchPlaceholder || "Search form, category, or link..."}
            />
            {search && (
              <button type="button" className="user-forms-search-clear" onClick={() => setSearch("")} aria-label="Clear search">
                <FaTimes />
              </button>
            )}
          </div>
        </section>

        {/* Grid */}
        <section className="user-forms-grid">
          {filteredForms.length > 0 ? (
            filteredForms.map((form) => <UserFormCard key={form.id} form={form} t={t} />)
          ) : (
            <div className="user-forms-empty">
              <div className="user-forms-empty-icon">
                {search ? <FaSearch /> : <FaClipboardList />}
              </div>
              <h3>{search ? (t?.forms?.noMatchingTitle || "No matching forms") : (t?.forms?.noFormsTitle || "No forms available")}</h3>
              <p>{search ? `${t?.forms?.noMatchingDesc || "No form matches"} "${search}".` : (t?.forms?.noFormsDesc || "There are currently no public forms.")}</p>
              {search && (
                <button type="button" className="user-forms-empty-btn" onClick={() => setSearch("")}>
                  {t?.forms?.clearSearch || "Clear Search"}
                </button>
              )}
            </div>
          )}
        </section>
      </main>

      {/* QR Scanner Modal */}
      {showScanner && (
        <div className="user-qr-overlay" onClick={closeScanner} role="dialog" aria-modal="true">
          <div className="user-qr-modal" onClick={(e) => e.stopPropagation()}>
            <div className="user-qr-header">
              <div className="user-qr-title">
                <div className="user-qr-title-icon"><FaQrcode /></div>
                <h3>{t?.dashboard?.scanModalTitle || "Scan QR Code"}</h3>
              </div>
              <button type="button" className="user-qr-close" onClick={closeScanner} aria-label="Close"><FaTimes /></button>
            </div>
            <p className="user-qr-description">{t?.dashboard?.scanModalDesc || "Point camera at QR code."}</p>
            <div className="user-qr-reader-wrapper">
              <div id="user-form-qr-reader" className="user-qr-reader" />
              {!scannerRunning && !scannerError && (
                <div className="user-qr-loading">
                  <div className="user-qr-loading-icon" />
                  <span>{t?.dashboard?.preparingCamera || "Preparing camera..."}</span>
                </div>
              )}
            </div>
            {scannerStatus && <div className="user-qr-status">{scannerStatus}</div>}
            {scannerError && <div className="user-qr-error">{scannerError}</div>}
            <div className="user-qr-actions">
              <button type="button" className="user-qr-cancel" onClick={closeScanner}>{t?.common?.cancel || "Cancel"}</button>
              {scannerError && (
                <button type="button" className="user-qr-retry" onClick={() => { setScannerError(""); setScannerStatus(""); scanHandledRef.current = false; startScanner(); }}>
                  {t?.dashboard?.tryAgain || "Try Again"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}