import {
  useContext,
  useMemo,
} from "react";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCalendarAlt,
  FaCheck,
  FaCheckCircle,
  FaClipboardCheck,
  FaClock,
  FaCode,
  FaExclamationTriangle,
  FaFileAlt,
  FaHome,
  FaImage,
  FaListUl,
  FaStar,
  FaTimes,
  FaTrophy,
} from "react-icons/fa";
import {
  ThemeContext,
} from "../context/ThemeContext";
import {
  FormContext,
} from "../context/FormContext";

const formResultStyles = `
/* === FormResult.css === */
/* =========================================================
   FORM RESULT PAGE
========================================================= */
.form-result-page {
  width: 100%;
  min-height: 100vh;
  background: #f4f7fc;
  color: #172033;
  padding-bottom: 60px;
}
/* =========================================================
   HEADER
========================================================= */
.form-result-header {
  position: relative;
  overflow: hidden;
  min-height: 310px;
  padding: 28px clamp(24px, 6vw, 90px) 60px;
  color: #ffffff;
  background: linear-gradient( 135deg, #2563eb 0%, #1d4ed8 52%, #1e40af 100% );
}
.form-result-header-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.form-result-circle {
  position: absolute;
  display: block;
  border-radius: 999px;
  background: rgba( 255, 255, 255, 0.08 );
}
.form-result-circle.circle-one {
  width: 290px;
  height: 290px;
  right: -80px;
  top: -100px;
}
.form-result-circle.circle-two {
  width: 170px;
  height: 170px;
  left: -70px;
  bottom: -90px;
  background: rgba( 255, 255, 255, 0.05 );
}
.form-result-dot-pattern {
  position: absolute;
  right: 8%;
  bottom: 32px;
  width: 118px;
  display: grid;
  grid-template-columns: repeat( 5, 1fr );
  gap: 12px;
}
.form-result-dot-pattern span {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba( 255, 255, 255, 0.32 );
}
/* =========================================================
   HEADER TOP
========================================================= */
.form-result-header-top {
  position: relative;
  z-index: 2;
  width: min( 1180px, 100% );
  margin: 0 auto;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 16px;
}
.form-result-back-btn {
  width: 44px;
  height: 44px;
  border: 1px solid rgba( 255, 255, 255, 0.28 );
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: #ffffff;
  background: rgba( 255, 255, 255, 0.12 );
  cursor: pointer;
  transition: 0.2s ease;
}
.form-result-back-btn:hover {
  transform: translateX(-2px);
  background: rgba( 255, 255, 255, 0.22 );
}
.form-result-header-label {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.04em;
  opacity: 0.92;
}
.form-result-mode-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 14px;
  border: 1px solid rgba( 255, 255, 255, 0.24 );
  border-radius: 999px;
  font-size: 14px;
  font-weight: 700;
  background: rgba( 255, 255, 255, 0.13 );
  backdrop-filter: blur(10px);
}
.form-result-mode-badge.score {
  color: #fff7d6;
  background: rgba( 245, 158, 11, 0.18 );
}
/* =========================================================
   HEADER CONTENT
========================================================= */
.form-result-header-content {
  position: relative;
  z-index: 2;
  width: min( 1180px, 100% );
  margin: 47px auto 0;
}
.form-result-eyebrow {
  display: inline-block;
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #bfdbfe;
}
.form-result-header-content h1 {
  max-width: 850px;
  margin: 0;
  font-size: clamp( 30px, 4vw, 47px );
  line-height: 1.12;
  letter-spacing: -0.035em;
}
.form-result-header-content p {
  max-width: 650px;
  margin: 14px 0 0;
  color: rgba( 255, 255, 255, 0.78 );
  font-size: 17px;
  line-height: 1.7;
}
/* =========================================================
   MAIN
========================================================= */
.form-result-content {
  width: min( 1120px, calc( 100% - 40px ) );
  margin: -35px auto 0;
  position: relative;
  z-index: 4;
}
/* =========================================================
   SUMMARY CARD
========================================================= */
.form-result-summary-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 20px;
  padding: 23px 25px;
  background: #ffffff;
  border: 1px solid #e6ebf4;
  border-radius: 24px;
  box-shadow: 0 16px 45px rgba( 30, 64, 175, 0.09 );
}
.form-result-summary-icon {
  width: 54px;
  height: 54px;
  display: grid;
  place-items: center;
  border-radius: 18px;
  color: #16a34a;
  background: #ecfdf3;
  font-size: 26px;
}
.form-result-summary-main {
  min-width: 0;
}
.form-result-summary-main > span {
  display: block;
  margin-bottom: 5px;
  color: #2563eb;
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.form-result-summary-main > strong {
  display: block;
  color: #172033;
  font-size: 19px;
}
.form-result-summary-main p {
  margin: 5px 0 0;
  color: #748096;
  font-size: 15px;
}
.form-result-summary-meta {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.form-result-summary-meta div {
  min-width: 115px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 13px;
  color: #64748b;
  background: #f7f9fc;
  font-size: 14px;
  font-weight: 600;
}
.form-result-summary-meta svg {
  color: #2563eb;
}
/* =========================================================
   SCORE SECTION
========================================================= */
.form-result-score-section {
  margin-top: 24px;
}
.form-result-score-card {
  position: relative;
  overflow: hidden;
  min-height: 200px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 24px;
  padding: 31px;
  border-radius: 27px;
  color: #ffffff;
  background: linear-gradient( 135deg, #1d4ed8, #2563eb 50%, #3b82f6 );
  box-shadow: 0 18px 45px rgba( 37, 99, 235, 0.22 );
}
.form-result-score-decoration {
  position: absolute;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  right: -90px;
  top: -110px;
  background: rgba( 255, 255, 255, 0.08 );
}
.form-result-score-icon {
  position: relative;
  width: 76px;
  height: 76px;
  display: grid;
  place-items: center;
  border-radius: 24px;
  color: #fde68a;
  background: rgba( 255, 255, 255, 0.15 );
  font-size: 34px;
}
.form-result-score-content {
  position: relative;
}
.form-result-score-content > span {
  color: #bfdbfe;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.form-result-score-number {
  display: flex;
  align-items: baseline;
  gap: 7px;
  margin-top: 5px;
}
.form-result-score-number strong {
  font-size: 50px;
  line-height: 1;
  letter-spacing: -0.04em;
}
.form-result-score-number small {
  font-size: 23px;
  font-weight: 700;
  color: #bfdbfe;
}
.form-result-score-content p {
  margin: 9px 0 0;
  color: rgba( 255, 255, 255, 0.76 );
  font-size: 15px;
}
.form-result-score-percentage {
  position: relative;
  min-width: 105px;
  min-height: 105px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 5px solid rgba( 255, 255, 255, 0.22 );
  border-radius: 50%;
  background: rgba( 255, 255, 255, 0.1 );
}
.form-result-score-percentage strong {
  font-size: 27px;
}
.form-result-score-percentage span {
  margin-top: 2px;
  color: #bfdbfe;
  font-size: 13px;
  font-weight: 700;
}
/* =========================================================
   SCORE MINI STATS
========================================================= */
.form-result-score-stats {
  display: grid;
  grid-template-columns: repeat( 3, 1fr );
  gap: 14px;
  margin-top: 14px;
}
.form-result-mini-stat {
  min-height: 105px;
  padding: 19px 20px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  border: 1px solid #e5eaf3;
  border-radius: 20px;
  background: #ffffff;
}
.form-result-mini-stat > div {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 13px;
}
.form-result-mini-stat > span {
  color: #64748b;
  font-size: 15px;
  font-weight: 700;
}
.form-result-mini-stat > strong {
  color: #172033;
  font-size: 26px;
}
.form-result-mini-stat.correct > div {
  color: #16a34a;
  background: #ecfdf3;
}
.form-result-mini-stat.incorrect > div {
  color: #dc2626;
  background: #fef2f2;
}
.form-result-mini-stat.answered > div {
  color: #2563eb;
  background: #eff6ff;
}
/* =========================================================
   REVIEW HEADING
========================================================= */
.form-result-review-heading {
  margin: 38px 0 18px;
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
}
.form-result-review-heading > div > span {
  display: block;
  margin-bottom: 5px;
  color: #2563eb;
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.11em;
}
.form-result-review-heading h2 {
  margin: 0;
  color: #172033;
  font-size: 28px;
  letter-spacing: -0.025em;
}
.form-result-review-heading p {
  max-width: 680px;
  margin: 7px 0 0;
  color: #748096;
  font-size: 15px;
  line-height: 1.6;
}
.form-result-question-count {
  flex-shrink: 0;
  padding: 9px 14px;
  border-radius: 999px;
  color: #2563eb;
  background: #eaf2ff;
  font-size: 14px;
  font-weight: 800;
}
/* =========================================================
   QUESTION LIST
========================================================= */
.form-result-question-list {
  display: flex;
  flex-direction: column;
  gap: 17px;
}
.form-result-question-card {
  overflow: hidden;
  border: 1px solid #e4e9f2;
  border-radius: 23px;
  background: #ffffff;
  box-shadow: 0 6px 20px rgba( 15, 23, 42, 0.035 );
  transition: 0.2s ease;
}
.form-result-question-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 30px rgba( 15, 23, 42, 0.06 );
}
/* Card salah dibuat merah */
.form-result-question-card.incorrect {
  border-color: #fecaca;
  background: linear-gradient( 180deg, #fffafa 0%, #ffffff 55% );
  box-shadow: 0 8px 24px rgba( 220, 38, 38, 0.07 );
}
/* Card benar tetap dominan putih */
.form-result-question-card.correct {
  border-color: #d8e9df;
}
/* =========================================================
   QUESTION TOP
========================================================= */
.form-result-question-top {
  min-height: 62px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 19px;
  border-bottom: 1px solid #edf0f5;
  background: #fbfcfe;
}
.form-result-question-card.incorrect
.form-result-question-top {
  background: #fff7f7;
  border-bottom-color: #fee2e2;
}
.form-result-question-number {
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 11px;
  color: #ffffff;
  background: #2563eb;
  font-size: 15px;
  font-weight: 800;
}
.form-result-question-card.incorrect
.form-result-question-number {
  background: #dc2626;
}
.form-result-question-type {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #667085;
  font-size: 14px;
  font-weight: 700;
}
.form-result-question-type svg {
  color: #2563eb;
}
.form-result-correctness {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 11px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 800;
}
.form-result-correctness.correct {
  color: #15803d;
  background: #dcfce7;
}
.form-result-correctness.incorrect {
  color: #b91c1c;
  background: #fee2e2;
}
/* =========================================================
   QUESTION BODY
========================================================= */
.form-result-question-body {
  padding: 23px;
}
.form-result-question-body h3 {
  margin: 0;
  color: #182033;
  font-size: 19px;
  line-height: 1.55;
}
/* =========================================================
   QUESTION IMAGE
========================================================= */
.form-result-question-image {
  margin-top: 18px;
  overflow: hidden;
  border: 1px solid #e4e9f2;
  border-radius: 18px;
  background: #f8fafc;
}
.form-result-question-image img {
  display: block;
  width: 100%;
  max-height: 460px;
  object-fit: contain;
  background: #f8fafc;
}
/* =========================================================
   USER ANSWER
========================================================= */
.form-result-answer-box {
  margin-top: 20px;
  padding: 17px 18px;
  border: 1px solid #dce4f2;
  border-radius: 16px;
  background: #f8faff;
}
.form-result-answer-label {
  display: block;
  margin-bottom: 8px;
  color: #7a8598;
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.form-result-answer-value {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #1f2937;
  line-height: 1.6;
}
.form-result-answer-value svg {
  flex-shrink: 0;
}
.form-result-answer-value strong {
  word-break: break-word;
  font-size: 16px;
}
.form-result-answer-box.correct {
  border-color: #bbf7d0;
  background: #f0fdf4;
}
.form-result-answer-box.correct
.form-result-answer-value svg {
  color: #16a34a;
}
.form-result-answer-box.incorrect {
  border-color: #fecaca;
  background: #fff1f2;
}
.form-result-answer-box.incorrect
.form-result-answer-label {
  color: #b91c1c;
}
.form-result-answer-box.incorrect
.form-result-answer-value {
  color: #991b1b;
}
.form-result-answer-box.incorrect
.form-result-answer-value svg {
  color: #dc2626;
}
.form-result-no-answer {
  color: #94a3b8;
  font-size: 15px;
  font-style: italic;
}
/* =========================================================
   CORRECT ANSWER
========================================================= */
.form-result-correct-answer-box {
  margin-top: 11px;
  padding: 16px 18px;
  border: 1px solid #bbf7d0;
  border-radius: 16px;
  background: #f0fdf4;
}
.form-result-correct-answer-box > span {
  display: block;
  margin-bottom: 8px;
  color: #15803d;
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.form-result-correct-answer-box > div {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #166534;
  font-size: 16px;
}
.form-result-correct-answer-box svg {
  flex-shrink: 0;
  color: #16a34a;
}
/* =========================================================
   QUESTION FOOTER
========================================================= */
.form-result-question-footer {
  min-height: 54px;
  padding: 12px 21px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  border-top: 1px solid #edf0f5;
  background: #fcfdff;
}
.form-result-question-card.incorrect
.form-result-question-footer {
  border-top-color: #fee2e2;
  background: #fffafa;
}
.form-result-question-footer > span {
  color: #8a94a6;
  font-size: 13px;
  font-weight: 600;
}
.form-result-question-footer
.score {
  padding: 6px 10px;
  border-radius: 9px;
  color: #15803d;
  background: #dcfce7;
  font-size: 14px;
}
.form-result-question-footer
.score.incorrect {
  color: #b91c1c;
  background: #fee2e2;
}
/* =========================================================
   BOTTOM ACTIONS
========================================================= */
.form-result-bottom-actions {
  margin-top: 29px;
  display: flex;
  justify-content: space-between;
  gap: 14px;
}
.form-result-bottom-actions button {
  min-height: 48px;
  padding: 0 19px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease;
}
.form-result-history-btn {
  border: 1px solid #dce3ee;
  color: #475569;
  background: #ffffff;
}
.form-result-history-btn:hover {
  background: #f8fafc;
  transform: translateX(-2px);
}
.form-result-home-btn {
  border: 1px solid #2563eb;
  color: #ffffff;
  background: #2563eb;
}
.form-result-home-btn:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
}
/* =========================================================
   EMPTY / ERROR STATE
========================================================= */
.form-result-state-card {
  width: min( 520px, calc( 100% - 36px ) );
  margin: 100px auto;
  padding: 42px 30px;
  text-align: center;
  border: 1px solid #e4e9f2;
  border-radius: 27px;
  background: #ffffff;
  box-shadow: 0 15px 45px rgba( 15, 23, 42, 0.08 );
}
.form-result-state-icon {
  width: 68px;
  height: 68px;
  margin: 0 auto 18px;
  display: grid;
  place-items: center;
  border-radius: 21px;
  font-size: 31px;
}
.form-result-state-icon.warning {
  color: #d97706;
  background: #fff7ed;
}
.form-result-state-card h2 {
  margin: 0;
  color: #172033;
  font-size: 26px;
}
.form-result-state-card p {
  margin: 10px auto 22px;
  max-width: 400px;
  color: #718096;
  line-height: 1.65;
  font-size: 16px;
}
.form-result-state-card button {
  min-height: 46px;
  padding: 0 18px;
  border: 0;
  border-radius: 13px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #ffffff;
  background: #2563eb;
  font-weight: 700;
  cursor: pointer;
}
/* =========================================================
   DARK MODE
========================================================= */
.form-result-page.dark {
  background: #0f172a;
  color: #e5e7eb;
}
.form-result-page.dark
.form-result-summary-card,
.form-result-page.dark
.form-result-mini-stat,
.form-result-page.dark
.form-result-question-card,
.form-result-page.dark
.form-result-state-card {
  border-color: #273449;
  background: #162033;
}
.form-result-page.dark
.form-result-summary-main > strong,
.form-result-page.dark
.form-result-mini-stat > strong,
.form-result-page.dark
.form-result-review-heading h2,
.form-result-page.dark
.form-result-question-body h3,
.form-result-page.dark
.form-result-state-card h2 {
  color: #f8fafc;
}
.form-result-page.dark
.form-result-summary-main p,
.form-result-page.dark
.form-result-review-heading p,
.form-result-page.dark
.form-result-state-card p {
  color: #94a3b8;
}
.form-result-page.dark
.form-result-summary-meta div {
  color: #b6c1d1;
  background: #111b2d;
}
.form-result-page.dark
.form-result-question-top,
.form-result-page.dark
.form-result-question-footer {
  border-color: #273449;
  background: #111b2d;
}
.form-result-page.dark
.form-result-question-card.incorrect {
  border-color: #7f1d1d;
  background: #23171b;
}
.form-result-page.dark
.form-result-question-card.incorrect
.form-result-question-top,
.form-result-page.dark
.form-result-question-card.incorrect
.form-result-question-footer {
  border-color: #552126;
  background: #2a171c;
}
.form-result-page.dark
.form-result-answer-box {
  border-color: #334155;
  background: #111b2d;
}
.form-result-page.dark
.form-result-answer-value {
  color: #e2e8f0;
}
.form-result-page.dark
.form-result-answer-box.correct {
  border-color: #166534;
  background: rgba( 22, 101, 52, 0.16 );
}
.form-result-page.dark
.form-result-answer-box.incorrect {
  border-color: #7f1d1d;
  background: rgba( 127, 29, 29, 0.2 );
}
.form-result-page.dark
.form-result-correct-answer-box {
  border-color: #166534;
  background: rgba( 22, 101, 52, 0.16 );
}
.form-result-page.dark
.form-result-question-image {
  border-color: #334155;
  background: #0f172a;
}
.form-result-page.dark
.form-result-question-image img {
  background: #0f172a;
}
.form-result-page.dark
.form-result-history-btn {
  border-color: #334155;
  color: #e2e8f0;
  background: #162033;
}
.form-result-page.dark
.form-result-history-btn:hover {
  background: #1e293b;
}
/* =========================================================
   RESPONSIVE
========================================================= */
@media (
  max-width:
    850px
) {
  .form-result-header {
    min-height: 290px;
    padding-left: 22px;
    padding-right: 22px;
  }
  .form-result-content {
    width: min( calc( 100% - 28px ), 1120px );
  }
  .form-result-summary-card {
    grid-template-columns: auto 1fr;
  }
  .form-result-summary-meta {
    grid-column: 1 / -1;
    justify-content: flex-start;
    padding-left: 74px;
  }
  .form-result-score-card {
    grid-template-columns: auto 1fr;
  }
  .form-result-score-percentage {
    grid-column: 1 / -1;
    width: 105px;
    margin: 0 auto;
  }
  .form-result-score-stats {
    grid-template-columns: 1fr;
  }
}
@media (
  max-width:
    600px
) {
  .form-result-header {
    min-height: 270px;
    padding: 20px 17px 50px;
  }
  .form-result-header-top {
    grid-template-columns: auto 1fr;
  }
  .form-result-mode-badge {
    grid-column: 1 / -1;
    width: fit-content;
  }
  .form-result-header-content {
    margin-top: 30px;
  }
  .form-result-header-content h1 {
    font-size: 31px;
  }
  .form-result-content {
    width: calc( 100% - 20px );
    margin-top: -25px;
  }
  .form-result-summary-card {
    padding: 19px;
    grid-template-columns: 1fr;
  }
  .form-result-summary-icon {
    width: 48px;
    height: 48px;
  }
  .form-result-summary-meta {
    grid-column: auto;
    padding-left: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
  }
  .form-result-summary-meta div {
    min-width: 0;
  }
  .form-result-score-card {
    grid-template-columns: 1fr;
    padding: 24px;
  }
  .form-result-score-icon {
    width: 60px;
    height: 60px;
    font-size: 27px;
  }
  .form-result-score-number strong {
    font-size: 43px;
  }
  .form-result-score-percentage {
    grid-column: auto;
    margin: 4px 0 0;
  }
  .form-result-review-heading {
    align-items: flex-start;
    flex-direction: column;
  }
  .form-result-question-top {
    flex-wrap: wrap;
    padding: 13px;
  }
  .form-result-correctness {
    margin-left: 0;
  }
  .form-result-question-body {
    padding: 18px;
  }
  .form-result-question-footer {
    align-items: flex-start;
    flex-direction: column;
  }
  .form-result-bottom-actions {
    flex-direction: column-reverse;
  }
  .form-result-bottom-actions button {
    width: 100%;
  }
}
`;
// =========================================================
// STORAGE KEYS
// =========================================================
const FORMS_STORAGE_KEY =
  "hidocs_forms";
