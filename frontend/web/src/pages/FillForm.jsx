import { getFormById, getPublicForm, submitForm as submitFormApi } from '../api/formApi';
import { getQuestionsByForm } from '../api/questionApi';

import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useNavigate, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaClipboardList,
  FaClock,
  FaExclamationTriangle,
  FaInfinity,
  FaStar,
  FaExpand,
  FaSearchMinus,
  FaSearchPlus,
  FaTimes,
  FaUndo,
  FaCode,
  FaCalculator,
} from "react-icons/fa";

import DOMPurify from "dompurify";
import katex from "katex";
import "katex/dist/katex.min.css";

import { ThemeContext } from "../context/ThemeContext";
import { FormContext } from "../context/FormContext";

import logo from "../assets/images/logo.png";


const fillFormStyles = `
/* === FillForm.css === */
/* =========================================================
   FILL FORM — HIDOCS
========================================================= */

.fillform-page,
.fillform-page * {
    box-sizing: border-box;
}


/* =========================================================
   PAGE
========================================================= */

.fillform-page {
    width: 100%;
    min-height: 100vh;

    overflow-x: hidden;

    background:
        radial-gradient(
            circle at top right,
            rgba(72, 139, 224, 0.08),
            transparent 28%
        ),
        #f3f6fb;

    color: #22344d;

    font-family: "Poppins", sans-serif;

    transition:
        background 0.25s ease,
        color 0.25s ease;
}


/* =========================================================
   HEADER
========================================================= */

.fillform-header {
    position: sticky;
    top: 0;

    z-index: 100;

    width: 100%;
    min-height: 92px;

    padding: 16px 28px;

    display: grid;
    grid-template-columns:
        minmax(240px, 0.8fr)
        minmax(320px, 1.35fr)
        minmax(145px, 0.45fr);

    align-items: center;

    gap: 26px;

    overflow: hidden;

    background:
        linear-gradient(
            135deg,
            #123d78 0%,
            #1f61ad 56%,
            #347fe0 100%
        );

    color: #ffffff;

    box-shadow:
        inset 0 -1px 0 rgba(255, 255, 255, 0.1),
        0 10px 26px rgba(27, 76, 137, 0.18);
}

.fillform-header::after {
    content: "";

    position: absolute;

    width: 190px;
    height: 190px;

    top: -110px;
    right: -35px;

    border-radius: 50%;

    border:
        1px solid rgba(255, 255, 255, 0.13);

    background:
        rgba(255, 255, 255, 0.05);

    pointer-events: none;
}


/* =========================================================
   BRAND
========================================================= */

.fillform-brand {
    position: relative;

    z-index: 2;

    min-width: 0;

    display: flex;
    align-items: center;

    gap: 12px;
}

.fillform-logo-wrapper {
    width: 48px;
    height: 48px;

    flex-shrink: 0;

    border:
        1px solid rgba(255, 255, 255, 0.2);

    border-radius: 13px;

    background:
        rgba(255, 255, 255, 0.14);

    display: flex;
    align-items: center;
    justify-content: center;

    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
}

.fillform-logo-wrapper img {
    width: 34px;
    height: 34px;

    display: block;

    object-fit: contain;
}

.fillform-brand-text {
    min-width: 0;
}

.fillform-brand-text h2 {
    margin: 0 0 4px;

    color: #ffffff;

    font-size: 23px;
    line-height: 1.2;

    font-weight: 700;

    letter-spacing: -0.35px;
}

.fillform-brand-text span {
    display: block;

    max-width: 260px;

    color:
        rgba(255, 255, 255, 0.72);

    font-size: 11px;
    line-height: 1.4;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}


/* =========================================================
   HEADER PROGRESS
========================================================= */

.fillform-header-progress {
    position: relative;

    z-index: 2;

    min-width: 0;
}

.fillform-progress-information {
    display: flex;
    align-items: center;
    justify-content: space-between;

    gap: 12px;

    margin-bottom: 8px;
}

.fillform-progress-information span {
    color:
        rgba(255, 255, 255, 0.86);

    font-size: 12px;

    font-weight: 600;
}

.fillform-progress-information strong {
    color: #ffffff;

    font-size: 13px;

    font-weight: 700;
}

.fillform-progress-track {
    width: 100%;
    height: 8px;

    overflow: hidden;

    border-radius: 999px;

    background:
        rgba(255, 255, 255, 0.2);
}

.fillform-progress-fill {
    height: 100%;

    border-radius: inherit;

    background:
        linear-gradient(
            90deg,
            #ffffff,
            #dcecff
        );

    box-shadow:
        0 0 10px rgba(255, 255, 255, 0.25);

    transition:
        width 0.35s ease;
}


/* =========================================================
   TIMER
========================================================= */

.fillform-timer {
    position: relative;

    z-index: 2;

    min-height: 58px;

    padding: 0 15px;

    border:
        1px solid rgba(255, 255, 255, 0.15);

    border-radius: 15px;

    background:
        rgba(255, 255, 255, 0.13);

    color: #ffffff;

    display: flex;
    align-items: center;
    justify-content: center;

    gap: 11px;

    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);

    transition:
        background 0.2s ease,
        border-color 0.2s ease;
}

.fillform-timer > svg {
    width: 17px;
    height: 17px;

    flex-shrink: 0;

    font-size: 19px;
}

.fillform-timer > div {
    display: flex;
    flex-direction: column;

    gap: 2px;
}

.fillform-timer span {
    color:
        rgba(255, 255, 255, 0.7);

    font-size: 9px;

    font-weight: 600;

    text-transform: uppercase;

    letter-spacing: 0.7px;
}

.fillform-timer strong {
    color: #ffffff;

    font-size: 18px;

    line-height: 1;

    font-weight: 700;

    letter-spacing: 0.4px;
}

.fillform-timer.warning {
    background:
        rgba(219, 67, 67, 0.2);

    border-color:
        rgba(255, 205, 205, 0.3);
}


/* =========================================================
   BODY
========================================================= */

.fillform-body {
    width: 100%;
    max-width: 1440px;

    min-height:
        calc(100vh - 92px);

    margin: 0 auto;

    display: grid;

    grid-template-columns:
        230px minmax(0, 1fr);

    align-items: stretch;
}


/* =========================================================
   SIDEBAR
========================================================= */

.question-sidebar {
    position: sticky;
    top: 92px;

    align-self: start;

    width: 100%;
    min-height:
        calc(100vh - 92px);

    padding: 28px 20px 32px;

    border-right:
        1px solid #dfe7f0;

    background:
        rgba(255, 255, 255, 0.96);

    box-shadow:
        8px 0 20px rgba(24, 51, 84, 0.035);
}

.sidebar-heading {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    gap: 12px;

    margin-bottom: 19px;
}

.sidebar-heading > div {
    min-width: 0;
}

.sidebar-heading span {
    display: block;

    margin-bottom: 3px;

    color: #7590ae;

    font-size: 9px;

    font-weight: 700;

    letter-spacing: 0.8px;

    text-transform: uppercase;
}

.sidebar-heading h3 {
    margin: 0;

    color: #2a3e56;

    font-size: 19px;

    font-weight: 700;
}

.sidebar-heading > strong {
    min-width: 42px;
    height: 30px;

    padding: 0 8px;

    border-radius: 9px;

    background: #edf5fd;

    color: #3179c1;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 11px;

    font-weight: 700;
}


/* =========================================================
   QUESTION GRID
========================================================= */

.question-grid {
    display: grid;

    grid-template-columns:
        repeat(4, minmax(0, 1fr));

    gap: 8px;

    margin-bottom: 22px;
}

.question-number {
    width: 100%;
    aspect-ratio: 1 / 1;

    padding: 0;

    border:
        1px solid #dce5ef;

    border-radius: 11px;

    background: #f4f7fb;

    color: #7e8fa4;

    display: flex;
    align-items: center;
    justify-content: center;

    font-family: inherit;

    font-size: 13px;

    font-weight: 700;

    cursor: pointer;

    transition:
        transform 0.2s ease,
        background 0.2s ease,
        color 0.2s ease,
        border-color 0.2s ease,
        box-shadow 0.2s ease;
}

.question-number:hover {
    transform: translateY(-2px);

    border-color: #bcd4ec;

    background: #edf5fd;

    color: #3179c1;
}

.question-number.active {
    border-color: #2f76c2;

    background:
        linear-gradient(
            145deg,
            #2269b6,
            #327fd2
        );

    color: #ffffff;

    box-shadow:
        0 7px 15px rgba(45, 113, 190, 0.25);
}

.question-number.answered {
    border-color: #bfe3d1;

    background: #e8f7ef;

    color: #269b68;
}

.question-number svg {
    width: 12px;
    height: 12px;

    font-size: 14px;
}


/* =========================================================
   SIDEBAR COMPLETION
========================================================= */

.sidebar-completion {
    margin-bottom: 23px;

    padding: 14px;

    border:
        1px solid #e1e8f0;

    border-radius: 13px;

    background: #f8fafc;
}

.sidebar-completion-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;

    gap: 10px;

    margin-bottom: 9px;
}

.sidebar-completion-heading span {
    color: #7e8fa4;

    font-size: 10px;

    font-weight: 600;
}

.sidebar-completion-heading strong {
    color: #2f78c0;

    font-size: 11px;

    font-weight: 700;
}

.sidebar-completion-track {
    width: 100%;
    height: 6px;

    overflow: hidden;

    border-radius: 999px;

    background: #e3eaf2;
}

.sidebar-completion-track > div {
    height: 100%;

    border-radius: inherit;

    background:
        linear-gradient(
            90deg,
            #2a9d6d,
            #52c993
        );

    transition:
        width 0.35s ease;
}


/* =========================================================
   LEGEND
========================================================= */

.question-legend {
    padding-top: 18px;

    border-top:
        1px solid #e6ebf1;

    display: flex;
    flex-direction: column;

    gap: 13px;
}

.legend-item {
    display: flex;
    align-items: center;

    gap: 9px;
}

.legend-item p {
    margin: 0;

    color: #7d8ea2;

    font-size: 11px;

    font-weight: 500;
}

.legend {
    width: 13px;
    height: 13px;

    flex-shrink: 0;

    border:
        1px solid #d8e1eb;

    border-radius: 4px;

    background: #f4f7fb;
}

.legend.current {
    border-color: #2f76c2;

    background: #2f76c2;
}

.legend.answered {
    border-color: #28a16d;

    background: #28a16d;
}


/* =========================================================
   QUESTION CONTENT
========================================================= */

.question-content {
    min-width: 0;

    padding: 26px 28px 42px;
}


/* =========================================================
   QUESTION CARD
========================================================= */

.question-card {
    width: 100%;
    max-width: 980px;

    margin: 0 auto;

    padding: 25px;

    border:
        1px solid #dfe7f0;

    border-radius: 21px;

    background: #ffffff;

    box-shadow:
        0 10px 28px rgba(24, 51, 84, 0.07);
}


/* =========================================================
   QUESTION HEADER
========================================================= */

.question-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    gap: 18px;

    margin-bottom: 21px;
}

.question-heading-content {
    min-width: 0;
}

.question-label {
    min-height: 27px;

    padding: 0 10px;

    border:
        1px solid #cfe1f3;

    border-radius: 999px;

    background: #edf5fd;

    color: #347bc1;

    display: inline-flex;
    align-items: center;

    font-size: 9px;

    font-weight: 700;

    letter-spacing: 0.7px;

    text-transform: uppercase;
}

.question-header h1 {
    margin: 13px 0 7px;

    color: #263a52;

    font-size: 26px;

    line-height: 1.4;

    font-weight: 700;

    letter-spacing: -0.45px;
}

.question-index {
    margin-right: 7px;

    color: #3179c1;
}

.question-instruction {
    margin: 0;

    color: #8997a8;

    font-size: 12px;

    line-height: 1.55;
}

.question-header-icon {
    width: 52px;
    height: 52px;

    flex-shrink: 0;

    border-radius: 14px;

    background: #e9f2fc;

    color: #347bc1;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 22px;
}

.question-header-icon svg {
    width: 20px;
    height: 20px;
}


/* =========================================================
   QUESTION IMAGE
========================================================= */

.question-image {
    width: 100%;

    margin-bottom: 20px;

    overflow: hidden;

    border:
        1px solid #dfe7f0;

    border-radius: 16px;

    background: #eef3f8;

    box-shadow:
        0 6px 16px rgba(24, 51, 84, 0.06);
}

.question-image img {
    width: 100%;
    max-height: 400px;

    display: block;

    object-fit: cover;
}


/* =========================================================
   FIELDSET
========================================================= */

.options-fieldset {
    min-width: 0;

    margin: 0;
    padding: 0;

    border: none;
}

.sr-only {
    position: absolute;

    width: 1px;
    height: 1px;

    padding: 0;
    margin: -1px;

    overflow: hidden;

    clip: rect(0, 0, 0, 0);

    white-space: nowrap;

    border: 0;
}


/* =========================================================
   OPTIONS
========================================================= */

.options-list {
    display: flex;
    flex-direction: column;

    gap: 11px;
}

.option-card {
    position: relative;

    width: 100%;
    min-height: 66px;

    padding: 11px 15px;

    border:
        1px solid #dce5ef;

    border-radius: 15px;

    background: #ffffff;

    display: flex;
    align-items: center;

    gap: 13px;

    cursor: pointer;

    transition:
        transform 0.2s ease,
        border-color 0.2s ease,
        background 0.2s ease,
        box-shadow 0.2s ease;
}

.option-card:hover {
    transform: translateY(-2px);

    border-color: #bdd5ec;

    background: #f8fbfe;

    box-shadow:
        0 7px 17px rgba(24, 51, 84, 0.06);
}

.option-card.selected {
    border-color: #2f76c2;

    background:
        linear-gradient(
            145deg,
            #edf5fd,
            #f8fbff
        );

    box-shadow:
        0 7px 17px rgba(45, 113, 190, 0.11);
}

.option-card input {
    position: absolute;

    width: 1px;
    height: 1px;

    opacity: 0;

    pointer-events: none;
}

.option-letter {
    width: 39px;
    height: 39px;

    flex-shrink: 0;

    border-radius: 11px;

    background: #edf3fb;

    color: #397cc0;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 14px;

    font-weight: 700;

    transition:
        background 0.2s ease,
        color 0.2s ease;
}

.option-card.selected
.option-letter {
    background: #2f76c2;

    color: #ffffff;
}

.option-text {
    min-width: 0;

    flex: 1;

    color: #2d4057;

    font-size: 14px;

    line-height: 1.45;

    font-weight: 600;
}

.option-check {
    width: 22px;
    height: 22px;

    flex-shrink: 0;

    color: #2f76c2;

    display: flex;
    align-items: center;
    justify-content: center;

    opacity: 0;

    transform: scale(0.8);

    transition:
        opacity 0.2s ease,
        transform 0.2s ease;
}

.option-card.selected
.option-check {
    opacity: 1;

    transform: scale(1);
}

.option-check svg {
    width: 17px;
    height: 17px;

    font-size: 19px;
}


/* =========================================================
   WARNING
========================================================= */

.fillform-warning {
    width: 100%;

    margin-top: 17px;

    padding: 13px 15px;

    border:
        1px solid #f0d8a8;

    border-radius: 13px;

    background: #fff7e7;

    color: #9e6b13;

    display: flex;
    align-items: flex-start;

    gap: 10px;
}

.fillform-warning > svg {
    margin-top: 2px;

    flex-shrink: 0;

    font-size: 16px;
}

.fillform-warning > div {
    display: flex;
    flex-direction: column;

    gap: 3px;
}

.fillform-warning strong {
    font-size: 12px;

    font-weight: 700;
}

.fillform-warning span {
    font-size: 10px;

    line-height: 1.5;
}


/* =========================================================
   QUESTION FOOTER
========================================================= */

.question-footer {
    width: 100%;

    margin-top: 24px;
    padding-top: 18px;

    border-top:
        1px solid #e5ebf2;

    display: grid;

    grid-template-columns:
        minmax(135px, 0.45fr)
        minmax(120px, 0.45fr)
        minmax(170px, 0.55fr);

    align-items: center;

    gap: 10px;
}

.previous-btn,
.next-btn,
.submit-btn {
    width: 100%;
    height: 43px;

    padding: 0 14px;

    border-radius: 11px;

    display: flex;
    align-items: center;
    justify-content: center;

    gap: 8px;

    font-family: inherit;

    font-size: 11px;

    font-weight: 700;

    cursor: pointer;

    transition:
        transform 0.2s ease,
        background 0.2s ease,
        color 0.2s ease,
        border-color 0.2s ease,
        box-shadow 0.2s ease;
}

.previous-btn {
    border:
        1px solid #d8e1eb;

    background: #ffffff;

    color: #6f8298;
}

.previous-btn:hover:not(:disabled) {
    transform: translateY(-1px);

    border-color: #bfd3e6;

    background: #f4f8fc;

    color: #315f8f;
}

.previous-btn:disabled {
    cursor: not-allowed;

    opacity: 0.45;
}

.next-btn,
.submit-btn {
    border: none;

    background:
        linear-gradient(
            90deg,
            #1f5fa4,
            #2e7fd0
        );

    color: #ffffff;

    box-shadow:
        0 6px 14px rgba(37, 105, 178, 0.2);
}

.next-btn:hover,
.submit-btn:hover {
    transform: translateY(-2px);

    box-shadow:
        0 10px 19px rgba(37, 105, 178, 0.27);

    filter: brightness(1.04);
}

.submit-btn {
    background:
        linear-gradient(
            90deg,
            #258960,
            #32ae79
        );

    box-shadow:
        0 6px 14px rgba(42, 155, 105, 0.2);
}

.submit-btn:hover {
    box-shadow:
        0 10px 19px rgba(42, 155, 105, 0.27);
}

.previous-btn svg,
.next-btn svg,
.submit-btn svg {
    width: 10px;
    height: 10px;

    flex-shrink: 0;

    font-size: 12px;
}

.question-footer-status {
    text-align: center;
}

.question-footer-status span {
    color: #8494a7;

    font-size: 10px;

    font-weight: 600;
}


/* =========================================================
   DARK MODE
========================================================= */

.fillform-page.dark {
    background:
        radial-gradient(
            circle at top right,
            rgba(70, 135, 216, 0.08),
            transparent 28%
        ),
        #0d1624;

    color: #e7edf6;
}

.fillform-page.dark
.fillform-header {
    background:
        linear-gradient(
            135deg,
            #0b294f 0%,
            #164575 55%,
            #2268aa 100%
        );

    box-shadow:
        inset 0 -1px 0 rgba(255, 255, 255, 0.07),
        0 10px 26px rgba(0, 0, 0, 0.25);
}

.fillform-page.dark
.question-sidebar {
    background:
        rgba(23, 34, 52, 0.97);

    border-color: #2c3b50;

    box-shadow:
        8px 0 20px rgba(0, 0, 0, 0.15);
}

.fillform-page.dark
.sidebar-heading h3,
.fillform-page.dark
.question-header h1,
.fillform-page.dark
.option-text {
    color: #f1f5f9;
}

.fillform-page.dark
.sidebar-heading span,
.fillform-page.dark
.question-instruction,
.fillform-page.dark
.legend-item p,
.fillform-page.dark
.question-footer-status span {
    color: #8fa0b4;
}

.fillform-page.dark
.sidebar-heading > strong,
.fillform-page.dark
.question-label {
    background: #203955;

    border-color: #2e5073;

    color: #73b6ff;
}

.fillform-page.dark
.question-number {
    background: #1f2d40;

    border-color: #314157;

    color: #93a5b9;
}

.fillform-page.dark
.question-number:hover {
    background: #26384e;

    border-color: #45617e;

    color: #b9cee4;
}

.fillform-page.dark
.question-number.active {
    background:
        linear-gradient(
            145deg,
            #1f5fa4,
            #2e7fd0
        );

    color: #ffffff;

    border-color: #5d9de2;
}

.fillform-page.dark
.question-number.answered {
    background: #21463a;

    border-color: #2e604d;

    color: #66d39d;
}

.fillform-page.dark
.sidebar-completion {
    background: #1f2d40;

    border-color: #314157;
}

.fillform-page.dark
.sidebar-completion-heading span {
    color: #93a5b9;
}

.fillform-page.dark
.sidebar-completion-track {
    background: #334155;
}

.fillform-page.dark
.question-legend {
    border-color: #304055;
}

.fillform-page.dark
.legend {
    background: #1f2d40;

    border-color: #3c4d62;
}

.fillform-page.dark
.question-card {
    background: #172234;

    border-color: #2c3b50;

    box-shadow:
        0 10px 28px rgba(0, 0, 0, 0.18);
}

.fillform-page.dark
.question-header-icon {
    background: #203a58;

    color: #6db2ff;
}

.fillform-page.dark
.question-image {
    background: #1f2d40;

    border-color: #314157;
}

.fillform-page.dark
.option-card {
    background: #1b283b;

    border-color: #314157;
}

.fillform-page.dark
.option-card:hover {
    background: #213147;

    border-color: #45617e;

    box-shadow:
        0 7px 17px rgba(0, 0, 0, 0.14);
}

.fillform-page.dark
.option-card.selected {
    background:
        linear-gradient(
            145deg,
            #203955,
            #1b2f47
        );

    border-color: #5794d4;
}

.fillform-page.dark
.option-letter {
    background: #25384f;

    color: #8ec4ff;
}

.fillform-page.dark
.option-card.selected
.option-letter {
    background: #367fc7;

    color: #ffffff;
}

.fillform-page.dark
.fillform-warning {
    background: #3b311f;

    border-color: #5b4b2a;

    color: #f2bd57;
}

.fillform-page.dark
.question-footer {
    border-color: #304055;
}

.fillform-page.dark
.previous-btn {
    background: #1b283b;

    border-color: #314157;

    color: #a4b5c8;
}

.fillform-page.dark
.previous-btn:hover:not(:disabled) {
    background: #22334a;

    border-color: #486784;

    color: #d7e2ee;
}


/* =========================================================
   TABLET
========================================================= */

@media (max-width: 1000px) {

    .fillform-header {
        grid-template-columns:
            minmax(210px, 0.8fr)
            minmax(260px, 1.1fr)
            135px;

        gap: 18px;

        padding:
            14px 20px;
    }

    .fillform-body {
        grid-template-columns:
            205px minmax(0, 1fr);
    }

    .question-sidebar {
        padding:
            24px 16px 28px;
    }

    .question-grid {
        grid-template-columns:
            repeat(3, minmax(0, 1fr));
    }

    .question-content {
        padding:
            22px 20px 36px;
    }

    .question-card {
        padding: 22px;
    }

}


/* =========================================================
   MOBILE / SMALL TABLET
========================================================= */

@media (max-width: 760px) {

    .fillform-header {
        position: relative;

        min-height: auto;

        padding:
            15px 14px;

        grid-template-columns:
            1fr auto;

        grid-template-areas:
            "brand timer"
            "progress progress";

        gap: 14px 12px;
    }

    .fillform-brand {
        grid-area: brand;
    }

    .fillform-header-progress {
        grid-area: progress;
    }

    .fillform-timer {
        grid-area: timer;

        min-height: 49px;

        padding:
            0 11px;
    }

    .fillform-timer span {
        display: none;
    }

    .fillform-timer strong {
        font-size: 16px;
    }

    .fillform-logo-wrapper {
        width: 40px;
        height: 40px;

        border-radius: 11px;
    }

    .fillform-logo-wrapper img {
        width: 28px;
        height: 28px;
    }

    .fillform-brand-text h2 {
        font-size: 19px;
    }

    .fillform-brand-text span {
        max-width: 210px;

        font-size: 10px;
    }

    .fillform-body {
        display: block;

        min-height: auto;
    }

    .question-sidebar {
        position: relative;
        top: auto;

        min-height: auto;

        padding:
            15px 12px;

        border-right: none;
        border-bottom:
            1px solid #dfe7f0;

        box-shadow:
            0 7px 16px rgba(24, 51, 84, 0.04);
    }

    .sidebar-heading {
        margin-bottom: 13px;
    }

    .sidebar-heading h3 {
        font-size: 16px;
    }

    .question-grid {
        grid-template-columns:
            repeat(auto-fit, minmax(42px, 1fr));

        margin-bottom: 14px;
    }

    .question-number {
        max-height: 48px;

        aspect-ratio: auto;

        min-height: 42px;
    }

    .sidebar-completion {
        margin-bottom: 13px;

        padding: 11px;
    }

    .question-legend {
        padding-top: 13px;

        flex-direction: row;
        flex-wrap: wrap;

        gap: 9px 15px;
    }

    .question-content {
        padding:
            14px 12px 28px;
    }

    .question-card {
        padding: 17px;

        border-radius: 17px;
    }

    .question-header {
        margin-bottom: 17px;
    }

    .question-header h1 {
        font-size: 21px;
    }

    .question-header-icon {
        width: 43px;
        height: 43px;

        border-radius: 12px;
    }

    .question-header-icon svg {
        width: 17px;
        height: 17px;
    }

    .option-card {
        min-height: 58px;

        padding:
            9px 11px;

        border-radius: 13px;
    }

    .option-letter {
        width: 35px;
        height: 35px;

        border-radius: 10px;
    }

    .option-text {
        font-size: 12px;
    }

    .question-footer {
        grid-template-columns:
            repeat(2, minmax(0, 1fr));

        gap: 8px;
    }

    .question-footer-status {
        grid-column: 1 / -1;
        grid-row: 1;

        padding-bottom: 2px;
    }

    .previous-btn {
        grid-column: 1;
        grid-row: 2;
    }

    .next-btn,
    .submit-btn {
        grid-column: 2;
        grid-row: 2;
    }

}


/* =========================================================
   SMALL MOBILE
========================================================= */

@media (max-width: 430px) {

    .fillform-header {
        padding:
            13px 11px;

        gap: 12px 8px;
    }

    .fillform-brand-text span {
        max-width: 145px;
    }

    .fillform-timer {
        min-height: 44px;

        padding:
            0 9px;

        gap: 7px;
    }

    .fillform-timer strong {
        font-size: 14px;
    }

    .fillform-progress-information span {
        font-size: 10px;
    }

    .fillform-progress-information strong {
        font-size: 11px;
    }

    .question-sidebar {
        padding:
            13px 10px;
    }

    .question-content {
        padding:
            11px 9px 24px;
    }

    .question-card {
        padding: 14px;
    }

    .question-header {
        gap: 10px;
    }

    .question-header h1 {
        font-size: 18px;
    }

    .question-instruction {
        font-size: 10px;
    }

    .question-header-icon {
        display: none;
    }

    .question-image {
        border-radius: 13px;
    }

    .options-list {
        gap: 9px;
    }

    .option-card {
        min-height: 54px;

        padding:
            8px 10px;
    }

    .option-letter {
        width: 32px;
        height: 32px;

        font-size: 12px;
    }

    .option-text {
        font-size: 11px;
    }

    .question-footer {
        margin-top: 18px;
        padding-top: 14px;
    }

    .previous-btn,
    .next-btn,
    .submit-btn {
        height: 40px;

        padding:
            0 10px;

        font-size: 10px;
    }

}


/* =========================================================
   ACCESSIBILITY
========================================================= */

.fillform-page button:focus-visible,
.fillform-page label:has(input:focus-visible) {
    outline:
        2px solid rgba(45, 119, 190, 0.55);

    outline-offset: 3px;
}


/* =========================================================
   REDUCED MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {

    .fillform-page *,
    .fillform-page *::before,
    .fillform-page *::after {
        animation: none !important;

        transition: none !important;

        scroll-behavior: auto !important;
    }

}
/* =========================================================
   TEXT ANSWER
========================================================= */

.fillform-text-answer {
    width: 100%;
    margin-top: 22px;
}

.fillform-text-answer input,
.fillform-text-answer textarea {
    width: 100%;

    border: 1px solid #dce6f2;
    border-radius: 14px;

    background: #ffffff;
    color: #22344d;

    font-family: inherit;
    font-size: 16px;
    line-height: 1.6;

    outline: none;

    transition:
        border-color .2s ease,
        box-shadow .2s ease,
        background .2s ease;
}

.fillform-text-answer input {
    height: 54px;
    padding: 0 17px;
}

.fillform-text-answer textarea {
    min-height: 145px;
    padding: 15px 17px;
    resize: vertical;
}

.fillform-text-answer input:focus,
.fillform-text-answer textarea:focus {
    border-color: #2f78d0;
    box-shadow: 0 0 0 4px rgba(47, 120, 208, .1);
}

.fillform-text-answer input::placeholder,
.fillform-text-answer textarea::placeholder {
    color: #9aa8b9;
}


/* =========================================================
   RATING ANSWER
========================================================= */

.fillform-rating-list {
    display: flex;
    align-items: stretch;
    flex-wrap: wrap;

    gap: 12px;

    margin-top: 22px;
}

.fillform-rating-btn {
    width: 76px;
    min-height: 76px;

    border: 1px solid #dce6f2;
    border-radius: 14px;

    background: #ffffff;
    color: #a6b1bf;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    gap: 7px;

    font-family: inherit;
    font-size: 15px;
    font-weight: 700;

    cursor: pointer;

    transition:
        transform .2s ease,
        border-color .2s ease,
        background .2s ease,
        color .2s ease,
        box-shadow .2s ease;
}

.fillform-rating-btn svg {
    font-size: 23px;
}

.fillform-rating-btn:hover {
    transform: translateY(-2px);

    border-color: #f4c85b;
    color: #e5a900;

    box-shadow: 0 8px 18px rgba(30, 57, 91, .08);
}

.fillform-rating-btn.selected {
    border-color: #f0b51e;

    background: #fff8df;
    color: #db9d00;

    box-shadow: 0 0 0 3px rgba(240, 181, 30, .11);
}


/* =========================================================
   EMPTY FORM
========================================================= */

.fillform-empty-state {
    min-height: 100vh;

    padding: 30px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    text-align: center;
}

.fillform-empty-state > svg {
    margin-bottom: 15px;

    color: #347dcc;
    font-size: 44px;
}

.fillform-empty-state h2 {
    margin: 0 0 8px;

    color: #263a52;
    font-size: 24px;
}

.fillform-empty-state p {
    margin: 0 0 20px;

    color: #8796a9;
    font-size: 15px;
}

.fillform-empty-state button {
    height: 43px;
    padding: 0 18px;

    border: none;
    border-radius: 11px;

    background: #276fbd;
    color: #ffffff;

    font-family: inherit;
    font-size: 14px;
    font-weight: 700;

    cursor: pointer;
}


/* =========================================================
   DARK MODE
========================================================= */

.fillform-page.dark
.fillform-text-answer input,

.fillform-page.dark
.fillform-text-answer textarea,

.fillform-page.dark
.fillform-rating-btn {
    border-color: #314258;

    background: #172234;
    color: #eef4fb;
}

.fillform-page.dark
.fillform-text-answer input::placeholder,

.fillform-page.dark
.fillform-text-answer textarea::placeholder {
    color: #74859a;
}

.fillform-page.dark
.fillform-rating-btn.selected {
    border-color: #c5931b;

    background: #3b3118;
    color: #f6c94c;
}

.fillform-page.dark
.fillform-empty-state h2 {
    color: #f1f5f9;
}

.fillform-page.dark
.fillform-empty-state p {
    color: #93a3b7;
}

.question-title-html {
  display: inline;
}

.question-title-html p {
  margin: 0;
  display: inline;
}

.question-title-html .ql-video {
  display: block;
  width: 100%;
  max-width: 100%;
  aspect-ratio: 16 / 9;
  margin: 12px 0;
  border: none;
  border-radius: 10px;
}

.question-title-html a {
  color: #2874bc;
  text-decoration: underline;
  word-break: break-word;
}

.question-title-html .katex {
  font-size: 1.05em;
}

.question-title-html .ql-video {
  display: block;
  width: 100%;
  max-width: 100%;
  aspect-ratio: 16 / 9;
  margin: 12px 0;
  border: none;
  border-radius: 10px;
}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 600px) {

    .fillform-rating-btn {
        width: 60px;
        min-height: 65px;
    }

    .fillform-text-answer input {
        height: 50px;
    }

}
/* === FillFormImageZoom.css === */
/* =========================================================
   HIDOCS — FILL FORM IMAGE ZOOM
   Add-on for FillForm.jsx
========================================================= */

.question-image-wrapper {
  width: 100%;
}

button.question-image.question-image-clickable {
  position: relative;
  width: 100%;
  padding: 0;
  overflow: hidden;
  border: 0;
  border-radius: inherit;
  background: transparent;
  display: block;
  cursor: zoom-in;
  font: inherit;
  text-align: inherit;
}

button.question-image.question-image-clickable img {
  display: block;
  width: 100%;
  max-height: 520px;
  object-fit: contain;
  transition: transform 0.2s ease, filter 0.2s ease;
}

button.question-image.question-image-clickable:hover img {
  transform: scale(1.012);
  filter: brightness(0.94);
}

.question-image-zoom-hint {
  position: absolute;
  right: 14px;
  bottom: 14px;
  min-height: 36px;
  padding: 0 12px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 10px;
  background: rgba(8, 24, 45, 0.82);
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  font-weight: 700;
  opacity: 0;
  transform: translateY(5px);
  transition: opacity 0.2s ease, transform 0.2s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  pointer-events: none;
}

.question-image-clickable:hover .question-image-zoom-hint,
.question-image-clickable:focus-visible .question-image-zoom-hint {
  opacity: 1;
  transform: translateY(0);
}

/* =========================================================
   FULL SCREEN VIEWER
========================================================= */

.image-preview-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  padding: 22px;
  background: rgba(3, 10, 22, 0.86);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(9px);
  -webkit-backdrop-filter: blur(9px);
}

.image-preview-modal {
  width: min(1180px, 100%);
  height: min(850px, calc(100vh - 44px));
  min-height: 360px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 22px;
  background: #111d2d;
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr) auto;
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.46);
}

.image-preview-header {
  min-height: 66px;
  padding: 13px 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.09);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.image-preview-header > div {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.image-preview-header span {
  color: #7d93ac;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.image-preview-header strong {
  color: #ffffff;
  font-size: 17px;
}

.image-preview-close {
  width: 38px;
  height: 38px;
  border: 0;
  border-radius: 11px;
  background: rgba(255, 255, 255, 0.08);
  color: #dce7f3;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
}

.image-preview-close:hover {
  background: #dc4444;
  color: #ffffff;
  transform: rotate(3deg);
}

.image-preview-toolbar {
  min-height: 56px;
  padding: 9px 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: #162437;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.image-preview-toolbar button {
  min-width: 38px;
  height: 36px;
  padding: 0 11px;
  border: 1px solid rgba(255, 255, 255, 0.11);
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.07);
  color: #dce8f5;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font: inherit;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
}

.image-preview-toolbar button:hover:not(:disabled) {
  background: #2f7bc5;
  color: #ffffff;
  transform: translateY(-1px);
}

.image-preview-toolbar button:disabled {
  opacity: 0.34;
  cursor: not-allowed;
}

.image-preview-zoom-value {
  min-width: 60px;
  height: 36px;
  padding: 0 10px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 9px;
  background: #0c1725;
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
}

/* This area deliberately scrolls when the image is zoomed. */
.image-preview-scroll-area {
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: auto;
  overscroll-behavior: contain;
  padding: 24px;
  background: radial-gradient(circle at center, #1c2b3f, #09131f);
  scrollbar-width: thin;
  scrollbar-color: #55708d #111d2d;
}

.image-preview-scroll-area::-webkit-scrollbar {
  width: 11px;
  height: 11px;
}

.image-preview-scroll-area::-webkit-scrollbar-track {
  background: #111d2d;
}

.image-preview-scroll-area::-webkit-scrollbar-thumb {
  border: 3px solid #111d2d;
  border-radius: 999px;
  background: #55708d;
}

.image-preview-canvas {
  min-height: 100%;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: width 0.16s ease, min-width 0.16s ease;
}

.image-preview-canvas img {
  display: block;
  width: 100%;
  height: auto;
  max-width: none;
  object-fit: contain;
  transform-origin: center center;
  user-select: none;
  -webkit-user-drag: none;
}

.image-preview-footer {
  min-height: 60px;
  padding: 11px 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: #111d2d;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.image-preview-footer span {
  color: #8396ab;
  font-size: 11px;
  line-height: 1.5;
}

.image-preview-footer button {
  min-width: 88px;
  height: 36px;
  border: 0;
  border-radius: 9px;
  background: #2e79c3;
  color: #ffffff;
  font: inherit;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}

@media (max-width: 680px) {
  .image-preview-overlay {
    padding: 7px;
  }

  .image-preview-modal {
    height: calc(100vh - 14px);
    border-radius: 16px;
  }

  .image-preview-toolbar {
    padding: 8px 10px;
  }

  .image-preview-reset span {
    display: none;
  }

  .image-preview-scroll-area {
    padding: 12px;
  }

  .image-preview-footer {
    padding: 10px 12px;
  }

  .image-preview-footer span {
    max-width: 72%;
  }

  .question-image-zoom-hint {
    right: 9px;
    bottom: 9px;
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .question-image-clickable img,
  .question-image-zoom-hint,
  .image-preview-toolbar button,
  .image-preview-close,
  .image-preview-canvas {
    transition: none !important;
  }
}
/* === FillFormSpecialAnswers.css === */
/* =========================================================
   FILL FORM — SPECIAL ANSWERS
   MATH + CODE
========================================================= */

.fillform-special-answer {
  width: 100%;
  margin-top: 18px;
  padding: 18px;

  border: 1px solid #dce6f1;
  border-radius: 17px;

  background:
    linear-gradient(
      145deg,
      #ffffff,
      #f9fbfe
    );

  box-shadow:
    0 5px 16px rgba(24, 50, 84, 0.05);
}


/* =========================================================
   COMMON HEADING
========================================================= */

.special-answer-heading {
  width: 100%;

  margin-bottom: 15px;

  display: flex;
  align-items: center;

  gap: 11px;
}

.special-answer-icon {
  width: 40px;
  height: 40px;

  flex-shrink: 0;

  border-radius: 11px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 16px;
}

.special-answer-icon.math {
  background: #e8f2fd;
  color: #347bc1;
}

.special-answer-icon.code {
  background: #efe9ff;
  color: #7758cf;
}

.special-answer-heading > div:nth-child(2) {
  min-width: 0;

  display: flex;
  flex-direction: column;

  gap: 2px;
}

.special-answer-heading > div:nth-child(2) > span {
  color: #8796aa;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.9px;

  text-transform: uppercase;
}

.special-answer-heading > div:nth-child(2) > strong {
  color: #2c4058;

  font-size: 13px;
  font-weight: 700;
}


/* =========================================================
   MATH INPUT
========================================================= */

.math-answer-input-wrapper {
  width: 100%;
}

.math-answer-input-wrapper > label {
  display: block;

  margin-bottom: 7px;

  color: #52677f;

  font-size: 11px;
  font-weight: 700;
}

.math-answer-input-wrapper > input {
  width: 100%;
  min-height: 48px;

  padding: 0 14px;

  border: 1px solid #d5e0ec;
  border-radius: 11px;

  outline: none;

  background: #ffffff;
  color: #293d55;

  font-family:
    "Consolas",
    "Courier New",
    monospace;

  font-size: 14px;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.math-answer-input-wrapper > input:focus {
  border-color: #4b8fd6;

  box-shadow:
    0 0 0 4px rgba(75, 143, 214, 0.1);
}

.math-answer-input-wrapper > input:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.math-answer-input-wrapper > small {
  display: block;

  margin-top: 8px;

  color: #8897aa;

  font-size: 10px;
  line-height: 1.6;
}

.math-answer-input-wrapper code {
  padding: 2px 5px;

  border: 1px solid #dce7f2;
  border-radius: 5px;

  background: #f1f6fb;
  color: #315f8d;

  font-family:
    "Consolas",
    "Courier New",
    monospace;

  font-size: 10px;
}


/* =========================================================
   MATH PREVIEW
========================================================= */

.math-preview-box {
  width: 100%;
  min-height: 116px;

  margin-top: 14px;
  padding: 13px;

  border: 1px dashed #cbd9e8;
  border-radius: 12px;

  background: #f8fbff;
}

.math-preview-box.has-value {
  border-style: solid;

  background:
    linear-gradient(
      145deg,
      #f7fbff,
      #ffffff
    );
}

.math-preview-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 10px;

  margin-bottom: 11px;
}

.math-preview-heading span {
  color: #536a82;

  font-size: 10px;
  font-weight: 700;

  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.math-preview-heading small {
  min-height: 21px;

  padding: 0 7px;

  border-radius: 999px;

  background: #e8f2fd;
  color: #347bc1;

  display: inline-flex;
  align-items: center;

  font-size: 8px;
  font-weight: 800;
}

.math-preview-content {
  min-height: 57px;

  overflow-x: auto;

  padding: 10px;

  border-radius: 9px;

  background: #ffffff;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #243a53;

  text-align: center;
}

.math-preview-content .katex-display {
  margin: 0;
}

.math-preview-empty {
  min-height: 56px;

  color: #96a4b5;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 8px;

  font-size: 10px;
}


/* =========================================================
   CODE ANSWER
========================================================= */

.code-answer-lines {
  margin-left: auto;

  min-height: 25px;

  padding: 0 9px;

  border-radius: 999px;

  background: #f0ecff;
  color: #755aca;

  display: inline-flex;
  align-items: center;

  font-size: 9px;
  font-weight: 700;
}

.code-editor-shell {
  width: 100%;

  overflow: hidden;

  border: 1px solid #263b55;
  border-radius: 13px;

  background: #0f1b2a;

  box-shadow:
    0 8px 20px rgba(12, 29, 48, 0.12);
}

.code-editor-topbar {
  min-height: 38px;

  padding: 0 12px;

  border-bottom:
    1px solid rgba(255, 255, 255, 0.08);

  background: #152438;

  display: flex;
  align-items: center;

  gap: 6px;
}

.code-editor-topbar > span {
  width: 8px;
  height: 8px;

  border-radius: 50%;
}

.code-editor-topbar > span:nth-child(1) {
  background: #f06a6a;
}

.code-editor-topbar > span:nth-child(2) {
  background: #eabf5b;
}

.code-editor-topbar > span:nth-child(3) {
  background: #5bc985;
}

.code-editor-topbar > strong {
  margin-left: 6px;

  color: #8799ae;

  font-size: 10px;
  font-weight: 600;
}

.code-editor-shell textarea {
  display: block;

  width: 100%;
  min-height: 260px;

  resize: vertical;

  padding: 15px 16px;

  border: none;
  outline: none;

  background: #0f1b2a;
  color: #dce8f5;

  font-family:
    "Consolas",
    "Courier New",
    monospace;

  font-size: 14px;
  line-height: 1.7;

  tab-size: 2;

  caret-color: #6eb5ff;
}

.code-editor-shell textarea::placeholder {
  color: #62758d;

  opacity: 1;
}

.code-editor-shell textarea:disabled {
  opacity: 0.62;
  cursor: not-allowed;
}

.code-answer-help {
  width: 100%;

  margin-top: 10px;

  color: #8494a8;

  display: flex;
  align-items: center;

  gap: 7px;

  font-size: 10px;
}

.code-answer-help svg {
  flex-shrink: 0;

  color: #7758cf;
}


/* =========================================================
   DARK MODE
========================================================= */

.fillform-page.dark
.fillform-special-answer {
  border-color: #2d4057;

  background:
    linear-gradient(
      145deg,
      #172539,
      #142133
    );

  box-shadow:
    0 7px 18px rgba(0, 0, 0, 0.17);
}

.fillform-page.dark
.special-answer-heading
> div:nth-child(2)
> strong {
  color: #edf3fa;
}

.fillform-page.dark
.special-answer-heading
> div:nth-child(2)
> span {
  color: #8ea0b6;
}

.fillform-page.dark
.special-answer-icon.math {
  background: #203d5d;
  color: #72b6ff;
}

.fillform-page.dark
.special-answer-icon.code {
  background: #352b5a;
  color: #b09bff;
}

.fillform-page.dark
.math-answer-input-wrapper
> label {
  color: #b3c0cf;
}

.fillform-page.dark
.math-answer-input-wrapper
> input {
  border-color: #364b64;

  background: #101c2c;
  color: #edf4fb;
}

.fillform-page.dark
.math-answer-input-wrapper
> input:focus {
  border-color: #5a9dde;

  background: #142235;
}

.fillform-page.dark
.math-answer-input-wrapper
> small {
  color: #8698ad;
}

.fillform-page.dark
.math-answer-input-wrapper code {
  border-color: #334a64;

  background: #1c3047;
  color: #8bc3ff;
}

.fillform-page.dark
.math-preview-box {
  border-color: #354a63;

  background: #101d2c;
}

.fillform-page.dark
.math-preview-box.has-value {
  background:
    linear-gradient(
      145deg,
      #132338,
      #101c2b
    );
}

.fillform-page.dark
.math-preview-heading span {
  color: #a4b3c4;
}

.fillform-page.dark
.math-preview-heading small {
  background: #203d5d;
  color: #79baff;
}

.fillform-page.dark
.math-preview-content {
  background: #0c1725;
  color: #edf4fb;
}

.fillform-page.dark
.math-preview-empty {
  color: #75879b;
}

.fillform-page.dark
.code-answer-lines {
  background: #302852;
  color: #b6a5ff;
}


/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 680px) {

  .fillform-special-answer {
    padding: 14px;

    border-radius: 14px;
  }

  .special-answer-heading {
    align-items: flex-start;
  }

  .special-answer-icon {
    width: 36px;
    height: 36px;
  }

  .code-answer-lines {
    font-size: 8px;
  }

  .code-editor-shell textarea {
    min-height: 220px;

    padding: 13px;

    font-size: 13px;
  }

  .math-preview-content {
    justify-content: flex-start;

    text-align: left;
  }

}
`;

