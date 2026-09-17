import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCheckCircle, FaClock, FaFileAlt, FaHistory,
  FaSearch, FaTimes, FaTrophy, FaArrowRight,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { FormContext } from "../context/FormContext";

const historyStyles = `
.history-page, .history-page * { box-sizing: border-box; }
.history-page {
  --primary: var(--hp-pri, #2168b4);
  --border: #e5ebf2; --surface: #ffffff; --background: transparent;
  --text: #1d2c3f; --text-soft: #5e7188; --text-muted: #9aa7b7;
  min-height: 100%; width: 100%;
  color: var(--text); font-family: "Inter", sans-serif; font-size: 14px;
}
.history-main-content { width: 100%; max-width: 1240px; margin: 0 auto; padding: 32px 36px 48px; }

/* Header Banner */
.history-header {
  position: relative; min-height: 148px; padding: 28px 32px; margin-bottom: 24px;
  overflow: hidden; border-radius: 18px;
  background: linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 70%, #4b9fe8) 100%);
  box-shadow: 0 10px 30px rgba(15, 30, 50, 0.12);
  display: flex; align-items: center; justify-content: space-between; gap: 20px;
}
.history-header-circle-1 {
  position: absolute; width: 220px; height: 220px; right: 80px; top: -100px;
  border: 1px solid rgba(255,255,255,.14); border-radius: 50%; pointer-events: none;
}
.history-header-circle-2 {
  position: absolute; width: 140px; height: 140px; right: -30px; bottom: -60px;
  border-radius: 50%; background: rgba(255,255,255,.08); pointer-events: none;
}
.history-header-content { position: relative; z-index: 2; max-width: 650px; }
.history-eyebrow {
  display: inline-flex; align-items: center; gap: 6px;
  color: rgba(255,255,255,.85); font-size: 11px; font-weight: 700;
  letter-spacing: .9px; text-transform: uppercase;
  background: rgba(255, 255, 255, 0.14); padding: 4px 10px; border-radius: 20px;
}
.history-header h1 {
  margin: 8px 0 6px; color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: -.5px;
}
.history-header p {
  margin: 0; color: rgba(255,255,255,.88); font-size: 13px; line-height: 1.5;
}

/* Stats Summary */
.history-stats {
  display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; margin-bottom: 24px;
}
.history-stat-card {
  padding: 16px 20px; border: 1px solid var(--border); border-radius: 14px;
  background: var(--surface); display: flex; align-items: center; gap: 14px;
  box-shadow: 0 2px 10px rgba(15, 30, 50, 0.02);
}
.history-stat-icon {
  width: 44px; height: 44px; flex-shrink: 0; border-radius: 12px;
  display: flex; align-items: center; justify-content: center; font-size: 18px;
}
.history-stat-card.blue .history-stat-icon { background: var(--hp-pri-lt, #eef5fd); color: var(--primary); }
.history-stat-card.green .history-stat-icon { background: #ecfdf5; color: #059669; }
.history-stat-card.amber .history-stat-icon { background: #fffbeb; color: #d97706; }
.history-stat-info { min-width: 0; }
.history-stat-info span { display: block; color: var(--text-soft); font-size: 11.5px; font-weight: 600; }
.history-stat-info strong { display: block; margin-top: 2px; color: var(--text); font-size: 18px; font-weight: 800; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* Toolbar: Search */
.history-toolbar {
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  margin-bottom: 20px; flex-wrap: wrap;
}
.history-toolbar-info h2 { margin: 0; color: var(--text); font-size: 18px; font-weight: 800; }
.history-toolbar-info p { margin: 3px 0 0; color: var(--text-soft); font-size: 12px; }

.history-search {
  position: relative; width: 100%; max-width: 360px; min-width: 240px;
}
.history-search-icon {
  position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
  color: var(--text-muted); font-size: 14px; pointer-events: none;
}
.history-search input {
  width: 100%; height: 42px; padding: 0 36px 0 38px; border: 1px solid var(--border);
  border-radius: 12px; background: var(--surface); color: var(--text);
  font-family: inherit; font-size: 13px; transition: border-color .15s, box-shadow .15s;
}
.history-search input:focus {
  outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(33, 104, 180, 0.16);
}
.history-search-clear {
  position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
  border: none; background: transparent; color: var(--text-muted); font-size: 13px;
  cursor: pointer; padding: 5px; display: flex; align-items: center; justify-content: center;
}
.history-search-clear:hover { color: var(--text); }

/* History List / Grid */
.history-grid {
  display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 16px;
}
.history-card {
  position: relative; padding: 20px; border: 1px solid var(--border);
  border-radius: 16px; background: var(--surface); display: flex; flex-direction: column;
  box-shadow: 0 3px 12px rgba(15, 30, 50, 0.03); cursor: pointer;
  transition: transform .2s, border-color .2s, box-shadow .2s;
}
.history-card:hover {
  transform: translateY(-2px); border-color: var(--primary);
  box-shadow: 0 10px 24px rgba(15, 30, 50, 0.08);
}
.history-card-top {
  display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px;
}
.history-card-icon {
  width: 40px; height: 40px; flex-shrink: 0; border-radius: 11px;
  background: var(--hp-pri-lt, #eef5fd); color: var(--primary);
  display: flex; align-items: center; justify-content: center; font-size: 17px;
}
.history-card-badge {
  min-height: 25px; padding: 0 10px; border-radius: 999px; border: 1px solid #a7f3d0;
  background: #ecfdf5; color: #059669; font-size: 11px; font-weight: 700;
  display: inline-flex; align-items: center; gap: 5px;
}
.history-card-title {
  margin: 0 0 8px; color: var(--text); font-size: 16px; font-weight: 700;
  line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.history-card-time {
  display: flex; align-items: center; gap: 6px; color: var(--text-soft); font-size: 12px; margin-bottom: 16px;
}
.history-card-footer {
  margin-top: auto; padding-top: 14px; border-top: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
}
.history-card-score {
  display: inline-flex; align-items: center; gap: 6px;
  background: #fef3c7; color: #b45309; border: 1px solid #fde68a;
  padding: 4px 10px; border-radius: 8px; font-size: 12.5px; font-weight: 800;
}
.history-card-score-empty { color: var(--text-muted); font-size: 13px; font-weight: 600; }
.history-card-action {
  color: var(--primary); font-size: 12.5px; font-weight: 700;
  display: inline-flex; align-items: center; gap: 6px; transition: transform .15s;
}
.history-card:hover .history-card-action svg { transform: translateX(3px); }

/* Empty State */
.history-empty {
  grid-column: 1/-1; min-height: 260px; border: 1.5px dashed var(--border);
  border-radius: 16px; background: var(--surface); display: flex;
  align-items: center; justify-content: center; flex-direction: column; text-align: center; padding: 40px 20px;
}
.history-empty-icon {
  width: 54px; height: 54px; border-radius: 16px; background: var(--hp-pri-lt, #eef5fd);
  color: var(--primary); display: flex; align-items: center; justify-content: center;
  font-size: 24px; margin-bottom: 14px;
}
.history-empty h3 { margin: 0; color: var(--text); font-size: 16px; font-weight: 700; }
.history-empty p { margin: 7px 0 20px; color: var(--text-soft); font-size: 13px; max-width: 460px; line-height: 1.5; }
.history-browse-btn {
  padding: 9px 18px; border: none; border-radius: 10px; background: var(--primary);
  color: #fff; font-size: 13px; font-weight: 700; cursor: pointer;
  display: inline-flex; align-items: center; gap: 7px;
  box-shadow: 0 4px 12px rgba(15, 30, 50, 0.12); transition: transform .15s;
}
.history-browse-btn:hover { transform: translateY(-1px); }

/* Dark Mode */
.dark.history-page {
  --border: #1b2e40; --surface: #0f1c2b; --background: transparent;
  --text: #dde9f6; --text-soft: #8da4be; --text-muted: #4b6277;
}
.dark .history-stat-card { background: #0f1c2b; border-color: #1b2e40; }
.dark .history-card { background: #0f1c2b; border-color: #1b2e40; }
.dark .history-card:hover { border-color: var(--primary); }
.dark .history-search input { background: #0f1c2b; border-color: #1b2e40; color: #dde9f6; }
.dark .history-empty { background: #0f1c2b; border-color: #1b2e40; }
.dark .history-card-footer { border-color: #1b2e40; }
.dark .history-card-score { background: #2d2105; border-color: #5c440a; color: #f59e0b; }

@media (max-width: 768px) {
  .history-main-content { padding: 20px 16px 40px; }
  .history-header { padding: 22px 20px; }
  .history-stats { grid-template-columns: 1fr; gap: 10px; }
  .history-toolbar { flex-direction: column; align-items: stretch; gap: 12px; }
  .history-search { max-width: 100%; }
  .history-grid { grid-template-columns: 1fr; }
}
`;

