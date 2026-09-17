import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaCheckCircle,
  FaCopy,
  FaDownload,
  FaEdit,
  FaFileAlt,
  FaFileWord,
  FaLayerGroup,
  FaPlus,
  FaPoll,
  FaQrcode,
  FaQuestionCircle,
  FaSearch,
  FaTimes,
  FaTrash,
  FaUsers,
  FaWpforms,
} from "react-icons/fa";
import { QRCodeCanvas } from "qrcode.react";
import { useTheme } from "../context/ThemeContext";
import { deleteForm as deleteFormApi, getForms } from "../api/formApi";

const FORMS_STORAGE_KEY = "hidocs_forms";
const DELETED_FORMS_STORAGE_KEY = "hidocs_deleted_forms";

const parseStoredArray = (key) => {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const getCompleteFormLink = (form) => {
  const customLink = String(form?.customLink || form?.custom_url || "").trim();
  if (customLink) {
    return `${window.location.origin}/form-details/${customLink}`;
  }
  const formId = form?.id ?? form?.formId ?? "";
  return `${window.location.origin}/form-details/${formId}`;
};

const createSafeFileName = (value) => {
  return String(value || "hidocs-form")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "hidocs-form";
};

const manageFormsStyles = `
.manage-forms-page, .manage-forms-page * { box-sizing: border-box; }
.manage-forms-page {
  --primary: var(--hp-pri, #2168b4);
  --border: #e5ebf2; --surface: #ffffff; --background: transparent;
  --text: #1d2c3f; --text-soft: #5e7188; --text-muted: #9aa7b7;
  min-height: 100%; width: 100%;
  color: var(--text); font-family: "Inter", sans-serif; font-size: 14px;
}
.manage-forms-main { width: 100%; max-width: 1240px; margin: 0 auto; padding: 32px 36px 48px; }

/* Header Banner Card (Matches User Forms & Dashboard) */
.manage-header {
  position: relative; min-height: 160px; padding: 30px 36px; margin-bottom: 24px;
  overflow: hidden; border-radius: 18px;
  background: linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 70%, #4b9fe8) 100%);
  box-shadow: 0 10px 30px rgba(15, 30, 50, 0.12);
  display: flex; align-items: center; justify-content: space-between; gap: 20px;
}
.manage-header-circle-1 {
  position: absolute; width: 220px; height: 220px; right: 90px; top: -110px;
  border: 1px solid rgba(255,255,255,.14); border-radius: 50%; pointer-events: none;
}
.manage-header-circle-2 {
  position: absolute; width: 140px; height: 140px; right: -20px; bottom: -70px;
  border-radius: 50%; background: rgba(255,255,255,.08); pointer-events: none;
}
.manage-header-content { position: relative; z-index: 2; max-width: 650px; }
.manage-eyebrow {
  display: inline-flex; align-items: center; gap: 6px;
  color: rgba(255,255,255,.9); font-size: 11px; font-weight: 700;
  letter-spacing: .8px; text-transform: uppercase;
  background: rgba(255, 255, 255, 0.14); padding: 4px 10px; border-radius: 20px;
}
.manage-header h1 {
  margin: 10px 0 6px; color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: -.5px;
}
.manage-header p {
  margin: 0; color: rgba(255,255,255,.9); font-size: 13.5px; line-height: 1.5;
}
.manage-header-actions {
  position: relative; z-index: 2; display: flex; align-items: center; gap: 10px; flex-shrink: 0;
}
.manage-create-btn {
  height: 42px; padding: 0 18px; border-radius: 12px; border: none;
  background: #ffffff; color: var(--primary); font-family: inherit; font-size: 13px;
  font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 8px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15); transition: all .15s ease;
}
.manage-create-btn:hover { transform: translateY(-1px); filter: brightness(0.96); }

/* Stats Summary */
.manage-stats-grid {
  display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; margin-bottom: 24px;
}
.manage-stat-card {
  padding: 16px 20px; border: 1px solid var(--border); border-radius: 14px;
  background: var(--surface); display: flex; align-items: center; gap: 14px;
  box-shadow: 0 2px 10px rgba(15, 30, 50, 0.02);
}
.manage-stat-icon {
  width: 44px; height: 44px; flex-shrink: 0; border-radius: 12px;
  display: flex; align-items: center; justify-content: center; font-size: 18px;
}
.manage-stat-card.blue .manage-stat-icon { background: var(--hp-pri-lt, #eef5fd); color: var(--primary); }
.manage-stat-card.green .manage-stat-icon { background: #ecfdf5; color: #059669; }
.manage-stat-card.purple .manage-stat-icon { background: #f5f3ff; color: #7c3aed; }
.manage-stat-info span { display: block; color: var(--text-soft); font-size: 11.5px; font-weight: 600; }
.manage-stat-info strong { display: block; margin-top: 2px; color: var(--text); font-size: 19px; font-weight: 800; }

/* Filter & Search Toolbar */
.manage-toolbar {
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  margin-bottom: 20px; flex-wrap: wrap;
}
.manage-search-box {
  position: relative; flex: 1; min-width: 260px; max-width: 420px;
}
.manage-search-icon {
  position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
  color: var(--text-muted); font-size: 14px; pointer-events: none;
}
.manage-search-input {
  width: 100%; height: 42px; padding: 0 36px 0 40px; border-radius: 12px;
  border: 1px solid var(--border); background: var(--surface); color: var(--text);
  font-family: inherit; font-size: 13px; transition: all .15s ease;
}
.manage-search-input:focus {
  outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(33, 104, 180, 0.14);
}
.manage-search-clear {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  border: none; background: none; color: var(--text-muted); cursor: pointer; padding: 2px;
  font-size: 13px; display: flex; align-items: center; justify-content: center;
}

.manage-category-tabs {
  display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
}
.manage-tab-btn {
  height: 36px; padding: 0 14px; border-radius: 10px; border: 1px solid var(--border);
  background: var(--surface); color: var(--text-soft); font-family: inherit; font-size: 12px;
  font-weight: 600; cursor: pointer; transition: all .15s ease;
}
.manage-tab-btn:hover { background: var(--hp-pri-lt, #f8fbff); border-color: var(--primary); }
.manage-tab-btn.active {
  background: var(--primary); color: #ffffff; border-color: var(--primary); font-weight: 700;
  box-shadow: 0 2px 8px rgba(33, 104, 180, 0.2);
}

/* Form Cards Grid */
.manage-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 18px;
}

/* Form Card */
.manage-card {
  border: 1px solid var(--border); border-radius: 16px; background: var(--surface);
  padding: 22px; display: flex; flex-direction: column; justify-content: space-between;
  box-shadow: 0 2px 10px rgba(15, 30, 50, 0.02); transition: all .18s ease;
}
.manage-card:hover {
  transform: translateY(-2px); border-color: var(--primary);
  box-shadow: 0 8px 24px rgba(15, 30, 50, 0.08);
}
.manage-card-top {
  display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px;
}
.manage-card-category {
  display: inline-flex; align-items: center; gap: 5px; font-size: 10px; font-weight: 700;
  text-transform: uppercase; letter-spacing: .6px; padding: 3px 8px; border-radius: 6px;
  background: var(--hp-pri-lt, #eef5fd); color: var(--primary);
}
.manage-card-status {
  display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 700;
  padding: 3px 9px; border-radius: 20px;
}
.manage-card-status.active { background: #ecfdf5; color: #059669; }
.manage-card-status.inactive { background: #fef2f2; color: #dc2626; }
.manage-status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

.manage-card-body h3 {
  margin: 0 0 6px; color: var(--text); font-size: 15.5px; font-weight: 800; line-height: 1.4;
}
.manage-card-body p {
  margin: 0 0 14px; color: var(--text-soft); font-size: 12.5px; line-height: 1.5;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}

.manage-card-meta {
  display: flex; flex-wrap: wrap; gap: 12px; padding: 10px 0;
  border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
  margin-bottom: 16px; font-size: 12px; color: var(--text-muted);
}
.manage-card-meta span { display: inline-flex; align-items: center; gap: 5px; }

/* Actions Bar inside Card */
.manage-card-actions {
  display: flex; flex-direction: column; gap: 10px;
}
.manage-action-primary-row {
  display: flex; gap: 8px;
}
.manage-details-btn {
  flex: 1; height: 38px; border-radius: 10px; border: none; background: var(--primary);
  color: #ffffff; font-family: inherit; font-size: 12px; font-weight: 700; cursor: pointer;
  display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  transition: all .15s ease; box-shadow: 0 2px 8px rgba(15, 30, 50, 0.1);
}
.manage-details-btn:hover { filter: brightness(1.08); }
.manage-results-btn {
  height: 38px; padding: 0 12px; border-radius: 10px; border: 1px solid var(--border);
  background: var(--surface); color: var(--primary); font-family: inherit; font-size: 12px;
  font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;
  transition: all .15s ease;
}
.manage-results-btn:hover { background: var(--hp-pri-lt, #eef5fd); border-color: var(--primary); }

.manage-action-icons-row {
  display: flex; align-items: center; justify-content: space-between; gap: 6px;
  padding-top: 6px;
}
.manage-icon-btn {
  height: 34px; padding: 0 10px; border-radius: 9px; border: 1px solid var(--border);
  background: var(--surface); color: var(--text-soft); display: inline-flex; align-items: center;
  gap: 6px; font-family: inherit; font-size: 11.5px; font-weight: 600; cursor: pointer;
  transition: all .15s ease;
}
.manage-icon-btn:hover { background: var(--hp-pri-lt, #eef5fd); color: var(--primary); border-color: var(--primary); }
.manage-icon-btn.copied { background: #ecfdf5; color: #059669; border-color: #a7f3d0; }
.manage-icon-btn.danger { color: #dc2626; }
.manage-icon-btn.danger:hover { background: #fef2f2; border-color: #fca5a5; }

/* Empty state */
.manage-empty-box {
  grid-column: 1 / -1; padding: 54px 24px; border: 1px dashed var(--border);
  border-radius: 18px; text-align: center; background: var(--surface);
}
.manage-empty-icon {
  width: 56px; height: 56px; border-radius: 16px; background: var(--hp-pri-lt, #eef5fd);
  color: var(--primary); display: inline-flex; align-items: center; justify-content: center;
  font-size: 24px; margin-bottom: 14px;
}
.manage-empty-box h3 { margin: 0 0 6px; color: var(--text); font-size: 16px; font-weight: 800; }
.manage-empty-box p { margin: 0 0 18px; color: var(--text-soft); font-size: 13px; }

/* Modal Styling */
.manage-modal-overlay {
  position: fixed; inset: 0; z-index: 200; padding: 20px;
  background: rgba(5, 14, 26, 0.55); display: flex; align-items: center;
  justify-content: center; backdrop-filter: blur(5px); animation: mnFadeIn .18s ease;
}
.manage-modal {
  width: 100%; max-width: 440px; padding: 26px; border: 1px solid var(--border);
  border-radius: 18px; background: var(--surface); box-shadow: 0 24px 60px rgba(0, 0, 0, 0.22);
  animation: mnModalIn .2s cubic-bezier(0.16, 1, 0.3, 1);
}
.manage-modal-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 12px; }
.manage-modal-title { display: flex; align-items: center; gap: 10px; }
.manage-modal-icon {
  width: 34px; height: 34px; border-radius: 10px; background: var(--hp-pri-lt, #eef5fd);
  color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 15px;
}
.manage-modal-icon.danger { background: #fef2f2; color: #dc2626; }
.manage-modal-title h3 { margin: 0; color: var(--text); font-size: 17px; font-weight: 800; }
.manage-modal-close {
  width: 32px; height: 32px; border: 1px solid var(--border); border-radius: 9px;
  background: var(--surface); color: var(--text-soft); display: flex; align-items: center;
  justify-content: center; cursor: pointer; transition: .15s;
}
.manage-modal-close:hover { background: #fee2e2; color: #dc2626; border-color: #fca5a5; }

.manage-modal-qr-box {
  background: #ffffff; border: 1px solid var(--border); border-radius: 14px;
  padding: 18px; margin: 16px 0; display: flex; flex-direction: column; align-items: center;
  box-shadow: 0 4px 14px rgba(15, 30, 50, 0.05);
}
.manage-modal-link-box {
  background: var(--hp-pri-lt, #f8fbff); border: 1px solid var(--border);
  border-radius: 10px; padding: 8px 12px; display: flex; align-items: center;
  justify-content: space-between; gap: 8px; margin-bottom: 16px;
}
.manage-modal-link-box p {
  margin: 0; font-size: 11.5px; color: var(--text); overflow: hidden;
  text-overflow: ellipsis; white-space: nowrap;
}
.manage-modal-link-copy {
  border: none; background: none; color: var(--primary); cursor: pointer;
  padding: 4px; display: flex; align-items: center; justify-content: center; font-size: 14px;
}
.manage-modal-actions { display: flex; gap: 10px; margin-top: 6px; }
.manage-modal-actions button {
  flex: 1; height: 40px; border-radius: 10px; font-family: inherit; font-size: 12.5px;
  font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 7px;
}
.manage-modal-cancel { border: 1px solid var(--border); background: var(--surface); color: var(--text-soft); }
.manage-modal-cancel:hover { background: var(--border); }
.manage-modal-submit { border: none; background: var(--primary); color: #ffffff; box-shadow: 0 2px 8px rgba(15, 30, 50, 0.12); }
.manage-modal-submit.danger { background: #dc2626; box-shadow: 0 2px 8px rgba(220, 38, 38, 0.2); }
.manage-modal-submit:hover { filter: brightness(1.08); }

@keyframes mnFadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes mnModalIn { from { opacity: 0; transform: scale(.95) translateY(10px); } to { opacity: 1; transform: none; } }

/* Dark Mode Overrides */
.dark.manage-forms-page {
  --border: #1b2e40; --surface: #0f1c2b; --background: transparent;
  --text: #dde9f6; --text-soft: #8da4be; --text-muted: #4b6277;
}
.dark .manage-stat-card { background: #0f1c2b; border-color: #1b2e40; }
.dark .manage-search-input { background: #0f1c2b; border-color: #1b2e40; color: #dde9f6; }
.dark .manage-tab-btn { background: #0f1c2b; border-color: #1b2e40; color: #8da4be; }
.dark .manage-tab-btn.active { background: var(--primary); color: #ffffff; }
.dark .manage-card { background: #0f1c2b; border-color: #1b2e40; }
.dark .manage-results-btn { background: #132235; border-color: #1b2e40; color: #60a5fa; }
.dark .manage-icon-btn { background: #132235; border-color: #1b2e40; color: #8da4be; }
.dark .manage-icon-btn:hover { background: #1b2e40; color: #60a5fa; }
.dark .manage-icon-btn.danger { color: #f87171; }
.dark .manage-icon-btn.danger:hover { background: #231215; border-color: #4c1d22; }
.dark .manage-modal { background: #0f1c2b; border-color: #1b2e40; }
.dark .manage-modal-close { background: #132235; border-color: #1b2e40; color: #8da4be; }
.dark .manage-modal-link-box { background: #132235; border-color: #1b2e40; }
.dark .manage-modal-cancel { background: #132235; border-color: #1b2e40; color: #8da4be; }
.dark .manage-empty-box { background: #0f1c2b; border-color: #1b2e40; }

@media (max-width: 900px) {
  .manage-stats-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
@media (max-width: 768px) {
  .manage-forms-main { padding: 20px 16px 40px; }
  .manage-header { padding: 24px 20px; flex-direction: column; align-items: flex-start; }
  .manage-stats-grid { grid-template-columns: 1fr; }
  .manage-toolbar { flex-direction: column; align-items: stretch; }
  .manage-search-box { max-width: 100%; }
}
`;

export default function ManageForms() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const [forms, setForms] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [copiedFormId, setCopiedFormId] = useState(null);
  const [selectedQrForm, setSelectedQrForm] = useState(null);
  const [qrDownloaded, setQrDownloaded] = useState(false);
  const [confirmDeleteForm, setConfirmDeleteForm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
      console.error("Gagal memuat daftar formulir:", error);
      setForms([]);
    }
  }, []);

  useEffect(() => {
    loadForms();
  }, [loadForms]);

  const categories = useMemo(() => {
    const set = new Set();
    forms.forEach((f) => {
      if (f.type) set.add(f.type);
    });
    return ["all", ...Array.from(set)];
  }, [forms]);

  const filteredForms = useMemo(() => {
    const q = search.trim().toLowerCase();
    return forms.filter((form) => {
      const matchCat = selectedCategory === "all" || form.type?.toLowerCase() === selectedCategory.toLowerCase();
      if (!matchCat) return false;
      if (!q) return true;
      return (
        (form.title || "").toLowerCase().includes(q) ||
        (form.description || "").toLowerCase().includes(q) ||
        (form.customLink || "").toLowerCase().includes(q)
      );
    });
  }, [forms, search, selectedCategory]);

  const totalForms = forms.length;
  const activeForms = forms.filter((f) => f.active).length;
  const totalResponses = forms.reduce((acc, f) => acc + (f.responses || 0), 0);

  const copyLink = async (form, e) => {
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
    const canvas = document.getElementById("manage-form-qr-canvas");
    if (!canvas) return;
    const pngUrl = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${createSafeFileName(selectedQrForm.title)}-qr.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    setQrDownloaded(true);
  };

  const executeDeleteForm = async () => {
    if (!confirmDeleteForm || isDeleting) return;
    setIsDeleting(true);
    const formId = confirmDeleteForm.id;
    try {
      try {
        await deleteFormApi(formId);
      } catch (err) {
        console.warn("API delete gagal, fallback ke local storage:", err);
      }

      // Local storage cleanup
      const savedForms = parseStoredArray(FORMS_STORAGE_KEY);
      const updatedSavedForms = savedForms.filter((f) => String(f.id) !== String(formId));
      localStorage.setItem(FORMS_STORAGE_KEY, JSON.stringify(updatedSavedForms));

      const deletedFormIds = parseStoredArray(DELETED_FORMS_STORAGE_KEY);
      if (!deletedFormIds.includes(formId)) {
        localStorage.setItem(DELETED_FORMS_STORAGE_KEY, JSON.stringify([...deletedFormIds, formId]));
      }

      setForms((prev) => prev.filter((f) => String(f.id) !== String(formId)));
      setConfirmDeleteForm(null);
      await loadForms();
    } catch (err) {
      console.error("Gagal menghapus formulir:", err);
    } finally {
      setIsDeleting(false);
    }
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

  return (
    <div className={["manage-forms-page", darkMode ? "dark" : ""].filter(Boolean).join(" ")}>
      <style>{manageFormsStyles}</style>

      <main className="manage-forms-main">
        {/* Header Banner Card */}
        <header className="manage-header">
          <div className="manage-header-circle-1" />
          <div className="manage-header-circle-2" />

          <div className="manage-header-content">
            <span className="manage-eyebrow">
              <FaLayerGroup /> DIREKTORI FORMULIR
            </span>
            <h1>Kelola Formulir</h1>
            <p>
              Pantau seluruh formulir yang dibuat, kelola kuis, bagikan link & QR Code, serta lihat hasil evaluasi secara real-time.
            </p>
          </div>

          <div className="manage-header-actions">
            <button
              type="button"
              className="manage-create-btn"
              onClick={() => navigate("/create-form")}
            >
              <FaPlus /> Buat Formulir
            </button>
          </div>
        </header>

        {/* 3 Summary Stats Cards */}
        <section className="manage-stats-grid">
          <div className="manage-stat-card blue">
            <div className="manage-stat-icon"><FaWpforms /></div>
            <div className="manage-stat-info">
              <span>Total Formulir</span>
              <strong>{totalForms}</strong>
            </div>
          </div>
          <div className="manage-stat-card green">
            <div className="manage-stat-icon"><FaCheckCircle /></div>
            <div className="manage-stat-info">
              <span>Formulir Aktif</span>
              <strong>{activeForms}</strong>
            </div>
          </div>
          <div className="manage-stat-card purple">
            <div className="manage-stat-icon"><FaUsers /></div>
            <div className="manage-stat-info">
              <span>Total Respons Masuk</span>
              <strong>{totalResponses}</strong>
            </div>
          </div>
        </section>

        {/* Filter Toolbar */}
        <section className="manage-toolbar">
          <div className="manage-search-box">
            <FaSearch className="manage-search-icon" />
            <input
              type="text"
              className="manage-search-input"
              placeholder="Cari formulir, deskripsi, atau link..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                className="manage-search-clear"
                onClick={() => setSearch("")}
                aria-label="Hapus pencarian"
              >
                <FaTimes />
              </button>
            )}
          </div>

          <div className="manage-category-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`manage-tab-btn${selectedCategory === cat ? " active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === "all" ? "Semua Formulir" : cat}
              </button>
            ))}
          </div>
        </section>

        {/* Form Cards Grid */}
        <section className="manage-grid">
          {filteredForms.length === 0 ? (
            <div className="manage-empty-box">
              <div className="manage-empty-icon"><FaWpforms /></div>
              <h3>Tidak Ada Formulir Ditemukan</h3>
              <p>
                {search
                  ? `Tidak ada formulir yang cocok dengan kata kunci "${search}".`
                  : "Belum ada formulir yang tersedia. Silakan buat formulir baru."}
              </p>
              {search ? (
                <button
                  type="button"
                  className="manage-create-btn"
                  style={{ maxWidth: 160, margin: "0 auto", background: "var(--primary)", color: "#fff" }}
                  onClick={() => setSearch("")}
                >
                  Reset Pencarian
                </button>
              ) : (
                <button
                  type="button"
                  className="manage-create-btn"
                  style={{ maxWidth: 180, margin: "0 auto", background: "var(--primary)", color: "#fff" }}
                  onClick={() => navigate("/create-form")}
                >
                  <FaPlus /> Buat Formulir
                </button>
              )}
            </div>
          ) : (
            filteredForms.map((form) => (
              <article key={form.id} className="manage-card">
                <div>
                  <div className="manage-card-top">
                    <span className="manage-card-category">
                      <FaLayerGroup /> {form.type}
                    </span>
                    <span className={`manage-card-status ${form.active ? "active" : "inactive"}`}>
                      <span className="manage-status-dot" />
                      {form.active ? "Aktif" : "Ditutup"}
                    </span>
                  </div>

                  <div className="manage-card-body">
                    <h3>{form.title}</h3>
                    <p>{form.description}</p>
                  </div>
                </div>

                <div>
                  <div className="manage-card-meta">
                    <span><FaCalendarAlt /> {formatDateStr(form.createdAt)}</span>
                    <span><FaQuestionCircle /> {form.questions} Pertanyaan</span>
                    <span><FaUsers /> {form.responses} Respons</span>
                  </div>

                  <div className="manage-card-actions">
                    <div className="manage-action-primary-row">
                      <button
                        type="button"
                        className="manage-details-btn"
                        onClick={() => navigate(`/admin/forms/${form.id}`)}
                        title="Buka detail formulir"
                      >
                        <span>Kelola Formulir</span>
                        <FaArrowRight />
                      </button>
                      <button
                        type="button"
                        className="manage-results-btn"
                        onClick={() => navigate(`/admin/forms/${form.id}/results`)}
                        title="Lihat hasil respons"
                      >
                        <FaPoll />
                        <span>Hasil</span>
                      </button>
                    </div>

                    <div className="manage-action-icons-row">
                      <button
                        type="button"
                        className="manage-icon-btn"
                        onClick={() => navigate(`/admin/forms/${form.id}/edit`)}
                        title="Edit Formulir"
                      >
                        <FaEdit />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        className="manage-icon-btn"
                        onClick={(e) => openQrModal(form, e)}
                        title="Tampilkan QR Code"
                      >
                        <FaQrcode />
                        <span>QR</span>
                      </button>

                      <button
                        type="button"
                        className={`manage-icon-btn${copiedFormId === form.id ? " copied" : ""}`}
                        onClick={(e) => copyLink(form, e)}
                        title="Salin Link Formulir"
                      >
                        {copiedFormId === form.id ? <FaCheckCircle /> : <FaCopy />}
                        <span>{copiedFormId === form.id ? "Tersalin" : "Salin"}</span>
                      </button>

                      <button
                        type="button"
                        className="manage-icon-btn danger"
                        onClick={() => setConfirmDeleteForm(form)}
                        title="Hapus Formulir"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </main>

      {/* QR Code Modal */}
      {selectedQrForm && (
        <div className="manage-modal-overlay" onClick={closeQrModal} role="dialog" aria-modal="true">
          <div className="manage-modal" onClick={(e) => e.stopPropagation()}>
            <div className="manage-modal-header">
              <div className="manage-modal-title">
                <div className="manage-modal-icon"><FaQrcode /></div>
                <h3>QR Code Formulir</h3>
              </div>
              <button type="button" className="manage-modal-close" onClick={closeQrModal} aria-label="Tutup">
                <FaTimes />
              </button>
            </div>

            <div style={{ textAlign: "center" }}>
              <span className="manage-card-category" style={{ marginBottom: 6 }}>
                {selectedQrForm.type}
              </span>
              <h4 style={{ margin: "4px 0 2px", color: "var(--text)", fontSize: 15, fontWeight: 800 }}>
                {selectedQrForm.title}
              </h4>
              <p style={{ margin: 0, color: "var(--text-soft)", fontSize: 12 }}>
                Pindai QR Code ini untuk membuka formulir langsung.
              </p>
            </div>

            <div className="manage-modal-qr-box">
              <QRCodeCanvas
                id="manage-form-qr-canvas"
                value={getCompleteFormLink(selectedQrForm)}
                size={210}
                level="H"
                includeMargin
                bgColor="#ffffff"
                fgColor="#0f172a"
              />
            </div>

            <div className="manage-modal-link-box">
              <p>{getCompleteFormLink(selectedQrForm)}</p>
              <button
                type="button"
                className="manage-modal-link-copy"
                onClick={(e) => copyLink(selectedQrForm, e)}
                title="Salin Link"
              >
                {copiedFormId === selectedQrForm.id ? <FaCheckCircle style={{ color: "#059669" }} /> : <FaCopy />}
              </button>
            </div>

            <div className="manage-modal-actions">
              <button type="button" className="manage-modal-cancel" onClick={closeQrModal}>
                Tutup
              </button>
              <button type="button" className="manage-modal-submit" onClick={downloadQrCode}>
                <FaDownload />
                <span>{qrDownloaded ? "Tersimpan" : "Unduh QR"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteForm && (
        <div className="manage-modal-overlay" onClick={() => !isDeleting && setConfirmDeleteForm(null)} role="dialog" aria-modal="true">
          <div className="manage-modal" onClick={(e) => e.stopPropagation()}>
            <div className="manage-modal-header">
              <div className="manage-modal-title">
                <div className="manage-modal-icon danger"><FaTrash /></div>
                <h3>Hapus Formulir?</h3>
              </div>
              <button
                type="button"
                className="manage-modal-close"
                onClick={() => !isDeleting && setConfirmDeleteForm(null)}
                aria-label="Tutup"
              >
                <FaTimes />
              </button>
            </div>

            <p style={{ margin: "12px 0 20px", color: "var(--text-soft)", fontSize: 13, lineHeight: 1.6 }}>
              Apakah Anda yakin ingin menghapus formulir <strong>"{confirmDeleteForm.title}"</strong>? Formulir yang telah dihapus tidak dapat dikembalikan lagi.
            </p>

            <div className="manage-modal-actions">
              <button
                type="button"
                className="manage-modal-cancel"
                onClick={() => setConfirmDeleteForm(null)}
                disabled={isDeleting}
              >
                Batal
              </button>
              <button
                type="button"
                className="manage-modal-submit danger"
                onClick={executeDeleteForm}
                disabled={isDeleting}
              >
                <FaTrash />
                <span>{isDeleting ? "Menghapus..." : "Ya, Hapus"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}