// =========================================================
// KATEX GLOBAL SETUP
// Formula Quill (window.katex) harus tersedia sebelum
// konten formula dirender ulang di halaman user.
// =========================================================

if (typeof window !== "undefined") {
  window.katex = katex;
}

// =========================================================
// STORAGE KEYS
// =========================================================

const FORMS_STORAGE_KEY = "hidocs_forms";
const DELETED_FORMS_STORAGE_KEY = "hidocs_deleted_forms";

// =========================================================
// TIMER LIMIT
// =========================================================

const MIN_TIMER_MINUTES = 1;
const MAX_TIMER_MINUTES = 1000;

// =========================================================
// DEFAULT FORMS
// =========================================================

const defaultForms = [
  {
    id: 1,
    title: "Survey Kepuasan Mahasiswa 2024",
    category: "Survey",
    active: true,
    settings: {
      oneTimeOnly: true,
      timer: {
        enabled: true,
        duration: 20,
      },
    },
    questions: [
      {
        id: "survey-1",
        title: "Bagaimana pendapat Anda mengenai fasilitas kampus?",
        type: "multiple",
        required: true,
        image: "",
        options: ["Sangat Baik", "Baik", "Cukup", "Kurang"],
      },
      {
        id: "survey-2",
        title: "Apakah pelayanan administrasi sudah memuaskan?",
        type: "multiple",
        required: true,
        image: "",
        options: ["Sangat Puas", "Puas", "Kurang Puas", "Tidak Puas"],
      },
    ],
  },
  {
    id: 2,
    title: "Quiz Pemrograman Mobile - Flutter",
    category: "Quiz",
    active: true,
    settings: {
      oneTimeOnly: true,
      timer: {
        enabled: true,
        duration: 30,
      },
    },
    questions: [
      {
        id: "flutter-1",
        title: "Widget apakah yang digunakan untuk membuat layout vertikal di Flutter?",
        type: "multiple",
        required: true,
        image: "",
        options: ["Row", "Column", "Stack", "ListView"],
      },
      {
        id: "flutter-2",
        title: "Perhatikan gambar berikut kemudian pilih jawaban yang benar.",
        type: "multiple",
        required: true,
        image: "https://picsum.photos/800/420",
        options: ["Jawaban A", "Jawaban B", "Jawaban C", "Jawaban D"],
      },
      {
        id: "flutter-3",
        title: "Apa fungsi utama dari Scaffold pada Flutter?",
        type: "multiple",
        required: true,
        image: "",
        options: ["Widget Layout", "Database", "State Management", "API"],
      },
    ],
  },
  {
    id: 3,
    title: "Form Pendaftaran Event Hackathon",
    category: "Registration",
    active: true,
    settings: {
      oneTimeOnly: true,
      timer: {
        enabled: true,
        duration: 15,
      },
    },
    questions: [
      {
        id: "hackathon-1",
        title: "Apakah Anda bersedia mengikuti seluruh rangkaian acara?",
        type: "yesno",
        required: true,
        image: "",
        options: ["Ya", "Tidak"],
      },
    ],
  },
];

