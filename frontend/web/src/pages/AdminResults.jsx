import { getFormById } from '../api/formApi';
import { getQuestionsByForm } from '../api/questionApi';
import { getFormResponses, gradeResponse as gradeResponseApi } from '../api/responseApi';

import {
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  FaArrowDown,
  FaArrowLeft,
  FaCalendarAlt,
  FaChartBar,
  FaChartLine,
  FaCheck,
  FaCheckCircle,
  FaChevronDown,
  FaClock,
  FaDownload,
  FaEye,
  FaFileExcel,
  FaFilePdf,
  FaQuestionCircle,
  FaSearch,
  FaSave,
  FaSortAmountDown,
  FaTimes,
  FaTrophy,
  FaUser,
  FaUsers,
  FaWpforms,
} from "react-icons/fa";
import {
  ThemeContext,
} from "../context/ThemeContext";
import {
  FormContext,
} from "../context/FormContext";

const adminResultsStyles = `
/* === AdminResults.css === */
/* =========================================================
   ADMIN RESULTS — HIDOCS
   ========================================================= */

*,
*::before,
*::after {
    box-sizing: border-box;
}

/* scoped reset */

button,
input,
select {
    font-family: inherit;
}


/* =========================================================
   PAGE
   ========================================================= */

.admin-results-page {
    width: 100%;
    min-height: 100vh;
    background:
        radial-gradient(circle at top right, rgba(72, 139, 224, .08), transparent 28%),
        #f3f6fb;
    color: #26364d;
    transition:
        background .25s ease,
        color .25s ease;
}


/* =========================================================
   HEADER
   ========================================================= */

.results-header {
    position: relative;
    width: 100%;
    min-height: 245px;
    overflow: visible;
    padding: 22px 30px 34px;
    color: #ffffff;
    background:
        linear-gradient(135deg, #103c72 0%, #1d5da7 58%, #2d7dcf 100%);
    box-shadow:
        inset 0 -1px 0 rgba(255, 255, 255, .08),
        0 12px 30px rgba(26, 74, 132, .18);
}

.results-header::after {
    content: "";
    position: absolute;
    inset: auto 0 0;
    height: 65px;
    background:
        linear-gradient(to bottom, transparent, rgba(4, 31, 67, .12));
    pointer-events: none;
}

.results-header-decoration {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
}

.results-header-circle {
    position: absolute;
    display: block;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, .13);
}

.results-header-circle.circle-one {
    width: 235px;
    height: 235px;
    top: -118px;
    right: -45px;
    background: rgba(255, 255, 255, .05);
}

.results-header-circle.circle-two {
    width: 170px;
    height: 170px;
    right: 86px;
    bottom: -98px;
    background: rgba(255, 255, 255, .035);
}

.results-header-dots {
    position: absolute;
    right: 48px;
    top: 108px;
    width: 110px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    opacity: .38;
}

.results-header-dots span {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #ffffff;
}


/* =========================================================
   HEADER TOP
   ========================================================= */

.results-header-top {
    position: relative;
    z-index: 5;
    display: grid;
    grid-template-columns: 42px 1fr auto;
    align-items: center;
    gap: 12px;
}

.results-back-btn {
    width: 38px;
    height: 38px;
    border: 1px solid rgba(255, 255, 255, .14);
    border-radius: 11px;
    background: rgba(255, 255, 255, .08);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    transition:
        background .2s ease,
        transform .2s ease;
}

.results-back-btn:hover {
    background: rgba(255, 255, 255, .16);
    transform: translateX(-2px);
}

.results-header-label {
    color: rgba(255, 255, 255, .78);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: .3px;
}


/* =========================================================
   EXPORT DROPDOWN
   ========================================================= */

.results-export-wrapper {
    position: relative;
}

.results-export-trigger {
    min-width: 104px;
    height: 38px;
    padding: 0 12px;
    border: 1px solid rgba(255, 255, 255, .16);
    border-radius: 11px;
    background: rgba(255, 255, 255, .1);
    color: #ffffff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 700;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    transition:
        background .2s ease,
        transform .2s ease;
}

.results-export-trigger:hover {
    background: rgba(255, 255, 255, .18);
    transform: translateY(-1px);
}

.results-export-trigger svg:last-child {
    font-size: 10px;
}

.results-export-menu {
    position: absolute;
    top: calc(100% + 9px);
    right: 0;
    width: 220px;
    padding: 8px;
    border: 1px solid #dce6f1;
    border-radius: 14px;
    background: #ffffff;
    box-shadow:
        0 16px 34px rgba(24, 48, 80, .18),
        0 3px 8px rgba(24, 48, 80, .06);
    z-index: 50;
}

.results-export-menu button {
    width: 100%;
    min-height: 58px;
    padding: 9px;
    border: none;
    border-radius: 10px;
    background: transparent;
    display: flex;
    align-items: center;
    gap: 10px;
    text-align: left;
    cursor: pointer;
    transition: background .18s ease;
}

.results-export-menu button:hover {
    background: #f4f8fc;
}

.export-menu-icon {
    width: 34px;
    height: 34px;
    flex-shrink: 0;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
}

.export-menu-icon.excel {
    background: #e6f5ed;
    color: #229b63;
}

.export-menu-icon.pdf {
    background: #fae9e9;
    color: #d95858;
}

.results-export-menu button > div {
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.results-export-menu strong {
    color: #30435a;
    font-size: 12px;
}

.results-export-menu small {
    color: #8c9aab;
    font-size: 10px;
}


/* =========================================================
   HEADER CONTENT
   ========================================================= */

.results-header-content {
    position: relative;
    z-index: 2;
    margin-top: 38px;
    display: flex;
    align-items: flex-start;
    gap: 16px;
    max-width: 790px;
}

.results-header-icon {
    width: 58px;
    height: 58px;
    flex-shrink: 0;
    border-radius: 17px;
    background: rgba(255, 255, 255, .14);
    border: 1px solid rgba(255, 255, 255, .17);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: 25px;
    backdrop-filter: blur(9px);
    -webkit-backdrop-filter: blur(9px);
}

.results-header-information {
    min-width: 0;
}

.results-label {
    display: inline-flex;
    align-items: center;
    min-height: 25px;
    padding: 0 10px;
    border-radius: 999px;
    background: rgba(255, 255, 255, .11);
    border: 1px solid rgba(255, 255, 255, .15);
    color: rgba(255, 255, 255, .82);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.1px;
    text-transform: uppercase;
}

.results-header-information h1 {
    margin: 13px 0 7px;
    color: #ffffff;
    font-size: 30px;
    line-height: 1.25;
    font-weight: 700;
    letter-spacing: -.55px;
}

.results-header-information p {
    margin: 0;
    max-width: 580px;
    color: rgba(255, 255, 255, .75);
    font-size: 14px;
    line-height: 1.65;
}


/* =========================================================
   CONTENT
   ========================================================= */

.results-content {
    position: relative;
    z-index: 4;
    width: 100%;
    max-width: 1180px;
    margin: -28px auto 0;
    padding: 0 24px 45px;
}


/* =========================================================
   SECTION HEADING
   ========================================================= */

.results-overview {
    padding-top: 0;
}

.results-section-heading {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 15px;
    margin-bottom: 13px;
}

.results-section-eyebrow {
    display: block;
    margin-bottom: 4px;
    color: #7f91a8;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.2px;
    text-transform: uppercase;
}

.results-section-heading h2,
.results-panel-heading h2,
.respondents-header h2 {
    margin: 0;
    color: #26394f;
    font-size: 19px;
    font-weight: 700;
    letter-spacing: -.2px;
}

.results-update-label,
.respondents-count {
    min-height: 27px;
    padding: 0 10px;
    border-radius: 999px;
    background: #edf4fb;
    color: #467ba9;
    display: inline-flex;
    align-items: center;
    font-size: 10px;
    font-weight: 700;
}


/* =========================================================
   STATS
   ========================================================= */

.results-stats {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 13px;
}

.result-stat-card {
    position: relative;
    min-height: 128px;
    overflow: hidden;
    padding: 17px;
    border: 1px solid #dce6f1;
    border-radius: 17px;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    box-shadow: 0 6px 18px rgba(25, 50, 85, .055);
}

.result-stat-card.responses {
    background: linear-gradient(145deg, #eef5fd, #ffffff);
}

.result-stat-card.average {
    background: linear-gradient(145deg, #edf9f5, #ffffff);
}

.result-stat-card.highest {
    background: linear-gradient(145deg, #fff9ed, #ffffff);
}

.result-stat-card.lowest {
    background: linear-gradient(145deg, #fff2f2, #ffffff);
}

.result-stat-icon {
    width: 42px;
    height: 42px;
    flex-shrink: 0;
    border-radius: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
}

.result-stat-card.responses .result-stat-icon {
    background: #e0edfb;
    color: #2f79c4;
}

.result-stat-card.average .result-stat-icon {
    background: #dff4ec;
    color: #22966b;
}

.result-stat-card.highest .result-stat-icon {
    background: #f9edd0;
    color: #d69918;
}

.result-stat-card.lowest .result-stat-icon {
    background: #f8dfdf;
    color: #d95e5e;
}

.result-stat-info {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.result-stat-info > span {
    color: #7f8fa3;
    font-size: 10px;
    font-weight: 700;
}

.result-stat-info strong {
    color: #273b52;
    font-size: 26px;
    line-height: 1;
    font-weight: 800;
}

.result-stat-info small {
    color: #96a2b2;
    font-size: 9px;
    line-height: 1.45;
}

.result-stat-decoration {
    position: absolute;
    width: 74px;
    height: 74px;
    right: -26px;
    bottom: -30px;
    border-radius: 50%;
    border: 1px solid rgba(45, 110, 177, .09);
}


/* =========================================================
   PANELS
   ========================================================= */

.results-panel {
    margin-top: 20px;
    padding: 18px;
    border: 1px solid #dce6f1;
    border-radius: 17px;
    background: #ffffff;
    box-shadow: 0 6px 18px rgba(25, 50, 85, .055);
}

.results-panel-heading,
.respondents-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 15px;
}

.score-summary-icon {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: #edf4fb;
    color: #397ec1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
}


/* =========================================================
   SCORE DISTRIBUTION
   ========================================================= */

.score-distribution {
    display: flex;
    flex-direction: column;
    gap: 9px;
}

.score-row {
    min-height: 66px;
    padding: 10px 11px;
    border: 1px solid #e2e9f1;
    border-radius: 12px;
    background: #fbfcfe;
    display: grid;
    grid-template-columns: 110px 1fr 70px;
    align-items: center;
    gap: 13px;
}

.score-row-label {
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.score-row-label strong {
    color: #33475e;
    font-size: 12px;
}

.score-row-label span {
    color: #8f9cad;
    font-size: 9px;
}

.score-bar-area {
    display: grid;
    grid-template-columns: 1fr 38px;
    align-items: center;
    gap: 9px;
}

.score-bar {
    width: 100%;
    height: 9px;
    overflow: hidden;
    border-radius: 999px;
    background: #e2e8ef;
}

.score-bar-fill {
    height: 100%;
    border-radius: inherit;
    transition: width .3s ease;
}

.score-bar-fill.green {
    background: linear-gradient(90deg, #27a96f, #3fc489);
}

.score-bar-fill.blue {
    background: linear-gradient(90deg, #2c78c7, #4b99e5);
}

.score-bar-fill.orange {
    background: linear-gradient(90deg, #d99a1c, #efb33f);
}

.score-bar-fill.gray {
    background: #aeb8c5;
}

.score-percentage {
    color: #61758b;
    font-size: 10px;
    font-weight: 700;
}

.score-count {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
}

.score-count strong {
    color: #30445b;
    font-size: 14px;
}

.score-count span {
    color: #8e9aac;
    font-size: 9px;
}


/* =========================================================
   RESPONDENTS TOOLBAR
   ========================================================= */

.respondents-toolbar {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 180px;
    gap: 10px;
    margin-bottom: 12px;
}

.respondents-search,
.respondents-sort {
    height: 40px;
    border: 1px solid #dce5ef;
    border-radius: 10px;
    background: #f8fafc;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 11px;
}

.respondents-search svg,
.respondents-sort svg {
    color: #8aa0b7;
    font-size: 13px;
    flex-shrink: 0;
}

.respondents-search input,
.respondents-sort select {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    background: transparent;
    color: #3c4f65;
    font-size: 11px;
}

.respondents-search input::placeholder {
    color: #9ba8b7;
}

.respondents-sort select {
    cursor: pointer;
}


/* =========================================================
   RESPONDENTS LIST
   ========================================================= */

.respondents-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}


/* =========================================================
   RESPONDENT CARD
   ========================================================= */

.respondent-card {
    position: relative;

    min-height: 112px;

    padding: 18px 20px;

    border: 1px solid #e0e8f2;
    border-radius: 17px;

    background:
        linear-gradient(
            135deg,
            #ffffff 0%,
            #ffffff 72%,
            #f8fbff 100%
        );

    display: grid;

    grid-template-columns:
        minmax(260px, 1fr)
        auto
        auto;

    align-items: center;

    gap: 24px;

    overflow: hidden;

    box-shadow:
        0 3px 10px rgba(26, 56, 92, .025);

    transition:
        transform .2s ease,
        border-color .2s ease,
        box-shadow .2s ease;
}


/* LEFT ACCENT */

.respondent-card::before {
    content: "";

    position: absolute;

    left: 0;
    top: 18px;
    bottom: 18px;

    width: 3px;

    border-radius: 0 4px 4px 0;

    background:
        linear-gradient(
            180deg,
            #3b82f6,
            #2563eb
        );

    opacity: 0;

    transform: scaleY(.5);

    transition:
        opacity .2s ease,
        transform .2s ease;
}


.respondent-card:hover {
    transform: translateY(-2px);

    border-color: #c9daed;

    box-shadow:
        0 12px 28px rgba(35, 76, 125, .08);
}


.respondent-card:hover::before {
    opacity: 1;
    transform: scaleY(1);
}


/* =========================================================
   RESPONDENT MAIN
   ========================================================= */

.respondent-main {
    min-width: 0;

    display: grid;

    grid-template-columns:
        28px
        48px
        minmax(0, 1fr);

    align-items: center;

    gap: 12px;
}


.respondent-number {
    width: 26px;
    height: 26px;

    border-radius: 8px;

    background: #f3f6fa;

    color: #8798ac;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 11px;
    font-weight: 800;
}


.respondent-avatar {
    width: 46px;
    height: 46px;

    flex-shrink: 0;

    border-radius: 14px;

    background:
        linear-gradient(
            135deg,
            #e6f1ff,
            #f0f6ff
        );

    border: 1px solid #d8e8fa;

    color: #2874c6;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 16px;
    font-weight: 800;

    box-shadow:
        0 4px 12px rgba(44, 117, 197, .07);
}


.respondent-info {
    min-width: 0;

    display: flex;
    flex-direction: column;

    align-items: flex-start;

    gap: 3px;
}


.respondent-info > strong {
    max-width: 100%;

    color: #263b55;

    font-size: 14px;
    font-weight: 800;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}


.respondent-info > small {
    max-width: 100%;

    color: #71839a;

    font-size: 11px;
    font-weight: 500;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}


.respondent-status {
    width: fit-content;

    margin-top: 3px;

    min-height: 21px;

    padding: 0 7px;

    border-radius: 999px;

    background: #eaf8f1;

    color: #269762;

    display: inline-flex;
    align-items: center;

    gap: 4px;

    font-size: 9px;
    font-weight: 700;
}


.respondent-status svg {
    font-size: 8px;
}


/* =========================================================
   RESPONDENT DATE & TIME
   ========================================================= */

.respondent-meta {
    display: flex;
    align-items: center;

    gap: 8px;
}


.respondent-meta-chip {
    min-width: 105px;
    min-height: 48px;

    padding: 8px 11px;

    border: 1px solid #e4ebf3;
    border-radius: 12px;

    background: #f8fafc;

    display: flex;
    align-items: center;

    gap: 8px;
}


.respondent-meta-chip > svg {
    flex-shrink: 0;

    color: #4d88c7;

    font-size: 13px;
}


.respondent-meta-chip > div {
    min-width: 0;

    display: flex;
    flex-direction: column;

    gap: 1px;
}


.respondent-meta-chip span {
    color: #99a6b6;

    font-size: 8px;
    font-weight: 700;

    text-transform: uppercase;

    letter-spacing: .4px;
}


.respondent-meta-chip strong {
    color: #52667e;

    font-size: 10px;
    font-weight: 700;

    white-space: nowrap;
}


/* =========================================================
   RESPONDENT ACTIONS
   ========================================================= */

.respondent-actions {
    display: grid;

    grid-template-columns:
        82px
        130px;

    align-items: stretch;

    gap: 9px;
}


/* =========================================================
   SCORE
   ========================================================= */

.respondent-score {
    width: 82px;
    min-height: 58px;

    padding: 8px;

    border-radius: 13px;

    display: flex;
    flex-direction: column;

    align-items: center;
    justify-content: center;

    gap: 3px;
}


.respondent-score span {
    font-size: 8px;
    font-weight: 800;

    text-transform: uppercase;

    letter-spacing: .7px;

    opacity: .72;
}


.respondent-score strong {
    font-size: 17px;
    line-height: 1;

    font-weight: 800;
}


.respondent-score.score-high {
    background:
        linear-gradient(
            145deg,
            #e7f8ef,
            #f2fcf7
        );

    color: #21945f;

    border: 1px solid #caead8;
}


.respondent-score.score-medium {
    background:
        linear-gradient(
            145deg,
            #e9f2fd,
            #f4f8fe
        );

    color: #2876c6;

    border: 1px solid #d0e2f5;
}


.respondent-score.score-low {
    background:
        linear-gradient(
            145deg,
            #fff3dc,
            #fff9ee
        );

    color: #d58c00;

    border: 1px solid #f1dcae;
}


.respondent-score.score-empty {
    background: #f4f6f9;

    color: #8795a7;

    border: 1px solid #e2e7ed;
}


/* =========================================================
   VIEW ANSWERS BUTTON
   ========================================================= */

.respondent-view-answers-btn {
    width: 130px;
    min-height: 58px;

    padding: 0 15px;

    border: 1px solid #d4e4f7;
    border-radius: 13px;

    background:
        linear-gradient(
            145deg,
            #f1f7ff,
            #eaf3ff
        );

    color: #286fc0;

    display: inline-flex;

    align-items: center;
    justify-content: center;

    gap: 8px;

    font-family: inherit;

    font-size: 11px;
    font-weight: 800;

    white-space: nowrap;

    cursor: pointer;

    transition:
        transform .18s ease,
        border-color .18s ease,
        background .18s ease,
        box-shadow .18s ease;
}


.respondent-view-answers-btn svg {
    font-size: 13px;
}


.respondent-view-answers-btn:hover {
    transform: translateY(-1px);

    border-color: #aeccef;

    background:
        linear-gradient(
            145deg,
            #e9f3ff,
            #dcecff
        );

    box-shadow:
        0 6px 15px rgba(40, 111, 192, .10);
}


.respondent-view-answers-btn:active {
    transform: translateY(0);
}


/* =========================================================
   EMPTY RESPONDENTS
   ========================================================= */

.respondents-empty {
    min-height: 220px;
    padding: 28px 18px;
    border: 1px dashed #cfd9e5;
    border-radius: 14px;
    background: #fbfcfe;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.respondents-empty-icon {
    width: 52px;
    height: 52px;
    margin-bottom: 12px;
    border-radius: 14px;
    background: #eaf3fd;
    color: #347fc5;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
}

.respondents-empty h3 {
    margin: 0 0 5px;
    color: #30445b;
    font-size: 15px;
}

.respondents-empty p {
    margin: 0;
    color: #8d9aac;
    font-size: 11px;
}


/* =========================================================
   EXPORT CARD
   ========================================================= */

.results-export-card {
    margin-top: 20px;
    min-height: 116px;
    padding: 19px;
    border-radius: 18px;
    background:
        linear-gradient(135deg, #123f78 0%, #1e65b0 62%, #2d7dce 100%);
    color: #ffffff;
    display: flex;
    align-items: center;
    gap: 14px;
    box-shadow: 0 10px 25px rgba(25, 76, 135, .18);
}

.results-export-card-icon {
    width: 48px;
    height: 48px;
    flex-shrink: 0;
    border-radius: 14px;
    background: rgba(255, 255, 255, .13);
    border: 1px solid rgba(255, 255, 255, .16);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
}

.results-export-card-content {
    flex: 1;
    min-width: 0;
}

.results-export-card-content > span {
    color: rgba(255, 255, 255, .72);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
}

.results-export-card-content h2 {
    margin: 4px 0 5px;
    color: #ffffff;
    font-size: 17px;
    font-weight: 700;
}

.results-export-card-content p {
    margin: 0;
    max-width: 610px;
    color: rgba(255, 255, 255, .72);
    font-size: 10px;
    line-height: 1.55;
}

.results-export-actions {
    display: flex;
    align-items: center;
    gap: 8px;
}

.export-btn {
    min-width: 92px;
    height: 40px;
    padding: 0 12px;
    border-radius: 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    cursor: pointer;
    font-size: 11px;
    font-weight: 800;
    transition:
        transform .2s ease,
        box-shadow .2s ease,
        background .2s ease;
}

.export-btn:hover {
    transform: translateY(-2px);
}

.export-btn.excel {
    border: none;
    background: #ffffff;
    color: #1f8d5c;
}

.export-btn.pdf {
    border: 1px solid rgba(255, 255, 255, .24);
    background: rgba(255, 255, 255, .11);
    color: #ffffff;
}

.export-btn.exported {
    background: #2ca36f;
    color: #ffffff;
}


/* =========================================================
   NOT FOUND
   ========================================================= */

.results-not-found {
    min-height: 100vh;
    padding: 30px 18px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.results-not-found-icon {
    width: 72px;
    height: 72px;
    margin-bottom: 16px;
    border-radius: 20px;
    background: #e7f1fb;
    color: #357dc3;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
}

.results-not-found h2 {
    margin: 0 0 7px;
    color: #2a3e55;
    font-size: 23px;
}

.results-not-found p {
    max-width: 420px;
    margin: 0 0 16px;
    color: #8795a7;
    font-size: 13px;
    line-height: 1.6;
}

.results-not-found button {
    height: 38px;
    padding: 0 14px;
    border: none;
    border-radius: 10px;
    background: #256bb0;
    color: #ffffff;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 700;
}


/* =========================================================
   DARK MODE
   ========================================================= */

.admin-results-page.dark {
    background:
        radial-gradient(circle at top right, rgba(74, 135, 213, .08), transparent 28%),
        #0d1624;
    color: #e8eef6;
}

.admin-results-page.dark .results-header {
    background:
        linear-gradient(135deg, #0b274b 0%, #123d70 58%, #1d5b9e 100%);
    box-shadow:
        inset 0 -1px 0 rgba(255, 255, 255, .06),
        0 12px 30px rgba(0, 0, 0, .26);
}

.admin-results-page.dark .results-export-menu,
.admin-results-page.dark .results-panel {
    background: #172234;
    border-color: #2c3b50;
    box-shadow: 0 8px 22px rgba(0, 0, 0, .18);
}

.admin-results-page.dark .results-export-menu button:hover {
    background: #1f2d40;
}

.admin-results-page.dark .results-export-menu strong {
    color: #edf3fa;
}

.admin-results-page.dark .results-export-menu small {
    color: #8494a8;
}

.admin-results-page.dark .results-section-heading h2,
.admin-results-page.dark .results-panel-heading h2,
.admin-results-page.dark .respondents-header h2,
.admin-results-page.dark .score-row-label strong,
.admin-results-page.dark .score-count strong,
.admin-results-page.dark .respondent-info > strong,
.admin-results-page.dark .respondents-empty h3 {
    color: #edf3fa;
}

.admin-results-page.dark .results-section-eyebrow,
.admin-results-page.dark .score-row-label span,
.admin-results-page.dark .score-count span,
.admin-results-page.dark .respondents-empty p {
    color: #8192a8;
}

.admin-results-page.dark .results-update-label,
.admin-results-page.dark .respondents-count,
.admin-results-page.dark .score-summary-icon {
    background: #213b5a;
    color: #6cb1ff;
}

.admin-results-page.dark .result-stat-card {
    border-color: #2d3c50;
    box-shadow: 0 6px 18px rgba(0, 0, 0, .16);
}

.admin-results-page.dark .result-stat-card.responses {
    background: linear-gradient(145deg, #1b3551, #172234);
}

.admin-results-page.dark .result-stat-card.average {
    background: linear-gradient(145deg, #16342e, #172234);
}

.admin-results-page.dark .result-stat-card.highest {
    background: linear-gradient(145deg, #3b3220, #172234);
}

.admin-results-page.dark .result-stat-card.lowest {
    background: linear-gradient(145deg, #3a2629, #172234);
}

.admin-results-page.dark .result-stat-info strong {
    color: #f1f5f9;
}

.admin-results-page.dark .result-stat-info > span,
.admin-results-page.dark .result-stat-info small {
    color: #8fa0b4;
}

.admin-results-page.dark .score-row,
.admin-results-page.dark .respondent-card,
.admin-results-page.dark .respondents-empty {
    background: #1a2638;
    border-color: #2c3c50;
}

.admin-results-page.dark .score-bar {
    background: #334155;
}

.admin-results-page.dark .score-percentage,
.admin-results-page.dark .respondent-number,
.admin-results-page.dark .respondent-meta > div {
    color: #8293a7;
}

.admin-results-page.dark .respondents-search,
.admin-results-page.dark .respondents-sort {
    background: #1a2739;
    border-color: #2e3d51;
}

.admin-results-page.dark .respondents-search input,
.admin-results-page.dark .respondents-sort select {
    color: #e1e8f0;
}

.admin-results-page.dark .respondents-search input::placeholder {
    color: #6f8095;
}

.admin-results-page.dark .respondent-avatar,
.admin-results-page.dark .respondents-empty-icon {
    background: #213b5a;
    color: #6cb1ff;
}

.admin-results-page.dark .results-not-found h2 {
    color: #edf3fa;
}

.admin-results-page.dark .results-not-found p {
    color: #8fa0b4;
}

.admin-results-page.dark .results-not-found-icon {
    background: #213b5a;
    color: #6cb1ff;
}


/* =========================================================
   RESPONSIVE — TABLET
   ========================================================= */

@media (max-width: 980px) {
    .results-header {
        min-height: 232px;
        padding: 20px 24px 31px;
    }

    .results-header-content {
        margin-top: 33px;
    }

    .results-header-information h1 {
        font-size: 27px;
    }

    .results-content {
        padding-left: 18px;
        padding-right: 18px;
    }

    .results-stats {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .respondent-card {
        grid-template-columns: 26px 38px minmax(0, 1fr) 76px;
    }

    .respondent-meta {
        display: none;
    }
}


/* =========================================================
   RESPONSIVE — MOBILE
   ========================================================= */

@media (max-width: 680px) {
    .results-header {
        min-height: 220px;
        padding: 17px 15px 28px;
    }

    .results-header-top {
        grid-template-columns: 36px 1fr auto;
    }

    .results-back-btn {
        width: 34px;
        height: 34px;
        border-radius: 10px;
        font-size: 15px;
    }

    .results-header-label {
        font-size: 12px;
    }

    .results-export-trigger {
        min-width: 38px;
        width: 38px;
        padding: 0;
    }

    .results-export-trigger span,
    .results-export-trigger svg:last-child {
        display: none;
    }

    .results-export-menu {
        width: 205px;
    }

    .results-header-content {
        margin-top: 29px;
        gap: 12px;
    }

    .results-header-icon {
        width: 48px;
        height: 48px;
        border-radius: 14px;
        font-size: 20px;
    }

    .results-header-information h1 {
        margin-top: 10px;
        font-size: 22px;
    }

    .results-header-information p {
        font-size: 12px;
    }

    .results-header-dots {
        right: 15px;
        top: 94px;
        width: 85px;
        gap: 8px;
    }

    .results-content {
        margin-top: -23px;
        padding: 0 11px 32px;
    }

    .results-section-heading {
        align-items: flex-start;
    }

    .results-section-heading h2,
    .results-panel-heading h2,
    .respondents-header h2 {
        font-size: 17px;
    }

    .results-stats {
        grid-template-columns: 1fr;
        gap: 10px;
    }

    .result-stat-card {
        min-height: 96px;
    }

    .results-panel {
        padding: 15px;
        border-radius: 15px;
    }

    .score-row {
        grid-template-columns: 86px 1fr 48px;
        gap: 9px;
    }

    .score-bar-area {
        grid-template-columns: 1fr;
        gap: 4px;
    }

    .score-percentage {
        display: none;
    }

    .respondents-toolbar {
        grid-template-columns: 1fr;
    }

    .respondent-card {
        grid-template-columns: 32px minmax(0, 1fr) 68px;
        min-height: 64px;
    }

    .respondent-number {
        display: none;
    }

    .respondent-avatar {
        width: 32px;
        height: 32px;
    }

    .respondent-score {
        min-width: 64px;
    }

    .results-export-card {
        align-items: flex-start;
        flex-wrap: wrap;
        padding: 16px;
        border-radius: 16px;
    }

    .results-export-card-content {
        min-width: calc(100% - 65px);
    }

    .results-export-actions {
        width: 100%;
        margin-top: 4px;
    }

    .export-btn {
        flex: 1;
    }
}


/* =========================================================
   RESPONSIVE — SMALL PHONE
   ========================================================= */

@media (max-width: 430px) {
    .results-header {
        min-height: 212px;
    }

    .results-header-information h1 {
        font-size: 20px;
    }

    .results-header-information p {
        display: none;
    }

    .results-update-label {
        display: none;
    }

    .score-row {
        grid-template-columns: 74px 1fr 42px;
        padding: 9px;
    }

    .score-count span {
        display: none;
    }

    .respondents-count {
        font-size: 9px;
    }

    .respondent-info > strong {
        font-size: 11px;
    }

    .respondent-score {
        min-width: 58px;
    }
}


/* =========================================================
   ACCESSIBILITY
   ========================================================= */

.admin-results-page button:focus-visible,
.admin-results-page article:focus-visible,
.admin-results-page input:focus-visible,
.admin-results-page select:focus-visible {
    outline: 2px solid rgba(45, 117, 187, .5);
    outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
    .admin-results-page *,
    .admin-results-page *::before,
    .admin-results-page *::after {
        animation: none !important;
        transition: none !important;
        scroll-behavior: auto !important;
    }
}
/* =========================================================
   VIEW ANSWERS BUTTON
========================================================= */

.respondent-view-answers-btn {
  min-height: 42px;
  padding: 0 15px;

  border: 1px solid #cfe0f7;
  border-radius: 12px;

  background: #eef5ff;
  color: #2563eb;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  font-family: inherit;
  font-size: 14px;
  font-weight: 700;

  cursor: pointer;

  transition: 0.2s ease;
}

.respondent-view-answers-btn:hover {
  background: #e0edff;
  border-color: #aecbf3;

  transform: translateY(-1px);
}


/* =========================================================
   ANSWER MODAL OVERLAY
========================================================= */

.admin-answer-overlay {
  position: fixed;
  inset: 0;

  z-index: 9999;

  background: rgba(12, 30, 54, 0.58);

  backdrop-filter: blur(8px);

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 30px;
}


/* =========================================================
   ANSWER MODAL
========================================================= */

.admin-answer-modal {
  width: min(930px, 100%);
  max-height: calc(100vh - 60px);

  overflow-y: auto;

  background: #ffffff;

  border: 1px solid #e2e8f0;
  border-radius: 26px;

  box-shadow:
    0 30px 90px rgba(15, 39, 70, 0.28);
}


/* =========================================================
   MODAL HEADER
========================================================= */

.admin-answer-modal-header {
  min-height: 105px;

  padding: 24px 28px;

  border-bottom: 1px solid #e8edf4;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  position: sticky;
  top: 0;

  z-index: 5;

  background: rgba(255, 255, 255, 0.97);

  backdrop-filter: blur(16px);
}

.admin-answer-modal-user {
  display: flex;
  align-items: center;
  gap: 15px;
}

.admin-answer-modal-avatar {
  width: 55px;
  height: 55px;

  border-radius: 17px;

  background:
    linear-gradient(
      135deg,
      #e5f0ff,
      #eff6ff
    );

  color: #2563eb;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 23px;
  font-weight: 800;
}

.admin-answer-modal-user span {
  display: block;

  color: #7c8ba1;

  font-size: 12px;
  font-weight: 800;

  text-transform: uppercase;
  letter-spacing: 0.08em;

  margin-bottom: 3px;
}

.admin-answer-modal-user h2 {
  margin: 0;

  color: #1e3555;

  font-size: 22px;
}

.admin-answer-modal-user p {
  margin: 3px 0 0;

  color: #8390a3;

  font-size: 14px;
}

.admin-answer-close-btn {
  width: 42px;
  height: 42px;

  border: none;
  border-radius: 13px;

  background: #f1f4f8;
  color: #607086;

  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;
}

.admin-answer-close-btn:hover {
  background: #e8edf4;
}


/* =========================================================
   SUMMARY
========================================================= */

.admin-answer-summary {
  margin: 25px 28px 0;

  display: grid;
  grid-template-columns: repeat(4, 1fr);

  border: 1px solid #e3e9f1;
  border-radius: 18px;

  overflow: hidden;

  background: #f8fbff;
}

.admin-answer-summary > div {
  padding: 17px 20px;

  border-right: 1px solid #e3e9f1;
}

.admin-answer-summary > div:last-child {
  border-right: none;
}

.admin-answer-summary span,
.admin-answer-summary strong {
  display: block;
}

.admin-answer-summary span {
  color: #8a97a9;

  font-size: 12px;
  font-weight: 700;

  margin-bottom: 5px;
}

.admin-answer-summary strong {
  color: #273d5b;

  font-size: 15px;
}


/* =========================================================
   SCORE CARD
========================================================= */

.admin-answer-score-card {
  margin: 18px 28px;

  padding: 19px 22px;

  border-radius: 18px;

  background:
    linear-gradient(
      135deg,
      #fff9e9,
      #fffdf5
    );

  border: 1px solid #f5dda3;

  display: grid;
  grid-template-columns: auto 1fr auto;

  align-items: center;
  gap: 14px;
}

.admin-answer-score-icon {
  width: 47px;
  height: 47px;

  border-radius: 14px;

  background: #fff0bf;
  color: #d99606;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 20px;
}

.admin-answer-score-card span {
  display: block;

  color: #96742e;

  font-size: 12px;
  font-weight: 700;
}

.admin-answer-score-card strong {
  display: block;

  margin-top: 2px;

  color: #624716;

  font-size: 25px;
}

.admin-answer-score-percentage {
  min-width: 69px;
  height: 51px;

  border-radius: 14px;

  background: #ffffff;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #b87500;

  font-weight: 800;

  box-shadow:
    0 6px 15px rgba(172, 122, 23, 0.08);
}


/* =========================================================
   QUESTION LIST
========================================================= */

.admin-answer-question-list {
  padding: 6px 28px 28px;

  display: flex;
  flex-direction: column;
  gap: 15px;
}

.admin-answer-question-card {
  position: relative;

  padding: 21px;

  border-radius: 18px;

  border: 1px solid #e4eaf1;

  background: #ffffff;
}

.admin-answer-question-card.correct {
  border-color: #cdebdc;

  background:
    linear-gradient(
      135deg,
      #ffffff,
      #f9fffc
    );
}

.admin-answer-question-card.incorrect {
  border-color: #ffc9c9;

  background:
    linear-gradient(
      135deg,
      #fffdfd,
      #fff7f7
    );
}

.admin-answer-question-card.incorrect::before {
  content: "";

  position: absolute;

  left: 0;
  top: 14px;
  bottom: 14px;

  width: 4px;

  border-radius: 0 6px 6px 0;

  background: #ef4444;
}


/* =========================================================
   QUESTION TOP
========================================================= */

.admin-answer-question-top {
  display: flex;
  align-items: center;
  gap: 9px;

  margin-bottom: 14px;
}

.admin-answer-question-number {
  width: 31px;
  height: 31px;

  border-radius: 10px;

  background: #e9f2ff;
  color: #2563eb;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 13px;
  font-weight: 800;
}

.admin-answer-question-type {
  display: inline-flex;
  align-items: center;
  gap: 6px;

  color: #748197;

  font-size: 12px;
  font-weight: 700;

  text-transform: capitalize;
}

.admin-answer-status {
  margin-left: auto;

  min-height: 29px;

  padding: 0 10px;

  border-radius: 999px;

  display: inline-flex;
  align-items: center;
  gap: 6px;

  font-size: 12px;
  font-weight: 800;
}

.admin-answer-status.correct {
  background: #e8f8ef;
  color: #22975d;
}

.admin-answer-status.incorrect {
  background: #fff0f0;
  color: #dc4545;
}

.admin-answer-question-card h3 {
  margin: 0 0 16px;

  color: #263b58;

  font-size: 16px;
  line-height: 1.6;
}


/* =========================================================
   QUESTION IMAGE
========================================================= */

.admin-answer-question-image {
  margin-bottom: 16px;

  border-radius: 14px;

  overflow: hidden;

  border: 1px solid #e1e7ef;
}

.admin-answer-question-image img {
  display: block;

  width: 100%;
  max-height: 350px;

  object-fit: contain;

  background: #f8fafc;
}


/* =========================================================
   USER ANSWER
========================================================= */

.admin-answer-user-answer {
  padding: 14px 16px;

  border-radius: 14px;

  background: #f6f8fb;

  border: 1px solid #e6ebf2;
}

.admin-answer-user-answer.correct {
  background: #effaf4;
  border-color: #ccebd9;
}

.admin-answer-user-answer.incorrect {
  background: #fff1f1;
  border-color: #ffc9c9;
}

.admin-answer-user-answer span,
.admin-answer-correct-answer span {
  display: block;

  margin-bottom: 5px;

  color: #8895a8;

  font-size: 12px;
  font-weight: 700;
}

.admin-answer-user-answer strong {
  color: #32465f;

  font-size: 14px;
}


/* =========================================================
   CORRECT ANSWER
========================================================= */

.admin-answer-correct-answer {
  margin-top: 10px;

  padding: 14px 16px;

  border-radius: 14px;

  background: #edf9f3;

  border: 1px solid #c9ead7;
}

.admin-answer-correct-answer strong {
  display: flex;
  align-items: center;
  gap: 7px;

  color: #1d8250;

  font-size: 14px;
}


/* =========================================================
   POINTS
========================================================= */

.admin-answer-points {
  margin-top: 12px;

  padding-top: 12px;

  border-top: 1px solid #ebeff4;

  display: flex;
  align-items: center;
  justify-content: space-between;
}

.admin-answer-points span {
  color: #8693a6;

  font-size: 12px;
}

.admin-answer-points strong {
  color: #315785;

  font-size: 13px;
}


/* =========================================================
   MODAL FOOTER
========================================================= */

.admin-answer-modal-footer {
  min-height: 76px;

  padding: 17px 28px;

  border-top: 1px solid #e6ebf2;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  background: #fafcff;
}

.admin-answer-modal-footer span {
  color: #8592a5;

  font-size: 13px;
}

.admin-answer-modal-footer button {
  min-width: 100px;
  height: 40px;

  border: none;
  border-radius: 12px;

  background: #2563eb;
  color: #ffffff;

  font-family: inherit;
  font-size: 14px;
  font-weight: 700;

  cursor: pointer;
}


/* =========================================================
   DARK MODE
========================================================= */

.admin-results-page.dark
.admin-answer-modal {
  background: #151f2f;
  border-color: #2a394f;
}

.admin-results-page.dark
.admin-answer-modal-header {
  background: rgba(21, 31, 47, 0.97);
  border-bottom-color: #2c3a4f;
}

.admin-results-page.dark
.admin-answer-modal-user h2,
.admin-results-page.dark
.admin-answer-question-card h3 {
  color: #edf3fa;
}

.admin-results-page.dark
.admin-answer-modal-user p,
.admin-results-page.dark
.admin-answer-modal-user span {
  color: #93a4b9;
}

.admin-results-page.dark
.admin-answer-close-btn {
  background: #202d40;
  color: #b2bfd0;
}

.admin-results-page.dark
.admin-answer-summary {
  background: #111b29;
  border-color: #2d3e54;
}

.admin-results-page.dark
.admin-answer-summary > div {
  border-right-color: #2d3e54;
}

.admin-results-page.dark
.admin-answer-summary strong {
  color: #e4ecf5;
}

.admin-results-page.dark
.admin-answer-question-card {
  background: #111b29;
  border-color: #2d3e54;
}

.admin-results-page.dark
.admin-answer-question-card.correct {
  background: #10251e;
  border-color: #28533e;
}

.admin-results-page.dark
.admin-answer-question-card.incorrect {
  background: #2d1b20;
  border-color: #653038;
}

.admin-results-page.dark
.admin-answer-user-answer {
  background: #172335;
  border-color: #304057;
}

.admin-results-page.dark
.admin-answer-user-answer strong {
  color: #e7eef7;
}

.admin-results-page.dark
.admin-answer-correct-answer {
  background: #153326;
  border-color: #285a40;
}

.admin-results-page.dark
.admin-answer-modal-footer {
  background: #111b29;
  border-top-color: #2d3d53;
}


/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 900px) {

  .respondent-card {
    grid-template-columns:
      auto
      auto
      minmax(0, 1fr);
  }

  .respondent-meta,
  .respondent-score,
  .respondent-view-answers-btn {
    grid-column: 3;
  }

}


@media (max-width: 700px) {

  .admin-answer-overlay {
    padding: 12px;
  }

  .admin-answer-modal {
    max-height: calc(100vh - 24px);

    border-radius: 20px;
  }

  .admin-answer-modal-header {
    padding: 18px;
  }

  .admin-answer-summary {
    margin: 18px;

    grid-template-columns:
      repeat(2, 1fr);
  }

  .admin-answer-summary > div:nth-child(2) {
    border-right: none;
  }

  .admin-answer-summary > div:nth-child(-n + 2) {
    border-bottom: 1px solid #e3e9f1;
  }

  .admin-answer-score-card {
    margin: 15px 18px;
  }

  .admin-answer-question-list {
    padding: 5px 18px 20px;
  }

  .admin-answer-modal-footer {
    padding: 15px 18px;

    align-items: flex-start;
    flex-direction: column;
  }

  .admin-answer-modal-footer button {
    width: 100%;
  }

}
/* =========================================================
   NEW RESPONDENT RESPONSIVE
   ========================================================= */

@media (max-width: 1050px) {

    .respondent-card {
        grid-template-columns:
            minmax(240px, 1fr)
            auto;
    }


    .respondent-meta {
        grid-column: 1;
        padding-left: 86px;
    }


    .respondent-actions {
        grid-column: 2;
        grid-row: 1 / span 2;
    }

}


@media (max-width: 760px) {

    .respondent-card {
        padding: 16px;

        grid-template-columns: 1fr;

        gap: 14px;
    }


    .respondent-main {
        grid-template-columns:
            42px
            minmax(0, 1fr);
    }


    .respondent-number {
        display: none;
    }


    .respondent-avatar {
        width: 42px;
        height: 42px;
    }


    .respondent-meta {
        grid-column: auto;

        padding-left: 54px;

        width: 100%;
    }


    .respondent-meta-chip {
        flex: 1;
        min-width: 0;
    }


    .respondent-actions {
        grid-column: auto;
        grid-row: auto;

        grid-template-columns:
            80px
            minmax(0, 1fr);

        width: 100%;
    }


    .respondent-score {
        width: 80px;
    }


    .respondent-view-answers-btn {
        width: 100%;
    }

}


@media (max-width: 480px) {

    .respondent-card {
        padding: 14px;
        border-radius: 15px;
    }


    .respondent-meta {
        padding-left: 0;
    }


    .respondent-meta-chip {
        min-height: 45px;
        padding: 7px 9px;
    }


    .respondent-actions {
        grid-template-columns:
            72px
            minmax(0, 1fr);
    }


    .respondent-score {
        width: 72px;
        min-height: 52px;
    }


    .respondent-view-answers-btn {
        min-height: 52px;
    }

}

/* === AdminResultsManualGrading.css === */
/* =========================================================
   HIDOCS — ADMIN MANUAL GRADING ADD-ON
========================================================= */

.admin-grading-progress {
  margin: 0 28px 18px;
  padding: 15px 17px;
  border: 1px solid #dce7f3;
  border-radius: 15px;
  background: #f7faff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.admin-grading-progress > div { display: flex; flex-direction: column; gap: 3px; }
.admin-grading-progress span { color: #8493a6; font-size: 11px; font-weight: 700; }
.admin-grading-progress strong { color: #29415e; font-size: 14px; }
.admin-grading-progress.pending { border-color: #f0d59d; background: #fffaf0; }
.admin-grading-progress.complete { border-color: #cce8d9; background: #f1fbf6; }

.admin-grading-pending-badge {
  min-height: 30px;
  padding: 0 11px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  background: #fff0cf;
  color: #b57900 !important;
  white-space: nowrap;
}
.admin-grading-progress.complete .admin-grading-pending-badge { background: #dff5e9; color: #238457 !important; }

.admin-manual-grade-box {
  margin-top: 12px;
  padding: 15px;
  border: 1px solid #f0d69f;
  border-radius: 14px;
  background: linear-gradient(135deg, #fffaf0, #fffdf8);
}

.admin-manual-grade-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 13px;
}
.admin-manual-grade-heading > div { display: flex; flex-direction: column; gap: 3px; }
.admin-manual-grade-heading > div > span { color: #a17b30; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .7px; }
.admin-manual-grade-heading strong { color: #60491d; font-size: 13px; }

.manual-grade-status { min-height: 27px; padding: 0 9px; border-radius: 999px; display: inline-flex; align-items: center; font-size: 10px; font-weight: 800; }
.manual-grade-status.pending { background: #fff0cd; color: #b57900; }
.manual-grade-status.graded { background: #e4f6ec; color: #22875a; }

.admin-manual-grade-inputs {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 20px minmax(0, 1fr);
  align-items: end;
  gap: 10px;
}
.admin-manual-grade-inputs label { display: flex; flex-direction: column; gap: 6px; }
.admin-manual-grade-inputs label span { color: #806b42; font-size: 10px; font-weight: 700; }
.admin-manual-grade-inputs input {
  width: 100%;
  height: 40px;
  padding: 0 11px;
  border: 1px solid #e5cf9f;
  border-radius: 10px;
  outline: none;
  background: #fff;
  color: #33465d;
  font: inherit;
  font-size: 12px;
}
.admin-manual-grade-inputs input:focus { border-color: #d9a63a; box-shadow: 0 0 0 3px rgba(217,166,58,.12); }
.manual-grade-divider { padding-bottom: 10px; color: #a1844c; font-size: 16px; font-weight: 800; text-align: center; }

.admin-answer-footer-actions { display: flex; align-items: center; gap: 9px; }
.admin-answer-modal-footer .admin-save-grades-btn,
.admin-answer-modal-footer .admin-close-answers-btn {
  min-width: 130px;
  height: 40px;
  padding: 0 14px;
  border-radius: 11px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  font: inherit;
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;
}
.admin-answer-modal-footer .admin-save-grades-btn { border: none; background: #2563eb; color: #fff; }
.admin-answer-modal-footer .admin-save-grades-btn:disabled { opacity: .65; cursor: wait; }
.admin-answer-modal-footer .admin-close-answers-btn { border: 1px solid #dce5ef; background: #fff; color: #6d7e91; }

.admin-results-page.dark .admin-grading-progress { background: #172436; border-color: #31445c; }
.admin-results-page.dark .admin-grading-progress.pending { background: #352d1e; border-color: #5d4b26; }
.admin-results-page.dark .admin-grading-progress.complete { background: #173026; border-color: #28533e; }
.admin-results-page.dark .admin-grading-progress strong { color: #e9f0f8; }
.admin-results-page.dark .admin-manual-grade-box { background: #30291d; border-color: #594824; }
.admin-results-page.dark .admin-manual-grade-heading strong { color: #f3ddb0; }
.admin-results-page.dark .admin-manual-grade-inputs input { background: #172335; border-color: #5a4c2e; color: #edf3fa; }
.admin-results-page.dark .admin-answer-modal-footer .admin-close-answers-btn { background: #1a2739; border-color: #34465d; color: #a8b6c7; }

@media (max-width: 700px) {
  .admin-grading-progress { margin: 0 18px 15px; align-items: flex-start; flex-direction: column; }
  .admin-manual-grade-inputs { grid-template-columns: 1fr 16px 1fr; }
  .admin-answer-footer-actions { width: 100%; flex-direction: column; }
  .admin-answer-modal-footer .admin-save-grades-btn,
  .admin-answer-modal-footer .admin-close-answers-btn { width: 100%; }
}
`;
// =========================================================
// STORAGE KEYS
// =========================================================
const FORMS_STORAGE_KEY =
  "hidocs_forms";