const normalizeResultMode = (value) => {
  const v = String(value || "").trim().toLowerCase();
  if (["score", "show-score", "show-result-and-score", "result-score"].includes(v)) return "score";
  if (["result", "show-result", "show-result-only"].includes(v)) return "result";
  return "none";
};

const fmtDateTime = (v) => {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return String(v).trim() || "—";
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} · ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export default function History() {
  const navigate = useNavigate();
  const { darkMode, t } = useTheme();
  const { submittedForms = [], forms = [], getFormById } = useContext(FormContext) || {};

  const [search, setSearch] = useState("");

  const getRelatedForm = (formId) => {
    if (formId == null || formId === "") return null;
    if (typeof getFormById === "function") {
      const f = getFormById(formId);
      if (f) return f;
    }
    return forms.find((item) => String(item.id) === String(formId)) ?? null;
  };

  const historyItems = useMemo(() => {
    return [...submittedForms]
      .map((sub, i) => {
        const formId = sub.formId ?? sub.id;
        const form = getRelatedForm(formId);
        if (!form) return null;

        const resultMode = normalizeResultMode(
          sub.resultMode || form?.settings?.resultMode || form?.resultMode
        );
        const rawScore = sub.score ?? sub.totalScore ?? sub.rawScore ?? 0;
        const maxScore = sub.maxScore ?? sub.totalPossible ?? sub.maxPossible ?? 0;
        const hasScore =
          rawScore > 0 ||
          (sub.essayScores && Object.keys(sub.essayScores).length > 0);
        const showScore = resultMode === "score" && hasScore;
        const scorePercent =
          sub.percentage != null
            ? Math.round(sub.percentage)
            : maxScore > 0
            ? Math.round((rawScore / maxScore) * 100)
            : 0;

        return {
          ...sub, formId,
          submissionId: sub.submissionId || `${formId}-${sub.submittedAt || i}-${i}`,
          title: sub.title || form?.title || "Untitled Form",
          showScore, scorePercent, resultMode,
          canViewResult: resultMode === "result" || resultMode === "score",
        };
      })
      .filter(Boolean)
      .sort((a, b) => {
        const aT = new Date(a.submittedAt).getTime();
        const bT = new Date(b.submittedAt).getTime();
        return Number.isNaN(aT) || Number.isNaN(bT) ? 0 : bT - aT;
      });
  }, [submittedForms, forms, getFormById]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? historyItems.filter((item) => item.title.toLowerCase().includes(q)) : historyItems;
  }, [historyItems, search]);

  const resultCount = historyItems.filter((item) => item.canViewResult).length;
  const latestDate = historyItems[0]?.submittedAt
    ? fmtDateTime(historyItems[0].submittedAt)
    : (t?.history?.noSubmissions || "None yet");

  const openCard = (item) => {
    if (!item?.formId) return;
    if (item.canViewResult) {
      navigate(`/form-result/${item.formId}`, {
        state: {
          formId: item.formId, formTitle: item.title,
          submissionId: item.submissionId, resultMode: item.resultMode,
          submission: item,
        },
      });
    } else {
      navigate(`/form-details/${item.formId}`);
    }
  };

  return (
    <div className={["history-page", darkMode ? "dark" : ""].filter(Boolean).join(" ")}>
      <style>{historyStyles}</style>

      <main className="history-main-content">
        {/* Header Banner */}
        <header className="history-header">
          <div className="history-header-circle-1" />
          <div className="history-header-circle-2" />

          <div className="history-header-content">
            <h1>{t?.history?.title || "Submission History"}</h1>
            <p>{t?.history?.subtitle || "Track your submission history and review your evaluation results."}</p>
          </div>
        </header>

        {/* Stats Summary */}
        <section className="history-stats">
          <div className="history-stat-card blue">
            <div className="history-stat-icon"><FaHistory /></div>
            <div className="history-stat-info">
              <span>{t?.history?.totalSubmissions || "Total Submissions"}</span>
              <strong>{historyItems.length}</strong>
            </div>
          </div>
          <div className="history-stat-card green">
            <div className="history-stat-icon"><FaCheckCircle /></div>
            <div className="history-stat-info">
              <span>{t?.history?.resultsAvailable || "Results Available"}</span>
              <strong>{resultCount}</strong>
            </div>
          </div>
          <div className="history-stat-card amber">
            <div className="history-stat-icon"><FaClock /></div>
            <div className="history-stat-info">
              <span>{t?.history?.latestSubmission || "Latest Activity"}</span>
              <strong style={{ fontSize: 13 }}>{latestDate}</strong>
            </div>
          </div>
        </section>

        {/* Toolbar */}
        <section className="history-toolbar">
          <div className="history-toolbar-info">
            <h2>{t?.history?.title || "Submission History"}</h2>
            <p>{filtered.length} {t?.forms?.displayed || "of"} {historyItems.length} {t?.forms?.formsCount || "forms displayed"}</p>
          </div>

          <div className="history-search">
            <span className="history-search-icon"><FaSearch /></span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t?.history?.searchPlaceholder || "Search submissions..."}
            />
            {search && (
              <button type="button" className="history-search-clear" onClick={() => setSearch("")} aria-label="Clear search">
                <FaTimes />
              </button>
            )}
          </div>
        </section>

        {/* Grid List */}
        <section className="history-grid">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <article
                key={item.submissionId}
                className="history-card"
                onClick={() => openCard(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && openCard(item)}
              >
                <div className="history-card-top">
                  <div className="history-card-icon"><FaFileAlt /></div>
                  <span className="history-card-badge">
                    <FaCheckCircle /> {t?.forms?.submittedBadge || "Submitted"}
                  </span>
                </div>

                <div className="history-card-title">{item.title}</div>
                <div className="history-card-time">
                  <FaClock /> {fmtDateTime(item.submittedAt)}
                </div>

                <div className="history-card-footer">
                  {item.showScore ? (
                    <span className="history-card-score">
                      <FaTrophy /> {item.scorePercent}%
                    </span>
                  ) : (
                    <span className="history-card-score-empty">—</span>
                  )}
                  <span className="history-card-action">
                    {item.canViewResult ? (t?.history?.viewResult || "View result") : (t?.history?.viewDetails || "View form")}
                    <FaArrowRight style={{ fontSize: 11 }} />
                  </span>
                </div>
              </article>
            ))
          ) : (
            <div className="history-empty">
              <div className="history-empty-icon"><FaHistory /></div>
              <h3>{search ? (t?.forms?.noMatchingTitle || "No matching forms") : (t?.history?.emptyTitle || "No submissions yet")}</h3>
              <p>{search ? `${t?.forms?.noMatchingDesc || "No form matches"} "${search}".` : (t?.history?.emptyDesc || "Submitted forms will appear here.")}</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}