// =========================================================
// SAFE STORAGE READER
// =========================================================

const getStoredArray = (key) => {
  try {
    const storedValue = localStorage.getItem(key);

    if (!storedValue) {
      return [];
    }

    const parsedValue = JSON.parse(storedValue);

    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch (error) {
    console.error(`Gagal membaca ${key}:`, error);

    return [];
  }
};

// =========================================================
// ANSWER CHECKER
// =========================================================

const hasAnswerValue = (value) => {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  return value !== undefined && value !== null && value !== "";
};

// =========================================================
// SHUFFLE HELPER
// =========================================================

const shuffleArray = (items) => {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));

    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }

  return result;
};

// =========================================================
// SANITIZE QUESTION HTML
//
// question.title / options bisa berisi HTML dari Quill
// (bold, list, link, embed video, formula KaTeX). String ini
// harus disaring sebelum dirender via dangerouslySetInnerHTML
// agar aman dari XSS, tapi tetap mengizinkan <iframe> untuk
// video embed Quill.
// =========================================================

// =========================================================
// VIDEO EMBED HELPERS
// =========================================================

const getVideoEmbedUrl = (url) => {
  if (!url) {
    return null;
  }

  const cleanUrl = String(url).trim();

  // Sudah berupa embed URL YouTube
  const youtubeEmbedMatch = cleanUrl.match(
    /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/
  );

  if (youtubeEmbedMatch) {
    return `https://www.youtube.com/embed/${youtubeEmbedMatch[1]}`;
  }

  // youtube.com/watch?v=xxxx
  const youtubeWatchMatch = cleanUrl.match(
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/
  );

  if (youtubeWatchMatch) {
    return `https://www.youtube.com/embed/${youtubeWatchMatch[1]}`;
  }

  // youtu.be/xxxx
  const youtubeShortMatch = cleanUrl.match(
    /youtu\.be\/([a-zA-Z0-9_-]+)/
  );

  if (youtubeShortMatch) {
    return `https://www.youtube.com/embed/${youtubeShortMatch[1]}`;
  }

  // vimeo.com/xxxx
  const vimeoMatch = cleanUrl.match(
    /vimeo\.com\/(\d+)/
  );

  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return null;

};


