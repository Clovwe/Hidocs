import {
  useContext,
  useEffect,
  useState,
} from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  FaAlignLeft,
  FaArrowLeft,
  FaCalculator,
  FaCalendarAlt,
  FaChartBar,
  FaCheck,
  FaCircle,
  FaClock,
  FaCode,
  FaCog,
  FaCopy,
  FaEye,
  FaEyeSlash,
  FaFont,
  FaGlobe,
  FaHourglassHalf,
  FaImage,
  FaInfoCircle,
  FaLink,
  FaListUl,
  FaLock,
  FaMinus,
  FaPlus,
  FaPowerOff,
  FaQrcode,
  FaQuestionCircle,
  FaRandom,
  FaStar,
  FaTrash,
  FaTrophy,
} from "react-icons/fa";
import {
  ThemeContext,
} from "../context/ThemeContext";

const editFormStyles = `
/* === CreateForm.css === */
/* =========================================================
   CREATE FORM — HIDOCS
========================================================= */
.create-form-page {
    --primary: #2563eb;
    --primary-hover: #1d4ed8;
    --primary-soft: #eff6ff;
    --primary-border: #bfdbfe;
    --text: #172033;
    --text-secondary: #667085;
    --text-muted: #98a2b3;
    --border: #e1e7ef;
    --border-light: #edf0f4;
    --background: #f4f7fb;
    --card: #ffffff;
    --input-background: #ffffff;
    --danger: #ef4444;
    --danger-soft: #fef2f2;
    --success: #22a863;
    --success-soft: #ecfdf3;
    --warning: #e99a0c;
    --warning-soft: #fff8e7;
    position: relative;
    width: 100%;
    min-height: 100vh;
    overflow-x: hidden;
    background: radial-gradient( circle at top right, rgba(59, 130, 246, 0.07), transparent 28% ), var(--background);
    color: var(--text);
    font-family: "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    transition: background 0.25s ease, color 0.25s ease;
}
.create-form-page,
.create-form-page *,
.create-form-page *::before,
.create-form-page *::after {
    box-sizing: border-box;
}
/* =========================================================
   DARK MODE VARIABLES
========================================================= */
.create-form-page.dark {
    --primary: #4d9aff;
    --primary-hover: #6eafff;
    --primary-soft: #1c3451;
    --primary-border: #365d84;
    --text: #f1f5f9;
    --text-secondary: #a7b4c5;
    --text-muted: #76869a;
    --border: #2c3a4d;
    --border-light: #263344;
    --background: #0d1624;
    --card: #172234;
    --input-background: #111c2b;
    --danger: #fb7185;
    --danger-soft: #3a2028;
    --success: #4ade80;
    --success-soft: #193a2c;
    --warning: #fbbf24;
    --warning-soft: #3c3017;
}
/* =========================================================
   HEADER
========================================================= */
.create-form-header {
    position: sticky;
    top: 0;
    z-index: 110;
    width: 100%;
    min-height: 76px;
    padding: 0 30px;
    border-bottom: 1px solid var(--border);
    background: rgba(255, 255, 255, 0.97);
    display: flex;
    align-items: center;
    gap: 15px;
    box-shadow: 0 3px 14px rgba(21, 42, 69, 0.05);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    transition: background 0.25s ease, border-color 0.25s ease;
}
.create-form-page.dark
.create-form-header {
    background: rgba(23, 34, 52, 0.97);
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.22);
}
/* =========================================================
   BACK BUTTON
========================================================= */
.create-back-btn {
    width: 42px;
    height: 42px;
    padding: 0;
    flex-shrink: 0;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--card);
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    cursor: pointer;
    transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease, color 0.2s ease;
}
.create-back-btn:hover {
    transform: translateX(-2px);
    border-color: var(--primary-border);
    background: var(--primary-soft);
    color: var(--primary);
}
/* =========================================================
   HEADER TITLE
========================================================= */
.create-header-title {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
}
.create-header-title > span {
    color: var(--text-muted);
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.9px;
    text-transform: uppercase;
}
.create-header-title h1 {
    margin: 0;
    color: var(--text);
    font-size: 23px;
    line-height: 1.25;
    font-weight: 700;
    letter-spacing: -0.4px;
}
/* =========================================================
   HEADER ACTIONS
========================================================= */
.create-header-actions {
    margin-left: auto;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 9px;
}
.create-previous-btn,
.create-save-btn {
    min-width: 94px;
    height: 42px;
    padding: 0 17px;
    border-radius: 11px;
    font-family: inherit;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.2s ease, background 0.2s ease, color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
}
.create-previous-btn {
    border: 1px solid var(--border);
    background: var(--card);
    color: var(--text-secondary);
}
.create-previous-btn:hover {
    transform: translateY(-1px);
    border-color: var(--primary-border);
    background: var(--primary-soft);
    color: var(--primary);
}
.create-save-btn {
    border: none;
    background: linear-gradient( 90deg, #1f5fa4, #2f80d1 );
    color: #ffffff;
    box-shadow: 0 6px 15px rgba(37, 105, 178, 0.22);
}
.create-save-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 21px rgba(37, 105, 178, 0.29);
    filter: brightness(1.04);
}
.create-save-btn:active,
.create-previous-btn:active {
    transform: translateY(0);
}
/* =========================================================
   STEP TABS
========================================================= */
.create-form-tabs {
    position: sticky;
    top: 76px;
    z-index: 100;
    width: 100%;
    padding: 11px 24px;
    border-bottom: 1px solid var(--border);
    background: rgba(255, 255, 255, 0.96);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    box-shadow: 0 3px 13px rgba(21, 42, 69, 0.035);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
}
.create-form-page.dark
.create-form-tabs {
    background: rgba(23, 34, 52, 0.96);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}
.create-tab {
    min-width: 145px;
    height: 45px;
    padding: 0 16px;
    border: 1px solid transparent;
    border-radius: 12px;
    background: transparent;
    color: var(--text-secondary);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-family: inherit;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}
.create-tab:hover {
    background: var(--primary-soft);
    color: var(--primary);
}
.create-tab.active {
    border-color: var(--primary-border);
    background: var(--primary-soft);
    color: var(--primary);
}
.create-tab > svg {
    flex-shrink: 0;
    font-size: 15px;
}
.create-tab-number {
    width: 22px;
    height: 22px;
    flex-shrink: 0;
    border-radius: 50%;
    background: #edf1f6;
    color: #7b8ca1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 800;
    transition: background 0.2s ease, color 0.2s ease;
}
.create-tab.active
.create-tab-number {
    background: var(--primary);
    color: #ffffff;
}
.create-form-page.dark
.create-tab-number {
    background: #223147;
    color: #8fa2b8;
}
/* =========================================================
   COMMON PAGE CONTENT
========================================================= */
.create-form-content,
.settings-page,
.questions-builder-page {
    width: 100%;
    max-width: 1080px;
    margin: 0 auto;
    padding: 32px 27px 75px;
}
.settings-page {
    max-width: 880px;
}
.questions-builder-page {
    max-width: 1120px;
}
/* =========================================================
   COMMON CARD
========================================================= */
.create-section,
.settings-section,
.question-builder-toolbar,
.builder-question-card,
.builder-empty-state {
    border: 1px solid var(--border);
    border-radius: 18px;
    background: var(--card);
    box-shadow: 0 7px 22px rgba(21, 42, 69, 0.055);
    transition: background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}
/* =========================================================
   INFO TAB
========================================================= */
.create-section {
    width: 100%;
    margin-bottom: 22px;
    padding: 25px;
}
.create-section:last-child {
    margin-bottom: 0;
}
.create-section-title {
    margin-bottom: 23px;
    display: flex;
    align-items: center;
    gap: 13px;
}
.create-section-icon {
    width: 42px;
    height: 42px;
    flex-shrink: 0;
    border-radius: 12px;
    background: var(--primary-soft);
    color: var(--primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
}
.create-section-title > div:last-child {
    min-width: 0;
}
.create-section-title > div:last-child > span {
    display: block;
    margin-bottom: 2px;
    color: var(--primary);
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.9px;
    text-transform: uppercase;
}
.create-section-title h2 {
    margin: 0;
    color: var(--text);
    font-size: 18px;
    line-height: 1.3;
    font-weight: 700;
}
/* =========================================================
   FORM FIELD
========================================================= */
.create-field {
    width: 100%;
    margin-bottom: 19px;
}
.create-field:last-child {
    margin-bottom: 0;
}
.create-field label {
    display: block;
    margin-bottom: 8px;
    color: var(--text);
    font-size: 13px;
    font-weight: 700;
}
.create-field label > span {
    margin-left: 3px;
    color: var(--danger);
}
.create-field-help {
    display: block;
    margin-top: 7px;
    color: var(--text-muted);
    font-size: 10px;
    line-height: 1.5;
    overflow-wrap: anywhere;
}
.create-input-wrapper {
    width: 100%;
    min-height: 49px;
    padding: 0 14px;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--input-background);
    display: flex;
    align-items: center;
    gap: 10px;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}
.create-input-wrapper:focus-within {
    border-color: var(--primary);
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.09);
}
.create-input-wrapper > svg {
    flex-shrink: 0;
    color: var(--text-muted);
    font-size: 15px;
}
.create-input-wrapper input {
    width: 100%;
    height: 47px;
    padding: 0;
    border: none;
    outline: none;
    background: transparent;
    color: var(--text);
    font-family: inherit;
    font-size: 13px;
}
.create-input-wrapper input::placeholder {
    color: var(--text-muted);
}
.create-form-page.dark
.create-input-wrapper {
    background: var(--input-background);
}
/* =========================================================
   SCHEDULE
========================================================= */
.schedule-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
}
.schedule-grid
.create-field {
    margin-bottom: 0;
}
/* =========================================================
   SETTINGS SECTION
========================================================= */
.settings-section {
    width: 100%;
    margin-bottom: 22px;
    padding: 23px;
}
.settings-section:last-child {
    margin-bottom: 0;
}
.settings-section-title {
    margin-bottom: 17px;
    display: flex;
    align-items: center;
    gap: 11px;
    color: var(--text);
}
.settings-title-icon {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    border-radius: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
}
.settings-title-icon.blue {
    background: var(--primary-soft);
    color: var(--primary);
}
.settings-section-title > div:last-child {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
}
.settings-section-title small {
    color: var(--primary);
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.8px;
    text-transform: uppercase;
}
.settings-section-title span {
    color: var(--text);
    font-size: 16px;
    font-weight: 700;
}
/* =========================================================
   SETTING TOGGLE ROW
========================================================= */
.setting-option {
    position: relative;
    width: 100%;
    padding: 14px 3px;
    border-bottom: 1px solid var(--border-light);
    display: flex;
    align-items: center;
    gap: 13px;
    cursor: pointer;
}
.setting-option:last-child {
    border-bottom: none;
}
.setting-option-icon {
    width: 39px;
    height: 39px;
    flex: 0 0 39px;
    border-radius: 11px;
    background: var(--primary-soft);
    color: var(--primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
}
.setting-option-content {
    min-width: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 3px;
}
.setting-option-content strong {
    color: var(--text);
    font-size: 13px;
    font-weight: 700;
}
.setting-option-content span {
    color: var(--text-secondary);
    font-size: 11px;
    line-height: 1.5;
}
.setting-option input {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
    pointer-events: none;
}
.toggle-switch {
    width: 46px;
    height: 25px;
    padding: 3px;
    flex: 0 0 46px;
    border-radius: 999px;
    background: #d6dee8;
    display: flex;
    align-items: center;
    transition: background 0.2s ease;
}
.toggle-circle {
    width: 19px;
    height: 19px;
    border-radius: 50%;
    background: #ffffff;
    box-shadow: 0 2px 5px rgba(31, 50, 75, 0.22);
    transition: transform 0.2s ease;
}
.setting-option input:checked
+ .toggle-switch {
    background: var(--primary);
}
.setting-option input:checked
+ .toggle-switch
.toggle-circle {
    transform: translateX(21px);
}
.setting-option input:focus-visible
+ .toggle-switch {
    outline: 2px solid rgba(37, 99, 235, 0.5);
    outline-offset: 3px;
}
/* =========================================================
   RESPONSE TIMER
========================================================= */
.timer-card {
    width: 100%;
    padding: 15px;
    border: 1px solid var(--border-light);
    border-radius: 14px;
    background: var(--background);
    display: flex;
    align-items: center;
    gap: 13px;
}
.timer-card-icon {
    width: 43px;
    height: 43px;
    flex: 0 0 43px;
    border-radius: 12px;
    background: var(--primary-soft);
    color: var(--primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
}
.timer-card-content {
    min-width: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 3px;
}
.timer-card-content strong {
    color: var(--text);
    font-size: 13px;
    font-weight: 700;
}
.timer-card-content span {
    color: var(--text-secondary);
    font-size: 11px;
    line-height: 1.5;
}
.timer-card-select {
    flex-shrink: 0;
}
.timer-card-select select {
    min-width: 112px;
    height: 39px;
    padding: 0 11px;
    border: 1px solid var(--border);
    border-radius: 10px;
    outline: none;
    background: var(--card);
    color: var(--text);
    font-family: inherit;
    font-size: 12px;
    cursor: pointer;
}
/* =========================================================
   RESULT OPTIONS
========================================================= */
.result-option {
    position: relative;
    width: 100%;
    min-height: 72px;
    margin-bottom: 9px;
    padding: 13px;
    border: 1px solid var(--border);
    border-radius: 13px;
    background: var(--card);
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
}
.result-option:last-child {
    margin-bottom: 0;
}
.result-option:hover {
    transform: translateY(-1px);
    border-color: var(--primary-border);
    background: var(--primary-soft);
}
.result-option.selected {
    border-color: var(--primary);
    background: var(--primary-soft);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.06);
}
.result-icon {
    width: 40px;
    height: 40px;
    flex: 0 0 40px;
    border-radius: 11px;
    background: var(--background);
    color: var(--primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
}
.result-content {
    min-width: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 3px;
}
.result-content strong {
    color: var(--text);
    font-size: 13px;
    font-weight: 700;
}
.result-content span {
    color: var(--text-secondary);
    font-size: 11px;
    line-height: 1.45;
}
.result-option input {
    width: 17px;
    height: 17px;
    flex-shrink: 0;
    accent-color: var(--primary);
    cursor: pointer;
}
/* =========================================================
   QUESTION BUILDER TOOLBAR
========================================================= */
.question-builder-toolbar {
    width: 100%;
    margin-bottom: 22px;
    padding: 19px;
}
.question-builder-label {
    margin-bottom: 14px;
    display: flex;
    flex-direction: column;
    gap: 2px;
}
.question-builder-label > span {
    color: var(--primary);
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.8px;
    text-transform: uppercase;
}
.question-builder-label > strong {
    color: var(--text);
    font-size: 16px;
    font-weight: 700;
}
.question-type-list {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 9px;
}
.question-type-btn {
    min-width: 0;
    min-height: 50px;
    padding: 8px 11px;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--card);
    color: var(--text);
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: inherit;
    font-size: 11px;
    font-weight: 700;
    text-align: left;
    cursor: pointer;
    transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
}
.question-type-btn:hover {
    transform: translateY(-2px);
    border-color: var(--primary-border);
    box-shadow: 0 7px 16px rgba(21, 42, 69, 0.08);
}
.question-type-icon {
    width: 31px;
    height: 31px;
    flex: 0 0 31px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
}
.question-type-btn.yellow
.question-type-icon {
    background: #fff4d7;
    color: #d88b0a;
}
.question-type-btn.green
.question-type-icon {
    background: #e7f8ef;
    color: #24a269;
}
.question-type-btn.blue
.question-type-icon {
    background: #e8f2fd;
    color: #337bc1;
}
.question-type-btn.orange
.question-type-icon {
    background: #fff0e3;
    color: #e56c19;
}
.create-form-page.dark
.question-type-btn.yellow
.question-type-icon {
    background: #493a1d;
}
.create-form-page.dark
.question-type-btn.green
.question-type-icon {
    background: #20463b;
}
.create-form-page.dark
.question-type-btn.blue
.question-type-icon {
    background: #203a58;
}
.create-form-page.dark
.question-type-btn.orange
.question-type-icon {
    background: #4c2f20;
}
/* =========================================================
   QUESTIONS LIST
========================================================= */
.builder-question-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 18px;
}
/* =========================================================
   EMPTY STATE
========================================================= */
.builder-empty-state {
    width: 100%;
    min-height: 310px;
    padding: 40px 20px;
    border-style: dashed;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
}
.builder-empty-icon {
    width: 67px;
    height: 67px;
    margin-bottom: 16px;
    border-radius: 19px;
    background: var(--primary-soft);
    color: var(--primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
}
.builder-empty-state h3 {
    margin: 0 0 7px;
    color: var(--text);
    font-size: 17px;
    font-weight: 700;
}
.builder-empty-state p {
    max-width: 400px;
    margin: 0;
    color: var(--text-secondary);
    font-size: 12px;
    line-height: 1.6;
}
/* =========================================================
   QUESTION CARD
========================================================= */
.builder-question-card {
    width: 100%;
    padding: 21px;
}
.builder-question-top {
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 13px;
}
.builder-question-heading {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 8px;
}
.question-number-badge {
    width: 31px;
    height: 31px;
    flex: 0 0 31px;
    border-radius: 9px;
    background: linear-gradient( 145deg, #2368b2, #347fd0 );
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    box-shadow: 0 5px 10px rgba(37, 105, 178, 0.18);
}
.builder-question-heading
.question-type-icon {
    background: var(--primary-soft);
    color: var(--primary);
}
.builder-question-heading strong {
    color: var(--text);
    font-size: 13px;
    font-weight: 700;
}
/* =========================================================
   QUESTION ACTION BUTTONS
========================================================= */
.question-card-actions {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 6px;
}
.question-card-actions button {
    width: 34px;
    height: 34px;
    padding: 0;
    border: 1px solid var(--border);
    border-radius: 9px;
    background: var(--card);
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    cursor: pointer;
    transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease, color 0.2s ease;
}
.question-card-actions button:hover {
    transform: translateY(-1px);
    border-color: var(--primary-border);
    background: var(--primary-soft);
    color: var(--primary);
}
.question-card-actions
.delete-question:hover {
    border-color: #fecaca;
    background: var(--danger-soft);
    color: var(--danger);
}
/* =========================================================
   QUESTION TYPE SELECT
========================================================= */
.question-type-select-wrapper {
    width: 100%;
    margin-bottom: 13px;
}
.question-type-select-wrapper select {
    width: 100%;
    height: 42px;
    padding: 0 12px;
    border: 1px solid var(--border);
    border-radius: 10px;
    outline: none;
    background: var(--background);
    color: var(--text);
    font-family: inherit;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.question-type-select-wrapper
select:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08);
}
/* =========================================================
   QUESTION TEXT INPUT
========================================================= */
.question-main-input {
    width: 100%;
    min-height: 90px;
    margin-bottom: 17px;
    padding: 11px;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--input-background);
    display: flex;
    align-items: flex-start;
    gap: 10px;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.question-main-input:focus-within {
    border-color: var(--primary);
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08);
}
.question-input-icon {
    width: 32px;
    height: 32px;
    flex: 0 0 32px;
    border-radius: 9px;
    background: var(--primary-soft);
    color: var(--primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
}
.question-main-input textarea {
    width: 100%;
    min-height: 65px;
    padding: 5px 0;
    resize: vertical;
    border: none;
    outline: none;
    background: transparent;
    color: var(--text);
    font-family: inherit;
    font-size: 13px;
    line-height: 1.6;
}
.question-main-input
textarea::placeholder {
    color: var(--text-muted);
}
/* =========================================================
   MULTIPLE CHOICE OPTIONS
========================================================= */
.question-options-area {
    width: 100%;
    margin-bottom: 17px;
    padding: 15px;
    border: 1px solid var(--border-light);
    border-radius: 13px;
    background: var(--background);
}
.answer-options-header {
    margin-bottom: 11px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
}
.answer-options-header span {
    color: var(--text);
    font-size: 12px;
    font-weight: 700;
}
.answer-options-header small {
    color: var(--text-muted);
    font-size: 10px;
}
.answer-options-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.answer-option-row {
    width: 100%;
    min-height: 42px;
    display: flex;
    align-items: center;
    gap: 8px;
}
.answer-radio {
    width: 23px;
    height: 23px;
    flex: 0 0 23px;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
}

.answer-radio:hover {
    color: var(--primary);
}
.answer-radio-selected {
    color: var(--primary);
}
.answer-radio-selected svg {
    color: var(--primary);
}

.answer-option-row input {
    width: 100%;
    height: 42px;
    padding: 0 11px;
    border: 1px solid var(--border);
    border-radius: 9px;
    outline: none;
    background: var(--card);
    color: var(--text);
    font-family: inherit;
    font-size: 12px;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.answer-option-row input:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
}
.remove-option-btn {
    width: 34px;
    height: 34px;
    padding: 0;
    flex: 0 0 34px;
    border: 1px solid #fecaca;
    border-radius: 9px;
    background: var(--danger-soft);
    color: var(--danger);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    cursor: pointer;
    transition: transform 0.2s ease, background 0.2s ease;
}
.remove-option-btn:hover {
    transform: scale(1.04);
}
.add-option-btn {
    min-height: 36px;
    margin-top: 11px;
    padding: 0 11px;
    border: 1px dashed var(--primary-border);
    border-radius: 9px;
    background: var(--primary-soft);
    color: var(--primary);
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: inherit;
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
}
/* =========================================================
   SHORT / LONG ANSWER PREVIEW
========================================================= */
.preview-answer-box {
    width: 100%;
    margin-bottom: 17px;
}
.preview-answer-box input,
.preview-answer-box textarea {
    width: 100%;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--background);
    color: var(--text);
    font-family: inherit;
    font-size: 12px;
}
.preview-answer-box input {
    height: 44px;
    padding: 0 12px;
}
.preview-answer-box textarea {
    min-height: 90px;
    padding: 11px;
    resize: none;
}
.preview-answer-box input:disabled,
.preview-answer-box textarea:disabled {
    opacity: 1;
    cursor: default;
}
/* =========================================================
   RATING PREVIEW
========================================================= */
.rating-preview {
    width: 100%;
    margin-bottom: 17px;
    padding: 13px;
    overflow-x: auto;
    border: 1px solid var(--border-light);
    border-radius: 12px;
    background: var(--background);
    display: flex;
    align-items: center;
    gap: 9px;
}
.rating-item {
    min-width: 49px;
    padding: 8px;
    border: 1px solid var(--border);
    border-radius: 9px;
    background: var(--card);
    color: #f2a313;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    font-size: 16px;
}
.rating-item span {
    color: var(--text-secondary);
    font-size: 10px;
    font-weight: 700;
}
/* =========================================================
   YES / NO PREVIEW
========================================================= */
.yesno-preview {
    width: 100%;
    margin-bottom: 17px;
    display: flex;
    gap: 10px;
}
.yesno-item {
    min-height: 44px;
    padding: 0 13px;
    flex: 1;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--background);
    color: var(--text);
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    font-weight: 600;
}
.yesno-item span {
    color: var(--text-muted);
    font-size: 20px;
}
/* =========================================================
   SPECIAL QUESTION
========================================================= */
.special-question-box {
    width: 100%;
    margin-bottom: 17px;
    padding: 13px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--background);
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    gap: 9px;
    font-size: 11px;
    line-height: 1.5;
}
.special-question-box svg {
    flex-shrink: 0;
    color: var(--primary);
    font-size: 17px;
}
/* =========================================================
   CODE PREVIEW
========================================================= */
.code-preview-box {
    width: 100%;
    min-height: 98px;
    margin-bottom: 17px;
    border: 1px dashed #354257;
    border-radius: 11px;
    background: #111827;
    color: #cbd5e1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    font-family: "Consolas", "Monaco", monospace;
    font-size: 12px;
}
.code-preview-box span {
    padding: 6px 8px;
    border-radius: 6px;
    background: #1f2937;
    color: #60a5fa;
    font-weight: 700;
}
/* =========================================================
   IMAGE QUESTION
========================================================= */
.image-question-area {
    width: 100%;
    margin-bottom: 17px;
}
.image-question-area > label {
    display: block;
    margin-bottom: 7px;
    color: var(--text);
    font-size: 12px;
    font-weight: 700;
}
.question-image-preview {
    width: 100%;
    max-height: 310px;
    margin-top: 12px;
    overflow: hidden;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--background);
}
.question-image-preview img {
    width: 100%;
    max-height: 310px;
    display: block;
    object-fit: contain;
}
/* =========================================================
   QUESTION SCORING
========================================================= */
.question-setting-card {
    width: 100%;
    margin: 4px 0 11px;
    padding: 13px;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--background);
    display: flex;
    align-items: center;
    gap: 11px;
}
.question-setting-icon {
    width: 38px;
    height: 38px;
    flex: 0 0 38px;
    border-radius: 10px;
    background: var(--warning-soft);
    color: var(--warning);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
}
.question-setting-content {
    min-width: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 3px;
}
.question-setting-content strong {
    color: var(--text);
    font-size: 12px;
    font-weight: 700;
}
.question-setting-content span {
    color: var(--text-secondary);
    font-size: 10px;
    line-height: 1.5;
}
.points-input {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 5px;
}
.points-input input {
    width: 58px;
    height: 34px;
    padding: 0 7px;
    border: 1px solid var(--border);
    border-radius: 8px;
    outline: none;
    background: var(--card);
    color: var(--text);
    text-align: center;
    font-family: inherit;
    font-size: 11px;
}
.points-input span {
    color: var(--text-secondary);
    font-size: 10px;
    font-weight: 700;
}
/* =========================================================
   SMALL TOGGLE
========================================================= */
.small-toggle {
    position: relative;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    cursor: pointer;
}
.small-toggle input {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
    pointer-events: none;
}
.small-toggle-track {
    width: 43px;
    height: 23px;
    padding: 3px;
    border-radius: 999px;
    background: #d6dee8;
    display: flex;
    align-items: center;
    transition: background 0.2s ease;
}
.small-toggle-circle {
    width: 17px;
    height: 17px;
    border-radius: 50%;
    background: #ffffff;
    box-shadow: 0 2px 5px rgba(31, 50, 75, 0.2);
    transition: transform 0.2s ease;
}
.small-toggle input:checked
+ .small-toggle-track {
    background: var(--primary);
}
.small-toggle input:checked
+ .small-toggle-track
.small-toggle-circle {
    transform: translateX(20px);
}
/* =========================================================
   REQUIRED QUESTION
========================================================= */
.required-question-row {
    position: relative;
    width: 100%;
    padding: 13px;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--background);
    display: flex;
    align-items: center;
    gap: 11px;
    cursor: pointer;
}
.required-question-row > div {
    min-width: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 3px;
}
.required-question-row strong {
    color: var(--text);
    font-size: 12px;
    font-weight: 700;
}
.required-question-row > div > span {
    color: var(--text-secondary);
    font-size: 10px;
    line-height: 1.5;
}
.required-question-row input {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
    pointer-events: none;
}
.required-toggle-switch {
    width: 43px;
    height: 23px;
    padding: 3px;
    flex: 0 0 43px;
    border-radius: 999px;
    background: #d6dee8;
    display: flex;
    align-items: center;
    transition: background 0.2s ease;
}
.required-toggle-circle {
    width: 17px;
    height: 17px;
    border-radius: 50%;
    background: #ffffff;
    box-shadow: 0 2px 5px rgba(31, 50, 75, 0.2);
    transition: transform 0.2s ease;
}
.required-question-row input:checked
+ .required-toggle-switch {
    background: var(--primary);
}
.required-question-row input:checked
+ .required-toggle-switch
.required-toggle-circle {
    transform: translateX(20px);
}
/* =========================================================
   DARK MODE ELEMENT FIXES
========================================================= */
.create-form-page.dark input,
.create-form-page.dark textarea,
.create-form-page.dark select {
    color-scheme: dark;
}
.create-form-page.dark
.timer-card,
.create-form-page.dark
.question-options-area,
.create-form-page.dark
.preview-answer-box input,
.create-form-page.dark
.preview-answer-box textarea,
.create-form-page.dark
.rating-preview,
.create-form-page.dark
.yesno-item,
.create-form-page.dark
.special-question-box,
.create-form-page.dark
.question-setting-card,
.create-form-page.dark
.required-question-row {
    background: #111c2b;
}
.create-form-page.dark
.answer-option-row input,
.create-form-page.dark
.points-input input,
.create-form-page.dark
.timer-card-select select {
    background: #172234;
}
.create-form-page.dark
.toggle-switch,
.create-form-page.dark
.small-toggle-track,
.create-form-page.dark
.required-toggle-switch {
    background: #405066;
}
/* =========================================================
   FOCUS
========================================================= */
.create-form-page input:focus,
.create-form-page textarea:focus,
.create-form-page select:focus {
    outline: none;
}
.create-form-page button:focus-visible,
.create-form-page input:focus-visible,
.create-form-page textarea:focus-visible,
.create-form-page select:focus-visible,
.create-form-page label:has(input:focus-visible) {
    outline: 2px solid rgba(37, 99, 235, 0.5);
    outline-offset: 3px;
}
/* =========================================================
   SELECTION
========================================================= */
.create-form-page ::selection {
    background: #bfdbfe;
    color: #1e3a8a;
}
/* =========================================================
   SCROLLBAR
========================================================= */
.create-form-page ::-webkit-scrollbar {
    width: 7px;
    height: 7px;
}
.create-form-page ::-webkit-scrollbar-track {
    background: transparent;
}
.create-form-page ::-webkit-scrollbar-thumb {
    border-radius: 999px;
    background: #c4cfdd;
}
.create-form-page.dark
::-webkit-scrollbar-thumb {
    background: #405066;
}
/* =========================================================
   TABLET
========================================================= */
@media (max-width: 900px) {
    .create-form-header {
        padding: 0 20px;
    }
    .create-form-content,
    .settings-page,
    .questions-builder-page {
        padding-left: 19px;
        padding-right: 19px;
    }
    .question-type-list {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}
/* =========================================================
   MOBILE
========================================================= */
@media (max-width: 650px) {
    .create-form-header {
        min-height: 66px;
        padding: 0 12px;
        gap: 9px;
    }
    .create-back-btn {
        width: 37px;
        height: 37px;
        border-radius: 10px;
    }
    .create-header-title > span {
        display: none;
    }
    .create-header-title h1 {
        font-size: 17px;
    }
    .create-header-actions {
        gap: 5px;
    }
    .create-previous-btn,
    .create-save-btn {
        min-width: 67px;
        height: 37px;
        padding: 0 9px;
        border-radius: 9px;
        font-size: 10px;
    }
    .create-form-tabs {
        top: 66px;
        padding: 8px;
        gap: 4px;
        justify-content: stretch;
    }
    .create-tab {
        min-width: 0;
        height: 40px;
        padding: 0 7px;
        flex: 1;
        gap: 5px;
        font-size: 11px;
    }
    .create-tab-number {
        width: 19px;
        height: 19px;
        font-size: 9px;
    }
    .create-tab > svg {
        display: none;
    }
    .create-form-content,
    .settings-page,
    .questions-builder-page {
        padding: 20px 11px 50px;
    }
    .create-section,
    .settings-section {
        padding: 17px;
        border-radius: 15px;
    }
    .create-section-title {
        margin-bottom: 19px;
    }
    .create-section-icon {
        width: 38px;
        height: 38px;
        border-radius: 10px;
    }
    .create-section-title h2 {
        font-size: 16px;
    }
    .schedule-grid {
        grid-template-columns: 1fr;
        gap: 15px;
    }
    .setting-option {
        padding: 13px 2px;
        gap: 9px;
    }
    .setting-option-icon {
        width: 35px;
        height: 35px;
        flex-basis: 35px;
    }
    .setting-option-content strong {
        font-size: 12px;
    }
    .setting-option-content span {
        font-size: 10px;
    }
    .toggle-switch {
        width: 42px;
        height: 23px;
        flex-basis: 42px;
    }
    .toggle-circle {
        width: 17px;
        height: 17px;
    }
    .setting-option input:checked
    + .toggle-switch
    .toggle-circle {
        transform: translateX(19px);
    }
    .timer-card {
        align-items: flex-start;
        flex-wrap: wrap;
    }
    .timer-card-content {
        padding-top: 2px;
    }
    .timer-card-select {
        width: 100%;
        padding-left: 55px;
    }
    .timer-card-select select {
        width: 100%;
    }
    .result-option {
        padding: 11px;
    }
    .question-builder-toolbar {
        padding: 15px;
        border-radius: 15px;
    }
    .question-type-list {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 7px;
    }
    .question-type-btn {
        min-height: 46px;
        padding: 7px 8px;
        font-size: 10px;
    }
    .question-type-icon {
        width: 28px;
        height: 28px;
        flex-basis: 28px;
    }
    .builder-question-card {
        padding: 15px;
        border-radius: 15px;
    }
    .builder-question-top {
        align-items: flex-start;
    }
    .builder-question-heading {
        flex-wrap: wrap;
    }
    .question-card-actions {
        flex-shrink: 0;
    }
    .question-card-actions button {
        width: 31px;
        height: 31px;
    }
    .question-main-input {
        padding: 9px;
    }
    .question-setting-card {
        flex-wrap: wrap;
    }
    .question-setting-content {
        min-width: calc(100% - 52px);
    }
    .points-input {
        margin-left: 49px;
    }
    .question-setting-card
    .small-toggle {
        margin-left: auto;
    }
    .yesno-preview {
        flex-direction: column;
        gap: 8px;
    }
}
/* =========================================================
   SMALL MOBILE
========================================================= */
@media (max-width: 420px) {
    .create-header-title h1 {
        font-size: 15px;
    }
    .create-previous-btn,
    .create-save-btn {
        min-width: 57px;
        padding: 0 7px;
        font-size: 9px;
    }
    .create-tab {
        padding: 0 4px;
        font-size: 10px;
    }
    .create-tab-number {
        width: 18px;
        height: 18px;
        font-size: 8px;
    }
    .question-type-list {
        grid-template-columns: 1fr;
    }
    .question-type-btn {
        justify-content: flex-start;
    }
    .builder-question-heading strong {
        font-size: 11px;
    }
    .question-number-badge {
        width: 28px;
        height: 28px;
        flex-basis: 28px;
    }
    .question-main-input textarea {
        font-size: 12px;
    }
    .question-setting-content {
        min-width: 0;
    }
    .points-input {
        margin-left: 0;
    }
    .required-question-row {
        align-items: flex-start;
    }
}
/* =========================================================
   REDUCED MOTION
========================================================= */
@media (prefers-reduced-motion: reduce) {
    .create-form-page *,
    .create-form-page *::before,
    .create-form-page *::after {
        animation: none !important;
        transition: none !important;
        scroll-behavior: auto !important;
    }
}
/* =========================================================
   FORM VISIBILITY — PUBLIC / QR ONLY
   Tambahkan ke bagian paling bawah CreateForm.css
========================================================= */
.visibility-settings-section {
    overflow: hidden;
}
.visibility-section-description {
    margin: -4px 0 16px;
    color: var(--text-secondary);
    font-size: 11px;
    line-height: 1.6;
}
.visibility-option-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
}
.visibility-option {
    position: relative;
    min-width: 0;
    min-height: 182px;
    padding: 16px;
    border: 1px solid var(--border);
    border-radius: 15px;
    background: var(--card);
    display: flex;
    align-items: flex-start;
    gap: 12px;
    cursor: pointer;
    transition: transform .2s ease, border-color .2s ease, background .2s ease, box-shadow .2s ease;
}
.visibility-option:hover {
    transform: translateY(-2px);
    border-color: var(--primary-border);
    box-shadow: 0 9px 20px rgba(21, 42, 69, .08);
}
.visibility-option.selected {
    border-color: var(--primary);
    background: var(--primary-soft);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, .07);
}
.visibility-option.selected.qr {
    border-color: #7c5ce7;
    background: #f5f1ff;
    box-shadow: 0 0 0 3px rgba(124, 92, 231, .08);
}
.visibility-option > input {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
    pointer-events: none;
}
.visibility-option-icon {
    width: 43px;
    height: 43px;
    flex: 0 0 43px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
}
.visibility-option-icon.public {
    background: #e8f2fd;
    color: #2f78c2;
}
.visibility-option-icon.qr {
    background: #f0ebff;
    color: #7554d9;
}
.visibility-option-content {
    min-width: 0;
    flex: 1;
}
.visibility-option-heading {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 7px;
    margin-bottom: 6px;
}
.visibility-option-heading strong {
    color: var(--text);
    font-size: 13px;
    font-weight: 700;
}
.visibility-recommended-badge,
.visibility-private-badge {
    min-height: 20px;
    padding: 0 7px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    font-size: 9px;
    font-weight: 700;
}
.visibility-recommended-badge {
    background: var(--success-soft);
    color: var(--success);
}
.visibility-private-badge {
    background: #f0ebff;
    color: #7554d9;
}
.visibility-option-content > p {
    margin: 0 0 12px;
    color: var(--text-secondary);
    font-size: 10px;
    line-height: 1.6;
}
.visibility-benefit-list {
    display: flex;
    flex-direction: column;
    gap: 7px;
}
.visibility-benefit-list span {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--text-secondary);
    font-size: 10px;
    line-height: 1.4;
}
.visibility-benefit-list svg {
    width: 10px;
    flex-shrink: 0;
    color: var(--primary);
}
.visibility-option.qr .visibility-benefit-list svg {
    color: #7554d9;
}
.visibility-radio-indicator {
    width: 20px;
    height: 20px;
    flex: 0 0 20px;
    border: 2px solid var(--border);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color .2s ease, background .2s ease;
}
.visibility-radio-indicator > span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: transparent;
    transition: background .2s ease, transform .2s ease;
}
.visibility-option.selected .visibility-radio-indicator {
    border-color: var(--primary);
}
.visibility-option.selected .visibility-radio-indicator > span {
    background: var(--primary);
    transform: scale(1);
}
.visibility-option.selected.qr .visibility-radio-indicator {
    border-color: #7554d9;
}
.visibility-option.selected.qr .visibility-radio-indicator > span {
    background: #7554d9;
}
.visibility-current-note {
    margin-top: 13px;
    padding: 12px 14px;
    border: 1px solid var(--primary-border);
    border-radius: 12px;
    background: var(--primary-soft);
    color: var(--primary);
    display: flex;
    align-items: center;
    gap: 10px;
}
.visibility-current-note.qr {
    border-color: #d9cdfc;
    background: #f5f1ff;
    color: #7554d9;
}
.visibility-current-note > svg {
    flex-shrink: 0;
    font-size: 17px;
}
.visibility-current-note > div {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
}
.visibility-current-note strong {
    color: currentColor;
    font-size: 11px;
    font-weight: 700;
}
.visibility-current-note span {
    color: var(--text-secondary);
    font-size: 10px;
    line-height: 1.5;
}
.create-form-page.dark .visibility-option.selected.qr,
.create-form-page.dark .visibility-current-note.qr {
    border-color: #5f4a9b;
    background: #2c2445;
}
.create-form-page.dark .visibility-option-icon.qr,
.create-form-page.dark .visibility-private-badge {
    background: #382d59;
    color: #b8a2ff;
}
.create-form-page.dark .visibility-option.qr .visibility-benefit-list svg,
.create-form-page.dark .visibility-current-note.qr {
    color: #b8a2ff;
}
.create-form-page.dark .visibility-option.selected.qr .visibility-radio-indicator {
    border-color: #b8a2ff;
}
.create-form-page.dark .visibility-option.selected.qr .visibility-radio-indicator > span {
    background: #b8a2ff;
}
@media (max-width: 650px) {
    .visibility-option-list {
        grid-template-columns: 1fr;
    }
    .visibility-option {
        min-height: 0;
        padding: 14px;
    }
}
/* =========================================================
   FORM VISIBILITY
========================================================= */
.visibility-options {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
}
.visibility-option {
    position: relative;
    min-height: 145px;
    padding: 17px;
    border: 1px solid var(--border);
    border-radius: 15px;
    background: var(--card);
    display: flex;
    align-items: flex-start;
    gap: 12px;
    cursor: pointer;
    transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
}
.visibility-option:hover {
    transform: translateY(-2px);
    border-color: var(--primary-border);
    box-shadow: 0 8px 20px rgba(21, 42, 69, 0.08);
}
.visibility-option.selected {
    border-color: var(--primary);
    background: var(--primary-soft);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.07);
}
.visibility-option.qr-only.selected {
    border-color: #8b5cf6;
    background: #f5f3ff;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.07);
}
.visibility-option-icon {
    width: 43px;
    height: 43px;
    flex: 0 0 43px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 19px;
}
.visibility-option-icon.public {
    background: var(--primary-soft);
    color: var(--primary);
}
.visibility-option-icon.qr {
    background: #f3e8ff;
    color: #8b5cf6;
}
.visibility-option-content {
    min-width: 0;
    flex: 1;
    padding-right: 24px;
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.visibility-option-content strong {
    color: var(--text);
    font-size: 13px;
    font-weight: 700;
}
.visibility-option-content span {
    color: var(--text-secondary);
    font-size: 11px;
    line-height: 1.55;
}
.visibility-option-content small {
    margin-top: 3px;
    color: var(--text-muted);
    font-size: 9px;
    line-height: 1.5;
}
.visibility-option > input {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
    pointer-events: none;
}
.visibility-radio {
    position: absolute;
    top: 17px;
    right: 17px;
    width: 18px;
    height: 18px;
    padding: 3px;
    border: 1.5px solid #b7c2d0;
    border-radius: 50%;
    background: var(--card);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.2s ease, background 0.2s ease;
}
.visibility-radio span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: transparent;
    transition: background 0.2s ease;
}
.visibility-option input:checked
+ .visibility-radio {
    border-color: var(--primary);
}
.visibility-option input:checked
+ .visibility-radio span {
    background: var(--primary);
}
.visibility-option.qr-only input:checked
+ .visibility-radio {
    border-color: #8b5cf6;
}
.visibility-option.qr-only input:checked
+ .visibility-radio span {
    background: #8b5cf6;
}
/* =========================================================
   VISIBILITY INFORMATION
========================================================= */
.visibility-information {
    width: 100%;
    margin-top: 13px;
    padding: 13px 14px;
    border: 1px solid var(--border);
    border-radius: 12px;
    display: flex;
    align-items: flex-start;
    gap: 11px;
}
.visibility-information > svg {
    flex-shrink: 0;
    margin-top: 2px;
    font-size: 17px;
}
.visibility-information > div {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;
}
.visibility-information strong {
    color: var(--text);
    font-size: 12px;
    font-weight: 700;
}
.visibility-information span {
    color: var(--text-secondary);
    font-size: 10px;
    line-height: 1.55;
}
.visibility-information.public {
    border-color: var(--primary-border);
    background: var(--primary-soft);
}
.visibility-information.public > svg {
    color: var(--primary);
}
.visibility-information.qr {
    border-color: #ddd6fe;
    background: #f5f3ff;
}
.visibility-information.qr > svg {
    color: #8b5cf6;
}
/* =========================================================
   DARK MODE
========================================================= */
.create-form-page.dark
.visibility-option.qr-only.selected,
.create-form-page.dark
.visibility-information.qr {
    border-color: #6d4c9b;
    background: #2b2240;
}
.create-form-page.dark
.visibility-option-icon.qr {
    background: #35264f;
    color: #c4b5fd;
}
.create-form-page.dark
.visibility-radio {
    background: #172234;
    border-color: #526177;
}
/* =========================================================
   RESPONSIVE
========================================================= */
@media (max-width: 650px) {
    .visibility-options {
        grid-template-columns: 1fr;
    }
    .visibility-option {
        min-height: 125px;
        padding: 14px;
    }
    .visibility-radio {
        top: 14px;
        right: 14px;
    }
}
/* =========================================================
   RESPONSE TIMER DURATION
========================================================= */
.response-timer-duration {
    width: 100%;
    margin: 14px 0;
    padding: 15px;
    border: 1px solid var(--primary-border);
    border-radius: 14px;
    background: var(--primary-soft);
    display: flex;
    align-items: center;
    gap: 13px;
    transition: opacity 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}
.response-timer-duration.disabled {
    opacity: 0.58;
    border-color: var(--border);
    background: var(--background);
}
.response-timer-duration-icon {
    width: 43px;
    height: 43px;
    flex: 0 0 43px;
    border-radius: 12px;
    background: var(--card);
    color: var(--primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
}
.response-timer-duration-content {
    min-width: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 3px;
}
.response-timer-duration-content strong {
    color: var(--text);
    font-size: 13px;
    font-weight: 700;
}
.response-timer-duration-content span {
    color: var(--text-secondary);
    font-size: 11px;
    line-height: 1.5;
}
.response-timer-input-wrapper {
    min-width: 150px;
    height: 42px;
    padding: 0 10px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--card);
    display: flex;
    align-items: center;
    gap: 7px;
}
.response-timer-input-wrapper:focus-within {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
}
.response-timer-input-wrapper input {
    width: 70px;
    height: 38px;
    padding: 0;
    border: none;
    outline: none;
    background: transparent;
    color: var(--text);
    font-family: inherit;
    font-size: 13px;
    font-weight: 700;
    text-align: right;
}
.response-timer-input-wrapper input:disabled {
    cursor: not-allowed;
}
.response-timer-input-wrapper span {
    color: var(--text-secondary);
    font-size: 10px;
    font-weight: 600;
}
/* =========================================================
   RESPONSE TIMER INFORMATION
========================================================= */
.response-timer-information {
    width: 100%;
    margin-bottom: 14px;
    padding: 13px 14px;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--background);
    display: flex;
    align-items: flex-start;
    gap: 11px;
}
.response-timer-information.active {
    border-color: #f5d18b;
    background: var(--warning-soft);
}
.response-timer-information > svg {
    margin-top: 2px;
    flex-shrink: 0;
    color: var(--text-muted);
    font-size: 17px;
}
.response-timer-information.active > svg {
    color: var(--warning);
}
.response-timer-information > div {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;
}
.response-timer-information strong {
    color: var(--text);
    font-size: 12px;
    font-weight: 700;
}
.response-timer-information span {
    color: var(--text-secondary);
    font-size: 10px;
    line-height: 1.55;
}
/* =========================================================
   DARK RESPONSE TIMER
========================================================= */
.create-form-page.dark
.response-timer-duration-icon,
.create-form-page.dark
.response-timer-input-wrapper {
    background: #172234;
}
.create-form-page.dark
.response-timer-information {
    background: #111c2b;
}
.create-form-page.dark
.response-timer-information.active {
    border-color: #6c5423;
    background: #3c3017;
}
/* =========================================================
   RESPONSIVE RESPONSE TIMER
========================================================= */
@media (max-width: 650px) {
    .response-timer-duration {
        align-items: flex-start;
        flex-wrap: wrap;
    }
    .response-timer-duration-content {
        padding-top: 2px;
    }
    .response-timer-input-wrapper {
        width: 100%;
        min-width: 0;
        margin-left: 56px;
    }
    .response-timer-input-wrapper input {
        width: 100%;
        text-align: left;
    }
}
@media (max-width: 420px) {
    .response-timer-input-wrapper {
        margin-left: 0;
    }
}
/* =========================================================
   QUESTION IMAGE UPLOAD
========================================================= */
.question-image-upload-box {
    width: 100%;
    margin-top: 8px;
}
.question-image-file-input {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    opacity: 0;
    pointer-events: none;
}
.question-image-upload-label {
    width: 100%;
    min-height: 82px;
    padding: 14px;
    border: 1px dashed var(--primary-border);
    border-radius: 13px;
    background: var(--primary-soft);
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
}
.question-image-upload-label:hover {
    transform: translateY(-1px);
    border-color: var(--primary);
    box-shadow: 0 7px 18px rgba(37, 99, 235, 0.08);
}
.question-image-upload-icon {
    width: 43px;
    height: 43px;
    flex: 0 0 43px;
    border-radius: 12px;
    background: var(--card);
    color: var(--primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
}
.question-image-upload-content {
    min-width: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.question-image-upload-content strong {
    color: var(--text);
    font-size: 12px;
    font-weight: 700;
}
.question-image-upload-content small {
    color: var(--text-secondary);
    font-size: 10px;
    line-height: 1.5;
}
.question-image-upload-button {
    min-width: 88px;
    height: 34px;
    padding: 0 12px;
    border: 1px solid var(--primary-border);
    border-radius: 9px;
    background: var(--card);
    color: var(--primary);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 10px;
    font-weight: 700;
}
.question-image-preview {
    width: 100%;
    max-height: none;
    margin-top: 14px;
    overflow: hidden;
    border: 1px solid var(--border);
    border-radius: 13px;
    background: var(--card);
}
.question-image-preview-header {
    width: 100%;
    padding: 11px 12px;
    border-bottom: 1px solid var(--border-light);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}
.question-image-preview-header > div {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;
}
.question-image-preview-header strong {
    color: var(--text);
    font-size: 11px;
    font-weight: 700;
}
.question-image-preview-header span {
    max-width: 420px;
    overflow: hidden;
    color: var(--text-secondary);
    font-size: 10px;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.question-image-preview img {
    width: 100%;
    max-height: 360px;
    display: block;
    object-fit: contain;
    background: var(--background);
}
.remove-question-image-btn {
    min-width: 78px;
    height: 32px;
    padding: 0 10px;
    border: 1px solid #fecaca;
    border-radius: 8px;
    background: var(--danger-soft);
    color: var(--danger);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    flex-shrink: 0;
    font-family: inherit;
    font-size: 10px;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.2s ease, background 0.2s ease;
}
.remove-question-image-btn:hover {
    transform: translateY(-1px);
}
/* =========================================================
   IMAGE UPLOAD DARK MODE
========================================================= */
.create-form-page.dark
.question-image-upload-label {
    background: #162a42;
}
.create-form-page.dark
.question-image-upload-icon,
.create-form-page.dark
.question-image-upload-button,
.create-form-page.dark
.question-image-preview {
    background: #172234;
}
/* =========================================================
   IMAGE UPLOAD MOBILE
========================================================= */
@media (max-width: 650px) {
    .question-image-upload-label {
        align-items: flex-start;
        flex-wrap: wrap;
    }
    .question-image-upload-content {
        min-width: calc(100% - 58px);
    }
    .question-image-upload-button {
        width: 100%;
        margin-left: 55px;
    }
    .question-image-preview-header {
        align-items: flex-start;
    }
    .remove-question-image-btn span {
        display: none;
    }
    .remove-question-image-btn {
        min-width: 34px;
        width: 34px;
        padding: 0;
    }
}
/* === EditForm.css === */
/* =========================================================
   EDIT FORM — HIDOCS
   Extends CreateForm.css so the edit page stays consistent.
========================================================= */

.edit-form-info-content {
  max-width: 980px;
  margin-left: auto;
  margin-right: auto;
}

.edit-form-information-note {
  width: 100%;
  margin-bottom: 22px;
  padding: 15px 16px;
  border: 1px solid #cfe1f5;
  border-radius: 14px;
  background: linear-gradient(145deg, #f4f9ff, #ffffff);
  display: flex;
  align-items: flex-start;
  gap: 11px;
}

.edit-form-information-note > svg {
  flex-shrink: 0;
  margin-top: 2px;
  color: #337bc1;
  font-size: 17px;
}

.edit-form-information-note > div {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.edit-form-information-note strong {
  color: #2b4058;
  font-size: 13px;
  font-weight: 700;
}

.edit-form-information-note span {
  color: #7f90a5;
  font-size: 11px;
  line-height: 1.6;
}

.edit-form-locked-info {
  width: 100%;
  min-height: 68px;
  margin-top: 16px;
  padding: 13px 15px;
  border: 1px solid #e1e8f0;
  border-radius: 13px;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.edit-form-locked-info > div {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.edit-form-locked-info span {
  color: #8796a9;
  font-size: 10px;
  font-weight: 600;
}

.edit-form-locked-info strong {
  max-width: 100%;
  color: #30445c;
  font-size: 12px;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.edit-form-locked-badge {
  min-height: 25px;
  padding: 0 9px;
  border-radius: 999px;
  background: #edf2f7;
  border: 1px solid #dde5ee;
  color: #77889d !important;
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  font-size: 9px !important;
  font-weight: 700 !important;
  text-transform: uppercase;
  letter-spacing: .5px;
}

.edit-form-state-page {
  width: 100%;
  min-height: 100vh;
  padding: 24px;
  background: #f3f6fb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Poppins", sans-serif;
}

.edit-form-state-card {
  width: min(440px, 100%);
  padding: 30px 24px;
  border: 1px solid #dfe7f0;
  border-radius: 20px;
  background: #ffffff;
  text-align: center;
  box-shadow: 0 18px 45px rgba(24, 51, 84, .10);
}

.edit-form-state-card > svg {
  margin-bottom: 13px;
  color: #347bc1;
  font-size: 34px;
}

.edit-form-state-card h2 {
  margin: 0 0 7px;
  color: #293e56;
  font-size: 22px;
}

.edit-form-state-card p {
  margin: 0;
  color: #8494a7;
  font-size: 12px;
  line-height: 1.6;
}

.edit-form-state-card button {
  min-width: 130px;
  height: 40px;
  margin-top: 18px;
  padding: 0 14px;
  border: none;
  border-radius: 10px;
  background: #256bb0;
  color: #ffffff;
  font-family: inherit;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}

.edit-form-loader {
  width: 34px;
  height: 34px;
  margin: 0 auto 15px;
  border: 3px solid #dbe8f5;
  border-top-color: #347bc1;
  border-radius: 50%;
  display: block;
  animation: edit-form-spin .8s linear infinite;
}

@keyframes edit-form-spin {
  to { transform: rotate(360deg); }
}

.create-form-page.dark .edit-form-information-note {
  background: linear-gradient(145deg, #1c2f45, #172234);
  border-color: #31506e;
}

.create-form-page.dark .edit-form-information-note strong,
.create-form-page.dark .edit-form-locked-info strong {
  color: #edf3fa;
}

.create-form-page.dark .edit-form-information-note span,
.create-form-page.dark .edit-form-locked-info span {
  color: #8fa0b4;
}

.create-form-page.dark .edit-form-locked-info {
  background: #1a2739;
  border-color: #2f4056;
}

.create-form-page.dark .edit-form-locked-badge {
  background: #263447;
  border-color: #34465c;
  color: #9aabbd !important;
}

.edit-form-state-page.dark {
  background: #0d1624;
}

.edit-form-state-page.dark .edit-form-state-card {
  background: #172234;
  border-color: #2c3b50;
}

.edit-form-state-page.dark .edit-form-state-card h2 {
  color: #edf3fa;
}

.edit-form-state-page.dark .edit-form-state-card p {
  color: #8fa0b4;
}

@media (max-width: 680px) {
  .edit-form-information-note,
  .edit-form-locked-info {
    border-radius: 12px;
  }

  .edit-form-locked-info {
    align-items: flex-start;
    flex-direction: column;
  }
}
`;
// =========================================================
// STORAGE KEYS
// =========================================================
const FORMS_STORAGE_KEY =
  "hidocs_forms";
