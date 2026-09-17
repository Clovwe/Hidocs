import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaCheckCircle,
  FaChevronRight,
  FaClipboardCheck,
  FaClipboardList,
  FaCopy,
  FaDownload,
  FaEye,
  FaFileAlt,
  FaFileWord,
  FaLayerGroup,
  FaPlus,
  FaQrcode,
  FaShieldAlt,
  FaTimes,
  FaUser,
  FaWpforms,
} from "react-icons/fa";
import { QRCodeCanvas } from "qrcode.react";
import { useTheme } from "../context/ThemeContext";
import { getForms } from "../api/formApi";
import logo from "../assets/images/logo.png";

const getCurrentAdmin = () => {
  try {
    for (const key of ["user", "hidocs_user", "currentUser", "loggedInUser"]) {
      const s = localStorage.getItem(key);
      if (!s) continue;
      const p = JSON.parse(s);
      if (p && typeof p === "object") {
        return {
          name: p.name || p.username || "Admin",
          username: p.username || p.name || "Admin",
          email: String(p.email || "").trim().toLowerCase(),
          role: p.role || "Admin",
        };
      }
    }
  } catch {}
  return { name: "Admin", username: "Admin", email: "", role: "Admin" };
};

const getCompleteFormLink = (form) => {
  const formLink = String(form?.link || form?.customLink || form?.id || "");
  if (formLink.startsWith("http://") || formLink.startsWith("https://")) {
    return formLink;
  }
  const clean = formLink.replace(/^https?:\/\//i, "").replace(/^hidocs\.app\/r\//i, "").replace(/^hidocs\.app\/f\//i, "");
  return `${window.location.origin}/form-details/${clean}`;
};

const createSafeFileName = (value) => {
  return String(value || "hidocs-form")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "hidocs-form";
};

const adminDashboardStyles = `
.admin-dashboard-page, .admin-dashboard-page * { box-sizing: border-box; }
.admin-dashboard-page {
  --primary: var(--hp-pri, #2168b4);
  --border: #e5ebf2; --surface: #ffffff; --background: transparent;
  --text: #1d2c3f; --text-soft: #5e7188; --text-muted: #9aa7b7;
  min-height: 100%; width: 100%;
  color: var(--text); font-family: "Inter", sans-serif; font-size: 14px;
}
.admin-dashboard-main { width: 100%; max-width: 1240px; margin: 0 auto; padding: 32px 36px 48px; }

/* Header Banner Card (matches User Dashboard) */
.admin-header {
  position: relative; min-height: 180px; padding: 32px 36px; margin-bottom: 24px;
  overflow: hidden; border-radius: 18px;
  background: linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 70%, #4b9fe8) 100%);
  box-shadow: 0 10px 30px rgba(15, 30, 50, 0.12);
  display: flex; align-items: center; justify-content: space-between; gap: 24px;
}
.admin-header.has-bg { background: #0b1523; }
.admin-header-bg-img {
  position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
  pointer-events: none; z-index: 1; opacity: .88;
}
.admin-header-bg-overlay {
  position: absolute; inset: 0; z-index: 2; pointer-events: none;
  background: linear-gradient(135deg, rgba(8, 20, 36, 0.72) 0%, rgba(15, 30, 50, 0.45) 100%);
}
.admin-header-circle-1 {
  position: absolute; width: 220px; height: 220px; right: 90px; top: -110px;
  border: 1px solid rgba(255,255,255,.14); border-radius: 50%; pointer-events: none; z-index: 2;
}
.admin-header-circle-2 {
  position: absolute; width: 140px; height: 140px; right: -20px; bottom: -70px;
  border-radius: 50%; background: rgba(255,255,255,.08); pointer-events: none; z-index: 2;
}
.admin-header-content { position: relative; z-index: 3; max-width: 650px; }
.admin-eyebrow {
  display: inline-flex; align-items: center; gap: 6px;
  color: rgba(255,255,255,.9); font-size: 11px; font-weight: 700;
  letter-spacing: .8px; text-transform: uppercase;
  background: rgba(255, 255, 255, 0.14); padding: 4px 10px; border-radius: 20px;
  backdrop-filter: blur(4px);
}
.admin-header h1 {
  margin: 10px 0 6px; color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: -.5px;
  display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
}
.admin-header p {
  margin: 0; color: rgba(255,255,255,.9); font-size: 13.5px; line-height: 1.5;
}
.admin-header-date-badge {
  position: relative; z-index: 3; display: inline-flex; align-items: center; gap: 8px;
  background: rgba(255,255,255,0.15); backdrop-filter: blur(6px);
  padding: 8px 16px; border-radius: 12px; color: #ffffff; font-size: 12.5px; font-weight: 600;
  border: 1px solid rgba(255,255,255,0.2); white-space: nowrap;
}

/* Stats Grid (Matches User style) */
.admin-stats-grid {
  display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; margin-bottom: 24px;
}
.admin-stat-card {
  padding: 18px 20px; border: 1px solid var(--border); border-radius: 14px;
  background: var(--surface); display: flex; align-items: center; gap: 14px;
  box-shadow: 0 2px 10px rgba(15, 30, 50, 0.02); transition: transform .15s ease, box-shadow .15s ease;
}
.admin-stat-card:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(15, 30, 50, 0.06); }
.admin-stat-icon {
  width: 44px; height: 44px; flex-shrink: 0; border-radius: 12px;
  display: flex; align-items: center; justify-content: center; font-size: 18px;
}
.admin-stat-card.blue .admin-stat-icon { background: var(--hp-pri-lt, #eef5fd); color: var(--primary); }
.admin-stat-card.green .admin-stat-icon { background: #ecfdf5; color: #059669; }
.admin-stat-card.purple .admin-stat-icon { background: #f5f3ff; color: #7c3aed; }
.admin-stat-card.amber .admin-stat-icon { background: #fffbeb; color: #d97706; }
.admin-stat-info { min-width: 0; }
.admin-stat-info span { display: block; color: var(--text-soft); font-size: 11.5px; font-weight: 600; }
.admin-stat-info strong {
  display: block; margin-top: 2px; color: var(--text); font-size: 20px; font-weight: 800;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

/* Quick Action Banner Cards */
.admin-quick-grid {
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; margin-bottom: 28px;
}
.admin-quick-card {
  padding: 20px 24px; border: 1px solid var(--border); border-radius: 16px;
  background: var(--surface); display: flex; align-items: center; justify-content: space-between;
  gap: 16px; cursor: pointer; transition: all .18s ease; text-align: left;
  box-shadow: 0 2px 10px rgba(15, 30, 50, 0.02);
}
.admin-quick-card:hover {
  transform: translateY(-2px); border-color: var(--primary);
  box-shadow: 0 8px 24px rgba(15, 30, 50, 0.08); background: var(--hp-pri-lt, #f8fbff);
}
.admin-quick-left { display: flex; align-items: center; gap: 16px; }
.admin-quick-icon {
  width: 46px; height: 46px; border-radius: 12px; display: flex; align-items: center;
  justify-content: center; font-size: 20px; flex-shrink: 0;
}
.admin-quick-card.create .admin-quick-icon {
  background: linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 75%, #60a5fa));
  color: #ffffff; box-shadow: 0 4px 12px rgba(33, 104, 180, 0.25);
}
.admin-quick-card.import .admin-quick-icon {
  background: linear-gradient(135deg, #2b579a, #4172b8);
  color: #ffffff; box-shadow: 0 4px 12px rgba(43, 87, 154, 0.25);
}
.admin-quick-text h3 { margin: 0; color: var(--text); font-size: 16px; font-weight: 800; }
.admin-quick-text p { margin: 3px 0 0; color: var(--text-soft); font-size: 12px; }
.admin-quick-arrow {
  width: 34px; height: 34px; border-radius: 10px; background: var(--border);
  color: var(--text-soft); display: flex; align-items: center; justify-content: center;
  font-size: 13px; transition: transform .15s ease, background .15s ease, color .15s ease;
  flex-shrink: 0;
}
.admin-quick-card:hover .admin-quick-arrow {
  background: var(--primary); color: #ffffff; transform: translateX(3px);
}

/* Recent Forms Section */
.admin-section-header {
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  margin-bottom: 16px; flex-wrap: wrap;
}
.admin-section-header h2 {
  margin: 0; color: var(--text); font-size: 18px; font-weight: 800;
  display: flex; align-items: center; gap: 8px;
}
.admin-view-all-link {
  display: inline-flex; align-items: center; gap: 6px; color: var(--primary);
  font-size: 12.5px; font-weight: 700; cursor: pointer; background: none; border: none; padding: 0;
  transition: gap .15s ease;
}
.admin-view-all-link:hover { gap: 9px; }

.admin-recent-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;
}

/* Form Card (Matches User Dashboard Card) */
.admin-form-card {
  border: 1px solid var(--border); border-radius: 16px; background: var(--surface);
  padding: 20px; display: flex; flex-direction: column; justify-content: space-between;
  box-shadow: 0 2px 10px rgba(15, 30, 50, 0.02); transition: all .18s ease;
}
.admin-form-card:hover {
  transform: translateY(-2px); border-color: var(--primary);
  box-shadow: 0 8px 24px rgba(15, 30, 50, 0.08);
}
.admin-form-card-header {
  display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px;
}
.admin-form-category-tag {
  display: inline-flex; align-items: center; gap: 5px; font-size: 10px; font-weight: 700;
  text-transform: uppercase; letter-spacing: .6px; padding: 3px 8px; border-radius: 6px;
  background: var(--hp-pri-lt, #eef5fd); color: var(--primary);
}
.admin-form-status-tag {
  display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 700;
  padding: 3px 9px; border-radius: 20px;
}
.admin-form-status-tag.active { background: #ecfdf5; color: #059669; }
.admin-form-status-tag.inactive { background: #fef2f2; color: #dc2626; }
.admin-status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

.admin-form-card-body h3 {
  margin: 0 0 6px; color: var(--text); font-size: 15px; font-weight: 800; line-height: 1.4;
}
.admin-form-card-body p {
  margin: 0 0 14px; color: var(--text-soft); font-size: 12px; line-height: 1.5;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.admin-form-meta {
  display: flex; flex-wrap: wrap; gap: 12px; padding: 10px 0;
  border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
  margin-bottom: 14px; font-size: 11.5px; color: var(--text-muted);
}
.admin-form-meta span { display: inline-flex; align-items: center; gap: 5px; }

/* Card Actions */
.admin-form-card-actions {
  display: flex; align-items: center; gap: 8px;
}
.admin-manage-btn {
  flex: 1; height: 38px; border-radius: 10px; border: none; background: var(--primary);
  color: #ffffff; font-family: inherit; font-size: 12px; font-weight: 700; cursor: pointer;
  display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  transition: all .15s ease; box-shadow: 0 2px 8px rgba(15, 30, 50, 0.1);
}
.admin-manage-btn:hover { filter: brightness(1.08); }
.admin-card-icon-btn {
  width: 38px; height: 38px; border-radius: 10px; border: 1px solid var(--border);
  background: var(--surface); color: var(--text-soft); display: inline-flex; align-items: center;
  justify-content: center; font-size: 14px; cursor: pointer; transition: all .15s ease;
  flex-shrink: 0;
}
.admin-card-icon-btn:hover { background: var(--hp-pri-lt, #eef5fd); color: var(--primary); border-color: var(--primary); }
.admin-card-icon-btn.copied { background: #ecfdf5; color: #059669; border-color: #a7f3d0; }

/* Empty Recent State */
.admin-empty-card {
  grid-column: 1 / -1; padding: 48px 24px; border: 1px dashed var(--border);
  border-radius: 18px; text-align: center; background: var(--surface);
}
.admin-empty-icon {
  width: 54px; height: 54px; border-radius: 16px; background: var(--hp-pri-lt, #eef5fd);
  color: var(--primary); display: inline-flex; align-items: center; justify-content: center;
  font-size: 24px; margin-bottom: 14px;
}
.admin-empty-card h3 { margin: 0 0 6px; color: var(--text); font-size: 16px; font-weight: 800; }
.admin-empty-card p { margin: 0 0 18px; color: var(--text-soft); font-size: 12.5px; }

/* Modals (Matches User Modal Styling) */
.admin-modal-overlay {
  position: fixed; inset: 0; z-index: 200; padding: 20px;
  background: rgba(5, 14, 26, 0.55); display: flex; align-items: center;
  justify-content: center; backdrop-filter: blur(5px); animation: adFadeIn .18s ease;
}
.admin-modal {
  width: 100%; max-width: 420px; padding: 26px; border: 1px solid var(--border);
  border-radius: 18px; background: var(--surface); box-shadow: 0 24px 60px rgba(0, 0, 0, 0.22);
  animation: adModalIn .2s cubic-bezier(0.16, 1, 0.3, 1);
}
.admin-modal-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 12px; }
.admin-modal-title { display: flex; align-items: center; gap: 10px; }
.admin-modal-icon {
  width: 34px; height: 34px; border-radius: 10px; background: var(--hp-pri-lt, #eef5fd);
  color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 15px;
}
.admin-modal-title h3 { margin: 0; color: var(--text); font-size: 17px; font-weight: 800; }
.admin-modal-close {
  width: 32px; height: 32px; border: 1px solid var(--border); border-radius: 9px;
  background: var(--surface); color: var(--text-soft); display: flex; align-items: center;
  justify-content: center; cursor: pointer; transition: .15s;
}
.admin-modal-close:hover { background: #fee2e2; color: #dc2626; border-color: #fca5a5; }

.admin-modal-qr-box {
  background: #ffffff; border: 1px solid var(--border); border-radius: 14px;
  padding: 18px; margin: 16px 0; display: flex; flex-direction: column; align-items: center;
  box-shadow: 0 4px 14px rgba(15, 30, 50, 0.05);
}
.admin-modal-qr-box canvas { display: block; max-width: 100%; }
.admin-modal-qr-label {
  margin-top: 10px; font-size: 11px; font-weight: 700; color: var(--primary);
  display: inline-flex; align-items: center; gap: 5px;
}
.admin-modal-link-box {
  background: var(--hp-pri-lt, #f8fbff); border: 1px solid var(--border);
  border-radius: 10px; padding: 8px 12px; display: flex; align-items: center;
  justify-content: space-between; gap: 8px; margin-bottom: 16px;
}
.admin-modal-link-box p {
  margin: 0; font-size: 11.5px; color: var(--text); overflow: hidden;
  text-overflow: ellipsis; white-space: nowrap;
}
.admin-modal-link-copy {
  border: none; background: none; color: var(--primary); cursor: pointer;
  padding: 4px; display: flex; align-items: center; justify-content: center; font-size: 14px;
}
.admin-modal-actions { display: flex; gap: 10px; margin-top: 6px; }
.admin-modal-actions button {
  flex: 1; height: 40px; border-radius: 10px; font-family: inherit; font-size: 12.5px;
  font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 7px;
}
.admin-modal-cancel { border: 1px solid var(--border); background: var(--surface); color: var(--text-soft); }
.admin-modal-cancel:hover { background: var(--border); }
.admin-modal-download { border: none; background: var(--primary); color: #ffffff; box-shadow: 0 2px 8px rgba(15, 30, 50, 0.12); }
.admin-modal-download:hover { filter: brightness(1.08); }

@keyframes adFadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes adModalIn { from { opacity: 0; transform: scale(.95) translateY(10px); } to { opacity: 1; transform: none; } }

/* Dark Mode Overrides */
.dark.admin-dashboard-page {
  --border: #1b2e40; --surface: #0f1c2b; --background: transparent;
  --text: #dde9f6; --text-soft: #8da4be; --text-muted: #4b6277;
}
.dark .admin-stat-card { background: #0f1c2b; border-color: #1b2e40; }
.dark .admin-stat-card.blue .admin-stat-icon { background: #132235; color: #60a5fa; }
.dark .admin-quick-card { background: #0f1c2b; border-color: #1b2e40; }
.dark .admin-quick-card:hover { background: #132235; }
.dark .admin-quick-arrow { background: #132235; color: #8da4be; }
.dark .admin-form-card { background: #0f1c2b; border-color: #1b2e40; }
.dark .admin-card-icon-btn { background: #132235; border-color: #1b2e40; color: #8da4be; }
.dark .admin-card-icon-btn:hover { background: #1b2e40; color: #60a5fa; }
.dark .admin-modal { background: #0f1c2b; border-color: #1b2e40; }
.dark .admin-modal-close { background: #132235; border-color: #1b2e40; color: #8da4be; }
.dark .admin-modal-link-box { background: #132235; border-color: #1b2e40; }
.dark .admin-modal-cancel { background: #132235; border-color: #1b2e40; color: #8da4be; }
.dark .admin-empty-card { background: #0f1c2b; border-color: #1b2e40; }

@media (max-width: 900px) {
  .admin-stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .admin-quick-grid { grid-template-columns: 1fr; }
}
@media (max-width: 600px) {
  .admin-dashboard-main { padding: 20px 16px 40px; }
  .admin-header { padding: 24px 20px; flex-direction: column; align-items: flex-start; }
  .admin-stats-grid { grid-template-columns: 1fr; }
}
`;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { darkMode, primaryColor, imageDataUrl, t } = useTheme();

  const [forms, setForms] = useState([]);
  const [copiedFormId, setCopiedFormId] = useState(null);
  const [selectedQrForm, setSelectedQrForm] = useState(null);
  const [qrDownloaded, setQrDownloaded] = useState(false);
  const [currentDate] = useState(new Date());

  const admin = useMemo(() => getCurrentAdmin(), []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return "SELAMAT PAGI";
    if (hour < 15) return "SELAMAT SIANG";
    if (hour < 19) return "SELAMAT SORE";
    return "SELAMAT MALAM";
  };

  const loadForms = useCallback(async () => {
    try {
      const res = await getForms();
      const apiForms = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];

      const mappedForms = apiForms.map((form) => ({
        id: form.id,
        title: form.title || "Untitled Form",
        description: form.description || "Form created using HiDocs.",
        customLink: form.custom_url || form.customLink || String(form.id),
        link: form.custom_url ? `hidocs.app/f/${form.custom_url}` : `hidocs.app/r/${form.id}`,
        active: form.status === "ACTIVE" || form.active !== false,
        responses: Number(form.response_count) || (Array.isArray(form.responses) ? form.responses.length : 0),
        questions: Array.isArray(form.questions) ? form.questions.length : (Number(form.question_count) || 0),
        createdAt: form.created_at || form.createdAt || new Date().toISOString(),
        type: form.type || form.category || "Form",
      }));

      setForms(mappedForms);
    } catch (error) {
      console.error("Gagal memuat form dashboard admin:", error);
      setForms([]);
    }
  }, []);

  useEffect(() => {
    loadForms();
  }, [loadForms]);

  const stats = useMemo(() => {
    const total = forms.length;
    const active = forms.filter((f) => f.active).length;
    const totalResponses = forms.reduce((acc, f) => acc + (f.responses || 0), 0);
    return {
      totalForms: total,
      activeForms: active,
      totalResponses,
      creatorName: admin.name || "Admin",
    };
  }, [forms, admin]);

  const recentForms = useMemo(() => {
    return [...forms]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4);
  }, [forms]);

  const copyFormLink = async (form, e) => {
    e?.stopPropagation();
    try {
      await navigator.clipboard.writeText(getCompleteFormLink(form));
      setCopiedFormId(form.id);
      setTimeout(() => setCopiedFormId(null), 1800);
    } catch (error) {
      console.error("Gagal menyalin link:", error);
    }
  };

  const openQrModal = (form, e) => {
    e?.stopPropagation();
    setQrDownloaded(false);
    setSelectedQrForm(form);
  };

  const closeQrModal = () => {
    setSelectedQrForm(null);
    setQrDownloaded(false);
  };

  const downloadQrCode = () => {
    if (!selectedQrForm) return;
    const canvas = document.getElementById("admin-dashboard-qr-canvas");
    if (!canvas) return;
    const pngUrl = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${createSafeFileName(selectedQrForm.title)}-qr-code.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    setQrDownloaded(true);
  };

  const formatDateStr = (dateStr) => {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(d);
    } catch {
      return dateStr;
    }
  };

  const formattedCurrentDate = useMemo(() => {
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(currentDate);
  }, [currentDate]);

  return (
    <div className={["admin-dashboard-page", darkMode ? "dark" : ""].filter(Boolean).join(" ")}>
      <style>{adminDashboardStyles}</style>

      <main className="admin-dashboard-main">
        {/* Header Banner Card (Aligned with User Dashboard) */}
        <header className={`admin-header${imageDataUrl ? " has-bg" : ""}`}>
          {imageDataUrl && <img src={imageDataUrl} alt="Header Background" className="admin-header-bg-img" />}
          {imageDataUrl && <div className="admin-header-bg-overlay" />}

          <div className="admin-header-circle-1" />
          <div className="admin-header-circle-2" />

          <div className="admin-header-content">
            <span className="admin-eyebrow">
              <FaShieldAlt /> {getGreeting()} · ADMIN PANEL
            </span>
            <h1>
              Halo, {admin.name}! <span style={{ display: "inline-block" }}>👋</span>
            </h1>
            <p>
              Kelola seluruh formulir digital, buat kuis interaktif, dan pantau respons masuk secara langsung.
            </p>
          </div>

          <div className="admin-header-date-badge">
            <FaCalendarAlt />
            <span>{formattedCurrentDate}</span>
          </div>
        </header>

        {/* 4 Summary Stats Cards */}
        <section className="admin-stats-grid">
          <div className="admin-stat-card blue">
            <div className="admin-stat-icon"><FaWpforms /></div>
            <div className="admin-stat-info">
              <span>Total Formulir</span>
              <strong>{stats.totalForms}</strong>
            </div>
          </div>
          <div className="admin-stat-card green">
            <div className="admin-stat-icon"><FaCheckCircle /></div>
            <div className="admin-stat-info">
              <span>Formulir Aktif</span>
              <strong>{stats.activeForms}</strong>
            </div>
          </div>
          <div className="admin-stat-card purple">
            <div className="admin-stat-icon"><FaClipboardCheck /></div>
            <div className="admin-stat-info">
              <span>Total Respons Masuk</span>
              <strong>{stats.totalResponses}</strong>
            </div>
          </div>
          <div className="admin-stat-card amber">
            <div className="admin-stat-icon"><FaUser /></div>
            <div className="admin-stat-info">
              <span>Akun Administrator</span>
              <strong>{stats.creatorName}</strong>
            </div>
          </div>
        </section>

        {/* Quick Actions (Create & Import) */}
        <section className="admin-quick-grid">
          <div
            className="admin-quick-card create"
            onClick={() => navigate("/create-form")}
            role="button"
            tabIndex={0}
          >
            <div className="admin-quick-left">
              <div className="admin-quick-icon">
                <FaPlus />
              </div>
              <div className="admin-quick-text">
                <h3>Buat Formulir Baru</h3>
                <p>Rancang kuis interaktif, survei opini, atau formulir pendaftaran baru.</p>
              </div>
            </div>
            <div className="admin-quick-arrow">
              <FaChevronRight />
            </div>
          </div>

          <div
            className="admin-quick-card import"
            onClick={() => navigate("/admin/import-word")}
            role="button"
            tabIndex={0}
          >
            <div className="admin-quick-left">
              <div className="admin-quick-icon">
                <FaFileWord />
              </div>
              <div className="admin-quick-text">
                <h3>Import Dokumen Word</h3>
                <p>Konversi file Microsoft Word (.docx) langsung menjadi kuis digital otomatis.</p>
              </div>
            </div>
            <div className="admin-quick-arrow">
              <FaChevronRight />
            </div>
          </div>
        </section>

        {/* Recent Forms Section */}
        <section>
          <div className="admin-section-header">
            <h2>
              <FaLayerGroup style={{ color: "var(--primary)" }} /> Formulir Terbaru
            </h2>
            <button
              type="button"
              className="admin-view-all-link"
              onClick={() => navigate("/admin/forms")}
            >
              <span>Kelola Semua Formulir</span>
              <FaArrowRight />
            </button>
          </div>

          <div className="admin-recent-grid">
            {recentForms.length === 0 ? (
              <div className="admin-empty-card">
                <div className="admin-empty-icon"><FaWpforms /></div>
                <h3>Belum Ada Formulir</h3>
                <p>Mulai buat formulir pertama Anda untuk mengumpulkan respons dari pengguna.</p>
                <button
                  type="button"
                  className="admin-manage-btn"
                  style={{ maxWidth: 200, margin: "0 auto" }}
                  onClick={() => navigate("/create-form")}
                >
                  <FaPlus /> Buat Formulir
                </button>
              </div>
            ) : (
              recentForms.map((form) => (
                <article key={form.id} className="admin-form-card">
                  <div>
                    <div className="admin-form-card-header">
                      <span className="admin-form-category-tag">
                        <FaLayerGroup /> {form.type}
                      </span>
                      <span className={`admin-form-status-tag ${form.active ? "active" : "inactive"}`}>
                        <span className="admin-status-dot" />
                        {form.active ? "Aktif" : "Ditutup"}
                      </span>
                    </div>

                    <div className="admin-form-card-body">
                      <h3>{form.title}</h3>
                      <p>{form.description}</p>
                    </div>
                  </div>

                  <div>
                    <div className="admin-form-meta">
                      <span><FaCalendarAlt /> {formatDateStr(form.createdAt)}</span>
                      <span><FaFileAlt /> {form.questions} Pertanyaan</span>
                      <span><FaClipboardList /> {form.responses} Respons</span>
                    </div>

                    <div className="admin-form-card-actions">
                      <button
                        type="button"
                        className="admin-manage-btn"
                        onClick={() => navigate(`/admin/forms/${form.id}`)}
                        title="Buka detail formulir"
                      >
                        <FaEye />
                        <span>Kelola</span>
                        <FaArrowRight />
                      </button>

                      <button
                        type="button"
                        className="admin-card-icon-btn"
                        onClick={(e) => openQrModal(form, e)}
                        title="Tampilkan QR Code"
                        aria-label="QR Code"
                      >
                        <FaQrcode />
                      </button>

                      <button
                        type="button"
                        className={`admin-card-icon-btn${copiedFormId === form.id ? " copied" : ""}`}
                        onClick={(e) => copyFormLink(form, e)}
                        title="Salin Link Formulir"
                        aria-label="Salin Link"
                      >
                        {copiedFormId === form.id ? <FaCheckCircle /> : <FaCopy />}
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </main>

      {/* QR Code Modal (Matches User Modal Styling) */}
      {selectedQrForm && (
        <div className="admin-modal-overlay" onClick={closeQrModal} role="dialog" aria-modal="true">
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div className="admin-modal-title">
                <div className="admin-modal-icon"><FaQrcode /></div>
                <h3>QR Code Formulir</h3>
              </div>
              <button type="button" className="admin-modal-close" onClick={closeQrModal} aria-label="Tutup">
                <FaTimes />
              </button>
            </div>

            <div style={{ textAlign: "center" }}>
              <span className="admin-form-category-tag" style={{ marginBottom: 6 }}>
                {selectedQrForm.type}
              </span>
              <h4 style={{ margin: "4px 0 2px", color: "var(--text)", fontSize: 15, fontWeight: 800 }}>
                {selectedQrForm.title}
              </h4>
              <p style={{ margin: 0, color: "var(--text-soft)", fontSize: 12 }}>
                Pindai QR Code ini untuk membuka formulir langsung di perangkat.
              </p>
            </div>

            <div className="admin-modal-qr-box">
              <QRCodeCanvas
                id="admin-dashboard-qr-canvas"
                value={getCompleteFormLink(selectedQrForm)}
                size={210}
                level="H"
                includeMargin
                bgColor="#ffffff"
                fgColor="#0f172a"
              />
              <span className="admin-modal-qr-label">
                <FaQrcode /> Scan untuk mengisi form
              </span>
            </div>

            <div className="admin-modal-link-box">
              <p>{getCompleteFormLink(selectedQrForm)}</p>
              <button
                type="button"
                className="admin-modal-link-copy"
                onClick={(e) => copyFormLink(selectedQrForm, e)}
                title="Salin Link"
              >
                {copiedFormId === selectedQrForm.id ? <FaCheckCircle style={{ color: "#059669" }} /> : <FaCopy />}
              </button>
            </div>

            <div className="admin-modal-actions">
              <button type="button" className="admin-modal-cancel" onClick={closeQrModal}>
                Tutup
              </button>
              <button type="button" className="admin-modal-download" onClick={downloadQrCode}>
                <FaDownload />
                <span>{qrDownloaded ? "Tersimpan" : "Unduh QR"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}