// =========================================================
// CONVERT VIDEO LINKS TO EMBEDDED IFRAME
//
// Menangani soal lama yang videonya tersimpan sebagai <a href>
// biasa (bukan hasil tombol Video Quill), supaya tetap tampil
// sebagai player, bukan link biru.
// =========================================================

const convertVideoLinksToEmbeds = (html) => {

  if (typeof window === "undefined" || !html) {
    return html;
  }

  const parser = new DOMParser();

  const parsedDocument = parser.parseFromString(
    html,
    "text/html"
  );


  const anchors = parsedDocument.querySelectorAll("a");


  anchors.forEach((anchor) => {

    const href = anchor.getAttribute("href") || "";

    const embedUrl = getVideoEmbedUrl(href);


    if (!embedUrl) {
      return;
    }


    const iframe = parsedDocument.createElement("iframe");

    iframe.setAttribute("src", embedUrl);
    iframe.setAttribute("class", "ql-video");
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("allowfullscreen", "true");
    iframe.setAttribute(
      "allow",
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    );


    anchor.replaceWith(iframe);

  });


  return parsedDocument.body.innerHTML;

};


// =========================================================
// SANITIZE QUESTION HTML
//
// question.title / options bisa berisi HTML dari Quill
// (bold, list, link, embed video, formula KaTeX). String ini
// harus disaring sebelum dirender via dangerouslySetInnerHTML
// agar aman dari XSS, tapi tetap mengizinkan <iframe> untuk
// video embed Quill. Link video (YouTube/Vimeo) juga otomatis
// dikonversi menjadi iframe embed.
// =========================================================