const NEW_FORM_STORAGE_KEY =
  "hidocs_new_form";
// =========================================================
// IMAGE CONFIGURATION
// =========================================================
const MAXIMUM_IMAGE_SIZE =
  1 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
// =========================================================
// CREATE FORM
// =========================================================
function EditForm() {
  const navigate =
    useNavigate();
  const {
    id,
  } = useParams();
  const {
    darkMode,
  } = useContext(
    ThemeContext
  );
  // =========================================================
  // ACTIVE TAB
  // =========================================================
  const [
    activeTab,
    setActiveTab,
  ] = useState(
    "info"
  );
  const tabOrder = [
    "info",
    "settings",
    "questions",
  ];
  const activeTabIndex =
    tabOrder.indexOf(
      activeTab
    );
  const isFirstTab =
    activeTab ===
    "info";
  const isLastTab =
    activeTab ===
    "questions";
  // =========================================================
  // FORM DATA
  // =========================================================
  const [
    formData,
    setFormData,
  ] = useState({
    title: "",
    customLink: "",
    openDate: "",
    closeDate: "",
    openTime: "",
    closeTime: "",
    shuffleQuestions: false,
    shuffleAnswers: false,
    oneTimeOnly: true,
    activateImmediately: true,
    timerEnabled: true,
    timerDuration: 20,
    responseDays: 30,
    resultMode: "none",
    accessMode: "public",
  });
  // =========================================================
  // QUESTIONS
  // =========================================================
  const [
    questions,
    setQuestions,
  ] = useState([]);
  // =========================================================
  // EDIT FORM STATE
  // =========================================================
  const [
    originalForm,
    setOriginalForm,
  ] = useState(null);
  const [
    loadingForm,
    setLoadingForm,
  ] = useState(true);
  const [
    formNotFound,
    setFormNotFound,
  ] = useState(false);
  // =========================================================
  // LOAD EXISTING FORM
  // =========================================================
  useEffect(() => {
    try {
      const storedValue =
        localStorage.getItem(
          FORMS_STORAGE_KEY
        );
      const storedForms =
        storedValue
          ? JSON.parse(storedValue)
          : [];
      const safeForms =
        Array.isArray(storedForms)
          ? storedForms
          : [];
      const selectedForm =
        [...safeForms]
          .reverse()
          .find(
            (item) =>
              String(item.id) ===
              String(id)
          );
      if (!selectedForm) {
        setFormNotFound(true);
        setLoadingForm(false);
        return;
      }
      const settings =
        selectedForm.settings &&
        typeof selectedForm.settings === "object"
          ? selectedForm.settings
          : {};
      const timerObject =
        selectedForm.timer &&
        typeof selectedForm.timer === "object"
          ? selectedForm.timer
          : {};
      const timerEnabled =
        settings.timerEnabled ??
        settings.timer?.enabled ??
        selectedForm.timerEnabled ??
        timerObject.enabled ??
        false;
      const timerDuration =
        Number(
          settings.timerDuration ??
          settings.timer?.duration ??
          selectedForm.timerDuration ??
          timerObject.duration ??
          selectedForm.duration ??
          20
        ) || 20;
      const accessMode =
        settings.accessMode ||
        selectedForm.accessMode ||
        (selectedForm.qrOnly ? "qr-only" : "public");
      const loadedQuestions =
        Array.isArray(selectedForm.questions)
          ? selectedForm.questions.map(
              (question, index) => ({
                ...question,
                id:
                  question.id ??
                  `${selectedForm.id}-question-${index + 1}`,
                title:
                  String(
                    question.title ||
                    question.question ||
                    ""
                  ),
                required:
                  question.required !== false,
                scoring:
                  Boolean(
                    question.scoring ??
                    question.grading?.enabled
                  ),
                points:
                  Number(
                    question.points ??
                    question.grading?.points ??
                    1
                  ) || 1,
                correctAnswer:
                  String(
                    question.correctAnswer ??
                    question.grading?.correctAnswer ??
                    ""
                  ),
                options:
                  Array.isArray(question.options)
                    ? [...question.options]
                    : question.type === "yesno"
                    ? ["Yes", "No"]
                    : [],
                imageOptions:
                  Array.isArray(question.imageOptions)
                    ? [...question.imageOptions]
                    : [],
                imageAnswerType:
                  question.imageAnswerType ||
                  (question.type === "image"
                    ? "multiple"
                    : ""),
                ratingMax:
                  question.ratingMax ||
                  (question.type === "rating" ? 5 : null),
              })
            )
          : [];
      setOriginalForm(selectedForm);
      setFormData({
        title:
          String(selectedForm.title || ""),
        customLink:
          String(selectedForm.customLink || ""),
        openDate:
          selectedForm.openDate || "",
        closeDate:
          selectedForm.closeDate || "",
        openTime:
          selectedForm.openTime || "",
        closeTime:
          selectedForm.closeTime || "",
        shuffleQuestions:
          Boolean(settings.shuffleQuestions),
        shuffleAnswers:
          Boolean(settings.shuffleAnswers),
        oneTimeOnly:
          settings.oneTimeOnly !== false,
        activateImmediately:
          settings.activateImmediately !== false,
        timerEnabled:
          Boolean(timerEnabled),
        timerDuration,
        responseDays:
          Number(
            settings.responseDays ??
            selectedForm.responseDays ??
            30
          ) || 30,
        resultMode:
          settings.resultMode ||
          selectedForm.resultMode ||
          "none",
        accessMode,
      });
      setQuestions(loadedQuestions);
      setFormNotFound(false);
    } catch (error) {
      console.error(
        "Gagal memuat form untuk diedit:",
        error
      );
      setFormNotFound(true);
    } finally {
      setLoadingForm(false);
    }
  }, [id]);
  // =========================================================
  // RANDOM LINK FEEDBACK
  // =========================================================
  const [
    linkGenerated,
    setLinkGenerated,
  ] = useState(false);
  // =========================================================
  // SAFE STORAGE READER
  // =========================================================
  const getStoredForms =
    () => {
      try {
        const storedValue =
          localStorage.getItem(
            FORMS_STORAGE_KEY
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
          "Gagal membaca data form:",
          error
        );
        return [];
      }
    };
  // =========================================================
  // FORM CHANGE
  // =========================================================
  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;
    let updatedValue =
      type === "checkbox"
        ? checked
        : value;
    // Membuat custom link aman untuk URL.
    if (
      name ===
      "customLink"
    ) {
      updatedValue =
        String(
          value
        )
          .toLowerCase()
          .replace(
            /\s+/g,
            "-"
          )
          .replace(
            /[^a-z0-9-_]/g,
            ""
          )
          .replace(
            /-+/g,
            "-"
          )
          .replace(
            /^-/,
            ""
          );
    }
    // Timer hanya boleh 1–1000 menit.
    if (
      name ===
      "timerDuration"
    ) {
      if (
        value ===
        ""
      ) {
        updatedValue =
          "";
      } else {
        const numberValue =
          Number(
            value
          );
        updatedValue =
          Number.isFinite(
            numberValue
          )
            ? Math.min(
                Math.max(
                  Math.floor(
                    numberValue
                  ),
                  1
                ),
                1000
              )
            : 1;
      }
    }
    setFormData(
      (
        previous
      ) => ({
        ...previous,
        [name]:
          updatedValue,
      })
    );
    if (
      name ===
        "title" ||
      name ===
        "customLink"
    ) {
      setLinkGenerated(
        false
      );
    }
  };
  // =========================================================
  // TIMER INPUT BLUR
  // =========================================================
  const handleTimerBlur =
    () => {
      const duration =
        Number(
          formData.timerDuration
        );
      const normalizedDuration =
        Number.isFinite(
          duration
        )
          ? Math.min(
              Math.max(
                Math.floor(
                  duration
                ),
                1
              ),
              1000
            )
          : 1;
      setFormData(
        (
          previous
        ) => ({
          ...previous,
          timerDuration:
            normalizedDuration,
        })
      );
    };
  // =========================================================
  // LINK HELPERS
  // =========================================================
  const createLinkSlug = (
    value
  ) => {
    return String(
      value ||
      ""
    )
      .trim()
      .toLowerCase()
      .normalize(
        "NFD"
      )
      .replace(
        /[\u0300-\u036f]/g,
        ""
      )
      .replace(
        /[^a-z0-9\s-]/g,
        ""
      )
      .replace(
        /\s+/g,
        "-"
      )
      .replace(
        /-+/g,
        "-"
      )
      .replace(
        /^-|-$/g,
        ""
      );
  };
  const createRandomCode =
    () => {
      return Math.random()
        .toString(
          36
        )
        .slice(
          2,
          7
        )
        .toLowerCase();
    };
  const isCustomLinkUsed = (
    customLink
  ) => {
    const storedForms =
      getStoredForms();
    return storedForms.some(
      (
        form
      ) => {
        return (
          String(
            form.customLink ||
            ""
          )
            .trim()
            .toLowerCase() ===
          String(
            customLink ||
            ""
          )
            .trim()
            .toLowerCase()
        );
      }
    );
  };
  const generateRandomLink =
    () => {
      const titleSlug =
        createLinkSlug(
          formData.title
        );
      if (!titleSlug) {
        alert(
          "Isi Form Title terlebih dahulu agar link dapat dibuat otomatis."
        );
        return;
      }
      let generatedLink =
        "";
      let attempt =
        0;
      do {
        generatedLink =
          `${titleSlug}-${createRandomCode()}`;
        attempt +=
          1;
      } while (
        isCustomLinkUsed(
          generatedLink
        ) &&
        attempt <
          20
      );
      if (
        isCustomLinkUsed(
          generatedLink
        )
      ) {
        alert(
          "Link otomatis gagal dibuat. Silakan coba kembali."
        );
        return;
      }
      setFormData(
        (
          previous
        ) => ({
          ...previous,
          customLink:
            generatedLink,
        })
      );
      setLinkGenerated(
        true
      );
      window.setTimeout(
        () => {
          setLinkGenerated(
            false
          );
        },
        1800
      );
    };
  // =========================================================
  // QUESTION TYPES
  // =========================================================
  const questionTypes = [
    {
      type: "multiple",
      label: "Multiple Choice",
      icon:
        <FaListUl />,
      className: "yellow",
    },
    {
      type: "short",
      label: "Short Text",
      icon:
        <FaFont />,
      className: "green",
    },
    {
      type: "long",
      label: "Long Text",
      icon:
        <FaAlignLeft />,
      className: "blue",
    },
    {
      type: "rating",
      label: "Rating",
      icon:
        <FaStar />,
      className: "orange",
    },
    {
      type: "yesno",
      label: "Yes / No",
      icon:
        <FaCheck />,
      className: "green",
    },
    {
      type: "math",
      label: "Math",
      icon:
        <FaCalculator />,
      className: "blue",
    },
    {
      type: "code",
      label: "Code",
      icon:
        <FaCode />,
      className: "orange",
    },
    {
      type: "image",
      label: "Image",
      icon:
        <FaImage />,
      className: "green",
    },
  ];
  // =========================================================
  // CREATE QUESTION
  // =========================================================
  const createQuestion = (type) => {
  const newQuestion = {
    id: Date.now() + Math.random(),
    title: "",
    type,
    required: true,
    // Penilaian internal admin.
    // Tidak bergantung pada resultMode user.
    scoring: false,
    points: 1,
    correctAnswer: "",
    options:
      type === "multiple"
        ? ["", ""]
        : type === "yesno"
        ? ["Yes", "No"]
        : [],
    ratingMax:
      type === "rating"
        ? 5
        : null,
    image: "",
    imageName: "",
    imageAnswerType:
      type === "image"
        ? "multiple"
        : "",
    imageOptions:
      type === "image"
        ? ["", ""]
        : [],
  };
  setQuestions((previous) => [
    ...previous,
    newQuestion,
  ]);
  window.setTimeout(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  }, 100);
};
  // =========================================================
  // UPDATE QUESTION
  // =========================================================
  const updateQuestion = (
    id,
    field,
    value
  ) => {
    setQuestions(
      (
        previous
      ) =>
        previous.map(
          (
            question
          ) =>
            question.id ===
            id
              ? {
                  ...question,
                  [field]:
                    value,
                }
              : question
        )
    );
  };
  // =========================================================
  // UPDATE OPTION
  // =========================================================
  const updateOption = (
    questionId,
    optionIndex,
    value
  ) => {
    setQuestions(
      (
        previous
      ) =>
        previous.map(
          (
            question
          ) => {
            if (
              question.id !==
              questionId
            ) {
              return question;
            }
            const updatedOptions = [
              ...(
                question.options ||
                []
              ),
            ];
            const previousOption =
              updatedOptions[
                optionIndex
              ];
            updatedOptions[
              optionIndex
            ] =
              value;
            return {
              ...question,
              options:
                updatedOptions,
              correctAnswer:
                question.correctAnswer ===
                previousOption
                  ? value
                  : question.correctAnswer,
            };
          }
        )
    );
  };
  // =========================================================
  // ADD OPTION
  // =========================================================
  const addOption = (
    questionId
  ) => {
    setQuestions(
      (
        previous
      ) =>
        previous.map(
          (
            question
          ) => {
            if (
              question.id !==
              questionId
            ) {
              return question;
            }
            return {
              ...question,
              options: [
                ...(
                  question.options ||
                  []
                ),
                "",
              ],
            };
          }
        )
    );
  };
  // =========================================================
  // DELETE OPTION
  // =========================================================
  const deleteOption = (
    questionId,
    optionIndex
  ) => {
    setQuestions(
      (
        previous
      ) =>
        previous.map(
          (
            question
          ) => {
            if (
              question.id !==
              questionId
            ) {
              return question;
            }
            const updatedOptions = [
              ...(
                question.options ||
                []
              ),
            ];
            if (
              updatedOptions.length <=
              2
            ) {
              return question;
            }
            const deletedOption =
              updatedOptions[
                optionIndex
              ];
            updatedOptions.splice(
              optionIndex,
              1
            );
            return {
              ...question,
              options:
                updatedOptions,
              correctAnswer:
                question.correctAnswer ===
                deletedOption
                  ? ""
                  : question.correctAnswer,
            };
          }
        )
    );
  };
  // =========================================================
  // IMAGE ANSWER OPTIONS
  // =========================================================
  const changeImageAnswerType = (
    questionId,
    answerType
  ) => {
    setQuestions(
      (
        previous
      ) =>
        previous.map(
          (
            question
          ) => {
            if (
              question.id !==
              questionId
            ) {
              return question;
            }
            return {
              ...question,
              imageAnswerType:
                answerType,
              imageOptions:
                answerType ===
                "multiple"
                  ? (
                      Array.isArray(
                        question.imageOptions
                      ) &&
                      question.imageOptions.length >= 2
                        ? question.imageOptions
                        : [
                            "",
                            "",
                          ]
                    )
                  : [],
              // Reset key because the answer format changed.
              correctAnswer: "",
            };
          }
        )
    );
  };
  const updateImageOption = (
    questionId,
    optionIndex,
    value
  ) => {
    setQuestions(
      (
        previous
      ) =>
        previous.map(
          (
            question
          ) => {
            if (
              question.id !==
              questionId
            ) {
              return question;
            }
            const updatedOptions = [
              ...(
                question.imageOptions ||
                []
              ),
            ];
            const previousOption =
              updatedOptions[
                optionIndex
              ];
            updatedOptions[
              optionIndex
            ] =
              value;
            return {
              ...question,
              imageOptions:
                updatedOptions,
              correctAnswer:
                question.correctAnswer ===
                previousOption
                  ? value
                  : question.correctAnswer,
            };
          }
        )
    );
  };
  const addImageOption = (
    questionId
  ) => {
    setQuestions(
      (
        previous
      ) =>
        previous.map(
          (
            question
          ) =>
            question.id ===
            questionId
              ? {
                  ...question,
                  imageOptions: [
                    ...(
                      question.imageOptions ||
                      []
                    ),
                    "",
                  ],
                }
              : question
        )
    );
  };
  const deleteImageOption = (
    questionId,
    optionIndex
  ) => {
    setQuestions(
      (
        previous
      ) =>
        previous.map(
          (
            question
          ) => {
            if (
              question.id !==
              questionId
            ) {
              return question;
            }
            const updatedOptions = [
              ...(
                question.imageOptions ||
                []
              ),
            ];
            if (
              updatedOptions.length <=
              2
            ) {
              return question;
            }
            const deletedOption =
              updatedOptions[
                optionIndex
              ];
            updatedOptions.splice(
              optionIndex,
              1
            );
            return {
              ...question,
              imageOptions:
                updatedOptions,
              correctAnswer:
                question.correctAnswer ===
                deletedOption
                  ? ""
                  : question.correctAnswer,
            };
          }
        )
    );
  };
  // =========================================================
  // DUPLICATE QUESTION
  // =========================================================
  const duplicateQuestion = (
    id
  ) => {
    setQuestions(
      (
        previous
      ) => {
        const questionIndex =
          previous.findIndex(
            (
              question
            ) =>
              question.id ===
              id
          );
        if (
          questionIndex ===
          -1
        ) {
          return previous;
        }
        const original =
          previous[
            questionIndex
          ];
        const duplicated = {
          ...original,
          id:
            Date.now() +
            Math.random(),
          options: [
            ...(
              original.options ||
              []
            ),
          ],
          imageOptions: [
            ...(
              original.imageOptions ||
              []
            ),
          ],
        };
        const updated = [
          ...previous,
        ];
        updated.splice(
          questionIndex +
            1,
          0,
          duplicated
        );
        return updated;
      }
    );
  };
  // =========================================================
  // DELETE QUESTION
  // =========================================================
  const deleteQuestion = (
    id
  ) => {
    const confirmed =
      window.confirm(
        "Hapus pertanyaan ini?"
      );
    if (!confirmed) {
      return;
    }
    setQuestions(
      (
        previous
      ) =>
        previous.filter(
          (
            question
          ) =>
            question.id !==
            id
        )
    );
  };
  // =========================================================
  // CHANGE QUESTION TYPE
  // =========================================================
  const changeQuestionType = (
    id,
    type
  ) => {
    setQuestions(
      (
        previous
      ) =>
        previous.map(
          (
            question
          ) => {
            if (
              question.id !==
              id
            ) {
              return question;
            }
            return {
              ...question,
              type,
              options:
                type ===
                "multiple"
                  ? [
                      "",
                      "",
                    ]
                  : type ===
                    "yesno"
                  ? [
                      "Yes",
                      "No",
                    ]
                  : [],
              ratingMax:
                type ===
                "rating"
                  ? 5
                  : null,
              image:
                type ===
                "image"
                  ? question.image ||
                    ""
                  : "",
              imageName:
                type ===
                "image"
                  ? question.imageName ||
                    ""
                  : "",
              imageAnswerType:
                type ===
                "image"
                  ? question.imageAnswerType ||
                    "multiple"
                  : "",
              imageOptions:
                type ===
                "image"
                  ? (
                      Array.isArray(
                        question.imageOptions
                      ) &&
                      question.imageOptions.length >= 2
                        ? question.imageOptions
                        : [
                            "",
                            "",
                          ]
                    )
                  : [],
              // Jangan membawa kunci jawaban dari tipe lama.
              correctAnswer: "",
            };
          }
        )
    );
  };
  // =========================================================
  // QUESTION IMAGE UPLOAD
  // =========================================================
  const handleQuestionImageUpload = (
    questionId,
    event
  ) => {
    const file =
      event.target.files?.[0];
    if (!file) {
      return;
    }
    if (
      !ALLOWED_IMAGE_TYPES.includes(
        file.type
      )
    ) {
      alert(
        "Format gambar harus JPG, JPEG, PNG, atau WEBP."
      );
      event.target.value =
        "";
      return;
    }
    if (
      file.size >
      MAXIMUM_IMAGE_SIZE
    ) {
      alert(
        "Ukuran gambar maksimal 1 MB. Silakan kompres gambar terlebih dahulu."
      );
      event.target.value =
        "";
      return;
    }
    const fileReader =
      new FileReader();
    fileReader.onload =
      () => {
        const imageResult =
          String(
            fileReader.result ||
            ""
          );
        setQuestions(
          (
            previous
          ) =>
            previous.map(
              (
                question
              ) => {
                if (
                  question.id !==
                  questionId
                ) {
                  return question;
                }
                return {
                  ...question,
                  image:
                    imageResult,
                  imageName:
                    file.name,
                };
              }
            )
        );
      };
    fileReader.onerror =
      () => {
        alert(
          "Gambar gagal dibaca. Silakan pilih gambar lain."
        );
      };
    fileReader.readAsDataURL(
      file
    );
  };
  // =========================================================
  // REMOVE QUESTION IMAGE
  // =========================================================
  const removeQuestionImage = (
    questionId
  ) => {
    setQuestions(
      (
        previous
      ) =>
        previous.map(
          (
            question
          ) => {
            if (
              question.id !==
              questionId
            ) {
              return question;
            }
            return {
              ...question,
              image: "",
              imageName: "",
            };
          }
        )
    );
  };
  // =========================================================
  // SCHEDULE HELPERS
  // =========================================================
  const buildScheduleDateTime = (
    dateValue,
    timeValue,
    defaultTime
  ) => {
    if (!dateValue) {
      return "";
    }
    const safeTime =
      timeValue ||
      defaultTime;
    return `${dateValue}T${safeTime}:00`;
  };
  const getScheduleValues =
    () => {
      const openAt =
        buildScheduleDateTime(
          formData.openDate,
          formData.openTime,
          "00:00"
        );
      const closeAt =
        buildScheduleDateTime(
          formData.closeDate,
          formData.closeTime,
          "23:59"
        );
      return {
        enabled:
          Boolean(
            openAt ||
            closeAt
          ),
        openAt,
        closeAt,
      };
    };
  // =========================================================
  // VALIDATE INFO
  // =========================================================
  const validateInfo =
    () => {
      const cleanTitle =
        formData.title.trim();
      if (!cleanTitle) {
        alert("Silakan isi Form Title terlebih dahulu.");
        setActiveTab("info");
        return false;
      }
      if (cleanTitle.length < 3) {
        alert("Form Title minimal 3 karakter.");
        setActiveTab("info");
        return false;
      }
      return true;
    };
  // =========================================================
  // VALIDATE SETTINGS
  // =========================================================
  const validateSettings =
    () => {
      if (!formData.timerEnabled) {
        return true;
      }
      const timerDuration =
        Number(formData.timerDuration);
      if (
        !Number.isFinite(timerDuration) ||
        timerDuration < 1 ||
        timerDuration > 1000
      ) {
        alert("Durasi timer harus antara 1 sampai 1000 menit.");
        setActiveTab("settings");
        return false;
      }
      return true;
    };
  // =========================================================
  // VALIDATE QUESTIONS
  // =========================================================
  const validateQuestions =
    () => {
      if (
        questions.length ===
        0
      ) {
        alert(
          "Tambahkan minimal satu pertanyaan."
        );
        setActiveTab(
          "questions"
        );
        return false;
      }
      const emptyQuestionIndex =
        questions.findIndex(
          (
            question
          ) =>
            !String(
              question.title ||
              ""
            ).trim()
        );
      if (
        emptyQuestionIndex !==
        -1
      ) {
        alert(
          `Judul pertanyaan nomor ${
            emptyQuestionIndex +
            1
          } belum diisi.`
        );
        setActiveTab(
          "questions"
        );
        return false;
      }
      const invalidMultipleIndex =
        questions.findIndex(
          (
            question
          ) => {
            if (
              question.type !==
              "multiple"
            ) {
              return false;
            }
            return (
              !Array.isArray(
                question.options
              ) ||
              question.options.length <
                2 ||
              question.options.some(
                (
                  option
                ) =>
                  !String(
                    option ||
                    ""
                  ).trim()
              )
            );
          }
        );
      if (
        invalidMultipleIndex !==
        -1
      ) {
        alert(
          `Semua pilihan jawaban pada pertanyaan nomor ${
            invalidMultipleIndex +
            1
          } harus diisi.`
        );
        setActiveTab(
          "questions"
        );
        return false;
      }
      const invalidImageIndex =
        questions.findIndex(
          (
            question
          ) => {
            return (
              question.type ===
                "image" &&
              !String(
                question.image ||
                ""
              ).trim()
            );
          }
        );
      if (
        invalidImageIndex !==
        -1
      ) {
        alert(
          `Gambar pada pertanyaan nomor ${
            invalidImageIndex +
            1
          } belum dipilih.`
        );
        setActiveTab(
          "questions"
        );
        return false;
      }
      const invalidImageOptionsIndex =
        questions.findIndex(
          (
            question
          ) => {
            if (
              question.type !==
                "image" ||
              question.imageAnswerType !==
                "multiple"
            ) {
              return false;
            }
            return (
              !Array.isArray(
                question.imageOptions
              ) ||
              question.imageOptions.length <
                2 ||
              question.imageOptions.some(
                (
                  option
                ) =>
                  !String(
                    option ||
                    ""
                  ).trim()
              )
            );
          }
        );
      if (
        invalidImageOptionsIndex !==
        -1
      ) {
        alert(
          `Semua pilihan jawaban gambar pada pertanyaan nomor ${
            invalidImageOptionsIndex +
            1
          } harus diisi.`
        );
        setActiveTab(
          "questions"
        );
        return false;
      }
      const invalidScoringIndex =
        questions.findIndex(
          (
            question
          ) => {
            if (
              !question.scoring
            ) {
              return false;
            }
            const points =
              Number(
                question.points
              );
            return (
              !Number.isFinite(
                points
              ) ||
              points <=
                0 ||
              !String(
                question.correctAnswer ??
                ""
              ).trim()
            );
          }
        );
      if (
        invalidScoringIndex !==
        -1
      ) {
        alert(
          `Pertanyaan nomor ${
            invalidScoringIndex +
            1
          } memakai scoring. Isi poin dan kunci jawaban terlebih dahulu.`
        );
        setActiveTab(
          "questions"
        );
        return false;
      }
      /*
        IMPORTANT:
        Scoring is an internal grading feature for admin.
        resultMode only controls what respondents can see:
        - none   = respondent cannot view result/score
        - result = respondent can review submitted answers only
        - score  = respondent can review answers + correctness + score
        Therefore scoring can remain enabled even when resultMode
        is "none" or "result".
      */
      return true;
    };
  // =========================================================
  // TAB NAVIGATION
  // =========================================================
  const changeTab = (
    tab
  ) => {
    if (
      tab ===
      "info"
    ) {
      setActiveTab(
        "info"
      );
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }
    if (
      !validateInfo()
    ) {
      return;
    }
    if (
      tab ===
        "questions" &&
      !validateSettings()
    ) {
      return;
    }
    setActiveTab(
      tab
    );
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const handleNextStep =
    () => {
      if (
        activeTab ===
          "info" &&
        !validateInfo()
      ) {
        return;
      }
      if (
        activeTab ===
          "settings" &&
        !validateSettings()
      ) {
        return;
      }
      if (
        activeTabIndex <
        tabOrder.length -
          1
      ) {
        setActiveTab(
          tabOrder[
            activeTabIndex +
              1
          ]
        );
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    };
  const handlePreviousStep =
    () => {
      if (
        activeTabIndex <=
        0
      ) {
        return;
      }
      setActiveTab(
        tabOrder[
          activeTabIndex -
            1
        ]
      );
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };
  // =========================================================
  // SAVE CHANGES
  // =========================================================
  const handleSave =
    () => {
      if (
        !validateInfo() ||
        !validateSettings() ||
        !validateQuestions()
      ) {
        return;
      }
      if (!originalForm) {
        alert("Data form tidak ditemukan.");
        return;
      }
      const normalizedTimerDuration =
        formData.timerEnabled
          ? Math.min(
              Math.max(
                Math.floor(
                  Number(formData.timerDuration) || 1
                ),
                1
              ),
              1000
            )
          : null;
      const responseDays =
        Number(formData.responseDays) || 30;
      const isPublicForm =
        formData.accessMode === "public";
      const normalizedQuestions =
        questions.map((question, index) => {
          const scoringEnabled =
            Boolean(question.scoring);
          const normalizedPoints =
            scoringEnabled
              ? Math.max(
                  Number(question.points) || 1,
                  1
                )
              : 0;
          const normalizedCorrectAnswer =
            scoringEnabled
              ? String(
                  question.correctAnswer ?? ""
                ).trim()
              : "";
          const normalizedOptions =
            (
              question.type === "image" &&
              question.imageAnswerType === "multiple"
                ? question.imageOptions || []
                : question.type === "yesno"
                ? (
                    Array.isArray(question.options) &&
                    question.options.length
                      ? question.options
                      : ["Yes", "No"]
                  )
                : question.options || []
            ).map((option) =>
              String(option || "").trim()
            );
          return {
            ...question,
            number: index + 1,
            title:
              String(question.title || "").trim(),
            question:
              String(question.title || "").trim(),
            required:
              question.required !== false,
            scoring:
              scoringEnabled,
            points:
              normalizedPoints,
            correctAnswer:
              normalizedCorrectAnswer,
            grading: {
              enabled: scoringEnabled,
              points: normalizedPoints,
              correctAnswer: normalizedCorrectAnswer,
            },
            options:
              normalizedOptions,
            imageAnswerType:
              question.type === "image"
                ? question.imageAnswerType || "multiple"
                : "",
            imageOptions:
              question.type === "image" &&
              question.imageAnswerType === "multiple"
                ? (question.imageOptions || []).map(
                    (option) =>
                      String(option || "").trim()
                  )
                : [],
            image:
              String(question.image || "").trim(),
            imageName:
              String(question.imageName || "").trim(),
          };
        });
      const gradingEnabled =
        normalizedQuestions.some(
          (question) => question.scoring
        );
      const updatedForm = {
        ...originalForm,
        // Bagian yang boleh diubah dari Edit Form.
        title:
          formData.title.trim(),
        accessMode:
          formData.accessMode,
        showInUserList:
          isPublicForm,
        qrOnly:
          !isPublicForm,
        timerEnabled:
          Boolean(formData.timerEnabled),
        timerDuration:
          normalizedTimerDuration,
        duration:
          normalizedTimerDuration,
        timer: {
          ...(
            originalForm.timer &&
            typeof originalForm.timer === "object"
              ? originalForm.timer
              : {}
          ),
          enabled:
            Boolean(formData.timerEnabled),
          mode: "custom",
          duration:
            normalizedTimerDuration,
        },
        responseDays,
        settings: {
          ...(
            originalForm.settings &&
            typeof originalForm.settings === "object"
              ? originalForm.settings
              : {}
          ),
          shuffleQuestions:
            Boolean(formData.shuffleQuestions),
          shuffleAnswers:
            Boolean(formData.shuffleAnswers),
          oneTimeOnly:
            Boolean(formData.oneTimeOnly),
          activateImmediately:
            Boolean(formData.activateImmediately),
          timerEnabled:
            Boolean(formData.timerEnabled),
          timerDuration:
            normalizedTimerDuration,
          timer: {
            ...(
              originalForm.settings?.timer &&
              typeof originalForm.settings.timer === "object"
                ? originalForm.settings.timer
                : {}
            ),
            enabled:
              Boolean(formData.timerEnabled),
            mode: "custom",
            duration:
              normalizedTimerDuration,
          },
          responseDays,
          resultMode:
            formData.resultMode,
          accessMode:
            formData.accessMode,
          showInUserList:
            isPublicForm,
          qrOnly:
            !isPublicForm,
        },
        resultMode:
          formData.resultMode,
        grading: {
          ...(
            originalForm.grading &&
            typeof originalForm.grading === "object"
              ? originalForm.grading
              : {}
          ),
          enabled:
            gradingEnabled,
          scoredQuestions:
            normalizedQuestions.filter(
              (question) => question.scoring
            ).length,
          totalPoints:
            normalizedQuestions.reduce(
              (total, question) =>
                total +
                (question.scoring
                  ? Number(question.points) || 0
                  : 0),
              0
            ),
          calculateForAdmin: true,
          userResultMode:
            formData.resultMode,
        },
        questions:
          normalizedQuestions,
        // ID, link, customLink, createdAt, responses, dan schedule
        // sengaja tidak diubah karena diambil dari originalForm.
        updatedAt:
          new Date().toISOString(),
      };
      try {
        const existingForms =
          getStoredForms();
        const formIndex =
          existingForms.findIndex(
            (item) =>
              String(item.id) ===
              String(id)
          );
        if (formIndex === -1) {
          alert("Form tidak ditemukan di penyimpanan.");
          return;
        }
        const updatedForms =
          existingForms.map((item) =>
            String(item.id) === String(id)
              ? updatedForm
              : item
          );
        localStorage.setItem(
          FORMS_STORAGE_KEY,
          JSON.stringify(updatedForms)
        );
        localStorage.setItem(
          NEW_FORM_STORAGE_KEY,
          JSON.stringify(updatedForm)
        );
        window.dispatchEvent(
          new CustomEvent(
            "hidocs-forms-updated",
            {
              detail: {
                formId: updatedForm.id,
                type: "form-edited",
              },
            }
          )
        );
        alert("Perubahan form berhasil disimpan.");
        navigate(
          `/admin/forms/${id}`,
          { replace: true }
        );
      } catch (error) {
        console.error(
          "Gagal menyimpan perubahan form:",
          error
        );
        if (error?.name === "QuotaExceededError") {
          alert(
            "Perubahan gagal disimpan karena kapasitas penyimpanan browser penuh."
          );
        } else {
          alert("Perubahan form gagal disimpan.");
        }
      }
    };
  // =========================================================
  // INFO TAB
  // =========================================================
  const renderInfoTab =
    () => (
      <div className="create-form-content edit-form-info-content">
        <section className="create-section">
          <div className="create-section-title">
            <div className="create-section-icon">
              <FaInfoCircle />
            </div>
            <div>
              <span>Step 1</span>
              <h2>Basic Information</h2>
            </div>
          </div>
          <div className="edit-form-information-note">
            <FaInfoCircle />
            <div>
              <strong>Edit form title</strong>
              <span>
                Custom link dan jadwal buka/tutup tetap dipertahankan.
                Jadwal dapat diubah dari Form Details.
              </span>
            </div>
          </div>
          <div className="create-field">
            <label htmlFor="form-title">
              Form Title
              <span>*</span>
            </label>
            <div className="create-input-wrapper">
              <FaInfoCircle />
              <input
                id="form-title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Form title"
                maxLength={100}
              />
            </div>
          </div>
          <div className="edit-form-locked-info">
            <div>
              <span>Form Link</span>
              <strong>
                hidocs.app/r/{formData.customLink || "-"}
              </strong>
            </div>
            <span className="edit-form-locked-badge">
              Locked
            </span>
          </div>
        </section>
      </div>
    );
  // =========================================================
  // TOGGLE COMPONENT
  // =========================================================
  const renderToggle = (
    name,
    icon,
    title,
    description
  ) => (
    <label className="setting-option">
      <div className="setting-option-icon">
        {icon}
      </div>
      <div className="setting-option-content">
        <strong>
          {title}
        </strong>
        <span>
          {description}
        </span>
      </div>
      <input
        type="checkbox"
        name={name}
        checked={
          Boolean(
            formData[name]
          )
        }
        onChange={
          handleChange
        }
      />
      <span className="toggle-switch">
        <span className="toggle-circle"></span>
      </span>
    </label>
  );
  // =========================================================
  // VISIBILITY SETTINGS
  // =========================================================
  const renderVisibilitySettings =
    () => (
      <section className="settings-section">
        <div className="settings-section-title">
          <div className="settings-title-icon blue">
            <FaGlobe />
          </div>
          <div>
            <small>
              Distribution
            </small>
            <span>
              Form Visibility
            </span>
          </div>
        </div>
        <div className="visibility-options">
          {[
            {
              value: "public",
              icon:
                <FaGlobe />,
              iconClass: "public",
              title: "Public Form",
              description: "The form automatically appears on the user dashboard and Forms page.",
              information: "Suitable for forms that should be visible to every user.",
            },
            {
              value: "qr-only",
              icon:
                <FaQrcode />,
              iconClass: "qr",
              title: "QR Code Only",
              description: "The form stays hidden and can only be opened using its QR code or direct link.",
              information: "Suitable for private events or limited participants.",
            },
          ].map(
            (
              item
            ) => (
              <label
                key={
                  item.value
                }
                className={
                  formData.accessMode ===
                  item.value
                    ? `visibility-option ${
                        item.value ===
                        "qr-only"
                          ? "qr-only "
                          : ""
                      }selected`
                    : `visibility-option ${
                        item.value ===
                        "qr-only"
                          ? "qr-only"
                          : ""
                      }`
                }
              >
                <div
                  className={
                    `visibility-option-icon ${item.iconClass}`
                  }
                >
                  {item.icon}
                </div>
                <div className="visibility-option-content">
                  <strong>
                    {item.title}
                  </strong>
                  <span>
                    {item.description}
                  </span>
                  <small>
                    {item.information}
                  </small>
                </div>
                <input
                  type="radio"
                  name="accessMode"
                  value={
                    item.value
                  }
                  checked={
                    formData.accessMode ===
                    item.value
                  }
                  onChange={
                    handleChange
                  }
                />
                <span className="visibility-radio">
                  <span></span>
                </span>
              </label>
            )
          )}
        </div>
        <div
          className={
            formData.accessMode ===
            "qr-only"
              ? "visibility-information qr"
              : "visibility-information public"
          }
        >
          {formData.accessMode ===
          "qr-only" ? (
            <>
              <FaQrcode />
              <div>
                <strong>
                  QR Code access enabled
                </strong>
                <span>
                  This form will not appear automatically in user lists, but remains accessible through QR and custom link.
                </span>
              </div>
            </>
          ) : (
            <>
              <FaGlobe />
              <div>
                <strong>
                  Public distribution enabled
                </strong>
                <span>
                  This form will automatically appear to users when the form is active.
                </span>
              </div>
            </>
          )}
        </div>
      </section>
    );
  // =========================================================
  // SETTINGS TAB
  // =========================================================
  const renderSettingsTab =
    () => (
      <div className="settings-page">
        <section className="settings-section">
          <div className="settings-section-title">
            <div className="settings-title-icon blue">
              <FaCog />
            </div>
            <div>
              <small>
                Step 2
              </small>
              <span>
                Form Options
              </span>
            </div>
          </div>
          {renderToggle(
            "shuffleQuestions",
            <FaRandom />,
            "Shuffle question order",
            "Each respondent gets a different question order."
          )}
          {renderToggle(
            "shuffleAnswers",
            <FaRandom />,
            "Shuffle answer options",
            "Answer options are randomized for every respondent."
          )}
          {renderToggle(
            "oneTimeOnly",
            <FaLock />,
            "One-time submission only",
            "Respondents cannot submit the same form more than once."
          )}
          {renderToggle(
            "activateImmediately",
            <FaPowerOff />,
            "Activate immediately",
            "The form becomes active immediately or after its opening schedule."
          )}
        </section>
        <section className="settings-section">
          <div className="settings-section-title">
            <div className="settings-title-icon blue">
              <FaClock />
            </div>
            <div>
              <small>
                Time Limit
              </small>
              <span>
                Response Timer
              </span>
            </div>
          </div>
          {renderToggle(
            "timerEnabled",
            <FaHourglassHalf />,
            "Enable response timer",
            "Automatically end the form when the respondent runs out of time."
          )}
          <div
            className={
              formData.timerEnabled
                ? "response-timer-duration"
                : "response-timer-duration disabled"
            }
          >
            <div className="response-timer-duration-icon">
              <FaClock />
            </div>
            <div className="response-timer-duration-content">
              <strong>
                Time limit per response
              </strong>
              <span>
                Set the working time between 1 and 1000 minutes.
              </span>
            </div>
            <div className="response-timer-input-wrapper">
              <input
                type="number"
                name="timerDuration"
                min="1"
                max="1000"
                step="1"
                value={
                  formData.timerDuration
                }
                onChange={
                  handleChange
                }
                onBlur={
                  handleTimerBlur
                }
                disabled={
                  !formData.timerEnabled
                }
              />
              <span>
                minutes
              </span>
            </div>
          </div>
          <div
            className={
              formData.timerEnabled
                ? "response-timer-information active"
                : "response-timer-information"
            }
          >
            <FaHourglassHalf />
            <div>
              <strong>
                {formData.timerEnabled
                  ? `${formData.timerDuration || 1} minute timer enabled`
                  : "Timer is disabled"
                }
              </strong>
              <span>
                {formData.timerEnabled
                  ? "When time runs out, the form will close automatically and the attempt can be recorded as Time Expired."
                  : "Respondents can complete the form without a countdown."
                }
              </span>
            </div>
          </div>
          <div className="timer-card">
            <div className="timer-card-icon">
              <FaCalendarAlt />
            </div>
            <div className="timer-card-content">
              <strong>
                Response availability
              </strong>
              <span>
                The form can receive responses for{" "}
                {formData.responseDays} days.
              </span>
            </div>
            <div className="timer-card-select">
              <select
                name="responseDays"
                value={
                  formData.responseDays
                }
                onChange={
                  handleChange
                }
              >
                <option value="7">
                  7 days
                </option>
                <option value="14">
                  14 days
                </option>
                <option value="30">
                  30 days
                </option>
                <option value="60">
                  60 days
                </option>
                <option value="90">
                  90 days
                </option>
              </select>
            </div>
          </div>
        </section>
        {renderVisibilitySettings()}
        <section className="settings-section">
          <div className="settings-section-title">
            <div className="settings-title-icon blue">
              <FaChartBar />
            </div>
            <div>
              <small>
                Submission
              </small>
              <span>
                Result &amp; Score
              </span>
            </div>
          </div>
          {[
            {
              value: "none",
              icon:
                <FaEyeSlash />,
              title: "Do not show results",
              description: "Respondents cannot see their result or score.",
            },
            {
              value: "result",
              icon:
                <FaEye />,
              title: "Show result only",
              description: "Respondents can see the result without the score.",
            },
            {
              value: "score",
              icon:
                <FaTrophy />,
              title: "Show result and score",
              description: "Respondents can see both their result and final score.",
            },
          ].map(
            (
              item
            ) => (
              <label
                key={
                  item.value
                }
                className={
                  formData.resultMode ===
                  item.value
                    ? "result-option selected"
                    : "result-option"
                }
              >
                <div className="result-icon">
                  {item.icon}
                </div>
                <div className="result-content">
                  <strong>
                    {item.title}
                  </strong>
                  <span>
                    {item.description}
                  </span>
                </div>
                <input
                  type="radio"
                  name="resultMode"
                  value={
                    item.value
                  }
                  checked={
                    formData.resultMode ===
                    item.value
                  }
                  onChange={
                    handleChange
                  }
                />
              </label>
            )
          )}
        </section>
      </div>
    );
  // =========================================================
  // QUESTION HELPERS
  // =========================================================
  const getQuestionTypeLabel = (
    type
  ) => {
    return (
      questionTypes.find(
        (
          item
        ) =>
          item.type ===
          type
      )?.label ||
      "Question"
    );
  };
  const getQuestionTypeIcon = (
    type
  ) => {
    return (
      questionTypes.find(
        (
          item
        ) =>
          item.type ===
          type
      )?.icon ||
      <FaQuestionCircle />
    );
  };
  // =========================================================
  // QUESTION BODY
  // =========================================================
  const renderQuestionBody = (
    question
  ) => {
    if (
      question.type ===
      "multiple"
    ) {
      return (
        <div className="question-options-area">
          <div className="answer-options-header">
            <span>
              Answer Options
            </span>
            <small>
              {
                (
                  question.options ||
                  []
                ).length
              } options
            </small>
          </div>
          <div className="answer-options-list">
            {(
              question.options ||
              []
            ).map(
              (
                option,
                index
              ) => (
                <div
                  className="answer-option-row"
                  key={
                    `${question.id}-${index}`
                  }
                >
                  <span className="answer-radio">
                    <FaCircle />
                  </span>
                  <input
                    type="text"
                    value={
                      option
                    }
                    onChange={(event) =>
                      updateOption(
                        question.id,
                        index,
                        event.target.value
                      )
                    }
                    placeholder={
                      `Option ${index + 1}`
                    }
                  />
                  {question.options
                    .length >
                    2 && (
                    <button
                      type="button"
                      className="remove-option-btn"
                      onClick={() =>
                        deleteOption(
                          question.id,
                          index
                        )
                      }
                    >
                      <FaMinus />
                    </button>
                  )}
                </div>
              )
            )}
          </div>
          <button
            type="button"
            className="add-option-btn"
            onClick={() =>
              addOption(
                question.id
              )
            }
          >
            <FaPlus />
            <span>
              Add option
            </span>
          </button>
        </div>
      );
    }
    if (
      question.type ===
      "short"
    ) {
      return (
        <div className="preview-answer-box">
          <input
            type="text"
            disabled
            placeholder="Short answer text"
          />
        </div>
      );
    }
    if (
      question.type ===
      "long"
    ) {
      return (
        <div className="preview-answer-box">
          <textarea
            disabled
            placeholder="Long answer text"
          />
        </div>
      );
    }
    if (
      question.type ===
      "rating"
    ) {
      return (
        <div className="rating-preview">
          {[1, 2, 3, 4, 5].map(
            (
              number
            ) => (
              <div
                className="rating-item"
                key={
                  number
                }
              >
                <FaStar />
                <span>
                  {number}
                </span>
              </div>
            )
          )}
        </div>
      );
    }
    if (
      question.type ===
      "yesno"
    ) {
      return (
        <div className="yesno-preview">
          <div className="yesno-item">
            <span>
              ○
            </span>
            Yes
          </div>
          <div className="yesno-item">
            <span>
              ○
            </span>
            No
          </div>
        </div>
      );
    }
    if (
      question.type ===
      "math"
    ) {
      return (
        <div className="special-question-box">
          <FaCalculator />
          <span>
            Respondent will enter a mathematical expression.
          </span>
        </div>
      );
    }
    if (
      question.type ===
      "code"
    ) {
      return (
        <div className="code-preview-box">
          <span>
            &lt;/&gt;
          </span>
          Enter code answer...
        </div>
      );
    }
    if (
      question.type ===
      "image"
    ) {
      return (
        <div className="image-question-area">
          <label>
            Question Image
          </label>
          <div className="question-image-upload-box">
            <input
              id={
                `question-image-${question.id}`
              }
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="question-image-file-input"
              onChange={(event) =>
                handleQuestionImageUpload(
                  question.id,
                  event
                )
              }
            />
            <label
              htmlFor={
                `question-image-${question.id}`
              }
              className="question-image-upload-label"
            >
              <span className="question-image-upload-icon">
                <FaImage />
              </span>
              <span className="question-image-upload-content">
                <strong>
                  {question.image
                    ? "Change Image"
                    : "Choose Image From Device"
                  }
                </strong>
                <small>
                  JPG, JPEG, PNG, or WEBP.
                  Maximum size 1 MB.
                </small>
              </span>
              <span className="question-image-upload-button">
                Browse File
              </span>
            </label>
          </div>
          {question.image && (
            <div className="question-image-preview">
              <div className="question-image-preview-header">
                <div>
                  <strong>
                    Image Preview
                  </strong>
                  <span>
                    {question.imageName ||
                      "Uploaded image"}
                  </span>
                </div>
                <button
                  type="button"
                  className="remove-question-image-btn"
                  onClick={() =>
                    removeQuestionImage(
                      question.id
                    )
                  }
                >
                  <FaTrash />
                  <span>
                    Remove
                  </span>
                </button>
              </div>
              <img
                src={
                  question.image
                }
                alt={
                  question.imageName ||
                  "Question preview"
                }
              />
            </div>
          )}
          <div className="image-answer-settings">
            <div className="answer-options-header">
              <span>
                Answer Type
              </span>
              <small>
                Choose how respondents answer this image question.
              </small>
            </div>
            <div className="image-answer-type-options">
              {[
                {
                  value: "multiple",
                  label: "Multiple Choice",
                  icon:
                    <FaListUl />,
                },
                {
                  value: "short",
                  label: "Short Text",
                  icon:
                    <FaFont />,
                },
                {
                  value: "long",
                  label: "Long Text",
                  icon:
                    <FaAlignLeft />,
                },
              ].map(
                (
                  item
                ) => (
                  <label
                    key={
                      item.value
                    }
                    className={
                      question.imageAnswerType ===
                      item.value
                        ? "image-answer-type-option selected"
                        : "image-answer-type-option"
                    }
                  >
                    <input
                      type="radio"
                      name={
                        `image-answer-type-${question.id}`
                      }
                      value={
                        item.value
                      }
                      checked={
                        question.imageAnswerType ===
                        item.value
                      }
                      onChange={() =>
                        changeImageAnswerType(
                          question.id,
                          item.value
                        )
                      }
                    />
                    <span>
                      {item.icon}
                    </span>
                    <strong>
                      {item.label}
                    </strong>
                  </label>
                )
              )}
            </div>
            {question.imageAnswerType ===
            "multiple" ? (
              <div className="question-options-area image-answer-options-area">
                <div className="answer-options-header">
                  <span>
                    Answer Options
                  </span>
                  <small>
                    {(
                      question.imageOptions ||
                      []
                    ).length} options
                  </small>
                </div>
                <div className="answer-options-list">
                  {(
                    question.imageOptions ||
                    []
                  ).map(
                    (
                      option,
                      optionIndex
                    ) => (
                      <div
                        className="answer-option-row"
                        key={
                          `${question.id}-image-option-${optionIndex}`
                        }
                      >
                        <span className="answer-radio">
                          <FaCircle />
                        </span>
                        <input
                          type="text"
                          value={
                            option
                          }
                          onChange={(event) =>
                            updateImageOption(
                              question.id,
                              optionIndex,
                              event.target.value
                            )
                          }
                          placeholder={
                            `Option ${optionIndex + 1}`
                          }
                        />
                        {(
                          question.imageOptions ||
                          []
                        ).length > 2 && (
                          <button
                            type="button"
                            className="remove-option-btn"
                            onClick={() =>
                              deleteImageOption(
                                question.id,
                                optionIndex
                              )
                            }
                          >
                            <FaMinus />
                          </button>
                        )}
                      </div>
                    )
                  )}
                </div>
                <button
                  type="button"
                  className="add-option-btn"
                  onClick={() =>
                    addImageOption(
                      question.id
                    )
                  }
                >
                  <FaPlus />
                  <span>
                    Add option
                  </span>
                </button>
              </div>
            ) : question.imageAnswerType ===
              "long" ? (
              <div className="preview-answer-box">
                <textarea
                  disabled
                  placeholder="Long answer text"
                />
              </div>
            ) : (
              <div className="preview-answer-box">
                <input
                  type="text"
                  disabled
                  placeholder="Short answer text"
                />
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };
  // =========================================================
  // QUESTION CARD
  // =========================================================
  const renderQuestionCard = (
    question,
    index
  ) => (
    <article
      className="builder-question-card"
      key={
        question.id
      }
    >
      <div className="builder-question-top">
        <div className="builder-question-heading">
          <span className="question-number-badge">
            {index + 1}
          </span>
          <span className="question-type-icon">
            {getQuestionTypeIcon(
              question.type
            )}
          </span>
          <strong>
            {getQuestionTypeLabel(
              question.type
            )}
          </strong>
        </div>
        <div className="question-card-actions">
          <button
            type="button"
            title="Duplicate question"
            onClick={() =>
              duplicateQuestion(
                question.id
              )
            }
          >
            <FaCopy />
          </button>
          <button
            type="button"
            title="Delete question"
            className="delete-question"
            onClick={() =>
              deleteQuestion(
                question.id
              )
            }
          >
            <FaTrash />
          </button>
        </div>
      </div>
      <div className="question-type-select-wrapper">
        <select
          value={
            question.type
          }
          onChange={(event) =>
            changeQuestionType(
              question.id,
              event.target.value
            )
          }
        >
          {questionTypes.map(
            (
              item
            ) => (
              <option
                key={
                  item.type
                }
                value={
                  item.type
                }
              >
                {item.label}
              </option>
            )
          )}
        </select>
      </div>
      <div className="question-main-input">
        <div className="question-input-icon">
          <FaQuestionCircle />
        </div>
        <textarea
          value={
            question.title
          }
          onChange={(event) =>
            updateQuestion(
              question.id,
              "title",
              event.target.value
            )
          }
          placeholder="Write your question here..."
          rows={2}
          maxLength={500}
        />
      </div>
      {renderQuestionBody(
        question
      )}
      <div className="question-setting-card">
        <div className="question-setting-icon">
          <FaTrophy />
        </div>
        <div className="question-setting-content">
          <strong>
            Question scoring
          </strong>
          <span>
            Assign points to this question.
          </span>
        </div>
        {question.scoring && (
          <div className="points-input">
            <input
              type="number"
              min="1"
              value={
                question.points
              }
              onChange={(event) =>
                updateQuestion(
                  question.id,
                  "points",
                  Number(
                    event.target.value
                  )
                )
              }
            />
            <span>
              pts
            </span>
          </div>
        )}
        <label className="small-toggle">
          <input
            type="checkbox"
            checked={
              question.scoring
            }
            onChange={(event) =>
              updateQuestion(
                question.id,
                "scoring",
                event.target.checked
              )
            }
          />
          <span className="small-toggle-track">
            <span className="small-toggle-circle"></span>
          </span>
        </label>
      </div>
      {question.scoring && (
        <div className="create-field">
          <label
            htmlFor={`correct-answer-${question.id}`}
          >
            Correct Answer
            <span>
              *
            </span>
          </label>
          {(question.type === "multiple" ||
            question.type === "yesno" ||
            (
              question.type === "image" &&
              question.imageAnswerType === "multiple"
            )) ? (
            <div className="create-input-wrapper">
              <FaCheck />
              <select
                id={`correct-answer-${question.id}`}
                value={
                  question.correctAnswer ||
                  ""
                }
                onChange={(event) =>
                  updateQuestion(
                    question.id,
                    "correctAnswer",
                    event.target.value
                  )
                }
              >
                <option value="">
                  Select correct answer
                </option>
                {(
                  question.type === "image"
                    ? question.imageOptions || []
                    : question.type === "yesno"
                    ? (
                        question.options?.length
                          ? question.options
                          : ["Yes", "No"]
                      )
                    : question.options || []
                ).filter(
                  (option) =>
                    String(
                      option ||
                      ""
                    ).trim()
                ).map(
                  (
                    option,
                    optionIndex
                  ) => (
                    <option
                      key={`${question.id}-correct-${optionIndex}`}
                      value={option}
                    >
                      {option}
                    </option>
                  )
                )}
              </select>
            </div>
          ) : question.type === "rating" ? (
            <div className="create-input-wrapper">
              <FaStar />
              <select
                id={`correct-answer-${question.id}`}
                value={
                  question.correctAnswer ||
                  ""
                }
                onChange={(event) =>
                  updateQuestion(
                    question.id,
                    "correctAnswer",
                    event.target.value
                  )
                }
              >
                <option value="">
                  Select correct rating
                </option>
                {Array.from({
                  length:
                    question.ratingMax || 5,
                }).map(
                  (_, ratingIndex) => (
                    <option
                      key={`${question.id}-rating-${ratingIndex + 1}`}
                      value={String(ratingIndex + 1)}
                    >
                      {ratingIndex + 1}
                    </option>
                  )
                )}
              </select>
            </div>
          ) : (
            <div className="create-input-wrapper">
              <FaCheck />
              <input
                id={`correct-answer-${question.id}`}
                type="text"
                value={
                  question.correctAnswer ||
                  ""
                }
                onChange={(event) =>
                  updateQuestion(
                    question.id,
                    "correctAnswer",
                    event.target.value
                  )
                }
                placeholder="Enter the expected correct answer"
              />
            </div>
          )}
          <small className="create-field-help">
            Used for automatic grading and admin result analysis.
            Respondent visibility is controlled separately by Result &amp; Score settings.
          </small>
        </div>
      )}
      <label className="required-question-row">
        <div>
          <strong>
            Required question
          </strong>
          <span>
            Respondents must answer this question.
          </span>
        </div>
        <input
          type="checkbox"
          checked={
            question.required
          }
          onChange={(event) =>
            updateQuestion(
              question.id,
              "required",
              event.target.checked
            )
          }
        />
        <span className="required-toggle-switch">
          <span className="required-toggle-circle"></span>
        </span>
      </label>
    </article>
  );
  // =========================================================
  // QUESTIONS TAB
  // =========================================================
  const renderQuestionsTab =
    () => (
      <div className="questions-builder-page">
        <div className="question-builder-toolbar">
          <div className="question-builder-label">
            <span>
              Step 3
            </span>
            <strong>
              Add Question
            </strong>
          </div>
          <div className="question-type-list">
            {questionTypes.map(
              (
                item
              ) => (
                <button
                  type="button"
                  key={
                    item.type
                  }
                  className={
                    `question-type-btn ${item.className}`
                  }
                  onClick={() =>
                    createQuestion(
                      item.type
                    )
                  }
                >
                  <span className="question-type-icon">
                    {item.icon}
                  </span>
                  <span>
                    {item.label}
                  </span>
                </button>
              )
            )}
          </div>
        </div>
        <div className="questions-builder-content">
          {questions.length ===
          0 ? (
            <div className="builder-empty-state">
              <div className="builder-empty-icon">
                <FaQuestionCircle />
              </div>
              <h3>
                No questions yet
              </h3>
              <p>
                Choose a question type above to start building your form.
              </p>
            </div>
          ) : (
            <div className="builder-question-list">
              {questions.map(
                (
                  question,
                  index
                ) =>
                  renderQuestionCard(
                    question,
                    index
                  )
              )}
            </div>
          )}
        </div>
      </div>
    );
  // =========================================================
  // LOADING / NOT FOUND
  // =========================================================
  if (loadingForm) {
    return (
      <div className={darkMode ? "edit-form-state-page dark" : "edit-form-state-page"}>
      <style>{editFormStyles}</style>
        <div className="edit-form-state-card">
          <span className="edit-form-loader"></span>
          <h2>Loading Form</h2>
          <p>Preparing the form data for editing.</p>
        </div>
      </div>
    );
  }
  if (formNotFound || !originalForm) {
    return (
      <div className={darkMode ? "edit-form-state-page dark" : "edit-form-state-page"}>
      <style>{editFormStyles}</style>
        <div className="edit-form-state-card">
          <FaQuestionCircle />
          <h2>Form not found</h2>
          <p>The form may have been deleted or is no longer available.</p>
          <button
            type="button"
            onClick={() => navigate("/admin/forms")}
          >
            Back to Forms
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
          ? "create-form-page dark"
          : "create-form-page"
      }
    >
      <style>{editFormStyles}</style>
      <header className="create-form-header">
        <button
          type="button"
          className="create-back-btn"
          onClick={() =>
            navigate(
              `/admin/forms/${id}`
            )
          }
          title="Back"
        >
          <FaArrowLeft />
        </button>
        <div className="create-header-title">
          <span>
            Form Builder
          </span>
          <h1>
            Edit Form
          </h1>
        </div>
        <div className="create-header-actions">
          {!isFirstTab && (
            <button
              type="button"
              className="create-previous-btn"
              onClick={
                handlePreviousStep
              }
            >
              Previous
            </button>
          )}
          {isLastTab ? (
            <button
              type="button"
              className="create-save-btn"
              onClick={
                handleSave
              }
            >
              Save Changes
            </button>
          ) : (
            <button
              type="button"
              className="create-save-btn"
              onClick={
                handleNextStep
              }
            >
              Next
            </button>
          )}
        </div>
      </header>
      <nav className="create-form-tabs">
        {[
          {
            key: "info",
            number: 1,
            icon:
              <FaInfoCircle />,
            label: "Info",
          },
          {
            key: "settings",
            number: 2,
            icon:
              <FaCog />,
            label: "Settings",
          },
          {
            key: "questions",
            number: 3,
            icon:
              <FaQuestionCircle />,
            label: "Questions",
          },
        ].map(
          (
            tab
          ) => (
            <button
              type="button"
              key={
                tab.key
              }
              className={
                activeTab ===
                tab.key
                  ? "create-tab active"
                  : "create-tab"
              }
              onClick={() =>
                changeTab(
                  tab.key
                )
              }
            >
              <span className="create-tab-number">
                {tab.number}
              </span>
              {tab.icon}
              <span>
                {tab.label}
              </span>
            </button>
          )
        )}
      </nav>
      {activeTab ===
        "info" &&
        renderInfoTab()}
      {activeTab ===
        "settings" &&
        renderSettingsTab()}
      {activeTab ===
        "questions" &&
        renderQuestionsTab()}
    </div>
  );
}
export default EditForm;