const SUBMISSIONS_STORAGE_KEY =
  "hidocs_submissions";
// =========================================================
// SAFE STORAGE READER
// =========================================================
const getStoredArray = (
  key
) => {
  try {
    const storedValue =
      localStorage.getItem(
        key
      );
    if (!storedValue) {
      return [];
    }
    const parsedValue =
      JSON.parse(
        storedValue
      );
    return Array.isArray(
      parsedValue
    )
      ? parsedValue
      : [];
  } catch (error) {
    console.error(
      `Gagal membaca ${key}:`,
      error
    );
    return [];
  }
};
// =========================================================
// NORMALIZE RESULT MODE
// =========================================================
const normalizeResultMode = (
  value
) => {
  const normalizedValue =
    String(
      value ||
      ""
    )
      .trim()
      .toLowerCase();
  if (
    normalizedValue ===
      "score" ||
    normalizedValue ===
      "show-score" ||
    normalizedValue ===
      "show-result-and-score" ||
    normalizedValue ===
      "result-score"
  ) {
    return "score";
  }
  if (
    normalizedValue ===
      "result" ||
    normalizedValue ===
      "show-result" ||
    normalizedValue ===
      "show-result-only"
  ) {
    return "result";
  }
  return "none";
};
// =========================================================
// CHECK ANSWER VALUE
// =========================================================
const hasAnswerValue = (
  value
) => {
  if (
    Array.isArray(
      value
    )
  ) {
    return (
      value.length >
      0
    );
  }
  if (
    typeof value ===
    "string"
  ) {
    return (
      value.trim().length >
      0
    );
  }
  return (
    value !== undefined &&
    value !== null &&
    value !== ""
  );
};
// =========================================================
// NORMALIZE ANSWER TEXT
// =========================================================
const normalizeAnswerText = (
  value
) => {
  if (
    value === undefined ||
    value === null
  ) {
    return "";
  }
  if (
    Array.isArray(
      value
    )
  ) {
    return value
      .map(
        (
          item
        ) =>
          String(
            item ??
            ""
          ).trim()
      )
      .filter(
        Boolean
      )
      .join(", ");
  }
  if (
    typeof value ===
    "object"
  ) {
    try {
      return JSON.stringify(
        value
      );
    } catch (error) {
      console.error(
        "Gagal membaca jawaban object:",
        error
      );
      return String(
        value
      );
    }
  }
  return String(
    value
  ).trim();
};
// =========================================================
// NORMALIZE COMPARABLE ANSWER
// =========================================================
const normalizeComparableAnswer = (
  value
) => {
  if (
    Array.isArray(
      value
    )
  ) {
    return value
      .map(
        (
          item
        ) =>
          String(
            item ??
            ""
          )
            .trim()
            .toLowerCase()
      )
      .sort()
      .join("|");
  }
  return normalizeAnswerText(
    value
  )
    .trim()
    .toLowerCase();
};
// =========================================================
// GET CORRECT ANSWER
// =========================================================
const getCorrectAnswer = (
  question
) => {
  if (
    !question ||
    typeof question !==
      "object"
  ) {
    return "";
  }
  const possibleAnswers = [
    question.correctAnswer,
    question.correctOption,
    question.correctValue,
    question.expectedAnswer,
    question.answerKey,
  ];
  for (
    const answer of possibleAnswers
  ) {
    if (
      hasAnswerValue(
        answer
      )
    ) {
      return answer;
    }
  }
  /*
    Jangan langsung memakai question.answer.
    Pada beberapa struktur aplikasi, "answer"
    dapat digunakan untuk data lain.
    Hanya digunakan sebagai fallback.
  */
  if (
    hasAnswerValue(
      question.answer
    )
  ) {
    return question.answer;
  }
  /*
    Mendukung option object seperti:
    {
      text: "Jakarta",
      correct: true
    }
  */
  if (
    Array.isArray(
      question.options
    )
  ) {
    const correctOption =
      question.options.find(
        (
          option
        ) => {
          return (
            option &&
            typeof option ===
              "object" &&
            (
              option.correct ===
                true ||
              option.isCorrect ===
                true
            )
          );
        }
      );
    if (
      correctOption
    ) {
      return (
        correctOption.value ??
        correctOption.label ??
        correctOption.text ??
        ""
      );
    }
  }
  return "";
};
// =========================================================
// NORMALIZE QUESTION
// =========================================================
const normalizeQuestion = (
  question,
  index
) => {
  const safeQuestion =
    question &&
    typeof question ===
      "object"
      ? question
      : {};
  const questionId =
    safeQuestion.id ??
    `question-${index + 1}`;
  return {
    ...safeQuestion,
    id:
      questionId,
    title:
      String(
        safeQuestion.title ||
        safeQuestion.question ||
        `Question ${index + 1}`
      ).trim(),
    type:
      safeQuestion.type ||
      "short",
    required:
      safeQuestion.required !==
      false,
    image:
      String(
        safeQuestion.image ||
        ""
      ).trim(),
    imageName:
      String(
        safeQuestion.imageName ||
        ""
      ).trim(),
    scoring:
      safeQuestion.scoring ===
      true,
    points:
      Number(
        safeQuestion.points
      ) || 0,
    options:
      Array.isArray(
        safeQuestion.options
      )
        ? safeQuestion.options
        : [],
  };
};
// =========================================================
// GET QUESTION TYPE LABEL
// =========================================================
const getQuestionTypeLabel = (
  type
) => {
  switch (
    String(
      type ||
      ""
    ).toLowerCase()
  ) {
    case "multiple":
      return "Multiple Choice";
    case "short":
      return "Short Text";
    case "long":
      return "Long Text";
    case "rating":
      return "Rating";
    case "yesno":
      return "Yes / No";
    case "math":
      return "Math";
    case "code":
      return "Code";
    case "image":
      return "Image Question";
    default:
      return "Question";
  }
};
// =========================================================
// GET QUESTION TYPE ICON
// =========================================================
const getQuestionTypeIcon = (
  type
) => {
  switch (
    String(
      type ||
      ""
    ).toLowerCase()
  ) {
    case "multiple":
    case "yesno":
      return (
        <FaListUl />
      );
    case "rating":
      return (
        <FaStar />
      );
    case "code":
      return (
        <FaCode />
      );
    case "image":
      return (
        <FaImage />
      );
    default:
      return (
        <FaFileAlt />
      );
  }
};
// =========================================================
// FORMAT DATE
// =========================================================
const formatSubmissionDate = (
  value
) => {
  if (!value) {
    return "-";
  }
  try {
    const date =
      new Date(
        value
      );
    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return String(
        value
      );
    }
    return new Intl.DateTimeFormat(
      "id-ID",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    ).format(
      date
    );
  } catch (error) {
    console.error(
      "Gagal format tanggal:",
      error
    );
    return "-";
  }
};
// =========================================================
// FORMAT TIME
// =========================================================
const formatSubmissionTime = (
  value
) => {
  if (!value) {
    return "-";
  }
  try {
    const date =
      new Date(
        value
      );
    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "-";
    }
    return new Intl.DateTimeFormat(
      "id-ID",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    ).format(
      date
    );
  } catch (error) {
    console.error(
      "Gagal format waktu:",
      error
    );
    return "-";
  }
};
// =========================================================
// FIND STORED FORM
// =========================================================
const findStoredForm = (
  formId
) => {
  if (
    formId === undefined ||
    formId === null
  ) {
    return null;
  }
  const storedForms =
    getStoredArray(
      FORMS_STORAGE_KEY
    );
  return (
    [...storedForms]
      .reverse()
      .find(
        (
          item
        ) =>
          String(
            item?.id
          ) ===
          String(
            formId
          )
      ) ||
    null
  );
};
// =========================================================
// FIND STORED SUBMISSION
// =========================================================
const findStoredSubmission = (
  formId,
  submissionId
) => {
  const storedSubmissions =
    getStoredArray(
      SUBMISSIONS_STORAGE_KEY
    );
  if (
    storedSubmissions.length ===
    0
  ) {
    return null;
  }
  /*
    Jika submissionId tersedia, gunakan itu terlebih dahulu.
  */
  if (
    submissionId
  ) {
    const exactSubmission =
      [...storedSubmissions]
        .reverse()
        .find(
          (
            item
          ) =>
            String(
              item?.submissionId
            ) ===
            String(
              submissionId
            )
        );
    if (
      exactSubmission
    ) {
      return exactSubmission;
    }
  }
  /*
    Fallback berdasarkan formId.
  */
  const matchingSubmissions =
    storedSubmissions.filter(
      (
        item
      ) => {
        const storedFormId =
          item?.formId ??
          item?.id;
        return (
          String(
            storedFormId
          ) ===
          String(
            formId
          )
        );
      }
    );
  if (
    matchingSubmissions.length ===
    0
  ) {
    return null;
  }
  return matchingSubmissions[
    matchingSubmissions.length -
    1
  ];
};
// =========================================================
// FORM RESULT
// =========================================================
function FormResult() {
  const navigate =
    useNavigate();
  const location =
    useLocation();
  const params =
    useParams();
  // =========================================================
  // CONTEXT
  // =========================================================
  const themeContext =
    useContext(
      ThemeContext
    ) ||
    {};
  const darkMode =
    Boolean(
      themeContext.darkMode
    );
  const formContext =
    useContext(
      FormContext
    ) ||
    {};
  const forms =
    Array.isArray(
      formContext.forms
    )
      ? formContext.forms
      : [];
  const submittedForms =
    Array.isArray(
      formContext.submittedForms
    )
      ? formContext.submittedForms
      : [];
  const getFormById =
    formContext.getFormById;
  const getUserSubmissionByForm =
    formContext.getUserSubmissionByForm;
  // =========================================================
  // ROUTE STATE
  // =========================================================
  const routeState =
    (
      location.state &&
      typeof location.state ===
        "object"
    )
      ? location.state
      : {};
  const formId =
    routeState.formId ??
    params.id ??
    null;
  const submissionId =
    routeState.submissionId ??
    routeState.submission
      ?.submissionId ??
    null;
  // =========================================================
  // LOAD FORM
  // =========================================================
  const form =
    useMemo(
      () => {
        if (
          formId === undefined ||
          formId === null
        ) {
          return null;
        }
        /*
          Prioritas 1:
          Context helper.
        */
        if (
          typeof getFormById ===
          "function"
        ) {
          try {
            const foundForm =
              getFormById(
                formId
              );
            if (
              foundForm
            ) {
              return foundForm;
            }
          } catch (error) {
            console.error(
              "getFormById error:",
              error
            );
          }
        }
        /*
          Prioritas 2:
          Context forms.
        */
        const contextForm =
          forms.find(
            (
              item
            ) =>
              String(
                item?.id
              ) ===
              String(
                formId
              )
          );
        if (
          contextForm
        ) {
          return contextForm;
        }
        /*
          Prioritas 3:
          LocalStorage.
        */
        return findStoredForm(
          formId
        );
      },
      [
        formId,
        forms,
        getFormById,
      ]
    );
  // =========================================================
  // LOAD SUBMISSION
  // =========================================================
  const submission =
    useMemo(
      () => {
        /*
          Prioritas 1:
          Submission dari navigation state.
        */
        if (
          routeState.submission &&
          typeof routeState.submission ===
            "object"
        ) {
          return routeState.submission;
        }
        /*
          Prioritas 2:
          Helper context.
        */
        if (
          formId &&
          typeof getUserSubmissionByForm ===
            "function"
        ) {
          try {
            const foundSubmission =
              getUserSubmissionByForm(
                formId
              );
            if (
              foundSubmission
            ) {
              return foundSubmission;
            }
          } catch (error) {
            console.error(
              "getUserSubmissionByForm error:",
              error
            );
          }
        }
        /*
          Prioritas 3:
          submittedForms context.
        */
        const matchingContextSubmissions =
          submittedForms.filter(
            (
              item
            ) => {
              const itemFormId =
                item?.formId ??
                item?.id;
              return (
                String(
                  itemFormId
                ) ===
                String(
                  formId
                )
              );
            }
          );
        if (
          submissionId
        ) {
          const exactContextSubmission =
            matchingContextSubmissions.find(
              (
                item
              ) =>
                String(
                  item?.submissionId
                ) ===
                String(
                  submissionId
                )
            );
          if (
            exactContextSubmission
          ) {
            return exactContextSubmission;
          }
        }
        if (
          matchingContextSubmissions.length >
          0
        ) {
          return matchingContextSubmissions[
            matchingContextSubmissions.length -
            1
          ];
        }
        /*
          Prioritas 4:
          LocalStorage.
        */
        return findStoredSubmission(
          formId,
          submissionId
        );
      },
      [
        formId,
        submissionId,
        routeState.submission,
        submittedForms,
        getUserSubmissionByForm,
      ]
    );
  // =========================================================
  // RESULT MODE
  // =========================================================
  const resultMode =
    normalizeResultMode(
      routeState.resultMode ??
      submission?.resultMode ??
      form?.settings?.resultMode ??
      form?.resultMode
    );
  const canViewResult =
    resultMode ===
      "result" ||
    resultMode ===
      "score";
  const canViewScore =
    resultMode ===
    "score";
  // =========================================================
  // QUESTIONS
  // =========================================================
  const questions =
    useMemo(
      () => {
        if (
          !form ||
          !Array.isArray(
            form.questions
          )
        ) {
          return [];
        }
        return form.questions.map(
          (
            question,
            index
          ) =>
            normalizeQuestion(
              question,
              index
            )
        );
      },
      [
        form,
      ]
    );
  // =========================================================
  // ANSWERS
  // =========================================================
  const answers =
    useMemo(
      () => {
        if (
          !submission ||
          !submission.answers ||
          typeof submission.answers !==
            "object" ||
          Array.isArray(
            submission.answers
          )
        ) {
          return {};
        }
        return submission.answers;
      },
      [
        submission,
      ]
    );
  // =========================================================
  // STORED QUESTION RESULTS
  // =========================================================
  const storedQuestionResults =
    useMemo(
      () => {
        if (
          !submission ||
          !Array.isArray(
            submission.questionResults
          )
        ) {
          return [];
        }
        return submission.questionResults;
      },
      [
        submission,
      ]
    );
  // =========================================================
  // BUILD QUESTION RESULTS
  // =========================================================
  const questionResults =
    useMemo(
      () => {
        return questions.map(
          (
            question,
            index
          ) => {
            const questionId =
              question.id ??
              `question-${index + 1}`;
            const userAnswer =
              answers[
                questionId
              ];
            const storedQuestionResult =
              storedQuestionResults.find(
                (
                  result
                ) => {
                  const resultQuestionId =
                    result?.questionId ??
                    result?.id;
                  return (
                    String(
                      resultQuestionId
                    ) ===
                    String(
                      questionId
                    )
                  );
                }
              ) ||
              null;
            const correctAnswer =
              storedQuestionResult
                ?.correctAnswer ??
              getCorrectAnswer(
                question
              );
            const hasCorrectAnswer =
              hasAnswerValue(
                correctAnswer
              );
            let isCorrect =
              null;
            /*
              Jika submission sudah memiliki hasil penilaian,
              gunakan data itu.
            */
            if (
              typeof storedQuestionResult
                ?.isCorrect ===
              "boolean"
            ) {
              isCorrect =
                storedQuestionResult
                  .isCorrect;
            }
            /*
              Jika belum ada, hitung dari correctAnswer.
            */
            else if (
              hasCorrectAnswer &&
              hasAnswerValue(
                userAnswer
              )
            ) {
              isCorrect =
                normalizeComparableAnswer(
                  userAnswer
                ) ===
                normalizeComparableAnswer(
                  correctAnswer
                );
            }
            /*
              Ada kunci tetapi user tidak menjawab.
            */
            else if (
              hasCorrectAnswer &&
              !hasAnswerValue(
                userAnswer
              )
            ) {
              isCorrect =
                false;
            }
            /*
              Scoring hanya dianggap aktif jika:
              - question.scoring true
              - atau stored result menyebut scoring true
              - atau ada points > 0
            */
            const scoringEnabled =
              question.scoring ===
                true ||
              storedQuestionResult
                ?.scoring ===
                true ||
              Number(
                question.points
              ) >
                0 ||
              Number(
                storedQuestionResult
                  ?.maxPoints
              ) >
                0;
            const pointsFromQuestion =
              Number(
                question.points
              );
            const pointsFromStoredResult =
              Number(
                storedQuestionResult
                  ?.maxPoints ??
                storedQuestionResult
                  ?.points
              );
            let maxPoints =
              0;
            if (
              Number.isFinite(
                pointsFromStoredResult
              ) &&
              pointsFromStoredResult >
                0
            ) {
              maxPoints =
                pointsFromStoredResult;
            } else if (
              Number.isFinite(
                pointsFromQuestion
              ) &&
              pointsFromQuestion >
                0
            ) {
              maxPoints =
                pointsFromQuestion;
            } else if (
              scoringEnabled
            ) {
              maxPoints =
                1;
            }
            let earnedPoints =
              0;
            if (
              storedQuestionResult
                ?.earnedPoints !==
              undefined &&
              storedQuestionResult
                ?.earnedPoints !==
              null
            ) {
              const storedEarnedPoints =
                Number(
                  storedQuestionResult
                    .earnedPoints
                );
              earnedPoints =
                Number.isFinite(
                  storedEarnedPoints
                )
                  ? storedEarnedPoints
                  : 0;
            } else if (
              scoringEnabled &&
              isCorrect ===
                true
            ) {
              earnedPoints =
                maxPoints;
            }
            return {
              questionId,
              question,
              userAnswer,
              correctAnswer,
              hasCorrectAnswer,
              isCorrect,
              scoringEnabled,
              maxPoints,
              earnedPoints,
            };
          }
        );
      },
      [
        questions,
        answers,
        storedQuestionResults,
      ]
    );
  // =========================================================
  // CALCULATED SCORE
  // =========================================================
  const calculatedScore =
    useMemo(
      () => {
        return questionResults.reduce(
          (
            total,
            item
          ) => {
            if (
              !item.scoringEnabled
            ) {
              return total;
            }
            return (
              total +
              (
                Number(
                  item.earnedPoints
                ) ||
                0
              )
            );
          },
          0
        );
      },
      [
        questionResults,
      ]
    );
  const calculatedMaxScore =
    useMemo(
      () => {
        return questionResults.reduce(
          (
            total,
            item
          ) => {
            if (
              !item.scoringEnabled
            ) {
              return total;
            }
            return (
              total +
              (
                Number(
                  item.maxPoints
                ) ||
                0
              )
            );
          },
          0
        );
      },
      [
        questionResults,
      ]
    );
  // =========================================================
  // FINAL SCORE
  // =========================================================
  const storedScore =
    Number(
      submission?.score
    );
  const storedMaxScore =
    Number(
      submission?.maxScore
    );
  const score =
    Number.isFinite(
      storedScore
    )
      ? storedScore
      : calculatedScore;
  const maxScore =
    (
      Number.isFinite(
        storedMaxScore
      ) &&
      storedMaxScore >
        0
    )
      ? storedMaxScore
      : calculatedMaxScore;
  // =========================================================
  // SCORED QUESTIONS
  // =========================================================
  const scoredQuestionResults =
    useMemo(
      () => {
        return questionResults.filter(
          (
            item
          ) => {
            return (
              item.scoringEnabled ||
              item.hasCorrectAnswer
            );
          }
        );
      },
      [
        questionResults,
      ]
    );
  // =========================================================
  // CORRECT COUNT
  // =========================================================
  const calculatedCorrectCount =
    scoredQuestionResults.filter(
      (
        item
      ) =>
        item.isCorrect ===
        true
    ).length;
  const storedCorrectAnswers =
    Number(
      submission?.correctAnswers
    );
  const correctCount =
    Number.isFinite(
      storedCorrectAnswers
    )
      ? storedCorrectAnswers
      : calculatedCorrectCount;
  // =========================================================
  // INCORRECT COUNT
  // =========================================================
  const calculatedIncorrectCount =
    scoredQuestionResults.filter(
      (
        item
      ) =>
        item.isCorrect ===
        false
    ).length;
  const storedIncorrectAnswers =
    Number(
      submission?.incorrectAnswers
    );
  const incorrectCount =
    Number.isFinite(
      storedIncorrectAnswers
    )
      ? storedIncorrectAnswers
      : calculatedIncorrectCount;
  // =========================================================
  // PERCENTAGE
  // =========================================================
  const percentage =
    maxScore >
      0
      ? Math.max(
          0,
          Math.min(
            100,
            Math.round(
              (
                score /
                maxScore
              ) *
              100
            )
          )
        )
      : (
          scoredQuestionResults.length >
            0
            ? Math.round(
                (
                  correctCount /
                  scoredQuestionResults.length
                ) *
                100
              )
            : 0
        );
  // =========================================================
  // ANSWERED COUNT
  // =========================================================
  const answeredCount =
    questionResults.filter(
      (
        item
      ) =>
        hasAnswerValue(
          item.userAnswer
        )
    ).length;
  // =========================================================
  // FORM TITLE
  // =========================================================
  const formTitle =
    routeState.formTitle ||
    submission?.title ||
    form?.title ||
    "Form Result";
  // =========================================================
  // NAVIGATION
  // =========================================================
  const goBack =
    () => {
      navigate(
        "/history"
      );
  };
  const goHome =
    () => {
      navigate(
        "/dashboard"
      );
  };
  // =========================================================
  // FORM ID NOT FOUND
  // =========================================================
  if (
    !formId
  ) {
    return (
      <div
        className={
          darkMode
            ? "form-result-page dark"
            : "form-result-page"
        }
      >
      <style>{formResultStyles}</style>
        <div className="form-result-state-card">
          <div className="form-result-state-icon warning">
            <FaExclamationTriangle />
          </div>
          <h2>
            Form ID tidak ditemukan
          </h2>
          <p>
            Halaman result tidak menerima ID form yang valid.
          </p>
          <button
            type="button"
            onClick={
              goBack
            }
          >
            <FaArrowLeft />
            Back to History
          </button>
        </div>
      </div>
    );
  }
  // =========================================================
  // DATA NOT FOUND
  // =========================================================
  if (
    !form ||
    !submission
  ) {
    return (
      <div
        className={
          darkMode
            ? "form-result-page dark"
            : "form-result-page"
        }
      >
      <style>{formResultStyles}</style>
        <div className="form-result-state-card">
          <div className="form-result-state-icon warning">
            <FaExclamationTriangle />
          </div>
          <h2>
            Result tidak ditemukan
          </h2>
          <p>
            {!form
              ? "Data form tidak berhasil ditemukan."
              : "Data submission tidak berhasil ditemukan."
            }
          </p>
          <button
            type="button"
            onClick={
              goBack
            }
          >
            <FaArrowLeft />
            Back to History
          </button>
        </div>
      </div>
    );
  }
  // =========================================================
  // RESULT ACCESS DENIED
  // =========================================================
  if (
    !canViewResult
  ) {
    return (
      <div
        className={
          darkMode
            ? "form-result-page dark"
            : "form-result-page"
        }
      >
      <style>{formResultStyles}</style>
        <div className="form-result-state-card">
          <div className="form-result-state-icon warning">
            <FaExclamationTriangle />
          </div>
          <h2>
            Result tidak tersedia
          </h2>
          <p>
            Admin tidak mengaktifkan akses hasil untuk form ini.
          </p>
          <button
            type="button"
            onClick={
              goBack
            }
          >
            <FaArrowLeft />
            Back to History
          </button>
        </div>
      </div>
    );
  }
  // =========================================================
  // EMPTY QUESTIONS
  // =========================================================
  if (
    questions.length ===
    0
  ) {
    return (
      <div
        className={
          darkMode
            ? "form-result-page dark"
            : "form-result-page"
        }
      >
      <style>{formResultStyles}</style>
        <div className="form-result-state-card">
          <div className="form-result-state-icon warning">
            <FaExclamationTriangle />
          </div>
          <h2>
            Pertanyaan tidak ditemukan
          </h2>
          <p>
            Data pertanyaan untuk form ini tidak tersedia.
          </p>
          <button
            type="button"
            onClick={
              goBack
            }
          >
            <FaArrowLeft />
            Back to History
          </button>
        </div>
      </div>
    );
  }
  // =========================================================
  // RETURN
  // =========================================================
  return (
    <div
      className={
        darkMode
          ? "form-result-page dark"
          : "form-result-page"
      }
    >
      <style>{formResultStyles}</style>
      {/* =====================================================
          HEADER
      ===================================================== */}
      <header className="form-result-header">
        <div className="form-result-header-decoration">
          <span className="form-result-circle circle-one"></span>
          <span className="form-result-circle circle-two"></span>
          <div className="form-result-dot-pattern">
            {Array.from({
              length: 15,
            }).map(
              (
                _,
                index
              ) => (
                <span
                  key={
                    index
                  }
                ></span>
              )
            )}
          </div>
        </div>
        <div className="form-result-header-top">
          <button
            type="button"
            className="form-result-back-btn"
            onClick={
              goBack
            }
          >
            <FaArrowLeft />
          </button>
          <span className="form-result-header-label">
            Submission Result
          </span>
          <span
            className={
              canViewScore
                ? "form-result-mode-badge score"
                : "form-result-mode-badge"
            }
          >
            {canViewScore ? (
              <>
                <FaTrophy />
                Result &amp; Score
              </>
            ) : (
              <>
                <FaClipboardCheck />
                Result Only
              </>
            )}
          </span>
        </div>
        <div className="form-result-header-content">
          <span className="form-result-eyebrow">
            HiDocs Result
          </span>
          <h1>
            {formTitle}
          </h1>
          <p>
            {canViewScore
              ? "Review your submitted answers and see your score."
              : "Review the questions and answers you submitted."
            }
          </p>
        </div>
      </header>
      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}
      <main className="form-result-content">
        {/* ===================================================
            SUBMISSION SUMMARY
        =================================================== */}
        <section className="form-result-summary-card">
          <div className="form-result-summary-icon">
            <FaCheckCircle />
          </div>
          <div className="form-result-summary-main">
            <span>
              Submission Completed
            </span>
            <strong>
              Your response was successfully recorded
            </strong>
            <p>
              {answeredCount}
              {" "}
              of
              {" "}
              {questions.length}
              {" "}
              questions answered.
            </p>
          </div>
          <div className="form-result-summary-meta">
            <div>
              <FaCalendarAlt />
              <span>
                {formatSubmissionDate(
                  submission.submittedAt
                )}
              </span>
            </div>
            <div>
              <FaClock />
              <span>
                {formatSubmissionTime(
                  submission.submittedAt
                )}
              </span>
            </div>
          </div>
        </section>
        {/* ===================================================
            SCORE SECTION
        =================================================== */}
        {canViewScore && (
          <section className="form-result-score-section">
            <div className="form-result-score-card">
              <div className="form-result-score-decoration"></div>
              <div className="form-result-score-icon">
                <FaTrophy />
              </div>
              <div className="form-result-score-content">
                <span>
                  Your Score
                </span>
                <div className="form-result-score-number">
                  <strong>
                    {score}
                  </strong>
                  <small>
                    / {maxScore}
                  </small>
                </div>
                <p>
                  Total points earned from all scored questions.
                </p>
              </div>
              <div className="form-result-score-percentage">
                <strong>
                  {percentage}%
                </strong>
                <span>
                  Score
                </span>
              </div>
            </div>
            <div className="form-result-score-stats">
              <article className="form-result-mini-stat correct">
                <div>
                  <FaCheck />
                </div>
                <span>
                  Correct
                </span>
                <strong>
                  {correctCount}
                </strong>
              </article>
              <article className="form-result-mini-stat incorrect">
                <div>
                  <FaTimes />
                </div>
                <span>
                  Incorrect
                </span>
                <strong>
                  {incorrectCount}
                </strong>
              </article>
              <article className="form-result-mini-stat answered">
                <div>
                  <FaClipboardCheck />
                </div>
                <span>
                  Answered
                </span>
                <strong>
                  {answeredCount}
                  /
                  {questions.length}
                </strong>
              </article>
            </div>
          </section>
        )}
        {/* ===================================================
            REVIEW HEADING
        =================================================== */}
        <section className="form-result-review-heading">
          <div>
            <span>
              Answer Review
            </span>
            <h2>
              Your Responses
            </h2>
            <p>
              {canViewScore
                ? "Questions answered incorrectly are highlighted in red. Correct answers remain highlighted positively."
                : "This page only shows the questions and answers you submitted. Correctness and score are hidden."
              }
            </p>
          </div>
          <span className="form-result-question-count">
            {questions.length}
            {" "}
            Questions
          </span>
        </section>
        {/* ===================================================
            QUESTION LIST
        =================================================== */}
        <section className="form-result-question-list">
          {questionResults.map(
            (
              item,
              index
            ) => {
              const question =
                item.question;
              const userAnswer =
                item.userAnswer;
              const correctAnswer =
                item.correctAnswer;
              const isCorrect =
                item.isCorrect;
              const maxPoints =
                Number(
                  item.maxPoints
                ) ||
                0;
              const earnedPoints =
                Number(
                  item.earnedPoints
                ) ||
                0;
              const incorrect =
                canViewScore &&
                isCorrect ===
                  false;
              const correct =
                canViewScore &&
                isCorrect ===
                  true;
              return (
                <article
                  key={
                    item.questionId
                  }
                  className={[
                    "form-result-question-card",
                    incorrect
                      ? "incorrect"
                      : "",
                    correct
                      ? "correct"
                      : "",
                  ]
                    .filter(
                      Boolean
                    )
                    .join(
                      " "
                    )}
                >
                  {/* =========================================
                      QUESTION TOP
                  ========================================= */}
                  <div className="form-result-question-top">
                    <div className="form-result-question-number">
                      {index + 1}
                    </div>
                    <div className="form-result-question-type">
                      {getQuestionTypeIcon(
                        question.type
                      )}
                      <span>
                        {getQuestionTypeLabel(
                          question.type
                        )}
                      </span>
                    </div>
                    {canViewScore &&
                    isCorrect !==
                      null && (
                      <span
                        className={
                          isCorrect
                            ? "form-result-correctness correct"
                            : "form-result-correctness incorrect"
                        }
                      >
                        {isCorrect ? (
                          <>
                            <FaCheckCircle />
                            Correct
                          </>
                        ) : (
                          <>
                            <FaTimes />
                            Incorrect
                          </>
                        )}
                      </span>
                    )}
                  </div>
                  {/* =========================================
                      QUESTION CONTENT
                  ========================================= */}
                  <div className="form-result-question-body">
                    <h3>
                      {question.title ||
                      question.question ||
                      `Question ${index + 1}`}
                    </h3>
                    {question.image && (
                      <div className="form-result-question-image">
                        <img
                          src={
                            question.image
                          }
                          alt={
                            question.imageName ||
                            `Question ${index + 1}`
                          }
                        />
                      </div>
                    )}
                    {/* =======================================
                        USER ANSWER
                    ======================================= */}
                    <div
                      className={[
                        "form-result-answer-box",
                        incorrect
                          ? "incorrect"
                          : "",
                        correct
                          ? "correct"
                          : "",
                      ]
                        .filter(
                          Boolean
                        )
                        .join(
                          " "
                        )}
                    >
                      <span className="form-result-answer-label">
                        Your Answer
                      </span>
                      <div className="form-result-answer-value">
                        {hasAnswerValue(
                          userAnswer
                        ) ? (
                          <>
                            {correct && (
                              <FaCheckCircle />
                            )}
                            {incorrect && (
                              <FaTimes />
                            )}
                            <strong>
                              {normalizeAnswerText(
                                userAnswer
                              )}
                            </strong>
                          </>
                        ) : (
                          <span className="form-result-no-answer">
                            No answer submitted
                          </span>
                        )}
                      </div>
                    </div>
                    {/* =======================================
                        CORRECT ANSWER
                        Hanya muncul:
                        - mode score
                        - jawaban user salah
                    ======================================= */}
                    {canViewScore &&
                    incorrect &&
                    hasAnswerValue(
                      correctAnswer
                    ) && (
                      <div className="form-result-correct-answer-box">
                        <span>
                          Correct Answer
                        </span>
                        <div>
                          <FaCheckCircle />
                          <strong>
                            {normalizeAnswerText(
                              correctAnswer
                            )}
                          </strong>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* =========================================
                      QUESTION FOOTER
                  ========================================= */}
                  <div className="form-result-question-footer">
                    <span>
                      {question.required !==
                      false
                        ? "Required question"
                        : "Optional question"
                      }
                    </span>
                    {canViewScore &&
                    item.scoringEnabled &&
                    maxPoints >
                      0 && (
                      <strong
                        className={
                          incorrect
                            ? "score incorrect"
                            : "score"
                        }
                      >
                        {earnedPoints}
                        /
                        {maxPoints}
                        {" "}
                        pts
                      </strong>
                    )}
                  </div>
                </article>
              );
            }
          )}
        </section>
        {/* ===================================================
            BOTTOM ACTIONS
        =================================================== */}
        <section className="form-result-bottom-actions">
          <button
            type="button"
            className="form-result-history-btn"
            onClick={
              goBack
            }
          >
            <FaArrowLeft />
            <span>
              Back to History
            </span>
          </button>
          <button
            type="button"
            className="form-result-home-btn"
            onClick={
              goHome
            }
          >
            <FaHome />
            <span>
              Back to Home
            </span>
            <FaArrowRight />
          </button>
        </section>
      </main>
    </div>
  );
}
export default FormResult;