const sanitizeQuestionHtml = (html) => {

  const rawHtml = String(html || "");


  const withEmbeddedVideos =
    convertVideoLinksToEmbeds(rawHtml);


  return DOMPurify.sanitize(withEmbeddedVideos, {
    ADD_TAGS: ["iframe"],
    ADD_ATTR: [
      "allow",
      "allowfullscreen",
      "class",
      "frameborder",
      "src",
      "target",
    ],
  });
};
// =========================================================
// SCHEDULE HELPERS
// =========================================================

const buildScheduleDateTime = (dateValue, timeValue, defaultTime) => {
  if (!dateValue) {
    return "";
  }

  const safeTime = timeValue || defaultTime;

  return `${dateValue}T${safeTime}:00`;
};

const parseDateTime = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
};

const formatAvailabilityDateTime = (value) => {
  const date = parseDateTime(value);

  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const getFormSchedule = (form) => {
  const settings = form.settings && typeof form.settings === "object" ? form.settings : {};

  const scheduleObject = form.schedule && typeof form.schedule === "object" ? form.schedule : {};

  const settingsSchedule =
    settings.schedule && typeof settings.schedule === "object" ? settings.schedule : {};

  const openAt =
    form.openAt ||
    scheduleObject.openAt ||
    settings.openAt ||
    settingsSchedule.openAt ||
    buildScheduleDateTime(form.openDate, form.openTime, "00:00");

  let closeAt =
    form.closeAt ||
    scheduleObject.closeAt ||
    settings.closeAt ||
    settingsSchedule.closeAt ||
    buildScheduleDateTime(form.closeDate, form.closeTime, "23:59");

  const responseDays = Number(form.responseDays ?? settings.responseDays);

  /*
    Response availability dipakai sebagai fallback jika admin
    tidak menentukan Close Date secara manual.
  */

  if (!closeAt && Number.isFinite(responseDays) && responseDays > 0) {
    const startingDate = parseDateTime(openAt) || parseDateTime(form.createdAt);

    if (startingDate) {
      const automaticClose = new Date(startingDate);

      automaticClose.setDate(automaticClose.getDate() + responseDays);

      closeAt = automaticClose.toISOString();
    }
  }

  const activationMode =
    form.activationMode ||
    settings.activationMode ||
    (settings.activateImmediately === false ? "scheduled" : "immediate");

  const enabled = Boolean(
    form.schedule?.enabled ??
      settings.scheduleEnabled ??
      settings.schedule?.enabled ??
      Boolean(openAt || closeAt || activationMode === "scheduled")
  );

  return {
    enabled,
    activationMode,
    openAt,
    closeAt,
  };
};

const getFormAvailability = (form, currentTime = new Date()) => {
  const schedule = getFormSchedule(form);

  const now = currentTime instanceof Date ? currentTime : new Date(currentTime);

  if (form.active === false) {
    return {
      status: "inactive",
      canFill: false,
      openAt: schedule.openAt,
      closeAt: schedule.closeAt,
      message: "Form ini sedang dinonaktifkan oleh admin.",
    };
  }

  const openDate = parseDateTime(schedule.openAt);

  const closeDate = parseDateTime(schedule.closeAt);

  if (schedule.activationMode === "scheduled" && !openDate) {
    return {
      status: "not-open",
      canFill: false,
      openAt: schedule.openAt,
      closeAt: schedule.closeAt,
      message: "Form ini belum dibuka oleh admin.",
    };
  }

  if (openDate && now < openDate) {
    return {
      status: "not-open",
      canFill: false,
      openAt: schedule.openAt,
      closeAt: schedule.closeAt,
      message: `Form belum dibuka. Form dapat dikerjakan mulai ${formatAvailabilityDateTime(
        schedule.openAt
      )}.`,
    };
  }

  if (closeDate && now > closeDate) {
    return {
      status: "closed",
      canFill: false,
      openAt: schedule.openAt,
      closeAt: schedule.closeAt,
      message: `Form sudah ditutup pada ${formatAvailabilityDateTime(schedule.closeAt)}.`,
    };
  }

  return {
    status: "open",
    canFill: true,
    openAt: schedule.openAt,
    closeAt: schedule.closeAt,
    message: "",
  };
};

// =========================================================
// SCORE HELPERS
// =========================================================

const normalizeComparableAnswer = (value) => {
  if (value === undefined || value === null) {
    return "";
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim().toLowerCase())
      .sort()
      .join("|");
  }

  return String(value).trim().toLowerCase();
};

const calculateFormScore = (questions, answers) => {
  let score = 0;
  let maxScore = 0;
  let correctAnswers = 0;
  let incorrectAnswers = 0;
  let scoredQuestions = 0;

  /*
    IMPORTANT:

    Penilaian ini merupakan INTERNAL GRADING untuk admin.
    Perhitungan tetap dilakukan walaupun resultMode user adalah:

    - none
    - result
    - score

    resultMode hanya menentukan apa yang boleh dilihat user.
    Ia TIDAK menentukan apakah jawaban user dinilai atau tidak.
  */

  const questionResults = questions.map((question) => {
    const grading = question.grading && typeof question.grading === "object" ? question.grading : {};

    const scoringEnabled = Boolean(question.scoring ?? grading.enabled);

    const respondentAnswer = answers[question.id];

    const hasRespondentAnswer = hasAnswerValue(respondentAnswer);

    const rawCorrectAnswer = question.correctAnswer ?? grading.correctAnswer ?? "";

    const normalizedCorrectAnswer = normalizeComparableAnswer(rawCorrectAnswer);

    const normalizedRespondentAnswer = normalizeComparableAnswer(respondentAnswer);

    const points = scoringEnabled ? Math.max(Number(question.points ?? grading.points) || 0, 0) : 0;

    const hasCorrectAnswer = Boolean(normalizedCorrectAnswer);

    let isCorrect = null;

    if (scoringEnabled && points > 0 && hasCorrectAnswer) {
      isCorrect = hasRespondentAnswer && normalizedRespondentAnswer === normalizedCorrectAnswer;

      scoredQuestions += 1;

      maxScore += points;

      if (isCorrect) {
        score += points;

        correctAnswers += 1;
      } else {
        incorrectAnswers += 1;
      }
    }

    const earnedPoints = isCorrect === true ? points : 0;

    return {
      questionId: question.id,
      questionNumber: question.number ?? null,
      questionTitle: question.title || question.question || "",
      questionType: question.type || "short",
      userAnswer: respondentAnswer,
      correctAnswer: rawCorrectAnswer,
      scoring: scoringEnabled,
      scoringEnabled,
      isCorrect,
      points,
      maxPoints: points,
      earnedPoints,
      answered: hasRespondentAnswer,
    };
  });

  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  return {
    score,
    maxScore,
    percentage,
    correctAnswers,
    incorrectAnswers,
    scoredQuestions,
    questionResults,
    gradingEnabled: scoredQuestions > 0,
  };
};

// =========================================================
// NORMALIZE QUESTION
// =========================================================

const normalizeQuestion = (question, index) => {
  const questionType =
    question.type ||
    (Array.isArray(question.options) && question.options.length > 0 ? "multiple" : "short");

  // =========================================================
  // NORMAL OPTIONS
  // =========================================================

  let questionOptions = Array.isArray(question.options)
    ? question.options.map((option) => String(option ?? "").trim()).filter(Boolean)
    : [];

  if (questionType === "yesno" && questionOptions.length === 0) {
    questionOptions = ["Yes", "No"];
  }

  // =========================================================
  // IMAGE ANSWER TYPE
  // =========================================================

  let imageAnswerType = String(question.imageAnswerType || "").trim().toLowerCase();

  if (!["multiple", "short", "long"].includes(imageAnswerType)) {
    /*
      Kompatibilitas dengan pertanyaan gambar lama.

      Jika terdapat imageOptions maka dianggap
      multiple choice.

      Jika tidak, default ke short answer.
    */

    if (Array.isArray(question.imageOptions) && question.imageOptions.length > 0) {
      imageAnswerType = "multiple";
    } else {
      imageAnswerType = "short";
    }
  }

  // =========================================================
  // IMAGE OPTIONS
  // =========================================================

  let imageOptions = Array.isArray(question.imageOptions)
    ? question.imageOptions.map((option) => String(option ?? "").trim()).filter(Boolean)
    : [];

  /*
    Mendukung kemungkinan CreateForm menyimpan
    pilihan pertanyaan gambar di field options.
  */

  if (
    questionType === "image" &&
    imageAnswerType === "multiple" &&
    imageOptions.length === 0 &&
    questionOptions.length > 0
  ) {
    imageOptions = questionOptions;
  }

  return {
    ...question,
    id: question.id || `question-${index + 1}`,
    title: String(question.title || question.question || "").trim() || `Question ${index + 1}`,
    type: questionType,
    required: question.required !== false,
    image: String(question.image || "").trim(),
    imageName: String(question.imageName || "").trim(),
    options: questionOptions,
    imageAnswerType,
    imageOptions,
    ratingMax: Math.min(Math.max(Number(question.ratingMax) || 5, 1), 10),
    scoring: Boolean(question.scoring ?? question.grading?.enabled),
    points: Number(question.points ?? question.grading?.points) || 0,
    correctAnswer: String(question.correctAnswer ?? question.grading?.correctAnswer ?? "").trim(),
    grading: {
      ...(question.grading && typeof question.grading === "object" ? question.grading : {}),
      enabled: Boolean(question.scoring ?? question.grading?.enabled),
      points: Number(question.points ?? question.grading?.points) || 0,
      correctAnswer: String(question.correctAnswer ?? question.grading?.correctAnswer ?? "").trim(),
    },
  };
};

