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
  FaArrowLeft,
  FaCalendarAlt,
  FaCheckCircle,
  FaClipboardList,
  FaClock,
  FaExclamationTriangle,
  FaFileAlt,
  FaInfoCircle,
  FaPlay,
  FaShieldAlt,
} from "react-icons/fa";
import {
  ThemeContext,
} from "../context/ThemeContext";
import {
  FormContext,
} from "../context/FormContext";

const formDetailsStyles = `
/* === FormDetails.css === */
/* =========================================================
   FORM DETAILS — HIDOCS
========================================================= */
.details-page,
.details-page * {
    box-sizing: border-box;
}
/* =========================================================
   PAGE
========================================================= */
.details-page {
    position: relative;
    width: 100%;
    min-height: 100vh;
    overflow-x: hidden;
    background: radial-gradient( circle at top right, rgba(72, 139, 224, 0.08), transparent 28% ), #f3f6fb;
    color: #22344d;
    font-family: "Poppins", sans-serif;
    transition: background 0.25s ease, color 0.25s ease;
}
/* =========================================================
   HEADER
========================================================= */
.details-header {
    position: relative;
    width: 100%;
    min-height: 92px;
    padding: 0 34px;
    overflow: hidden;
    background: linear-gradient( 135deg, #123d78 0%, #1f61ad 56%, #347fe0 100% );
    color: #ffffff;
    display: flex;
    align-items: center;
    gap: 14px;
    box-shadow: inset 0 -1px 0 rgba(255, 255, 255, 0.1), 0 12px 28px rgba(27, 76, 137, 0.18);
}
/* =========================================================
   HEADER DECORATION
========================================================= */
.details-header-decoration {
    position: absolute;
    inset: 0;
    pointer-events: none;
}
.details-header-circle {
    position: absolute;
    display: block;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.13);
}
.details-header-circle.circle-one {
    width: 190px;
    height: 190px;
    top: -112px;
    right: -28px;
    background: rgba(255, 255, 255, 0.05);
}
.details-header-circle.circle-two {
    width: 115px;
    height: 115px;
    right: 130px;
    bottom: -84px;
    background: rgba(255, 255, 255, 0.035);
}
/* =========================================================
   BACK BUTTON
========================================================= */
.details-back-button {
    position: relative;
    z-index: 2;
    width: 42px;
    height: 42px;
    flex-shrink: 0;
    padding: 0;
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.11);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    transition: background 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
}
.details-back-button:hover {
    transform: translateX(-2px);
    background: rgba(255, 255, 255, 0.18);
    border-color: rgba(255, 255, 255, 0.25);
}
.details-back-button svg {
    width: 18px;
    height: 18px;
    font-size: 20px;
}
/* =========================================================
   HEADER TITLE
========================================================= */
.details-header-title {
    position: relative;
    z-index: 2;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.details-header-title > span {
    color: rgba(255, 255, 255, 0.72);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.1px;
    text-transform: uppercase;
}
.details-header-title h2 {
    margin: 0;
    color: #ffffff;
    font-size: 25px;
    line-height: 1.2;
    font-weight: 700;
    letter-spacing: -0.35px;
}
/* =========================================================
   MAIN CONTENT
========================================================= */
.details-content {
    width: 100%;
    max-width: 1180px;
    margin: 0 auto;
    padding: 30px 26px 50px;
}
/* =========================================================
   HERO CARD
========================================================= */
.details-hero-card {
    position: relative;
    width: 100%;
    padding: 31px 28px 28px;
    overflow: hidden;
    border: 1px solid #dfe7f0;
    border-radius: 22px;
    background: linear-gradient( 145deg, #ffffff 0%, #f7fbff 100% );
    text-align: center;
    box-shadow: 0 12px 30px rgba(24, 51, 84, 0.08), 0 3px 8px rgba(24, 51, 84, 0.04);
}
.details-hero-card::before {
    content: "";
    position: absolute;
    width: 210px;
    height: 210px;
    top: -120px;
    left: -70px;
    border-radius: 50%;
    background: radial-gradient( circle, rgba(61, 137, 218, 0.1), rgba(61, 137, 218, 0) );
    pointer-events: none;
}
/* =========================================================
   MAIN ICON
========================================================= */
.details-main-icon {
    position: relative;
    z-index: 2;
    width: 68px;
    height: 68px;
    margin: 0 auto 16px;
    border-radius: 20px;
    background: linear-gradient( 145deg, #dcecff, #eff6ff );
    color: #2c75bd;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    box-shadow: 0 9px 20px rgba(46, 117, 187, 0.13);
}
.details-main-icon svg {
    width: 28px;
    height: 28px;
}
/* =========================================================
   CATEGORY
========================================================= */
.details-category {
    position: relative;
    z-index: 2;
    min-height: 27px;
    padding: 0 11px;
    border: 1px solid #cfe1f3;
    border-radius: 999px;
    background: #edf5fd;
    color: #347bc1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.7px;
    text-transform: uppercase;
}
/* =========================================================
   HERO TEXT
========================================================= */
.details-hero-card h1 {
    position: relative;
    z-index: 2;
    max-width: 850px;
    margin: 15px auto 8px;
    color: #24384f;
    font-size: 32px;
    line-height: 1.3;
    font-weight: 700;
    letter-spacing: -0.7px;
}
.details-description {
    position: relative;
    z-index: 2;
    max-width: 700px;
    margin: 0 auto;
    color: #8190a4;
    font-size: 14px;
    line-height: 1.7;
}
/* =========================================================
   HERO META
========================================================= */
.details-meta-list {
    position: relative;
    z-index: 2;
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 9px;
}
.details-meta-list span {
    min-height: 31px;
    padding: 0 11px;
    border: 1px solid #e1e8f0;
    border-radius: 9px;
    background: #f5f8fb;
    color: #6f8399;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 10px;
    font-weight: 600;
}
.details-meta-list svg {
    color: #4382c1;
    font-size: 11px;
}
/* =========================================================
   CONTENT LAYOUT
========================================================= */
.details-layout {
    width: 100%;
    margin-top: 20px;
    display: grid;
    grid-template-columns: minmax(0, 1.55fr) minmax(280px, 0.75fr);
    align-items: stretch;
    gap: 18px;
}
/* =========================================================
   INFORMATION CARD
========================================================= */
.details-information-card {
    width: 100%;
    padding: 22px;
    border: 1px solid #dfe7f0;
    border-radius: 19px;
    background: #ffffff;
    box-shadow: 0 7px 20px rgba(24, 51, 84, 0.06);
}
/* =========================================================
   SECTION HEADING
========================================================= */
.details-section-heading {
    display: flex;
    align-items: center;
    gap: 11px;
    margin-bottom: 18px;
}
.details-section-icon {
    width: 42px;
    height: 42px;
    flex-shrink: 0;
    border-radius: 12px;
    background: #e9f2fc;
    color: #337bc1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
}
.details-section-heading > div:last-child {
    min-width: 0;
}
.details-section-heading span {
    display: block;
    margin-bottom: 2px;
    color: #7f90a4;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.8px;
    text-transform: uppercase;
}
.details-section-heading h3 {
    margin: 0;
    color: #2a3e56;
    font-size: 19px;
    font-weight: 700;
}
/* =========================================================
   INFORMATION LIST
========================================================= */
.details-information-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.details-information-item {
    width: 100%;
    min-height: 76px;
    padding: 13px 14px;
    border: 1px solid #e5ebf2;
    border-radius: 14px;
    background: linear-gradient( 145deg, #ffffff, #fafcff );
    display: flex;
    align-items: center;
    gap: 12px;
    transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}
.details-information-item:hover {
    transform: translateY(-2px);
    border-color: #cbdbea;
    box-shadow: 0 8px 17px rgba(24, 51, 84, 0.06);
}
/* =========================================================
   INFORMATION ICON
========================================================= */
.details-information-icon {
    width: 43px;
    height: 43px;
    flex-shrink: 0;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
}
.details-information-icon.blue {
    background: #e9f2fc;
    color: #337bc1;
}
.details-information-icon.green {
    background: #e8f7ef;
    color: #27a16c;
}
.details-information-icon.purple {
    background: #efecff;
    color: #735ecb;
}
/* =========================================================
   INFORMATION TEXT
========================================================= */
.details-information-text {
    min-width: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 3px;
}
.details-information-text span {
    color: #8796a9;
    font-size: 11px;
    font-weight: 500;
}
.details-information-text strong {
    color: #2a3e56;
    font-size: 14px;
    line-height: 1.45;
    font-weight: 700;
    overflow-wrap: anywhere;
}
/* =========================================================
   STATUS BADGE
========================================================= */
.details-status-badge {
    min-height: 27px;
    padding: 0 9px;
    flex-shrink: 0;
    border: 1px solid #c9ead8;
    border-radius: 999px;
    background: #e8f7ef;
    color: #269b68;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 10px;
    font-weight: 700;
}
.details-status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #2bac73;
    box-shadow: 0 0 0 3px rgba(43, 172, 115, 0.1);
}
/* =========================================================
   SIDE COLUMN
========================================================= */
.details-side-column {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 13px;
}
/* =========================================================
   WARNING CARD
========================================================= */
.details-warning-card {
    width: 100%;
    padding: 19px;
    border: 1px solid #f0dfb6;
    border-radius: 18px;
    background: linear-gradient( 145deg, #fff8e8, #fffdf8 );
    display: flex;
    align-items: flex-start;
    gap: 12px;
    box-shadow: 0 7px 18px rgba(166, 111, 12, 0.06);
}
.details-warning-icon {
    width: 42px;
    height: 42px;
    flex-shrink: 0;
    border-radius: 12px;
    background: #ffedbd;
    color: #d89612;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
}
.details-warning-card > div:last-child {
    min-width: 0;
}
.details-warning-label {
    display: block;
    margin-bottom: 4px;
    color: #c08318;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.8px;
    text-transform: uppercase;
}
.details-warning-card h4 {
    margin: 0 0 7px;
    color: #5b4723;
    font-size: 16px;
    font-weight: 700;
}
.details-warning-card p {
    margin: 0;
    color: #8b7448;
    font-size: 11px;
    line-height: 1.7;
}
/* =========================================================
   RULE CARD
========================================================= */
.details-rule-card {
    width: 100%;
    padding: 17px;
    border: 1px solid #dfe7f0;
    border-radius: 17px;
    background: #ffffff;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0 6px 17px rgba(24, 51, 84, 0.05);
}
.details-rule-icon {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    border-radius: 12px;
    background: #efecff;
    color: #735ecb;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
}
.details-rule-card > div:last-child {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;
}
.details-rule-card strong {
    color: #2a3e56;
    font-size: 13px;
    font-weight: 700;
}
.details-rule-card span {
    color: #8897aa;
    font-size: 10px;
    line-height: 1.55;
}
/* =========================================================
   ACTIONS
========================================================= */
.details-actions {
    width: 100%;
    margin-top: 18px;
    display: grid;
    grid-template-columns: minmax(160px, 0.4fr) minmax(260px, 1fr);
    gap: 12px;
}
/* =========================================================
   CANCEL BUTTON
========================================================= */
.details-cancel-btn {
    width: 100%;
    height: 46px;
    padding: 0 16px;
    border: 1px solid #d8e1eb;
    border-radius: 12px;
    background: #ffffff;
    color: #687c92;
    font-family: inherit;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}
.details-cancel-btn:hover {
    transform: translateY(-1px);
    background: #f3f7fb;
    color: #315f8f;
    border-color: #c5d6e7;
}
/* =========================================================
   PRIMARY BUTTON
========================================================= */
.details-primary-btn {
    width: 100%;
    height: 46px;
    padding: 0 18px;
    border: none;
    border-radius: 12px;
    background: linear-gradient( 90deg, #1d5ca4, #2f80d1 );
    color: #ffffff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-family: inherit;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 7px 16px rgba(37, 105, 178, 0.21);
    transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
}
.details-primary-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 11px 22px rgba(37, 105, 178, 0.28);
    filter: brightness(1.04);
}
.details-primary-btn svg {
    width: 11px;
    height: 11px;
    font-size: 13px;
}
/* =========================================================
   NOT FOUND
========================================================= */
.details-not-found {
    width: calc(100% - 32px);
    max-width: 480px;
    min-height: 360px;
    margin: 70px auto;
    padding: 34px;
    border: 1px solid #dfe7f0;
    border-radius: 22px;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    box-shadow: 0 12px 30px rgba(24, 51, 84, 0.08);
}
.details-not-found-icon {
    width: 68px;
    height: 68px;
    margin-bottom: 16px;
    border-radius: 19px;
    background: #e9f2fc;
    color: #347bc1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 29px;
}
.details-not-found h2 {
    margin: 0 0 7px;
    color: #293d55;
    font-size: 22px;
    font-weight: 700;
}
.details-not-found p {
    max-width: 350px;
    margin: 0 0 19px;
    color: #8796a9;
    font-size: 12px;
    line-height: 1.65;
}
/* =========================================================
   DARK MODE
========================================================= */
.details-page.dark {
    background: radial-gradient( circle at top right, rgba(70, 135, 216, 0.08), transparent 28% ), #0d1624;
    color: #e7edf6;
}
.details-page.dark
.details-header {
    background: linear-gradient( 135deg, #0b294f 0%, #164575 55%, #2268aa 100% );
    box-shadow: inset 0 -1px 0 rgba(255, 255, 255, 0.07), 0 12px 28px rgba(0, 0, 0, 0.25);
}
.details-page.dark
.details-hero-card,
.details-page.dark
.details-information-card,
.details-page.dark
.details-rule-card,
.details-page.dark
.details-not-found {
    background: #172234;
    border-color: #2c3b50;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.18);
}
.details-page.dark
.details-information-item {
    background: linear-gradient( 145deg, #1b283b, #172234 );
    border-color: #314157;
}
.details-page.dark
.details-hero-card h1,
.details-page.dark
.details-section-heading h3,
.details-page.dark
.details-information-text strong,
.details-page.dark
.details-rule-card strong,
.details-page.dark
.details-not-found h2 {
    color: #f1f5f9;
}
.details-page.dark
.details-description,
.details-page.dark
.details-section-heading span,
.details-page.dark
.details-information-text span,
.details-page.dark
.details-rule-card span,
.details-page.dark
.details-not-found p {
    color: #8fa0b4;
}
.details-page.dark
.details-main-icon,
.details-page.dark
.details-section-icon,
.details-page.dark
.details-information-icon.blue,
.details-page.dark
.details-not-found-icon {
    background: #203a58;
    color: #6db2ff;
}
.details-page.dark
.details-information-icon.green {
    background: #20463b;
    color: #5bd39a;
}
.details-page.dark
.details-information-icon.purple,
.details-page.dark
.details-rule-icon {
    background: #372f61;
    color: #a79cff;
}
.details-page.dark
.details-category,
.details-page.dark
.details-meta-list span {
    background: #1f2d40;
    border-color: #304259;
    color: #93a9c2;
}
.details-page.dark
.details-warning-card {
    background: linear-gradient( 145deg, #3c321f, #2c271c );
    border-color: #594a2b;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.14);
}
.details-page.dark
.details-warning-icon {
    background: #57451f;
    color: #f2bd57;
}
.details-page.dark
.details-warning-label {
    color: #e6ae4b;
}
.details-page.dark
.details-warning-card h4 {
    color: #f6e3ba;
}
.details-page.dark
.details-warning-card p {
    color: #c7b17f;
}
.details-page.dark
.details-cancel-btn {
    background: #172234;
    border-color: #314157;
    color: #a8b6c7;
}
.details-page.dark
.details-cancel-btn:hover {
    background: #1f2d40;
    border-color: #46617e;
    color: #d4dfec;
}
/* =========================================================
   TABLET
========================================================= */
@media (max-width: 900px) {
    .details-header {
        min-height: 82px;
        padding: 0 24px;
    }
    .details-header-title h2 {
        font-size: 23px;
    }
    .details-content {
        padding: 24px 20px 42px;
    }
    .details-hero-card {
        padding: 27px 23px 24px;
    }
    .details-hero-card h1 {
        font-size: 28px;
    }
    .details-layout {
        grid-template-columns: 1fr;
    }
    .details-side-column {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        align-items: stretch;
    }
    .details-warning-card,
    .details-rule-card {
        height: 100%;
    }
}
/* =========================================================
   MOBILE
========================================================= */
@media (max-width: 680px) {
    .details-header {
        min-height: 68px;
        padding: 0 14px;
        gap: 10px;
    }
    .details-back-button {
        width: 36px;
        height: 36px;
        border-radius: 10px;
    }
    .details-back-button svg {
        width: 15px;
        height: 15px;
        font-size: 17px;
    }
    .details-header-title > span {
        font-size: 9px;
    }
    .details-header-title h2 {
        font-size: 19px;
    }
    .details-content {
        padding: 15px 12px 30px;
    }
    .details-hero-card {
        padding: 23px 16px 20px;
        border-radius: 18px;
    }
    .details-main-icon {
        width: 58px;
        height: 58px;
        margin-bottom: 13px;
        border-radius: 17px;
    }
    .details-main-icon svg {
        width: 24px;
        height: 24px;
    }
    .details-category {
        min-height: 24px;
        padding: 0 9px;
        font-size: 9px;
    }
    .details-hero-card h1 {
        margin-top: 12px;
        font-size: 23px;
    }
    .details-description {
        font-size: 12px;
    }
    .details-meta-list {
        margin-top: 16px;
        gap: 6px;
    }
    .details-meta-list span {
        min-height: 28px;
        padding: 0 8px;
        font-size: 9px;
    }
    .details-layout {
        margin-top: 13px;
        gap: 12px;
    }
    .details-information-card {
        padding: 16px;
        border-radius: 16px;
    }
    .details-section-heading {
        margin-bottom: 14px;
    }
    .details-section-icon {
        width: 38px;
        height: 38px;
        border-radius: 11px;
        font-size: 16px;
    }
    .details-section-heading h3 {
        font-size: 17px;
    }
    .details-information-item {
        min-height: 70px;
        padding: 12px;
        border-radius: 12px;
    }
    .details-information-icon {
        width: 39px;
        height: 39px;
        border-radius: 11px;
        font-size: 16px;
    }
    .details-information-text span {
        font-size: 10px;
    }
    .details-information-text strong {
        font-size: 12px;
    }
    .details-status-badge {
        display: none;
    }
    .details-side-column {
        display: flex;
    }
    .details-warning-card {
        padding: 15px;
        border-radius: 15px;
    }
    .details-warning-icon {
        width: 38px;
        height: 38px;
        border-radius: 11px;
        font-size: 16px;
    }
    .details-warning-card h4 {
        font-size: 14px;
    }
    .details-warning-card p {
        font-size: 10px;
    }
    .details-rule-card {
        padding: 14px;
        border-radius: 15px;
    }
    .details-rule-icon {
        width: 37px;
        height: 37px;
        font-size: 15px;
    }
    .details-rule-card strong {
        font-size: 12px;
    }
    .details-rule-card span {
        font-size: 9px;
    }
    .details-actions {
        margin-top: 13px;
        grid-template-columns: 1fr;
        gap: 8px;
    }
    .details-cancel-btn,
    .details-primary-btn {
        height: 42px;
        border-radius: 10px;
        font-size: 11px;
    }
}
/* =========================================================
   SMALL MOBILE
========================================================= */
@media (max-width: 420px) {
    .details-hero-card h1 {
        font-size: 20px;
    }
    .details-meta-list {
        align-items: stretch;
        flex-direction: column;
    }
    .details-meta-list span {
        width: 100%;
        justify-content: center;
    }
    .details-information-item {
        align-items: flex-start;
    }
}
/* =========================================================
   ACCESSIBILITY
========================================================= */
.details-page button:focus-visible {
    outline: 2px solid rgba(45, 119, 190, 0.55);
    outline-offset: 3px;
}
/* =========================================================
   REDUCED MOTION
========================================================= */
@media (prefers-reduced-motion: reduce) {
    .details-page *,
    .details-page *::before,
    .details-page *::after {
        animation: none !important;
        transition: none !important;
        scroll-behavior: auto !important;
    }
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
// DEFAULT FORM DATA
// =========================================================
const defaultForms = [
  {
    id: 1,
    title: "Survey Kepuasan Mahasiswa 2024",
    category: "Survey",
    description: "Please read all information carefully before filling out this survey.",
    status: "Available to Fill",
    submission: "You can only submit once",
    questions: 5,
    duration: "5 minutes",
    deadline: "15 July 2024",
    active: true,
    settings: {
      oneTimeOnly: true,
    },
  },
  {
    id: 2,
    title: "Quiz Pemrograman Mobile - Flutter",
    category: "Quiz",
    description: "Please read all information carefully before starting the quiz.",
    status: "Available to Fill",
    submission: "You can only submit once",
    questions: 10,
    duration: "20 minutes",
    deadline: "18 July 2024",
    active: true,
    settings: {
      oneTimeOnly: true,
    },
  },
  {
    id: 3,
    title: "Form Pendaftaran Event Hackathon",
    category: "Registration",
    description: "Please read all information carefully before registering for this event.",
    status: "Available to Fill",
    submission: "You can only submit once",
    questions: 7,
    duration: "8 minutes",
    deadline: "20 July 2024",
    active: true,
    settings: {
      oneTimeOnly: true,
    },
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
// FORMAT DATE
// =========================================================
const formatDate = (
  dateValue
) => {
  if (!dateValue) {
    return "No deadline";
  }
  const date =
    new Date(
      dateValue
    );
  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return String(
      dateValue
    );
  }
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  ).format(
    date
  );
};
// =========================================================
// FORMAT DATE TIME
// =========================================================
const formatDateTime = (
  dateValue,
  timeValue
) => {
  if (!dateValue) {
    return "Not scheduled";
  }
  const safeTime =
    timeValue ||
    "00:00";
  const date =
    new Date(
      `${dateValue}T${safeTime}`
    );
  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return `${dateValue}${
      timeValue
        ? ` ${timeValue}`
        : ""
    }`;
  }
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }
  ).format(
    date
  );
};
// =========================================================
// CREATE DATE TIME
// =========================================================
const createDateTime = (
  dateValue,
  timeValue,
  fallbackTime
) => {
  if (!dateValue) {
    return null;
  }
  const finalTime =
    timeValue ||
    fallbackTime;
  const date =
    new Date(
      `${dateValue}T${finalTime}`
    );
  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return null;
  }
  return date;
};
// =========================================================
// GET SCHEDULE STATUS
// =========================================================
const getScheduleStatus = (
  form,
  currentTime
) => {
  if (
    form.active ===
    false
  ) {
    return {
      code: "inactive",
      label: "Unavailable",
      title: "Currently Unavailable",
      message: "This form has been deactivated by the administrator.",
      canStart: false,
    };
  }
  const openDateTime =
    createDateTime(
      form.openDate,
      form.openTime,
      "00:00"
    );
  const closeDateTime =
    createDateTime(
      form.closeDate,
      form.closeTime,
      "23:59"
    );
  if (
    openDateTime &&
    currentTime <
      openDateTime
  ) {
    return {
      code: "not-open",
      label: "Not Open Yet",
      title: "Form Not Open Yet",
      message:
        `This form will open on ${formatDateTime(
          form.openDate,
          form.openTime
        )}.`,
      canStart: false,
    };
  }
  if (
    closeDateTime &&
    currentTime >
      closeDateTime
  ) {
    return {
      code: "closed",
      label: "Closed",
      title: "Form Closed",
      message:
        `This form closed on ${formatDateTime(
          form.closeDate,
          form.closeTime
        )}.`,
      canStart: false,
    };
  }
  return {
    code: "open",
    label: "Available",
    title: "Available to Fill",
    message: "This form is currently open and accepting responses.",
    canStart: true,
  };
};
// =========================================================
// FORMAT DURATION
// =========================================================
const formatDuration = (
  form
) => {
  const timerEnabled =
    form.timerEnabled ??
    form.settings?.timerEnabled ??
    form.settings?.timer?.enabled;
  if (
    timerEnabled ===
    false
  ) {
    return "No time limit";
  }
  const durationValue =
    form.timerDuration ??
    form.settings?.timerDuration ??
    form.settings?.timer?.duration ??
    form.duration ??
    form.settings?.duration;
  if (
    durationValue ===
      undefined ||
    durationValue ===
      null ||
    durationValue ===
      ""
  ) {
    return "No time limit";
  }
  if (
    typeof durationValue ===
    "number"
  ) {
    return `${durationValue} minutes`;
  }
  const durationText =
    String(
      durationValue
    ).trim();
  if (!durationText) {
    return "No time limit";
  }
  if (
    durationText
      .toLowerCase()
      .includes(
        "min"
      )
  ) {
    return durationText;
  }
  const durationNumber =
    Number(
      durationText
    );
  if (
    Number.isFinite(
      durationNumber
    )
  ) {
    return `${durationNumber} minutes`;
  }
  return durationText;
};
// =========================================================
// NORMALIZE FORM
// =========================================================
const normalizeForm = (
  form,
  currentTime
) => {
  const questionCount =
    Array.isArray(
      form.questions
    )
      ? form.questions.length
      : Number(
          form.questions
        ) || 0;
  const oneTimeOnly =
    form.settings?.oneTimeOnly !==
    false;
  const scheduleStatus =
    getScheduleStatus(
      form,
      currentTime
    );
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
    category:
      form.category ||
      form.type ||
      "Form",
    description:
      String(
        form.description ||
        ""
      ).trim() ||
      "Please read all information carefully before filling out this form.",
    status:
      scheduleStatus.title,
    statusCode:
      scheduleStatus.code,
    statusLabel:
      scheduleStatus.label,
    statusMessage:
      scheduleStatus.message,
    canStart:
      scheduleStatus.canStart,
    submission:
      oneTimeOnly
        ? "You can only submit once"
        : "Multiple submissions are allowed",
    questions:
      questionCount,
    duration:
      formatDuration(
        form
      ),
    deadline:
      form.closeDate
        ? formatDateTime(
            form.closeDate,
            form.closeTime
          )
        : form.deadline
        ? formatDate(
            form.deadline
          )
        : "No deadline",
    openSchedule:
      form.openDate
        ? formatDateTime(
            form.openDate,
            form.openTime
          )
        : "Available immediately",
    closeSchedule:
      form.closeDate
        ? formatDateTime(
            form.closeDate,
            form.closeTime
          )
        : "No closing schedule",
    active:
      form.active !==
      false,
    oneTimeOnly,
  };
};
// =========================================================
// FORM DETAILS
// =========================================================
function FormDetails() {
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
    submittedForms = [],
  } = useContext(
    FormContext
  );
  // =========================================================
  // CURRENT TIME
  // Dibuat state agar status form dapat berubah otomatis
  // tanpa refresh manual.
  // =========================================================
  const [
    currentTime,
    setCurrentTime,
  ] = useState(
    new Date()
  );
  useEffect(() => {
    const interval =
      window.setInterval(
        () => {
          setCurrentTime(
            new Date()
          );
        },
        30000
      );
    return () => {
      window.clearInterval(
        interval
      );
    };
  }, []);
  // =========================================================
  // STORAGE VERSION
  // Supaya perubahan jadwal dari Admin langsung terbaca.
  // =========================================================
  const [
    storageVersion,
    setStorageVersion,
  ] = useState(
    0
  );
  useEffect(() => {
    const refreshForm =
      () => {
        setStorageVersion(
          (
            previous
          ) =>
            previous +
            1
        );
      };
    const handleStorage =
      (
        event
      ) => {
        if (
          event.key ===
            FORMS_STORAGE_KEY ||
          event.key ===
            DELETED_FORMS_STORAGE_KEY
        ) {
          refreshForm();
        }
      };
    const handleVisibilityChange =
      () => {
        if (
          document.visibilityState ===
          "visible"
        ) {
          refreshForm();
          setCurrentTime(
            new Date()
          );
        }
      };
    window.addEventListener(
      "storage",
      handleStorage
    );
    window.addEventListener(
      "hidocs-forms-updated",
      refreshForm
    );
    window.addEventListener(
      "focus",
      refreshForm
    );
    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );
    return () => {
      window.removeEventListener(
        "storage",
        handleStorage
      );
      window.removeEventListener(
        "hidocs-forms-updated",
        refreshForm
      );
      window.removeEventListener(
        "focus",
        refreshForm
      );
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, []);
  // =========================================================
  // LOAD SELECTED FORM
  // =========================================================
  const form =
    useMemo(
      () => {
        const savedForms =
          getStoredArray(
            FORMS_STORAGE_KEY
          );
        const deletedFormIds =
          getStoredArray(
            DELETED_FORMS_STORAGE_KEY
          ).map(
            (
              deletedId
            ) =>
              String(
                deletedId
              )
          );
        const availableForms = [
          ...defaultForms,
          ...savedForms,
        ];
        /*
          Reverse sangat penting.
          Kalau form default sudah diedit Admin,
          versi localStorage harus mengalahkan versi default.
        */
        const selectedForm =
          [...availableForms]
            .reverse()
            .find(
              (
                item
              ) => {
                return (
                  String(
                    item.id
                  ) ===
                  String(
                    id
                  )
                );
              }
            );
        if (!selectedForm) {
          return null;
        }
        if (
          deletedFormIds.includes(
            String(
              selectedForm.id
            )
          )
        ) {
          return null;
        }
        return normalizeForm(
          selectedForm,
          currentTime
        );
      },
      [
        id,
        currentTime,
        storageVersion,
      ]
    );
  // =========================================================
  // CHECK SUBMISSION
  // =========================================================
  const isSubmitted =
    useMemo(
      () => {
        if (!form) {
          return false;
        }
        return submittedForms.some(
          (
            submittedForm
          ) => {
            const submittedFormId =
              submittedForm.formId ??
              submittedForm.id;
            return (
              String(
                submittedFormId
              ) ===
              String(
                form.id
              )
            );
          }
        );
      },
      [
        form,
        submittedForms,
      ]
    );

  // =========================================================
  // FORM NOT FOUND
  // =========================================================
  if (!form) {
    return (
      <div
        className={
          darkMode
            ? "details-page dark"
            : "details-page"
        }
      >
      <style>{formDetailsStyles}</style>
        <div className="details-not-found">
          <div className="details-not-found-icon">
            <FaClipboardList />
          </div>
          <h2>
            Form Not Found
          </h2>
          <p>
            The form you are looking for is unavailable or has been removed.
          </p>
          <button
            type="button"
            className="details-primary-btn"
            onClick={() =>
              navigate(
                "/dashboard"
              )
            }
          >
            <FaArrowLeft />
            <span>
              Back to Dashboard
            </span>
          </button>
        </div>
      </div>
    );
  }
  // =========================================================
  // START FORM
  // =========================================================
  const handleStartForm =
    () => {
      if (
        !form.canStart
      ) {
        return;
      }
      if (
        form.oneTimeOnly &&
        isSubmitted
      ) {
        navigate(
          "/history"
        );
        return;
      }
      navigate(
        `/fill-form/${form.id || id}`
      );
    };
  // =========================================================
  // BUTTON TEXT
  // =========================================================
  const getStartButtonText =
    () => {
      if (
        form.statusCode ===
        "inactive"
      ) {
        return "Form Unavailable";
      }
      if (
        form.statusCode ===
        "not-open"
      ) {
        return "Form Not Open Yet";
      }
      if (
        form.statusCode ===
        "closed"
      ) {
        return "Form Closed";
      }
      if (
        form.oneTimeOnly &&
        isSubmitted
      ) {
        return "View Submission History";
      }
      return "Start Filling Form";
    };
  // =========================================================
  // STATUS CLASS
  // =========================================================
  const statusClassName =
    form.statusCode ===
    "open"
      ? "details-status-badge"
      : `details-status-badge inactive ${form.statusCode}`;
  // =========================================================
  // RETURN
  // =========================================================
  return (
    <div
      className={
        darkMode
          ? "details-page dark"
          : "details-page"
      }
    >
      <style>{formDetailsStyles}</style>
      {/* =====================================================
          HEADER
      ===================================================== */}
      <header className="details-header">
        <div className="details-header-decoration">
          <span className="details-header-circle circle-one"></span>
          <span className="details-header-circle circle-two"></span>
        </div>
        <button
          type="button"
          className="details-back-button"
          onClick={() =>
            navigate(-1)
          }
          aria-label="Back"
        >
          <FaArrowLeft />
        </button>
        <div className="details-header-title">
          <span>
            HiDocs Form
          </span>
          <h2>
            Form Details
          </h2>
        </div>
      </header>
      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}
      <main className="details-content">
        {/* ===================================================
            SCHEDULE STATUS ALERT
        =================================================== */}
        {form.statusCode !==
        "open" && (
          <section className="details-warning-card">
            <div className="details-warning-icon">
              <FaExclamationTriangle />
            </div>
            <div>
              <span className="details-warning-label">
                {form.statusLabel}
              </span>
              <h4>
                {form.status}
              </h4>
              <p>
                {form.statusMessage}
              </p>
            </div>
          </section>
        )}
        {/* ===================================================
            HERO
        =================================================== */}
        <section className="details-hero-card">
          <div className="details-main-icon">
            <FaClipboardList />
          </div>
          <span className="details-category">
            {form.category}
          </span>
          <h1>
            {form.title}
          </h1>
          <p className="details-description">
            {form.description}
          </p>
          <div className="details-meta-list">
            <span>
              <FaFileAlt />
              {form.questions}
              {" "}
              Questions
            </span>
            <span>
              <FaClock />
              {form.duration}
            </span>
            <span>
              <FaCalendarAlt />
              {form.deadline}
            </span>
          </div>
        </section>
        {/* ===================================================
            CONTENT GRID
        =================================================== */}
        <div className="details-layout">
          {/* =================================================
              FORM INFORMATION
          ================================================= */}
          <section className="details-information-card">
            <div className="details-section-heading">
              <div className="details-section-icon">
                <FaInfoCircle />
              </div>
              <div>
                <span>
                  Overview
                </span>
                <h3>
                  Form Information
                </h3>
              </div>
            </div>
            <div className="details-information-list">
              {/* FORM NAME */}
              <div className="details-information-item">
                <div className="details-information-icon blue">
                  <FaFileAlt />
                </div>
                <div className="details-information-text">
                  <span>
                    Form Name
                  </span>
                  <strong>
                    {form.title}
                  </strong>
                </div>
              </div>
              {/* STATUS */}
              <div className="details-information-item">
                <div
                  className={
                    form.statusCode ===
                    "open"
                      ? "details-information-icon green"
                      : "details-information-icon"
                  }
                >
                  {form.statusCode ===
                  "open" ? (
                    <FaCheckCircle />
                  ) : (
                    <FaExclamationTriangle />
                  )}
                </div>
                <div className="details-information-text">
                  <span>
                    Status
                  </span>
                  <strong>
                    {form.status}
                  </strong>
                </div>
                <span
                  className={
                    statusClassName
                  }
                >
                  <span className="details-status-dot"></span>
                  {form.statusLabel}
                </span>
              </div>
              {/* OPEN SCHEDULE */}
              <div className="details-information-item">
                <div className="details-information-icon blue">
                  <FaCalendarAlt />
                </div>
                <div className="details-information-text">
                  <span>
                    Opens
                  </span>
                  <strong>
                    {form.openSchedule}
                  </strong>
                </div>
              </div>
              {/* CLOSE SCHEDULE */}
              <div className="details-information-item">
                <div className="details-information-icon purple">
                  <FaCalendarAlt />
                </div>
                <div className="details-information-text">
                  <span>
                    Closes
                  </span>
                  <strong>
                    {form.closeSchedule}
                  </strong>
                </div>
              </div>
              {/* SUBMISSION */}
              <div className="details-information-item">
                <div className="details-information-icon purple">
                  <FaShieldAlt />
                </div>
                <div className="details-information-text">
                  <span>
                    Submission Rule
                  </span>
                  <strong>
                    {form.submission}
                  </strong>
                </div>
              </div>
            </div>
          </section>
          {/* =================================================
              SIDE INFORMATION
          ================================================= */}
          <aside className="details-side-column">
            {form.statusCode ===
            "open" ? (
              <section className="details-warning-card">
                <div className="details-warning-icon">
                  <FaExclamationTriangle />
                </div>
                <div>
                  <span className="details-warning-label">
                    Important Notice
                  </span>
                  <h4>
                    Before You Start
                  </h4>
                  <p>
                    Make sure you have enough time to complete the form.
                    Review every answer carefully before submitting.
                  </p>
                </div>
              </section>
            ) : (
              <section className="details-warning-card">
                <div className="details-warning-icon">
                  <FaClock />
                </div>
                <div>
                  <span className="details-warning-label">
                    Form Availability
                  </span>
                  <h4>
                    {form.status}
                  </h4>
                  <p>
                    {form.statusMessage}
                  </p>
                </div>
              </section>
            )}
            <section className="details-rule-card">
              <div className="details-rule-icon">
                <FaShieldAlt />
              </div>
              <div>
                <strong>
                  {form.oneTimeOnly
                    ? "One-time submission"
                    : "Multiple submissions"
                  }
                </strong>
                <span>
                  {form.oneTimeOnly
                    ? "You cannot submit this form again after completing it."
                    : "This form allows more than one submission."
                  }
                </span>
              </div>
            </section>
            {isSubmitted && (
              <section className="details-rule-card submitted">
                <div className="details-rule-icon">
                  <FaCheckCircle />
                </div>
                <div>
                  <strong>
                    Already submitted
                  </strong>
                  <span>
                    You have completed this form previously.
                  </span>
                </div>
              </section>
            )}
          </aside>
        </div>
        {/* ===================================================
            ACTIONS
        =================================================== */}
        <section className="details-actions">
          <button
            type="button"
            className="details-cancel-btn"
            onClick={() =>
              navigate(
                "/dashboard"
              )
            }
          >
            Cancel
          </button>
          <button
            type="button"
            className="details-primary-btn"
            onClick={
              handleStartForm
            }
            disabled={
              !form.canStart
            }
          >
            {form.oneTimeOnly &&
            isSubmitted ? (
              <FaCheckCircle />
            ) : form.canStart ? (
              <FaPlay />
            ) : (
              <FaClock />
            )}
            <span>
              {getStartButtonText()}
            </span>
          </button>
        </section>
      </main>
    </div>
  );
}
export default FormDetails;