const DELETED_FORMS_STORAGE_KEY =
  "hidocs_deleted_forms";
// =========================================================
// DEFAULT FORMS
// =========================================================
const defaultForms = [
  {
    id: 1,
    title: "Survey Kepuasan Mahasiswa 2024",
    description: "Overview of respondent performance and form analytics.",
    type: "Survey",
    responses: 0,
    questions: [
      {
        id: "survey-1",
        title: "Bagaimana pendapat Anda mengenai fasilitas kampus?",
        type: "multiple",
        options: [
          "Sangat Baik",
          "Baik",
          "Cukup",
          "Kurang",
        ],
      },
      {
        id: "survey-2",
        title: "Apakah pelayanan administrasi sudah memuaskan?",
        type: "multiple",
        options: [
          "Sangat Puas",
          "Puas",
          "Kurang Puas",
          "Tidak Puas",
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Quiz Pemrograman Mobile - Flutter",
    description: "Overview of quiz responses and respondent performance.",
    type: "Quiz",
    responses: 0,
    questions: [
      {
        id: "flutter-1",
        title: "Widget apakah yang digunakan untuk membuat layout vertikal di Flutter?",
        type: "multiple",
        options: [
          "Row",
          "Column",
          "Stack",
          "ListView",
        ],
      },
      {
        id: "flutter-2",
        title: "Perhatikan gambar berikut kemudian pilih jawaban yang benar.",
        type: "multiple",
        options: [
          "Jawaban A",
          "Jawaban B",
          "Jawaban C",
          "Jawaban D",
        ],
      },
      {
        id: "flutter-3",
        title: "Apa fungsi utama dari Scaffold pada Flutter?",
        type: "multiple",
        options: [
          "Widget Layout",
          "Database",
          "State Management",
          "API",
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Form Pendaftaran Event Hackathon",
    description: "Overview of registration responses and participant activity.",
    type: "Registration",
    responses: 0,
    questions: [
      {
        id: "hackathon-1",
        title: "Apakah Anda bersedia mengikuti seluruh rangkaian acara?",
        type: "yesno",
        options: [
          "Ya",
          "Tidak",
        ],
      },
    ],
  },
];
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
// NORMALIZE FORM
// =========================================================
const normalizeForm = (
  form
) => {
  const questions =
    Array.isArray(
      form.questions
    )
      ? form.questions
      : [];
  return {
    ...form,
    id:
      form.id,
    title:
      String(
        form.title ||
        ""
      ).trim() ||
      "Untitled Form",
    description:
      String(
        form.description ||
        ""
      ).trim() ||
      "Overview of respondent activity and submitted answers.",
    type:
      form.type ||
      form.category ||
      "Form",
    responses:
      Number(
        form.responses
      ) || 0,
    questions,
  };
};

const reverseQuestionTypeMapResults = {
  SHORT_TEXT: "short",
  LONG_TEXT: "long",
  MULTIPLE_CHOICE: "multiple",
  CHECKBOXES: "checkbox",
  YES_NO: "yesno",
  RATING: "rating",
  MATH: "math",
  CODE: "code",
  IMAGE: "image",
};

const mapApiQuestionForResults = (q) => ({
  id: q.id,
  title: q.question_text,
  type: reverseQuestionTypeMapResults[q.question_type] || "short",
  required: q.is_required,
  scoring: q.is_auto_scored,
  points: q.points,
  options: (q.options || []).map((o) => o.option_text),
  correctAnswer:
    (q.options || []).find((o) => o.is_correct)?.option_text || "",
});
// =========================================================
// HAS ANSWER
// =========================================================
const hasAnswer = (
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
    value !==
      undefined &&
    value !==
      null &&
    value !==
      ""
  );
};
// =========================================================
// NORMALIZE ANSWER
// =========================================================
const normalizeAnswer = (
  value
) => {
  if (
    Array.isArray(
      value
    )
  ) {
    return value.join(
      ", "
    );
  }
  if (
    value ===
      undefined ||
    value ===
      null ||
    value ===
      ""
  ) {
    return "-";
  }
  if (
    typeof value ===
    "object"
  ) {
    try {
      return JSON.stringify(
        value
      );
    } catch {
      return String(
        value
      );
    }
  }
  return String(
    value
  );
};
// =========================================================
// NORMALIZE COMPARISON
// =========================================================
const normalizeComparableAnswer = (
  value
) => {
  return normalizeAnswer(
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
  if (!question) {
    return "";
  }
  const directAnswer =
    question.correctAnswer ??
    question.correctOption ??
    question.answer ??
    question.correctValue ??
    question.expectedAnswer;
  if (
    directAnswer !==
      undefined &&
    directAnswer !==
      null &&
    directAnswer !==
      ""
  ) {
    return directAnswer;
  }
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
// FORMAT DATE
// =========================================================
const formatSubmittedDate = (
  value
) => {
  if (!value) {
    return "-";
  }
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
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(
    date
  );
};
// =========================================================
// FORMAT TIME
// =========================================================
const formatSubmittedTime = (
  value
) => {
  if (!value) {
    return "-";
  }
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
    "en-GB",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(
    date
  );
};
// =========================================================
// DATE VALUE
// =========================================================
const getDateValue = (
  value
) => {
  const date =
    new Date(
      value
    );
  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return 0;
  }
  return date.getTime();
};
// =========================================================
// CSV
// =========================================================
const escapeCsvValue = (
  value
) => {
  const stringValue =
    String(
      value ??
      ""
    );
  return `"${stringValue.replace(
    /"/g,
    '""'
  )}"`;
};
// =========================================================
// CLEAN WYSIWYG HTML FOR EXPORT
// =========================================================
const stripHtmlToText = (
  value
) => {
  const stringValue =
    String(
      value ??
      ""
    );
  if (!stringValue) {
    return "";
  }
  try {
    const parser =
      new DOMParser();
    const documentValue =
      parser.parseFromString(
        stringValue,
        "text/html"
      );
    return String(
      documentValue.body.textContent ||
      ""
    )
      .replace(
        /\u00a0/g,
        " "
      )
      .replace(
        /\s+/g,
        " "
      )
      .trim();
  } catch {
    return stringValue
      .replace(
        /<[^>]*>/g,
        " "
      )
      .replace(
        /&nbsp;/gi,
        " "
      )
      .replace(
        /\s+/g,
        " "
      )
      .trim();
  }
};
// =========================================================
// ESCAPE HTML FOR EXCEL EXPORT
// =========================================================
const escapeHtml = (
  value
) => {
  return String(
    value ??
    ""
  )
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );
};
// =========================================================
// ADMIN RESULTS
// =========================================================
function AdminResults() {
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
  const {
    allSubmissions = [],
    updateSubmissionGrading,
  } = useContext(
    FormContext
  );
  // =========================================================
  // STATE
  // =========================================================
  const [
    search,
    setSearch,
  ] = useState("");
  const [
    sortOrder,
    setSortOrder,
  ] = useState(
    "newest"
  );
  const [
    showExportMenu,
    setShowExportMenu,
  ] = useState(
    false
  );
  const [
    exportStatus,
    setExportStatus,
  ] = useState("");
  const [
    selectedRespondent,
    setSelectedRespondent,
  ] = useState(null);
  const [
    manualGrades,
    setManualGrades,
  ] = useState({});
  const [
    gradingSaving,
    setGradingSaving,
  ] = useState(false);
  // =========================================================
  // LOAD FORM
  // =========================================================
  const [form, setForm] = useState(null);
  const [isLoadingResults, setIsLoadingResults] = useState(true);
  const [formSubmissions, setFormSubmissions] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadResults = async () => {
      setIsLoadingResults(true);
      try {
        const formRes = await getFormById(id);
        const apiForm = formRes.data.data;

        const questionsForFormRes = await getQuestionsByForm(id);
        const apiQuestionsForForm = questionsForFormRes.data.data || [];

        const mappedForm = normalizeForm({
          id: apiForm.id,
          title: apiForm.title,
          description: apiForm.description,
          customLink: apiForm.custom_url,
          type: apiForm.type,
          active: apiForm.status === "ACTIVE",
          questions: apiQuestionsForForm.map(mapApiQuestionForResults),
        });

        const responsesRes = await getFormResponses(id);
        const apiResponses = responsesRes.data.data || [];

        const mappedSubmissions = apiResponses.map((r) => ({
          id: r.id,
          formId: id,
          respondentEmail: r.respondent_email,
          submittedAt: r.submitted_at,
          isAutoSubmitted: r.is_auto_submitted,
          score: r.total_score,
          maxScore: (r.answers || []).reduce(
            (sum, a) => sum + (a.points_earned || 0),
            0
          ),
          answers: (r.answers || []).reduce((acc, a) => {
            acc[a.question_id] = a.selected_option_text || a.answer_text;
            return acc;
          }, {}),
          questionResults: (r.answers || []).map((a) => ({
            questionId: a.question_id,
            questionText: a.question_text,
            answer: a.selected_option_text || a.answer_text,
            isCorrect: a.is_correct,
            pointsEarned: a.points_earned,
            scoreGiven: a.score_given,
          })),
        }));

        if (isMounted) {
          setForm(mappedForm);
          setFormSubmissions(mappedSubmissions);
        }
      } catch (error) {
        console.error("Gagal memuat hasil form:", error);
        if (isMounted) {
          setForm(null);
          setFormSubmissions([]);
        }
      } finally {
        if (isMounted) setIsLoadingResults(false);
      }
    };

    loadResults();
    return () => { isMounted = false; };
  }, [id]);
  // =========================================================
  // BUILD QUESTION RESULTS
  // ADMIN ALWAYS HAS FULL ACCESS
  // =========================================================
  const buildQuestionResults = (
    submission
  ) => {
    const questions =
      Array.isArray(
        form?.questions
      )
        ? form.questions
        : [];
    const answers =
      submission?.answers &&
      typeof submission.answers ===
        "object"
        ? submission.answers
        : {};
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
        const storedResult =
          Array.isArray(
            submission?.questionResults
          )
            ? submission.questionResults.find(
                (
                  result
                ) => {
                  return (
                    String(
                      result.questionId ??
                      result.id
                    ) ===
                    String(
                      questionId
                    )
                  );
                }
              )
            : null;
        const correctAnswer =
          storedResult?.correctAnswer ??
          getCorrectAnswer(
            question
          );
        const hasCorrectAnswer =
          hasAnswer(
            correctAnswer
          );
        let isCorrect =
          null;
        if (
          typeof storedResult?.isCorrect ===
          "boolean"
        ) {
          isCorrect =
            storedResult.isCorrect;
        } else if (
          hasCorrectAnswer &&
          hasAnswer(
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
        const isAutoGraded =
          question.scoring === true ||
          hasCorrectAnswer;
        const manuallyGraded =
          !isAutoGraded &&
          storedResult?.manuallyGraded === true;
        const scoringEnabled =
          isAutoGraded ||
          manuallyGraded;
        const maxPoints =
          isAutoGraded
            ? Math.max(
                Number(
                  storedResult?.maxPoints ??
                  storedResult?.points ??
                  question.points
                ) || 1,
                0
              )
            : manuallyGraded
              ? Math.max(
                  Number(
                    storedResult?.manualMaxPoints ??
                    storedResult?.points
                  ) || 0,
                  0
                )
              : 0;
        const earnedPoints =
          isAutoGraded
            ? (
                storedResult?.earnedPoints !== undefined
                  ? Number(storedResult.earnedPoints) || 0
                  : isCorrect === true
                    ? maxPoints
                    : 0
              )
            : manuallyGraded
              ? Number(
                  storedResult?.manualEarnedPoints ??
                  storedResult?.earnedPoints
                ) || 0
              : 0;
        return {
          questionId,
          number:
            index +
            1,
          question,
          userAnswer,
          correctAnswer,
          hasCorrectAnswer,
          isCorrect,
          scoringEnabled,
          isAutoGraded,
          manuallyGraded,
          gradingStatus:
            isAutoGraded
              ? "auto"
              : manuallyGraded
                ? "graded"
                : "pending",
          maxPoints,
          earnedPoints,
        };
      }
    );
  };
  // =========================================================
  // RESPONDENTS
  // =========================================================
  const respondents =
    useMemo(
      () => {
        return formSubmissions.map(
          (
            submission,
            index
          ) => {
            const respondentName =
              String(
                submission.respondentName ||
                submission.username ||
                submission.user?.username ||
                submission.user?.name ||
                `Respondent ${index + 1}`
              ).trim();
            const respondentEmail =
              String(
                submission.respondentEmail ||
                submission.email ||
                submission.user?.email ||
                ""
              ).trim();
            const questionResults =
              buildQuestionResults(
                submission
              );
            const calculatedScore =
              questionResults.reduce(
                (
                  total,
                  item
                ) => {
                  return (
                    total +
                    (
                      item.scoringEnabled
                        ? item.earnedPoints
                        : 0
                    )
                  );
                },
                0
              );
            const calculatedMaxScore =
              questionResults.reduce(
                (
                  total,
                  item
                ) => {
                  return (
                    total +
                    (
                      item.scoringEnabled
                        ? item.maxPoints
                        : 0
                    )
                  );
                },
                0
              );
            const storedScore =
              Number(
                submission.score
              );
            const storedMaxScore =
              Number(
                submission.maxScore
              );
            const score =
              Number.isFinite(
                storedScore
              )
                ? storedScore
                : calculatedScore;
            const maxScore =
              Number.isFinite(
                storedMaxScore
              ) &&
              storedMaxScore >
                0
                ? storedMaxScore
                : calculatedMaxScore;
            const scoreItems =
              questionResults.filter(
                (
                  item
                ) =>
                  item.scoringEnabled ||
                  item.isCorrect !==
                    null
              );
            const correctCount =
              scoreItems.filter(
                (
                  item
                ) =>
                  item.isCorrect ===
                  true
              ).length;
            const incorrectCount =
              scoreItems.filter(
                (
                  item
                ) =>
                  item.isCorrect ===
                  false
              ).length;
            const gradedQuestions =
              questionResults.filter(
                (item) =>
                  item.isAutoGraded ||
                  item.manuallyGraded
              ).length;
            const ungradedQuestions =
              questionResults.filter(
                (item) =>
                  !item.isAutoGraded &&
                  !item.manuallyGraded
              ).length;
            let percentage =
              Number(
                submission.percentage
              );
            if (
              !Number.isFinite(
                percentage
              )
            ) {
              percentage =
                maxScore >
                  0
                  ? Math.round(
                      (
                        score /
                        maxScore
                      ) *
                      100
                    )
                  : null;
            }
            return {
              id:
                submission.submissionId ||
                `${submission.formId || submission.id}-${index}-${submission.submittedAt || "submission"}`,
              submission,
              name:
                respondentName ||
                `Respondent ${index + 1}`,
              email:
                respondentEmail,
              initial:
                respondentName
                  .charAt(
                    0
                  )
                  .toUpperCase() ||
                "U",
              score,
              maxScore,
              percentage,
              correctCount,
              incorrectCount,
              gradedQuestions,
              ungradedQuestions,
              gradingComplete:
                ungradedQuestions === 0,
              questionResults,
              date:
                formatSubmittedDate(
                  submission.submittedAt
                ),
              time:
                formatSubmittedTime(
                  submission.submittedAt
                ),
              submittedAt:
                submission.submittedAt ||
                "",
              duration:
                submission.duration ||
                "-",
              status:
                submission.status ||
                "Completed",
              answers:
                submission.answers &&
                typeof submission.answers ===
                  "object"
                  ? submission.answers
                  : {},
              answeredQuestions:
                Number(
                  submission.answeredQuestions
                ) ||
                Object.values(
                  submission.answers ||
                  {}
                ).filter(
                  hasAnswer
                ).length,
              totalQuestions:
                Number(
                  submission.totalQuestions
                ) ||
                (
                  Array.isArray(
                    form?.questions
                  )
                    ? form.questions.length
                    : 0
                ),
            };
          }
        );
      },
      [
        formSubmissions,
        form,
      ]
    );
  // =========================================================
  // SCORED RESPONDENTS
  // =========================================================
  const scoredRespondents =
    useMemo(
      () => {
        return respondents.filter(
          (
            respondent
          ) =>
            Number.isFinite(
              respondent.percentage
            )
        );
      },
      [
        respondents,
      ]
    );
  // =========================================================
  // AVERAGE
  // =========================================================
  const averageScore =
    useMemo(
      () => {
        if (
          scoredRespondents.length ===
          0
        ) {
          return null;
        }
        const total =
          scoredRespondents.reduce(
            (
              sum,
              respondent
            ) =>
              sum +
              respondent.percentage,
            0
          );
        return Math.round(
          total /
          scoredRespondents.length
        );
      },
      [
        scoredRespondents,
      ]
    );
  // =========================================================
  // HIGHEST
  // =========================================================
  const highestScore =
    useMemo(
      () => {
        if (
          scoredRespondents.length ===
          0
        ) {
          return null;
        }
        return Math.max(
          ...scoredRespondents.map(
            (
              respondent
            ) =>
              respondent.percentage
          )
        );
      },
      [
        scoredRespondents,
      ]
    );
  // =========================================================
  // LOWEST
  // =========================================================
  const lowestScore =
    useMemo(
      () => {
        if (
          scoredRespondents.length ===
          0
        ) {
          return null;
        }
        return Math.min(
          ...scoredRespondents.map(
            (
              respondent
            ) =>
              respondent.percentage
          )
        );
      },
      [
        scoredRespondents,
      ]
    );
  // =========================================================
  // SCORE DISTRIBUTION
  // =========================================================
  const distribution =
    useMemo(
      () => {
        const groups = [
          {
            label: "90–100%",
            description: "Excellent",
            minimum: 90,
            maximum: 100,
            color: "green",
          },
          {
            label: "75–89%",
            description: "Good",
            minimum: 75,
            maximum: 89,
            color: "blue",
          },
          {
            label: "60–74%",
            description: "Fair",
            minimum: 60,
            maximum: 74,
            color: "orange",
          },
          {
            label: "< 60%",
            description: "Needs improvement",
            minimum: 0,
            maximum: 59,
            color: "gray",
          },
        ];
        return groups.map(
          (
            group
          ) => {
            const count =
              scoredRespondents.filter(
                (
                  respondent
                ) => {
                  return (
                    respondent.percentage >=
                      group.minimum &&
                    respondent.percentage <=
                      group.maximum
                  );
                }
              ).length;
            const value =
              scoredRespondents.length >
                0
                ? Math.round(
                    (
                      count /
                      scoredRespondents.length
                    ) *
                    100
                  )
                : 0;
            return {
              ...group,
              count,
              value,
            };
          }
        );
      },
      [
        scoredRespondents,
      ]
    );
  // =========================================================
  // TOTAL RESPONSES
  // =========================================================
  const totalResponses =
    respondents.length;
  // =========================================================
  // SCORE CLASS
  // =========================================================
  const getScoreClass = (
    score
  ) => {
    if (
      !Number.isFinite(
        score
      )
    ) {
      return "score-empty";
    }
    if (
      score >=
      90
    ) {
      return "score-high";
    }
    if (
      score >=
      75
    ) {
      return "score-medium";
    }
    return "score-low";
  };
  // =========================================================
  // FILTER + SORT
  // =========================================================
  const filteredRespondents =
    useMemo(
      () => {
        const keyword =
          search
            .trim()
            .toLowerCase();
        const filtered =
          respondents.filter(
            (
              respondent
            ) => {
              return (
                respondent.name
                  .toLowerCase()
                  .includes(
                    keyword
                  ) ||
                respondent.email
                  .toLowerCase()
                  .includes(
                    keyword
                  )
              );
            }
          );
        return [
          ...filtered,
        ].sort(
          (
            first,
            second
          ) => {
            if (
              sortOrder ===
              "highest"
            ) {
              return (
                (
                  second.percentage ??
                  -1
                ) -
                (
                  first.percentage ??
                  -1
                )
              );
            }
            if (
              sortOrder ===
              "lowest"
            ) {
              return (
                (
                  first.percentage ??
                  Number.MAX_SAFE_INTEGER
                ) -
                (
                  second.percentage ??
                  Number.MAX_SAFE_INTEGER
                )
              );
            }
            if (
              sortOrder ===
              "name"
            ) {
              return first.name.localeCompare(
                second.name
              );
            }
            if (
              sortOrder ===
              "oldest"
            ) {
              return (
                getDateValue(
                  first.submittedAt
                ) -
                getDateValue(
                  second.submittedAt
                )
              );
            }
            return (
              getDateValue(
                second.submittedAt
              ) -
              getDateValue(
                first.submittedAt
              )
            );
          }
        );
      },
      [
        respondents,
        search,
        sortOrder,
      ]
    );
  // =========================================================
  // VIEW ANSWERS
  // =========================================================
  const openRespondentAnswers = (
    respondent
  ) => {
    const initialGrades = {};
    respondent.questionResults.forEach((item) => {
      if (!item.isAutoGraded) {
        initialGrades[String(item.questionId)] = {
          earnedPoints: item.manuallyGraded
            ? Number(item.earnedPoints) || 0
            : "",
          maxPoints: item.manuallyGraded
            ? Number(item.maxPoints) || 0
            : "",
          graded: item.manuallyGraded === true,
        };
      }
    });
    setManualGrades(initialGrades);
    setSelectedRespondent(respondent);
    document.body.style.overflow =
      "hidden";
  };
  // =========================================================
  // MANUAL GRADE INPUT
  // =========================================================
  const updateManualGradeField = (questionId, field, value) => {
    setManualGrades((previous) => ({
      ...previous,
      [String(questionId)]: {
        ...(previous[String(questionId)] || {}),
        [field]: value,
      },
    }));
  };
  const saveManualGrades = () => {
    if (!selectedRespondent) return;
    const gradesToSave = {};
    for (const item of selectedRespondent.questionResults) {
      if (item.isAutoGraded) continue;
      const draft = manualGrades[String(item.questionId)] || {};
      const earnedRaw = draft.earnedPoints;
      const maxRaw = draft.maxPoints;
      const untouched =
        earnedRaw === "" &&
        maxRaw === "" &&
        draft.graded !== true;
      if (untouched) continue;
      const earned = Number(earnedRaw);
      const max = Number(maxRaw);
      if (!Number.isFinite(max) || max <= 0) {
        alert(`Isi nilai maksimal untuk soal nomor ${item.number}.`);
        return;
      }
      if (!Number.isFinite(earned) || earned < 0 || earned > max) {
        alert(`Nilai soal nomor ${item.number} harus antara 0 sampai ${max}.`);
        return;
      }
      gradesToSave[String(item.questionId)] = {
        earnedPoints: earned,
        maxPoints: max,
        graded: true,
      };
    }
    if (Object.keys(gradesToSave).length === 0) {
      alert("Belum ada nilai manual yang diisi.");
      return;
    }
    if (typeof updateSubmissionGrading !== "function") {
      alert("Fungsi penyimpanan nilai belum tersedia. Pastikan FormContext sudah diperbarui.");
      return;
    }
    setGradingSaving(true);
    try {
      updateSubmissionGrading(
        selectedRespondent.id,
        gradesToSave
      );
      alert("Nilai manual berhasil disimpan dan total nilai telah diperbarui.");
      closeRespondentAnswers();
    } catch (error) {
      console.error("Gagal menyimpan nilai manual:", error);
      alert("Nilai manual gagal disimpan.");
    } finally {
      setGradingSaving(false);
    }
  };
  // =========================================================
  // CLOSE ANSWERS
  // =========================================================
  const closeRespondentAnswers =
    () => {
      setSelectedRespondent(
        null
      );
      document.body.style.overflow =
        "";
  };
  // =========================================================
  // EXPORT EXCEL
  // Creates a real table layout that opens directly in
  // Microsoft Excel / WPS Spreadsheet without all values
  // being placed in column A.
  // =========================================================
  const exportExcel =
    () => {
      setShowExportMenu(
        false
      );
      if (
        respondents.length ===
        0
      ) {
        alert(
          "No responses are available to export."
        );
        return;
      }
      const questionList =
        Array.isArray(
          form?.questions
        )
          ? form.questions
          : [];
      const getQuestionTitle =
        (
          question,
          index
        ) => {
          const rawTitle =
            question?.title ||
            question?.question ||
            `Question ${index + 1}`;
          const cleanTitle =
            stripHtmlToText(
              rawTitle
            );
          return (
            cleanTitle ||
            `Question ${index + 1}`
          );
        };
      const getGradingStatus =
        (
          respondent
        ) => {
          const graded =
            Number(
              respondent.gradedQuestions
            ) || 0;
          const ungraded =
            Number(
              respondent.ungradedQuestions
            ) || 0;
          if (
            ungraded >
              0 &&
            graded ===
              0
          ) {
            return "Not Graded";
          }
          if (
            ungraded >
            0
          ) {
            return "Partially Graded";
          }
          return "Graded";
        };
      const exportRows =
        respondents.map(
          (
            respondent,
            index
          ) => {
            const questionResults =
              Array.isArray(
                respondent.questionResults
              )
                ? respondent.questionResults
                : [];
            const autoResults =
              questionResults.filter(
                (
                  item
                ) =>
                  item.isAutoGraded ===
                  true
              );
            const manualResults =
              questionResults.filter(
                (
                  item
                ) =>
                  item.isAutoGraded !==
                    true &&
                  item.manuallyGraded ===
                    true
              );
            const autoEarned =
              autoResults.reduce(
                (
                  total,
                  item
                ) =>
                  total +
                  (
                    Number(
                      item.earnedPoints
                    ) || 0
                  ),
                0
              );
            const autoMax =
              autoResults.reduce(
                (
                  total,
                  item
                ) =>
                  total +
                  (
                    Number(
                      item.maxPoints
                    ) || 0
                  ),
                0
              );
            const manualEarned =
              manualResults.reduce(
                (
                  total,
                  item
                ) =>
                  total +
                  (
                    Number(
                      item.earnedPoints
                    ) || 0
                  ),
                0
              );
            const manualMax =
              manualResults.reduce(
                (
                  total,
                  item
                ) =>
                  total +
                  (
                    Number(
                      item.maxPoints
                    ) || 0
                  ),
                0
              );
            const gradingStatus =
              getGradingStatus(
                respondent
              );
            const totalScore =
              gradingStatus ===
                "Not Graded"
                ? "Not Graded"
                : (
                    respondent.maxScore >
                    0
                      ? `${respondent.score}/${respondent.maxScore}`
                      : "Not Graded"
                  );
            const percentage =
              gradingStatus ===
                "Not Graded"
                ? "Not Graded"
                : (
                    Number.isFinite(
                      respondent.percentage
                    )
                      ? (
                          gradingStatus ===
                            "Partially Graded"
                            ? `${respondent.percentage}% (Partial)`
                            : `${respondent.percentage}%`
                        )
                      : "Not Graded"
                  );
            const answerValues =
              questionList.map(
                (
                  question,
                  questionIndex
                ) => {
                  const questionId =
                    question.id ??
                    `question-${questionIndex + 1}`;
                  return normalizeAnswer(
                    respondent.answers[
                      questionId
                    ]
                  );
                }
              );
            return [
              index +
                1,
              respondent.name,
              respondent.email,
              respondent.date,
              respondent.time,
              gradingStatus,
              autoMax >
                0
                ? `${autoEarned}/${autoMax}`
                : "-",
              manualMax >
                0
                ? `${manualEarned}/${manualMax}`
                : (
                    Number(
                      respondent.ungradedQuestions
                    ) >
                    0
                      ? "Not Graded"
                      : "-"
                  ),
              totalScore,
              percentage,
              Number(
                respondent.ungradedQuestions
              ) || 0,
              ...answerValues,
            ];
          }
        );
      const headers = [
        "No",
        "Respondent",
        "Email",
        "Submission Date",
        "Submission Time",
        "Grading Status",
        "Auto Score",
        "Manual Score",
        "Total Score",
        "Percentage",
        "Ungraded Questions",
        ...questionList.map(
          (
            question,
            index
          ) =>
            `Q${index + 1} - ${getQuestionTitle(
              question,
              index
            )}`
        ),
      ];
      const headerHtml =
        headers
          .map(
            (
              header
            ) =>
              `<th>${escapeHtml(
                header
              )}</th>`
          )
          .join(
            ""
          );
      const bodyHtml =
        exportRows
          .map(
            (
              row
            ) => {
              const cells =
                row
                  .map(
                    (
                      value,
                      cellIndex
                    ) => {
                      const className =
                        cellIndex >=
                          11
                          ? "answer-cell"
                          : "";
                      return (
                        `<td class="${className}">${escapeHtml(
                          value
                        )}</td>`
                      );
                    }
                  )
                  .join(
                    ""
                  );
              return `<tr>${cells}</tr>`;
            }
          )
          .join(
            ""
          );
      const workbookHtml =
        `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta http-equiv="Content-Type" content="application/vnd.ms-excel; charset=UTF-8" />
<style>
  table {
    border-collapse: collapse;
    font-family: Arial, sans-serif;
    font-size: 11pt;
  }
  th {
    padding: 9px 11px;
    border: 1px solid #cbd5e1;
    background: #1f5fa4;
    color: #ffffff;
    font-weight: 700;
    text-align: center;
    vertical-align: middle;
    white-space: nowrap;
  }
  td {
    padding: 8px 10px;
    border: 1px solid #d9e2ec;
    color: #24364b;
    vertical-align: top;
    white-space: nowrap;
  }
  tr:nth-child(even) td {
    background: #f7fafe;
  }
  .answer-cell {
    min-width: 180px;
    max-width: 420px;
    white-space: pre-wrap;
    word-break: break-word;
  }
</style>
</head>
<body>
<table>
  <thead>
    <tr>${headerHtml}</tr>
  </thead>
  <tbody>
    ${bodyHtml}
  </tbody>
</table>
</body>
</html>`;
      const blob =
        new Blob(
          [
            "\uFEFF",
            workbookHtml,
          ],
          {
            type: "application/vnd.ms-excel;charset=utf-8;",
          }
        );
      const downloadUrl =
        URL.createObjectURL(
          blob
        );
      const downloadLink =
        document.createElement(
          "a"
        );
      const safeTitle =
        form.title
          .replace(
            /[^a-z0-9]/gi,
            "-"
          )
          .replace(
            /-+/g,
            "-"
          )
          .replace(
            /^-+|-+$/g,
            ""
          )
          .toLowerCase();
      downloadLink.href =
        downloadUrl;
      downloadLink.download =
        `${safeTitle || "hidocs-form"}-responses.xls`;
      document.body.appendChild(
        downloadLink
      );
      downloadLink.click();
      document.body.removeChild(
        downloadLink
      );
      URL.revokeObjectURL(
        downloadUrl
      );
      setExportStatus(
        "excel"
      );
      window.setTimeout(
        () =>
          setExportStatus(
            ""
          ),
        1800
      );
  };
  // =========================================================
  // EXPORT PDF
  // Opens a dedicated printable report instead of printing
  // the entire Admin Results page.
  // =========================================================
  const exportPDF =
    () => {
      setShowExportMenu(
        false
      );
      if (
        respondents.length ===
        0
      ) {
        alert(
          "No responses are available to export."
        );
        return;
      }
      const questionList =
        Array.isArray(
          form?.questions
        )
          ? form.questions
          : [];
      const getQuestionTitle =
        (
          question,
          index
        ) => {
          const rawTitle =
            question?.title ||
            question?.question ||
            `Question ${index + 1}`;
          const cleanTitle =
            stripHtmlToText(
              rawTitle
            );
          return (
            cleanTitle ||
            `Question ${index + 1}`
          );
        };
      const getGradingStatus =
        (
          respondent
        ) => {
          const graded =
            Number(
              respondent.gradedQuestions
            ) || 0;
          const ungraded =
            Number(
              respondent.ungradedQuestions
            ) || 0;
          if (
            ungraded >
              0 &&
            graded ===
              0
          ) {
            return "Not Graded";
          }
          if (
            ungraded >
            0
          ) {
            return "Partially Graded";
          }
          return "Graded";
        };
      const respondentRows =
        respondents
          .map(
            (
              respondent,
              index
            ) => {
              const status =
                getGradingStatus(
                  respondent
                );
              const totalScore =
                status ===
                  "Not Graded"
                  ? "Not Graded"
                  : (
                      respondent.maxScore >
                      0
                        ? `${respondent.score}/${respondent.maxScore}`
                        : "Not Graded"
                    );
              const percentage =
                status ===
                  "Not Graded"
                  ? "-"
                  : (
                      Number.isFinite(
                        respondent.percentage
                      )
                        ? `${respondent.percentage}%`
                        : "-"
                    );
              return `
                <tr>
                  <td>${index + 1}</td>
                  <td>${escapeHtml(respondent.name)}</td>
                  <td>${escapeHtml(respondent.email || "-")}</td>
                  <td>${escapeHtml(respondent.date)}</td>
                  <td>${escapeHtml(respondent.time)}</td>
                  <td>${escapeHtml(status)}</td>
                  <td>${escapeHtml(totalScore)}</td>
                  <td>${escapeHtml(percentage)}</td>
                  <td>${Number(respondent.ungradedQuestions) || 0}</td>
                </tr>
              `;
            }
          )
          .join(
            ""
          );
      const detailSections =
        respondents
          .map(
            (
              respondent,
              respondentIndex
            ) => {
              const status =
                getGradingStatus(
                  respondent
                );
              const totalScore =
                status ===
                  "Not Graded"
                  ? "Not Graded"
                  : (
                      respondent.maxScore >
                      0
                        ? `${respondent.score}/${respondent.maxScore}`
                        : "Not Graded"
                    );
              const percentage =
                status ===
                  "Not Graded"
                  ? "-"
                  : (
                      Number.isFinite(
                        respondent.percentage
                      )
                        ? `${respondent.percentage}%`
                        : "-"
                    );
              const answerRows =
                questionList
                  .map(
                    (
                      question,
                      questionIndex
                    ) => {
                      const questionId =
                        question.id ??
                        `question-${questionIndex + 1}`;
                      const questionResult =
                        Array.isArray(
                          respondent.questionResults
                        )
                          ? respondent.questionResults.find(
                              (
                                item
                              ) =>
                                String(
                                  item.questionId
                                ) ===
                                String(
                                  questionId
                                )
                            )
                          : null;
                      const answer =
                        normalizeAnswer(
                          respondent.answers[
                            questionId
                          ]
                        );
                      let questionStatus =
                        "Not Graded";
                      let questionScore =
                        "-";
                      if (
                        questionResult?.isAutoGraded
                      ) {
                        questionStatus =
                          questionResult.isCorrect ===
                            true
                            ? "Correct"
                            : questionResult.isCorrect ===
                              false
                              ? "Incorrect"
                              : "Auto Graded";
                        questionScore =
                          `${Number(questionResult.earnedPoints) || 0}/${Number(questionResult.maxPoints) || 0}`;
                      } else if (
                        questionResult?.manuallyGraded
                      ) {
                        questionStatus =
                          "Manually Graded";
                        questionScore =
                          `${Number(questionResult.earnedPoints) || 0}/${Number(questionResult.maxPoints) || 0}`;
                      }
                      return `
                        <tr>
                          <td>${questionIndex + 1}</td>
                          <td>${escapeHtml(getQuestionTitle(question, questionIndex))}</td>
                          <td class="answer-cell">${escapeHtml(answer)}</td>
                          <td>${escapeHtml(questionStatus)}</td>
                          <td>${escapeHtml(questionScore)}</td>
                        </tr>
                      `;
                    }
                  )
                  .join(
                    ""
                  );
              return `
                <section class="respondent-detail">
                  <div class="respondent-detail-header">
                    <div>
                      <span>Respondent ${respondentIndex + 1}</span>
                      <h2>${escapeHtml(respondent.name)}</h2>
                      <p>${escapeHtml(respondent.email || "-")}</p>
                    </div>
                    <div class="detail-score">
                      <span>Total Score</span>
                      <strong>${escapeHtml(totalScore)}</strong>
                      <small>${escapeHtml(percentage)}</small>
                    </div>
                  </div>
                  <div class="detail-meta">
                    <div>
                      <span>Submitted</span>
                      <strong>${escapeHtml(respondent.date)} • ${escapeHtml(respondent.time)}</strong>
                    </div>
                    <div>
                      <span>Grading Status</span>
                      <strong>${escapeHtml(status)}</strong>
                    </div>
                    <div>
                      <span>Ungraded Questions</span>
                      <strong>${Number(respondent.ungradedQuestions) || 0}</strong>
                    </div>
                  </div>
                  <table class="detail-table">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Question</th>
                        <th>User Answer</th>
                        <th>Status</th>
                        <th>Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${answerRows}
                    </tbody>
                  </table>
                </section>
              `;
            }
          )
          .join(
            ""
          );
      const averageDisplay =
        averageScore !==
          null
          ? `${averageScore}%`
          : "-";
      const highestDisplay =
        highestScore !==
          null
          ? `${highestScore}%`
          : "-";
      const lowestDisplay =
        lowestScore !==
          null
          ? `${lowestScore}%`
          : "-";
      const reportHtml =
        `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>${escapeHtml(form.title)} - Results Report</title>
<style>
  @page {
    size: A4 landscape;
    margin: 12mm;
  }
  * {
    box-sizing: border-box;
  }
  body {
    margin: 0;
    color: #20344d;
    background: #ffffff;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 10px;
  }
  .report {
    width: 100%;
  }
  .report-header {
    margin-bottom: 18px;
    padding: 18px 20px;
    border-radius: 12px;
    background: #1f5fa4;
    color: #ffffff;
  }
  .report-header span {
    display: block;
    margin-bottom: 5px;
    font-size: 8px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    opacity: .78;
  }
  .report-header h1 {
    margin: 0 0 5px;
    font-size: 22px;
  }
  .report-header p {
    margin: 0;
    font-size: 9px;
    opacity: .82;
  }
  .summary-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 9px;
    margin-bottom: 16px;
  }
  .summary-card {
    padding: 12px;
    border: 1px solid #dce6f0;
    border-radius: 10px;
    background: #f8fbff;
  }
  .summary-card span {
    display: block;
    margin-bottom: 4px;
    color: #71859b;
    font-size: 7px;
    text-transform: uppercase;
  }
  .summary-card strong {
    color: #203b59;
    font-size: 18px;
  }
  h2.section-title {
    margin: 0 0 8px;
    color: #263b54;
    font-size: 14px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th {
    padding: 8px;
    border: 1px solid #cbd8e5;
    background: #eaf3fd;
    color: #245b91;
    font-size: 8px;
    text-align: left;
  }
  td {
    padding: 8px;
    border: 1px solid #dce5ee;
    color: #334b63;
    font-size: 8px;
    vertical-align: top;
  }
  tbody tr:nth-child(even) td {
    background: #fafcff;
  }
  .summary-table {
    margin-bottom: 22px;
  }
  .respondent-detail {
    margin-top: 18px;
    padding-top: 4px;
    break-before: page;
    page-break-before: always;
  }
  .respondent-detail:first-of-type {
    break-before: auto;
    page-break-before: auto;
  }
  .respondent-detail-header {
    margin-bottom: 9px;
    padding: 12px 14px;
    border-radius: 10px;
    background: #f1f6fc;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }
  .respondent-detail-header span {
    color: #7890a8;
    font-size: 7px;
    text-transform: uppercase;
  }
  .respondent-detail-header h2 {
    margin: 3px 0;
    color: #263d56;
    font-size: 15px;
  }
  .respondent-detail-header p {
    margin: 0;
    color: #7a8da1;
    font-size: 8px;
  }
  .detail-score {
    min-width: 110px;
    text-align: right;
  }
  .detail-score strong {
    display: block;
    margin: 2px 0;
    color: #1f5fa4;
    font-size: 17px;
  }
  .detail-score small {
    color: #75889c;
  }
  .detail-meta {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-bottom: 10px;
  }
  .detail-meta > div {
    padding: 9px 10px;
    border: 1px solid #dde6ef;
    border-radius: 8px;
  }
  .detail-meta span {
    display: block;
    margin-bottom: 3px;
    color: #8395a8;
    font-size: 7px;
  }
  .detail-meta strong {
    color: #314961;
    font-size: 8px;
  }
  .detail-table .answer-cell {
    width: 36%;
    white-space: pre-wrap;
    word-break: break-word;
  }
  .report-footer {
    margin-top: 14px;
    color: #91a0af;
    font-size: 7px;
    text-align: center;
  }
  @media print {
    body {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
</style>
</head>
<body>
<div class="report">
  <header class="report-header">
    <span>
      HiDocs • Form Results Report
    </span>
    <h1>
      ${escapeHtml(form.title)}
    </h1>
    <p>
      ${escapeHtml(form.description || "Respondent results and grading report.")}
    </p>
  </header>
  <section class="summary-grid">
    <div class="summary-card">
      <span>Total Responses</span>
      <strong>${totalResponses}</strong>
    </div>
    <div class="summary-card">
      <span>Average Score</span>
      <strong>${averageDisplay}</strong>
    </div>
    <div class="summary-card">
      <span>Highest Score</span>
      <strong>${highestDisplay}</strong>
    </div>
    <div class="summary-card">
      <span>Lowest Score</span>
      <strong>${lowestDisplay}</strong>
    </div>
  </section>
  <h2 class="section-title">
    Respondent Score Summary
  </h2>
  <table class="summary-table">
    <thead>
      <tr>
        <th>No</th>
        <th>Respondent</th>
        <th>Email</th>
        <th>Date</th>
        <th>Time</th>
        <th>Grading Status</th>
        <th>Total Score</th>
        <th>Percentage</th>
        <th>Ungraded</th>
      </tr>
    </thead>
    <tbody>
      ${respondentRows}
    </tbody>
  </table>
  ${detailSections}
  <div class="report-footer">
    Generated by HiDocs Admin Results
  </div>
</div>
<script>
  window.addEventListener("load", function () {
    window.setTimeout(function () {
      window.print();
    }, 250);
  });
</script>
</body>
</html>`;
      const printWindow =
        window.open(
          "",
          "_blank",
          "width=1200,height=800"
        );
      if (!printWindow) {
        alert(
          "Please allow pop-ups so the PDF report can be opened."
        );
        return;
      }
      printWindow.document.open();
      printWindow.document.write(
        reportHtml
      );
      printWindow.document.close();
      setExportStatus(
        "pdf"
      );
      window.setTimeout(
        () =>
          setExportStatus(
            ""
          ),
        1800
      );
  };
  // =========================================================
  // BACK
  // =========================================================
  const goBack =
    () => {
      navigate(
        `/admin/forms/${id}`
      );
  };
  // =========================================================
  // FORM NOT FOUND
  // =========================================================
  if (!form) {
    return (
      <div
        className={
          darkMode
            ? "admin-results-page dark"
            : "admin-results-page"
        }
      >
      <style>{adminResultsStyles}</style>
        <div className="results-not-found">
          <div className="results-not-found-icon">
            <FaWpforms />
          </div>
          <h2>
            Hasil form tidak ditemukan
          </h2>
          <p>
            Form yang kamu cari mungkin sudah dihapus atau tidak tersedia.
          </p>
          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/forms"
              )
            }
          >
            <FaArrowLeft />
            Kembali ke Manage Forms
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
          ? "admin-results-page dark"
          : "admin-results-page"
      }
    >
      <style>{adminResultsStyles}</style>
      {/* =====================================================
          HEADER
      ===================================================== */}
      <header className="results-header">
        <div className="results-header-decoration">
          <span className="results-header-circle circle-one"></span>
          <span className="results-header-circle circle-two"></span>
          <div className="results-header-dots">
            {Array.from({
              length: 12,
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
        <div className="results-header-top">
          <button
            type="button"
            className="results-back-btn"
            onClick={
              goBack
            }
          >
            <FaArrowLeft />
          </button>
          <span className="results-header-label">
            Form Results
          </span>
          <div className="results-export-wrapper">
            <button
              type="button"
              className="results-export-trigger"
              onClick={() =>
                setShowExportMenu(
                  (
                    previous
                  ) =>
                    !previous
                )
              }
            >
              <FaDownload />
              <span>
                Export
              </span>
              <FaChevronDown />
            </button>
            {showExportMenu && (
              <div className="results-export-menu">
                <button
                  type="button"
                  onClick={
                    exportExcel
                  }
                >
                  <span className="export-menu-icon excel">
                    <FaFileExcel />
                  </span>
                  <div>
                    <strong>
                      Export Excel
                    </strong>
                    <small>
                      Download spreadsheet
                    </small>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={
                    exportPDF
                  }
                >
                  <span className="export-menu-icon pdf">
                    <FaFilePdf />
                  </span>
                  <div>
                    <strong>
                      Export PDF
                    </strong>
                    <small>
                      Print or save PDF
                    </small>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="results-header-content">
          <div className="results-header-icon">
            <FaChartBar />
          </div>
          <div className="results-header-information">
            <span className="results-label">
              Analytics Dashboard
            </span>
            <h1>
              {form.title}
            </h1>
            <p>
              {form.description}
            </p>
          </div>
        </div>
      </header>
      {/* =====================================================
          MAIN
      ===================================================== */}
      <main className="results-content">
        {/* ===================================================
            OVERVIEW
        =================================================== */}
        <section className="results-overview">
          <div className="results-section-heading">
            <div>
              <span className="results-section-eyebrow">
                Overview
              </span>
              <h2>
                Performance summary
              </h2>
            </div>
            <span className="results-update-label">
              Updated recently
            </span>
          </div>
          <div className="results-stats">
            <article className="result-stat-card responses">
              <div className="result-stat-icon">
                <FaUsers />
              </div>
              <div className="result-stat-info">
                <span>
                  Total responses
                </span>
                <strong>
                  {totalResponses}
                </strong>
                <small>
                  All submitted responses
                </small>
              </div>
              <div className="result-stat-decoration"></div>
            </article>
            <article className="result-stat-card average">
              <div className="result-stat-icon">
                <FaChartLine />
              </div>
              <div className="result-stat-info">
                <span>
                  Average score
                </span>
                <strong>
                  {averageScore !==
                  null
                    ? `${averageScore}%`
                    : "—"
                  }
                </strong>
                <small>
                  Overall respondent average
                </small>
              </div>
              <div className="result-stat-decoration"></div>
            </article>
            <article className="result-stat-card highest">
              <div className="result-stat-icon">
                <FaTrophy />
              </div>
              <div className="result-stat-info">
                <span>
                  Highest score
                </span>
                <strong>
                  {highestScore !==
                  null
                    ? `${highestScore}%`
                    : "—"
                  }
                </strong>
                <small>
                  Best respondent result
                </small>
              </div>
              <div className="result-stat-decoration"></div>
            </article>
            <article className="result-stat-card lowest">
              <div className="result-stat-icon">
                <FaArrowDown />
              </div>
              <div className="result-stat-info">
                <span>
                  Lowest score
                </span>
                <strong>
                  {lowestScore !==
                  null
                    ? `${lowestScore}%`
                    : "—"
                  }
                </strong>
                <small>
                  Lowest respondent result
                </small>
              </div>
              <div className="result-stat-decoration"></div>
            </article>
          </div>
        </section>
        {/* ===================================================
            DISTRIBUTION
        =================================================== */}
        <section className="results-panel score-section">
          <div className="results-panel-heading">
            <div>
              <span className="results-section-eyebrow">
                Score Analytics
              </span>
              <h2>
                Score Distribution
              </h2>
            </div>
            <div className="score-summary-icon">
              <FaChartBar />
            </div>
          </div>
          {scoredRespondents.length ===
          0 ? (
            <div className="respondents-empty">
              <div className="respondents-empty-icon">
                <FaChartBar />
              </div>
              <h3>
                Score data is not available
              </h3>
              <p>
                This form does not contain scored questions.
              </p>
            </div>
          ) : (
            <div className="score-distribution">
              {distribution.map(
                (
                  item,
                  index
                ) => (
                  <article
                    className="score-row"
                    key={
                      index
                    }
                  >
                    <div className="score-row-label">
                      <strong>
                        {item.label}
                      </strong>
                      <span>
                        {item.description}
                      </span>
                    </div>
                    <div className="score-bar-area">
                      <div className="score-bar">
                        <div
                          className={
                            `score-bar-fill ${item.color}`
                          }
                          style={{
                            width: `${item.value}%`,
                          }}
                        ></div>
                      </div>
                      <span className="score-percentage">
                        {item.value}%
                      </span>
                    </div>
                    <div className="score-count">
                      <strong>
                        {item.count}
                      </strong>
                      <span>
                        respondents
                      </span>
                    </div>
                  </article>
                )
              )}
            </div>
          )}
        </section>
        {/* ===================================================
            RESPONDENTS
        =================================================== */}
        <section className="results-panel respondents-section">
          <div className="respondents-header">
            <div>
              <span className="results-section-eyebrow">
                Participants
              </span>
              <h2>
                Respondents
              </h2>
            </div>
            <span className="respondents-count">
              {filteredRespondents.length}
              {" "}
              participants
            </span>
          </div>
          <div className="respondents-toolbar">
            <div className="respondents-search">
              <FaSearch />
              <input
                type="text"
                value={
                  search
                }
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search respondent..."
              />
            </div>
            <div className="respondents-sort">
              <FaSortAmountDown />
              <select
                value={
                  sortOrder
                }
                onChange={(event) =>
                  setSortOrder(
                    event.target.value
                  )
                }
              >
                <option value="newest">
                  Newest submission
                </option>
                <option value="oldest">
                  Oldest submission
                </option>
                <option value="highest">
                  Highest score
                </option>
                <option value="lowest">
                  Lowest score
                </option>
                <option value="name">
                  Name A–Z
                </option>
              </select>
            </div>
          </div>
          <div className="respondents-list">
            {filteredRespondents.length ===
            0 ? (
              <div className="respondents-empty">
                <div className="respondents-empty-icon">
                  <FaUser />
                </div>
                <h3>
                  {respondents.length ===
                  0
                    ? "No responses yet"
                    : "No respondents found"
                  }
                </h3>
                <p>
                  {respondents.length ===
                  0
                    ? "Responses submitted by users will appear here."
                    : "Try searching with another name."
                  }
                </p>
              </div>
            ) : (
              filteredRespondents.map(
                (
                  respondent,
                  index
                ) => (
                  <article
                    className="respondent-card"
                    key={respondent.id}
                  >
                    {/* =========================
                        LEFT SIDE
                    ========================= */}
                    <div className="respondent-main">
                      <span className="respondent-number">
                        {index + 1}
                      </span>
                      <div className="respondent-avatar">
                        {respondent.initial}
                      </div>
                      <div className="respondent-info">
                        <strong>
                          {respondent.name}
                        </strong>
                        {respondent.email && (
                          <small>
                            {respondent.email}
                          </small>
                        )}
                        <div className="respondent-status">
                          <FaCheck />
                          <span>
                            {respondent.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* =========================
                        DATE & TIME
                    ========================= */}
                    <div className="respondent-meta">
                      <div className="respondent-meta-chip">
                        <FaCalendarAlt />
                        <div>
                          <span>
                            Submitted
                          </span>
                          <strong>
                            {respondent.date}
                          </strong>
                        </div>
                      </div>
                      <div className="respondent-meta-chip">
                        <FaClock />
                        <div>
                          <span>
                            Time
                          </span>
                          <strong>
                            {respondent.time}
                          </strong>
                        </div>
                      </div>
                    </div>
                    {/* =========================
                        RIGHT SIDE
                    ========================= */}
                    <div className="respondent-actions">
                      <div
                        className={
                          `respondent-score ${getScoreClass(
                            respondent.score
                          )}`
                        }
                      >
                        <span>
                          Score
                        </span>
                        <strong>
                          {respondent.score !== null
                            ? `${respondent.score}%`
                            : "—"
                          }
                        </strong>
                      </div>
                      <button
                        type="button"
                        className="respondent-view-answers-btn"
                        onClick={() =>
                          setSelectedRespondent(
                            respondent
                          )
                        }
                      >
                        <FaEye />
                        <span>
                          View Answers
                        </span>
                      </button>
                    </div>
                  </article>
                )
              )
            )}
          </div>
        </section>
        {/* ===================================================
            EXPORT CARD
        =================================================== */}
        <section className="results-export-card">
          <div className="results-export-card-icon">
            <FaDownload />
          </div>
          <div className="results-export-card-content">
            <span>
              Download report
            </span>
            <h2>
              Export response data
            </h2>
            <p>
              Download respondent data and analytics in spreadsheet or PDF format.
            </p>
          </div>
          <div className="results-export-actions">
            <button
              type="button"
              className={
                exportStatus ===
                  "excel"
                  ? "export-btn excel exported"
                  : "export-btn excel"
              }
              onClick={
                exportExcel
              }
            >
              {exportStatus ===
              "excel"
                ? <FaCheck />
                : <FaFileExcel />
              }
              <span>
                Excel
              </span>
            </button>
            <button
              type="button"
              className={
                exportStatus ===
                  "pdf"
                  ? "export-btn pdf exported"
                  : "export-btn pdf"
              }
              onClick={
                exportPDF
              }
            >
              {exportStatus ===
              "pdf"
                ? <FaCheck />
                : <FaFilePdf />
              }
              <span>
                PDF
              </span>
            </button>
          </div>
        </section>
      </main>
      {/* =====================================================
          ADMIN ANSWER MODAL
      ===================================================== */}
      {selectedRespondent && (
        <div
          className="admin-answer-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeRespondentAnswers();
            }
          }}
        >
          <section className="admin-answer-modal">
            {/* ===============================================
                MODAL HEADER
            =============================================== */}
            <div className="admin-answer-modal-header">
              <div className="admin-answer-modal-user">
                <div className="admin-answer-modal-avatar">
                  {selectedRespondent.initial}
                </div>
                <div>
                  <span>
                    Respondent Answers
                  </span>
                  <h2>
                    {selectedRespondent.name}
                  </h2>
                  {selectedRespondent.email && (
                    <p>
                      {selectedRespondent.email}
                    </p>
                  )}
                </div>
              </div>
              <button
                type="button"
                className="admin-answer-close-btn"
                onClick={
                  closeRespondentAnswers
                }
              >
                <FaTimes />
              </button>
            </div>
            {/* ===============================================
                SUBMISSION SUMMARY
            =============================================== */}
            <div className="admin-answer-summary">
              <div>
                <span>
                  Submitted
                </span>
                <strong>
                  {selectedRespondent.date}
                  {" • "}
                  {selectedRespondent.time}
                </strong>
              </div>
              <div>
                <span>
                  Answered
                </span>
                <strong>
                  {selectedRespondent.answeredQuestions}
                  /
                  {selectedRespondent.totalQuestions}
                </strong>
              </div>
              <div>
                <span>
                  Correct
                </span>
                <strong>
                  {selectedRespondent.correctCount}
                </strong>
              </div>
              <div>
                <span>
                  Incorrect
                </span>
                <strong>
                  {selectedRespondent.incorrectCount}
                </strong>
              </div>
            </div>
            {/* ===============================================
                SCORE
            =============================================== */}
            {selectedRespondent.maxScore >
              0 && (
              <div className="admin-answer-score-card">
                <div className="admin-answer-score-icon">
                  <FaTrophy />
                </div>
                <div>
                  <span>
                    Respondent Score
                  </span>
                  <strong>
                    {selectedRespondent.score}
                    /
                    {selectedRespondent.maxScore}
                  </strong>
                </div>
                <div className="admin-answer-score-percentage">
                  {selectedRespondent.percentage}%
                </div>
              </div>
            )}
            <div
              className={
                selectedRespondent.gradingComplete
                  ? "admin-grading-progress complete"
                  : "admin-grading-progress pending"
              }
            >
              <div>
                <span>Grading Progress</span>
                <strong>
                  {selectedRespondent.gradedQuestions}
                  /
                  {selectedRespondent.totalQuestions}
                  {" questions graded"}
                </strong>
              </div>
              <span className="admin-grading-pending-badge">
                {selectedRespondent.ungradedQuestions === 0
                  ? "Grading Complete"
                  : `${selectedRespondent.ungradedQuestions} Not Graded`}
              </span>
            </div>
            {/* ===============================================
                QUESTIONS
            =============================================== */}
            <div className="admin-answer-question-list">
              {selectedRespondent.questionResults.map(
                (
                  item
                ) => {
                  const incorrect =
                    item.isCorrect ===
                    false;
                  const correct =
                    item.isCorrect ===
                    true;
                  return (
                    <article
                      key={
                        item.questionId
                      }
                      className={[
                        "admin-answer-question-card",
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
                      <div className="admin-answer-question-top">
                        <span className="admin-answer-question-number">
                          {item.number}
                        </span>
                        <span className="admin-answer-question-type">
                          <FaQuestionCircle />
                          {item.question.type ||
                            "Question"}
                        </span>
                        {item.isCorrect !==
                        null && (
                          <span
                            className={
                              item.isCorrect
                                ? "admin-answer-status correct"
                                : "admin-answer-status incorrect"
                            }
                          >
                            {item.isCorrect
                              ? <FaCheckCircle />
                              : <FaTimes />
                            }
                            {item.isCorrect
                              ? "Correct"
                              : "Incorrect"
                            }
                          </span>
                        )}
                      </div>
                      <h3
                        dangerouslySetInnerHTML={{
                          __html:
                            item.question.title ||
                            item.question.question ||
                            `Question ${item.number}`,
                        }}
                      />
                      {item.question.image && (
                        <div className="admin-answer-question-image">
                          <img
                            src={
                              item.question.image
                            }
                            alt={`Question ${item.number}`}
                          />
                        </div>
                      )}
                      <div
                        className={
                          incorrect
                            ? "admin-answer-user-answer incorrect"
                            : correct
                            ? "admin-answer-user-answer correct"
                            : "admin-answer-user-answer"
                        }
                      >
                        <span>
                          User Answer
                        </span>
                        <strong>
                          {hasAnswer(
                            item.userAnswer
                          )
                            ? normalizeAnswer(
                                item.userAnswer
                              )
                            : "No answer"
                          }
                        </strong>
                      </div>
                      {item.hasCorrectAnswer && (
                        <div className="admin-answer-correct-answer">
                          <span>
                            Correct Answer
                          </span>
                          <strong>
                            <FaCheckCircle />
                            {normalizeAnswer(
                              item.correctAnswer
                            )}
                          </strong>
                        </div>
                      )}
                      {!item.isAutoGraded && (
                        <div className="admin-manual-grade-box">
                          <div className="admin-manual-grade-heading">
                            <div>
                              <span>Manual Grading</span>
                              <strong>
                                {item.manuallyGraded
                                  ? "Nilai sudah diberikan admin"
                                  : "This question has not been graded yet."}
                              </strong>
                            </div>
                            <span
                              className={
                                item.manuallyGraded
                                  ? "manual-grade-status graded"
                                  : "manual-grade-status pending"
                              }
                            >
                              {item.manuallyGraded
                                ? "Graded"
                                : "Not Graded"}
                            </span>
                          </div>
                          <div className="admin-manual-grade-inputs">
                            <label>
                              <span>Score</span>
                              <input
                                type="number"
                                min="0"
                                value={
                                  manualGrades[String(item.questionId)]?.earnedPoints ?? ""
                                }
                                onChange={(event) =>
                                  updateManualGradeField(
                                    item.questionId,
                                    "earnedPoints",
                                    event.target.value
                                  )
                                }
                                placeholder="0"
                              />
                            </label>
                            <span className="manual-grade-divider">/</span>
                            <label>
                              <span>Max Points</span>
                              <input
                                type="number"
                                min="1"
                                value={
                                  manualGrades[String(item.questionId)]?.maxPoints ?? ""
                                }
                                onChange={(event) =>
                                  updateManualGradeField(
                                    item.questionId,
                                    "maxPoints",
                                    event.target.value
                                  )
                                }
                                placeholder="10"
                              />
                            </label>
                          </div>
                        </div>
                      )}
                      {item.scoringEnabled && (
                        <div className="admin-answer-points">
                          <span>
                            Question Score
                          </span>
                          <strong>
                            {item.earnedPoints}
                            /
                            {item.maxPoints}
                            {" pts"}
                          </strong>
                        </div>
                      )}
                    </article>
                  );
                }
              )}
            </div>
            {/* ===============================================
                MODAL FOOTER
            =============================================== */}
            <div className="admin-answer-modal-footer">
              <span>
                This detailed result is visible to administrators only.
              </span>
              <div className="admin-answer-footer-actions">
                {selectedRespondent.ungradedQuestions > 0 && (
                  <button
                    type="button"
                    className="admin-save-grades-btn"
                    onClick={saveManualGrades}
                    disabled={gradingSaving}
                  >
                    <FaSave />
                    {gradingSaving ? "Saving..." : "Save Manual Grades"}
                  </button>
                )}
                <button
                  type="button"
                  className="admin-close-answers-btn"
                  onClick={closeRespondentAnswers}
                >
                  Close
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
export default AdminResults;