// =========================================================
// NORMALIZE TIMER
// =========================================================

const normalizeTimer = (form) => {
  const timerSetting =
    form.settings?.timer && typeof form.settings.timer === "object" ? form.settings.timer : {};

  const timerEnabled =
    form.timerEnabled ?? form.settings?.timerEnabled ?? timerSetting.enabled ?? Boolean(form.duration);

  const rawDuration = Number(
    form.timerDuration ?? form.settings?.timerDuration ?? timerSetting.duration ?? form.duration ?? 20
  );

  const duration = Number.isFinite(rawDuration)
    ? Math.min(Math.max(Math.floor(rawDuration), MIN_TIMER_MINUTES), MAX_TIMER_MINUTES)
    : 20;

  return {
    enabled: Boolean(timerEnabled),
    duration,
  };
};
const reverseQuestionTypeMap = {
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

const mapApiQuestionForFill = (q) => ({
  id: q.id,
  title: q.question_text,
  type: reverseQuestionTypeMap[q.question_type] || "short",
  required: q.is_required,
  scoring: q.is_auto_scored,
  points: q.points,
  language: q.code_language || "",
  options: (q.options || []).map((o) => o.option_text),
  optionIds: (q.options || []).reduce((acc, o) => {
    acc[o.option_text] = o.id;
    return acc;
  }, {}),
});


// =========================================================
// NORMALIZE FORM
// =========================================================

const normalizeForm = (form) => {
  const timer = normalizeTimer(form);

  const settings = form.settings && typeof form.settings === "object" ? form.settings : {};

  let questions = Array.isArray(form.questions) ? form.questions.map(normalizeQuestion) : [];

  /*
    Shuffle answer options dilakukan satu kali ketika form
    dimuat sehingga urutan tidak berubah setiap re-render.
  */

  if (settings.shuffleAnswers) {
    questions = questions.map((question) => {
      if (question.type === "multiple") {
        return {
          ...question,
          options: shuffleArray(question.options),
        };
      }

      if (question.type === "image" && question.imageAnswerType === "multiple") {
        return {
          ...question,
          imageOptions: shuffleArray(question.imageOptions),
        };
      }

      return question;
    });
  }

  /*
    Shuffle question order juga dilakukan satu kali saat form
    dibuka. ID pertanyaan tetap sama sehingga jawaban aman.
  */

  if (settings.shuffleQuestions) {
    questions = shuffleArray(questions);
  }

  const schedule = getFormSchedule(form);

  return {
    ...form,
    id: form.id,
    title: String(form.title || "").trim() || "Untitled Form",
    category: form.category || form.type || "Form",
    active: form.active !== false,
    oneTimeOnly: settings.oneTimeOnly !== false,
    shuffleQuestions: Boolean(settings.shuffleQuestions),
    shuffleAnswers: Boolean(settings.shuffleAnswers),
    resultMode: settings.resultMode || form.resultMode || "none",
    timerEnabled: timer.enabled,
    timerDuration: timer.duration,
    schedule,
    questions,
  };
};

// =========================================================
// FILL FORM
// =========================================================

function FillForm() {
  const navigate = useNavigate();

  const { id } = useParams();

  const { submitForm, submittedForms = [] } = useContext(FormContext);

  const { darkMode } = useContext(ThemeContext);

  // =========================================================
  // LIVE SCHEDULE / STORAGE VERSION
  // =========================================================

  const [currentTime, setCurrentTime] = useState(new Date());

  const [formVersion, setFormVersion] = useState(0);

  // =========================================================
  // LOAD SELECTED FORM
  // =========================================================

  const [form, setForm] = useState(null);
  const [isLoadingForm, setIsLoadingForm] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadForm = async () => {
      setIsLoadingForm(true);
      try {
        const formRes = await getFormById(id);
        const questionsRes = await getQuestionsByForm(id);

        const apiForm = formRes.data.data;
        const apiQuestions = questionsRes.data.data || [];

        const mapped = normalizeForm({
          id: apiForm.id,
          title: apiForm.title,
          description: apiForm.description,
          customLink: apiForm.custom_url,
          type: apiForm.type,
          active: apiForm.status === "ACTIVE",
          questions: apiQuestions.map(mapApiQuestionForFill),
        });

        if (isMounted) setForm(mapped);
      } catch (error) {
        console.error("Gagal memuat form:", error);
        if (isMounted) setForm(null);
      } finally {
        if (isMounted) setIsLoadingForm(false);
      }
    };

    loadForm();
    return () => { isMounted = false; };
  }, [id, formVersion]);

  // =========================================================
  // FORM STATE
  // =========================================================

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answers, setAnswers] = useState({});

  const [timeLeft, setTimeLeft] = useState(
    form?.timerEnabled ? form.timerDuration * 60 : 0
  );

  const [showAnswerWarning, setShowAnswerWarning] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [timerExpired, setTimerExpired] = useState(false);

  const hasSubmittedRef = useRef(false);

  const answersRef = useRef({});

  // =========================================================
  // IMAGE PREVIEW / ZOOM
  // =========================================================

  const [showImagePreview, setShowImagePreview] = useState(false);

  const [imageZoom, setImageZoom] = useState(1);

  const openImagePreview = () => {
    setImageZoom(1);
    setShowImagePreview(true);
  };

  const closeImagePreview = () => {
    setShowImagePreview(false);
    setImageZoom(1);
  };

  const zoomImageIn = () => {
    setImageZoom((previous) => Math.min(previous + 0.25, 4));
  };

  const zoomImageOut = () => {
    setImageZoom((previous) => Math.max(previous - 0.25, 0.5));
  };

  const resetImageZoom = () => {
    setImageZoom(1);
  };

  const handleImagePreviewWheel = (event) => {
    if (!event.ctrlKey) {
      return;
    }

    event.preventDefault();

    if (event.deltaY < 0) {
      setImageZoom((previous) => Math.min(previous + 0.25, 4));
    } else {
      setImageZoom((previous) => Math.max(previous - 0.25, 0.5));
    }
  };

  useEffect(() => {
    if (!showImagePreview) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeImagePreview();
      }

      if (event.key === "+" || event.key === "=") {
        setImageZoom((previous) => Math.min(previous + 0.25, 4));
      }

      if (event.key === "-") {
        setImageZoom((previous) => Math.max(previous - 0.25, 0.5));
      }

      if (event.key === "0") {
        setImageZoom(1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showImagePreview]);

  // =========================================================
  // UPDATE CURRENT TIME
  //
  // Status jadwal diperiksa ulang secara berkala supaya form
  // otomatis berubah dari Not Open -> Open -> Closed tanpa
  // refresh halaman manual.
  // =========================================================

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 15000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  // =========================================================
  // REFRESH FORM AFTER ADMIN CHANGES
  //
  // storage       = perubahan dari tab lain
  // custom event  = perubahan admin pada tab yang sama
  // focus/visible = sinkronisasi saat user kembali ke halaman
  // =========================================================

  useEffect(() => {
    const refreshForm = () => {
      setFormVersion((previous) => previous + 1);

      setCurrentTime(new Date());
    };

    const handleStorageChange = (event) => {
      if (event.key === FORMS_STORAGE_KEY || event.key === DELETED_FORMS_STORAGE_KEY) {
        refreshForm();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshForm();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    window.addEventListener("focus", refreshForm);

    window.addEventListener("hidocs-forms-updated", refreshForm);

    window.addEventListener("hidocsFormsUpdated", refreshForm);

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);

      window.removeEventListener("focus", refreshForm);

      window.removeEventListener("hidocs-forms-updated", refreshForm);

      window.removeEventListener("hidocsFormsUpdated", refreshForm);

      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // =========================================================
  // KEEP LATEST ANSWERS
  // =========================================================

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  // =========================================================
  // FORM INFORMATION
  // =========================================================

  const availability = useMemo(() => {
    if (!form) {
      return {
        status: "unavailable",
        canFill: false,
        message: "",
      };
    }

    return getFormAvailability(form, currentTime);
  }, [form, currentTime]);

  const canFillForm = Boolean(form && availability.canFill);

  const questions = form?.questions || [];

  const totalQuestions = questions.length;

  const question = questions[currentQuestion];

  const currentAnswer = question ? answers[question.id] : undefined;

  const currentQuestionAnswered = hasAnswerValue(currentAnswer);

  const isLastQuestion = currentQuestion === totalQuestions - 1;

  const progress = totalQuestions > 0 ? ((currentQuestion + 1) / totalQuestions) * 100 : 0;

  const answeredQuestionCount = useMemo(() => {
    return Object.values(answers).filter(hasAnswerValue).length;
  }, [answers]);

  // =========================================================
  // CHECK PREVIOUS SUBMISSION
  // =========================================================

  const alreadySubmitted = useMemo(() => {
    if (!form) {
      return false;
    }

    return submittedForms.some((submittedForm) => {
      const submittedFormId = submittedForm.formId ?? submittedForm.id;

      return String(submittedFormId) === String(form.id);
    });
  }, [form, submittedForms]);

  // =========================================================
  // REDIRECT INVALID OR PREVIOUSLY SUBMITTED FORM
  // =========================================================

  useEffect(() => {
    if (isLoadingForm) {
      return;
    }

    if (!form) {
      navigate("/dashboard", {
        replace: true,
      });

      return;
    }

    if (form.oneTimeOnly && alreadySubmitted && !hasSubmittedRef.current) {
      navigate("/history", {
        replace: true,
      });
    }
  }, [form, alreadySubmitted, navigate]);

  // =========================================================
  // RESET FORM STATE WHEN FORM CHANGES
  // =========================================================

  useEffect(() => {
    if (!form) {
      return;
    }

    hasSubmittedRef.current = false;

    answersRef.current = {};

    setAnswers({});

    setCurrentQuestion(0);

    setShowAnswerWarning(false);

    setIsSubmitting(false);

    setTimerExpired(false);

    setTimeLeft(form.timerEnabled ? form.timerDuration * 60 : 0);
  }, [form?.id, form?.timerEnabled, form?.timerDuration]);

  // =========================================================
  // COMPLETE NORMAL SUBMISSION
  // =========================================================

  const completeSubmission = useCallback(async () => {
    if (hasSubmittedRef.current || !form || !canFillForm || isSubmitting) {
      return;
    }

    hasSubmittedRef.current = true;
    setIsSubmitting(true);

    try {
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const respondentEmail = currentUser.email || "";

      const answerPayload = questions.map((q) => {
        const answerValue = answersRef.current[q.id];
        const isChoiceType = ["multiple", "checkbox", "yesno"].includes(q.type);

        if (isChoiceType) {
          return {
            question_id: q.id,
            selected_option_id: q.optionIds?.[answerValue] || null,
            answer_text: "",
          };
        }
        return {
          question_id: q.id,
          selected_option_id: null,
          answer_text: String(answerValue || ""),
        };
      });

      const response = await submitFormApi(form.id, {
        respondent_email: respondentEmail,
        passcode: "",
        is_auto_submitted: false,
        answers: answerPayload,
      });

      const result = response.data.data;

      navigate("/submit-success", {
        replace: true,
        state: {
          formId: form.id,
          formTitle: form.title,
          submittedAt: result.submitted_at,
          status: "completed",
          score: result.total_score,
          totalQuestions,
        },
      });
    } catch (error) {
      console.error("Gagal mengirim form:", error);
      hasSubmittedRef.current = false;
      setIsSubmitting(false);
      alert(
        error.response?.data?.message ||
        "Terjadi kesalahan saat mengirim form. Silakan coba lagi."
      );
    }
  }, [form, canFillForm, isSubmitting, navigate, questions, totalQuestions]);

  // =========================================================
  // HANDLE TIMER EXPIRED
  // =========================================================

  const handleTimeExpired = useCallback(() => {
    if (hasSubmittedRef.current || !form) {
      return;
    }

    hasSubmittedRef.current = true;

    setTimerExpired(true);

    setIsSubmitting(true);

    const expiredAt = new Date().toISOString();

    try {
      /*
        Walaupun waktu habis, jawaban yang sudah diisi tetap
        dinilai untuk kebutuhan admin. User tetap tidak otomatis
        mendapatkan akses nilai kecuali resultMode mengizinkannya.
      */

      const scoreResult = calculateFormScore(questions, answersRef.current);

      const result = submitForm({
        formId: form.id,
        title: form.title,
        answers: answersRef.current,
        answeredQuestions: Object.values(answersRef.current).filter(hasAnswerValue).length,
        totalQuestions,
        status: "time-expired",
        isTimeExpired: true,
        submittedAt: expiredAt,
        resultMode: form.resultMode,
        score: scoreResult.score,
        maxScore: scoreResult.maxScore,
        percentage: scoreResult.percentage,
        correctAnswers: scoreResult.correctAnswers,
        incorrectAnswers: scoreResult.incorrectAnswers,
        scoredQuestions: scoreResult.scoredQuestions,
        questionResults: scoreResult.questionResults,
        gradingEnabled: scoreResult.gradingEnabled,
        grading: {
          enabled: scoreResult.gradingEnabled,
          score: scoreResult.score,
          maxScore: scoreResult.maxScore,
          percentage: scoreResult.percentage,
          correctAnswers: scoreResult.correctAnswers,
          incorrectAnswers: scoreResult.incorrectAnswers,
          scoredQuestions: scoreResult.scoredQuestions,
        },
      });

      if (!result?.success) {
        console.error("Gagal mencatat waktu habis:", result?.message);
      }

      navigate("/history", {
        replace: true,
        state: {
          timeExpired: true,
          formId: form.id,
          formTitle: form.title,
          submittedAt: expiredAt,
        },
      });
    } catch (error) {
      console.error("Gagal menyimpan riwayat waktu habis:", error);

      navigate("/history", {
        replace: true,
        state: {
          timeExpired: true,
          formId: form.id,
          formTitle: form.title,
        },
      });
    }
  }, [form, navigate, questions, submitForm, totalQuestions]);

  // =========================================================
  // TIMER
  // =========================================================

  useEffect(() => {
    if (
      !form ||
      !form.timerEnabled ||
      !canFillForm ||
      alreadySubmitted ||
      isSubmitting ||
      hasSubmittedRef.current
    ) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((previousTime) => {
        if (previousTime <= 1) {
          window.clearInterval(timer);

          window.setTimeout(handleTimeExpired, 0);

          return 0;
        }

        return previousTime - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [form, alreadySubmitted, isSubmitting, handleTimeExpired, canFillForm]);

  // =========================================================
  // FORMAT TIMER
  // =========================================================

  const timerMinutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");

  const timerSeconds = String(timeLeft % 60).padStart(2, "0");

  const timerIsWarning = Boolean(form?.timerEnabled) && timeLeft <= 300;

  // =========================================================
  // SAVE ANSWER
  // =========================================================

  const saveAnswer = (value) => {
    if (!question || !canFillForm || isSubmitting || timerExpired) {
      return;
    }

    setAnswers((previousAnswers) => {
      const updatedAnswers = {
        ...previousAnswers,
        [question.id]: value,
      };

      answersRef.current = updatedAnswers;

      return updatedAnswers;
    });

    setShowAnswerWarning(false);
  };

  // =========================================================
  // QUESTION NAVIGATION
  // =========================================================

  const goToQuestion = (index) => {
    if (!canFillForm || isSubmitting || timerExpired || index < 0 || index >= totalQuestions) {
      return;
    }

    if (index > currentQuestion && question?.required && !currentQuestionAnswered) {
      setShowAnswerWarning(true);

      return;
    }

    setCurrentQuestion(index);

    setShowAnswerWarning(false);

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  const nextQuestion = () => {
    if (!canFillForm || isSubmitting || timerExpired) {
      return;
    }

    if (question?.required && !currentQuestionAnswered) {
      setShowAnswerWarning(true);

      return;
    }

    if (!isLastQuestion) {
      goToQuestion(currentQuestion + 1);
    }
  };

  const previousQuestion = () => {
    if (!canFillForm || isSubmitting || timerExpired) {
      return;
    }

    if (currentQuestion > 0) {
      setCurrentQuestion((previous) => previous - 1);

      setShowAnswerWarning(false);
    }
  };

  // =========================================================
  // SUBMIT BUTTON
  // =========================================================

  const handleSubmit = () => {
    if (!canFillForm || isSubmitting || timerExpired) {
      return;
    }

    if (question?.required && !currentQuestionAnswered) {
      setShowAnswerWarning(true);

      return;
    }

    const unansweredRequiredIndex = questions.findIndex((item) => {
      return item.required && !hasAnswerValue(answers[item.id]);
    });

    if (unansweredRequiredIndex !== -1) {
      setCurrentQuestion(unansweredRequiredIndex);

      setShowAnswerWarning(true);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    completeSubmission();
  };

  // =========================================================
  // RENDER CHOICE OPTIONS
  // =========================================================

  const renderChoiceOptions = (customOptions) => {
  let availableOptions = Array.isArray(customOptions) ? customOptions : question.options;

  if (question.type === "yesno" && availableOptions.length === 0) {
    availableOptions = ["Yes", "No"];
  }

  if (!Array.isArray(availableOptions)) {
    availableOptions = [];
  }

  // Do not use React hooks inside this nested renderer.
  // This function is called conditionally depending on question type,
  // so useMemo here can break the Hooks call order when navigating
  // from Multiple Choice to Math/Code and cause a blank page.
  const sanitizedOptionsHtml =
    availableOptions.map((option) =>
      sanitizeQuestionHtml(option)
    );

  const sanitizedOptionMarkup =
    sanitizedOptionsHtml.map((html) => ({
      __html: html,
    }));

  if (availableOptions.length === 0) {
    return (
      <div className="fillform-warning">
        <FaExclamationTriangle />

        <div>
          <strong>No answer options</strong>

          <span>This question does not contain any answer options.</span>
        </div>
      </div>
    );
  }

  return (
    <fieldset className="options-fieldset">
      <legend className="sr-only">Answer choices</legend>

      <div className="options-list">
        {availableOptions.map((option, index) => {
          const isSelected = currentAnswer === option;

          return (
            <label
              key={`${question.id}-${option}-${index}`}
              className={isSelected ? "option-card selected" : "option-card"}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option}
                checked={isSelected}
                disabled={!canFillForm || isSubmitting || timerExpired}
                onChange={() => saveAnswer(option)}
              />

              <span className="option-letter">{String.fromCharCode(65 + index)}</span>

              <span
                className="option-text"
                dangerouslySetInnerHTML={sanitizedOptionMarkup[index]}
              />

              <span className="option-check">
                <FaCheckCircle />
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
};
 
    
  // =========================================================
  // RENDER TEXT ANSWER
  // =========================================================

  const renderTextAnswer = (answerType = question.type) => {
    if (answerType === "long") {
      return (
        <div className="fillform-text-answer">
          <textarea
            value={currentAnswer || ""}
            disabled={!canFillForm || isSubmitting || timerExpired}
            onChange={(event) => saveAnswer(event.target.value)}
            placeholder="Type your answer here..."
            rows={6}
          />
        </div>
      );
    }

    let placeholder = "Type your answer here...";

    if (question.type === "image") {
      placeholder = "Type your answer based on the image...";
    }

    return (
      <div className="fillform-text-answer">
        <input
          type="text"
          value={currentAnswer || ""}
          disabled={!canFillForm || isSubmitting || timerExpired}
          onChange={(event) => saveAnswer(event.target.value)}
          placeholder={placeholder}
        />
      </div>
    );
  };


  // =========================================================
  // MATH ANSWER
  // User types a KaTeX/LaTeX expression and sees a live preview.
  // Examples:
  // x = -2
  // b^2
  // x^2 + y^2 = z^2
  // \frac{a}{b}
  // =========================================================

  const getMathPreviewHtml = (value) => {
    const expression = String(value || "").trim();

    if (!expression) {
      return "";
    }

    try {
      return katex.renderToString(expression, {
        throwOnError: false,
        displayMode: true,
        strict: false,
        trust: false,
      });
    } catch (error) {
      console.error("Math preview error:", error);

      return "";
    }
  };


  const renderMathAnswer = () => {
    const mathValue = String(currentAnswer || "");

    const mathPreviewHtml =
      getMathPreviewHtml(mathValue);

    return (
      <section className="fillform-special-answer math-answer-card">


        <div className="special-answer-heading">


          <div className="special-answer-icon math">

            <FaCalculator />

          </div>


          <div>

            <span>
              Math Answer
            </span>

            <strong>
              Enter your mathematical expression
            </strong>

          </div>


        </div>


        <div className="math-answer-input-wrapper">

          <label htmlFor={`math-answer-${question.id}`}>
            Your Answer
          </label>

          <input
            id={`math-answer-${question.id}`}
            type="text"
            value={mathValue}
            disabled={!canFillForm || isSubmitting || timerExpired}
            onChange={(event) =>
              saveAnswer(event.target.value)
            }
            placeholder="Example: x = -2, b^2, \frac{a}{b}"
            autoComplete="off"
            spellCheck={false}
          />

          <small>
            You can use expressions such as <code>b^2</code>,{" "}
            <code>x^2 + y^2</code>, <code>\sqrt{"{16}"}</code>, or{" "}
            <code>\frac{"{a}{b}"}</code>.
          </small>

        </div>


        <div
          className={
            mathValue.trim()
              ? "math-preview-box has-value"
              : "math-preview-box"
          }
        >

          <div className="math-preview-heading">

            <span>
              Live Preview
            </span>

            <small>
              KaTeX
            </small>

          </div>


          {mathValue.trim() ? (

            <div
              className="math-preview-content"
              dangerouslySetInnerHTML={{
                __html:
                  mathPreviewHtml,
              }}
            />

          ) : (

            <div className="math-preview-empty">

              <FaCalculator />

              <span>
                Your formula preview will appear here.
              </span>

            </div>

          )}


        </div>


      </section>
    );
  };


  // =========================================================
  // CODE ANSWER
  // Multiline code editor-style textarea.
  // Code answers are best suited for manual grading because
  // different implementations can still be correct.
  // =========================================================

  const handleCodeKeyDown = (event) => {
    if (event.key !== "Tab") {
      return;
    }

    event.preventDefault();

    const textarea =
      event.currentTarget;

    const start =
      textarea.selectionStart;

    const end =
      textarea.selectionEnd;

    const currentValue =
      String(currentAnswer || "");

    const updatedValue =
      `${currentValue.slice(0, start)}  ${currentValue.slice(end)}`;

    saveAnswer(updatedValue);

    window.requestAnimationFrame(() => {
      textarea.selectionStart =
        start + 2;

      textarea.selectionEnd =
        start + 2;
    });
  };


  const renderCodeAnswer = () => {
    const codeValue =
      String(currentAnswer || "");

    const codeLines =
      codeValue
        ? codeValue.split("\n").length
        : 1;

    return (
      <section className="fillform-special-answer code-answer-card">


        <div className="special-answer-heading">


          <div className="special-answer-icon code">

            <FaCode />

          </div>


          <div>

            <span>
              Code Answer
            </span>

            <strong>
              Write your code below
            </strong>

          </div>


          <div className="code-answer-lines">

            {codeLines}
            {" "}
            {codeLines === 1
              ? "line"
              : "lines"
            }

          </div>


        </div>


        <div className="code-editor-shell">


          <div className="code-editor-topbar">

            <span></span>
            <span></span>
            <span></span>

            <strong>
              answer
            </strong>

          </div>


          <textarea
            value={codeValue}
            disabled={!canFillForm || isSubmitting || timerExpired}
            onChange={(event) =>
              saveAnswer(event.target.value)
            }
            onKeyDown={
              handleCodeKeyDown
            }
            placeholder={`Example:\nfunction sum(a, b) {\n  return a + b;\n}`}
            rows={12}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
          />


        </div>


        <div className="code-answer-help">

          <FaCode />

          <span>
            Use Tab to indent. Your answer will be saved exactly as written.
          </span>

        </div>


      </section>
    );
  };


  // =========================================================
  // RENDER RATING
  // =========================================================

  const renderRating = () => {
    return (
      <div className="fillform-rating-list">
        {Array.from({
          length: question.ratingMax,
        }).map((_, index) => {
          const rating = index + 1;

          const isSelected = Number(currentAnswer) === rating;

          return (
            <button
              key={rating}
              type="button"
              className={isSelected ? "fillform-rating-btn selected" : "fillform-rating-btn"}
              disabled={isSubmitting || timerExpired}
              onClick={() => saveAnswer(rating)}
            >
              <FaStar />

              <span>{rating}</span>
            </button>
          );
        })}
      </div>
    );
  };

  // =========================================================
  // RENDER IMAGE ANSWER
  // =========================================================

  const renderImageAnswer = () => {
    const imageAnswerType = question.imageAnswerType || "short";

    if (imageAnswerType === "multiple") {
      return renderChoiceOptions(question.imageOptions);
    }

    if (imageAnswerType === "long") {
      return renderTextAnswer("long");
    }

    return renderTextAnswer("short");
  };

  // =========================================================
  // RENDER ANSWER FIELD
  // =========================================================

  const renderAnswerField = () => {
    if (!question) {
      return null;
    }

    if (question.type === "multiple" || question.type === "yesno") {
      return renderChoiceOptions(question.options);
    }

    if (question.type === "rating") {
      return renderRating();
    }

    if (question.type === "image") {
      return renderImageAnswer();
    }

    if (question.type === "long") {
      return renderTextAnswer("long");
    }

    if (question.type === "code") {
      return renderCodeAnswer();
    }

    if (question.type === "math") {
      return renderMathAnswer();
    }

    return renderTextAnswer("short");
  };

  // =========================================================
// MEMOIZED SANITIZED QUESTION TITLE
//
// Timer men-trigger re-render setiap detik. Tanpa memoization,
// dangerouslySetInnerHTML akan mereset iframe video setiap detik
// sehingga video ter-reload terus dan terlihat "kedip-kedip".
// =========================================================

const sanitizedQuestionTitle = useMemo(() => {
  if (!question) {
    return "";
  }

  return sanitizeQuestionHtml(question.title);
}, [question?.id, question?.title]);

const sanitizedQuestionTitleMarkup = useMemo(
  () => ({ __html: sanitizedQuestionTitle }),
  [sanitizedQuestionTitle]
);

  // =========================================================
  // INVALID FORM
  // =========================================================

  if (!form) {
    return null;
  }

  if (alreadySubmitted && form.oneTimeOnly && !hasSubmittedRef.current) {
    return null;
  }

  // =========================================================
  // SCHEDULE NOT AVAILABLE
  // =========================================================

  if (!canFillForm) {
    const isClosed = availability.status === "closed";

    const isInactive = availability.status === "inactive";

    return (
      <div className={darkMode ? "fillform-page dark" : "fillform-page"}>
      <style>{fillFormStyles}</style>
        <div className="fillform-empty-state">
          {isClosed || isInactive ? <FaExclamationTriangle /> : <FaClock />}

          <h2>
            {isInactive
              ? "Form Sedang Dinonaktifkan"
              : isClosed
              ? "Form Sudah Ditutup"
              : "Form Belum Dibuka"}
          </h2>

          <p>{availability.message}</p>

          {availability.openAt && !isClosed && !isInactive && (
            <p>
              Waktu buka: <strong>{formatAvailabilityDateTime(availability.openAt)}</strong>
            </p>
          )}

          {availability.closeAt && (
            <p>
              Waktu tutup: <strong>{formatAvailabilityDateTime(availability.closeAt)}</strong>
            </p>
          )}

          <button type="button" onClick={() => navigate("/forms")}>
            Kembali ke Forms
          </button>
        </div>
      </div>
    );
  }

  // =========================================================
  // EMPTY QUESTIONS
  // =========================================================

  if (totalQuestions === 0) {
    return (
      <div className={darkMode ? "fillform-page dark" : "fillform-page"}>
      <style>{fillFormStyles}</style>
        <div className="fillform-empty-state">
          <FaClipboardList />

          <h2>No Questions Available</h2>

          <p>This form does not contain any questions yet.</p>

          <button type="button" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // =========================================================
  // RETURN
  // =========================================================

  return (
    <div className={darkMode ? "fillform-page dark" : "fillform-page"}>
      <style>{fillFormStyles}</style>
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="fillform-header">
        <div className="fillform-brand">
          <div className="fillform-logo-wrapper">
            <img src={logo} alt="HiDocs Logo" />
          </div>

          <div className="fillform-brand-text">
            <h2>HiDocs</h2>

            <span>{form.title}</span>
          </div>
        </div>

        <div className="fillform-header-progress">
          <div className="fillform-progress-information">
            <span>
              Question {currentQuestion + 1} of {totalQuestions}
            </span>

            <strong>{Math.round(progress)}%</strong>
          </div>

          <div className="fillform-progress-track">
            <div
              className="fillform-progress-fill"
              style={{
                width: `${progress}%`,
              }}
            ></div>
          </div>
        </div>

        <div className={timerIsWarning ? "fillform-timer warning" : "fillform-timer"}>
          {form.timerEnabled ? (
            <>
              <FaClock />

              <div>
                <span>Time Left</span>

                <strong>
                  {timerMinutes}:{timerSeconds}
                </strong>
              </div>
            </>
          ) : (
            <>
              <FaInfinity />

              <div>
                <span>Timer</span>

                <strong>No Limit</strong>
              </div>
            </>
          )}
        </div>
      </header>

      {/* =====================================================
          BODY
      ===================================================== */}

      <div className="fillform-body">
        {/* ===================================================
            SIDEBAR
        =================================================== */}

        <aside className="question-sidebar">
          <div className="sidebar-heading">
            <div>
              <span>Navigation</span>

              <h3>Questions</h3>
            </div>

            <strong>
              {currentQuestion + 1}/{totalQuestions}
            </strong>
          </div>

          <div className="question-grid">
            {questions.map((item, index) => {
              const isCurrent = currentQuestion === index;

              const isAnswered = hasAnswerValue(answers[item.id]);

              const isLocked = index > currentQuestion && question?.required && !currentQuestionAnswered;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => goToQuestion(index)}
                  disabled={isLocked || !canFillForm || isSubmitting || timerExpired}
                  className={[
                    "question-number",
                    isCurrent ? "active" : "",
                    !isCurrent && isAnswered ? "answered" : "",
                    isLocked ? "locked" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {isAnswered && !isCurrent ? <FaCheckCircle /> : index + 1}
                </button>
              );
            })}
          </div>

          <div className="question-legend">
            <div className="legend-item">
              <span className="legend current"></span>

              <p>Current</p>
            </div>

            <div className="legend-item">
              <span className="legend answered"></span>

              <p>Answered</p>
            </div>

            <div className="legend-item">
              <span className="legend"></span>

              <p>Not Answered</p>
            </div>
          </div>

          <div className="question-footer-status">
            <span>
              {answeredQuestionCount} of {totalQuestions} answered
            </span>
          </div>
        </aside>

        {/* ===================================================
            QUESTION CONTENT
        =================================================== */}

        <main className="question-content">
          <article className="question-card">
            <div className="question-header">
              <div className="question-heading-content">
                <span className="question-label">{form.category} Question</span>

                <h1>
                  <span className="question-index">{currentQuestion + 1}.</span>

                 
                  <span
                    className="question-title-html"
                    dangerouslySetInnerHTML={sanitizedQuestionTitleMarkup}
                  />

                </h1>

                <p className="question-instruction">
                  {question.required
                    ? "This question must be answered before continuing."
                    : "This question is optional."}
                </p>
              </div>

              <div className="question-header-icon">
                <FaClipboardList />
              </div>
            </div>

            {/* =================================================
                QUESTION IMAGE
            ================================================= */}

            {question.image && (
              <div className="question-image-wrapper">
                <button
                  type="button"
                  className="question-image question-image-clickable"
                  onClick={openImagePreview}
                  title="Click to zoom image"
                  aria-label="Open question image preview"
                >
                  <img
                    src={question.image}
                    alt={question.imageName || `Illustration for question ${currentQuestion + 1}`}
                  />

                  <span className="question-image-zoom-hint">
                    <FaExpand />
                    <span>Click to zoom</span>
                  </span>
                </button>
              </div>
            )}

            {/* =================================================
                ANSWER FIELD
            ================================================= */}

            {renderAnswerField()}

            {/* =================================================
                REQUIRED WARNING
            ================================================= */}

            {showAnswerWarning && (
              <div className="fillform-warning" role="alert">
                <FaExclamationTriangle />

                <div>
                  <strong>Answer this question first</strong>

                  <span>Complete this required question before continuing.</span>
                </div>
              </div>
            )}

            {/* =================================================
                TIMER WARNING
            ================================================= */}

            {form.timerEnabled && timerIsWarning && timeLeft > 0 && (
              <div className="fillform-warning" role="status">
                <FaClock />

                <div>
                  <strong>Time is running out</strong>

                  <span>The form will close automatically when the timer reaches zero.</span>
                </div>
              </div>
            )}

            {/* =================================================
                FOOTER
            ================================================= */}

            <div className="question-footer">
              <button
                type="button"
                className="previous-btn"
                onClick={previousQuestion}
                disabled={currentQuestion === 0 || !canFillForm || isSubmitting || timerExpired}
              >
                <FaArrowLeft />

                <span>Previous</span>
              </button>

              <div className="question-footer-status">
                <span>
                  {isSubmitting
                    ? "Processing..."
                    : currentQuestionAnswered
                    ? "Answer saved"
                    : question.required
                    ? "Answer required"
                    : "Optional question"}
                </span>
              </div>

              {isLastQuestion ? (
                <button
                  type="button"
                  className="submit-btn"
                  onClick={handleSubmit}
                  disabled={
                    !canFillForm ||
                    isSubmitting ||
                    timerExpired ||
                    (question.required && !currentQuestionAnswered)
                  }
                >
                  <FaCheckCircle />

                  <span>{isSubmitting ? "Submitting..." : "Submit Form"}</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="next-btn"
                  onClick={nextQuestion}
                  disabled={
                    !canFillForm ||
                    isSubmitting ||
                    timerExpired ||
                    (question.required && !currentQuestionAnswered)
                  }
                >
                  <span>Next</span>

                  <FaArrowRight />
                </button>
              )}
            </div>
          </article>
        </main>
      </div>

      {/* =====================================================
          IMAGE PREVIEW / ZOOM
      ===================================================== */}

      {showImagePreview && question?.image && (
        <div
          className="image-preview-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeImagePreview();
            }
          }}
        >
          <section
            className="image-preview-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Question image preview"
          >
            <header className="image-preview-header">
              <div>
                <span>Question Image</span>
                <strong>Zoom Preview</strong>
              </div>

              <button
                type="button"
                className="image-preview-close"
                onClick={closeImagePreview}
                title="Close preview"
                aria-label="Close image preview"
              >
                <FaTimes />
              </button>
            </header>

            <div className="image-preview-toolbar">
              <button
                type="button"
                onClick={zoomImageOut}
                disabled={imageZoom <= 0.5}
                title="Zoom out"
                aria-label="Zoom out"
              >
                <FaSearchMinus />
              </button>

              <span className="image-preview-zoom-value">
                {Math.round(imageZoom * 100)}%
              </span>

              <button
                type="button"
                onClick={zoomImageIn}
                disabled={imageZoom >= 4}
                title="Zoom in"
                aria-label="Zoom in"
              >
                <FaSearchPlus />
              </button>

              <button
                type="button"
                className="image-preview-reset"
                onClick={resetImageZoom}
                title="Reset zoom"
              >
                <FaUndo />
                <span>Reset</span>
              </button>
            </div>

            <div
              className="image-preview-scroll-area"
              onWheel={handleImagePreviewWheel}
            >
              <div
                className="image-preview-canvas"
                style={{
                  width: `${Math.max(imageZoom, 1) * 100}%`,
                  minWidth: `${Math.max(imageZoom, 1) * 100}%`,
                }}
              >
                <img
                  src={question.image}
                  alt={question.imageName || `Question ${currentQuestion + 1}`}
                  draggable="false"
                  style={{
                    transform: `scale(${imageZoom < 1 ? imageZoom : 1})`,
                  }}
                />
              </div>
            </div>

            <footer className="image-preview-footer">
              <span>
                Zoom with + / −, press 0 to reset, or hold Ctrl while scrolling.
              </span>

              <button type="button" onClick={closeImagePreview}>
                Close
              </button>
            </footer>
          </section>
        </div>
      )}
    </div>
  );
}

export default FillForm;