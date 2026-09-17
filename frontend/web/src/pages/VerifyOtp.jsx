import { resendOtp, verifyOtp } from "../api/authApi";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaCheckCircle,
  FaRedoAlt,
  FaShieldAlt,
} from "react-icons/fa";
import background from "../assets/images/background.png";
import logo from "../assets/images/logo.png";

const styles = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

* { box-sizing: border-box; }
html, body, #root { width: 100%; height: 100%; margin: 0; }
body { font-family: "Inter", sans-serif; background: var(--hp-pri-dk, #0f3d75); overflow: hidden; }
button, input { font: inherit; }

.verify-page {
  --primary: var(--hp-pri, #2168b4);
  --primary-hover: var(--hp-pri-hover, #1a5695);
  position: relative;
  width: 100%;
  height: 100vh;
  padding: 45px 7%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--hp-pri-dk, #0f3d75) url(${background}) center/cover;
}
.verify-page::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    120deg,
    rgba(7, 35, 72, 0.97),
    color-mix(in srgb, var(--primary) 60%, rgba(7, 35, 72, 0.95)) 55%,
    color-mix(in srgb, var(--primary) 75%, rgba(30, 105, 174, 0.85))
  );
}
.verify-page::after {
  content: "";
  position: absolute;
  width: 650px;
  height: 650px;
  right: -300px;
  top: -300px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 0 70px rgba(255, 255, 255, 0.025), 0 0 0 140px rgba(255, 255, 255, 0.018);
}

.verify-blob { position: absolute; border-radius: 50%; pointer-events: none; }
.verify-blob.one { width: 390px; height: 390px; left: -270px; bottom: -240px; background: rgba(49, 132, 220, 0.2); }
.verify-blob.two { width: 190px; height: 190px; right: 8%; bottom: -125px; background: rgba(72, 156, 235, 0.12); }
.verify-blob.three { width: 90px; height: 90px; left: 18%; top: 10%; background: rgba(255, 255, 255, 0.055); }

.verify-dots { position: absolute; right: 13%; bottom: 18%; display: grid; grid-template-columns: repeat(5, 5px); gap: 9px; opacity: 0.25; }
.verify-dots span { width: 4px; height: 4px; border-radius: 50%; background: #fff; }

.verify-brand { position: absolute; z-index: 4; top: 35px; left: 7%; display: flex; align-items: center; gap: 13px; color: #fff; }
.verify-logo-wrapper {
  width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center;
  justify-content: center; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.17);
  backdrop-filter: blur(10px); box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}
.verify-logo { width: 32px; height: 32px; object-fit: contain; }
.verify-brand > span { font-size: 25px; font-weight: 800; letter-spacing: -1px; }

.verify-container {
  position: relative; z-index: 2; width: 100%; max-width: 1180px;
  display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(380px, 0.78fr);
  align-items: center; gap: 55px;
}

.verify-brand-panel { position: relative; color: #fff; padding: 0 0 20px; }
.verify-brand-content { position: relative; z-index: 2; max-width: 560px; }
.verify-brand-message { margin-top: 0; max-width: 500px; transform: translateY(-8px); }
.verify-brand-message h1 {
  margin: 0 0 18px; font-size: clamp(38px, 3.8vw, 60px);
  line-height: 1.06; letter-spacing: -2.5px; font-weight: 800; color: #fff;
}
.verify-brand-message p { margin: 0; max-width: 420px; color: rgba(255, 255, 255, 0.75); font-size: 14px; line-height: 1.8; font-weight: 400; }

.verify-form-panel { position: relative; display: flex; align-items: center; justify-content: flex-start; transform: translateX(-18px); }
.verify-form-panel::before {
  content: ""; position: absolute; width: 360px; height: 360px; right: -150px; top: -170px;
  border-radius: 50%; background: rgba(111, 183, 240, 0.12); filter: blur(2px);
}

.verify-form-card {
  position: relative; z-index: 2; width: 100%; max-width: 440px; padding: 38px 40px;
  border: 1px solid rgba(255, 255, 255, 0.85); border-radius: 24px;
  background: rgba(255, 255, 255, 0.98); box-shadow: 0 25px 65px rgba(3, 24, 52, 0.3);
}

.verify-mobile-brand { display: none; }

.verify-form-header { margin-bottom: 24px; }
.verify-form-header h2 { margin: 0 0 8px; color: #193858; font-size: 28px; line-height: 1.2; font-weight: 800; letter-spacing: -1px; }
.verify-form-header p { margin: 0; color: #8795a5; font-size: 12.5px; line-height: 1.6; font-weight: 400; }
.verify-form-header p strong { color: var(--primary, #2168b4); font-weight: 700; }
.verify-form-header p .verify-email { display: block; margin-top: 3px; }

.verify-form { display: flex; flex-direction: column; gap: 18px; }

.verify-form-label { display: block; margin-bottom: 10px; color: #405872; font-size: 11px; font-weight: 700; text-align: left; }

.verify-otp-inputs { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 8px; width: 100%; }

.verify-otp-input {
  width: 100%; height: 50px; border: 1px solid #dbe4ed; border-radius: 12px; outline: 0;
  background: #f8fafc; color: #30475f; text-align: center; font-size: 18px; font-weight: 800; transition: 0.2s;
}
.verify-otp-input:hover:not(:disabled) { border-color: #b9cfe5; background: #fff; }
.verify-otp-input:focus {
  border-color: var(--primary, #2168b4); background: #fff;
  box-shadow: 0 0 0 4px rgba(33, 104, 180, 0.12); transform: translateY(-1px);
}
.verify-otp-input:disabled { cursor: not-allowed; opacity: 0.65; }

.verify-message { min-height: 40px; padding: 9px 12px; border-radius: 10px; display: flex; align-items: center; gap: 8px; font-size: 11.5px; font-weight: 600; }
.verify-message.error { border: 1px solid #f1cdcd; background: #fff2f2; color: #d64f4f; }
.verify-message-error-icon {
  width: 19px; height: 19px; flex-shrink: 0; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; background: #e45c5c; color: #fff; font-size: 10px; font-weight: 800;
}
.verify-message.success { border: 1px solid #c9ead9; background: #eefaf4; color: #258b63; }
.verify-message.success svg { font-size: 15px; flex-shrink: 0; }

.verify-btn {
  position: relative; width: 100%; height: 50px; margin-top: 4px; border: 0; border-radius: 12px;
  background: linear-gradient(135deg, var(--primary, #164b87), color-mix(in srgb, var(--primary, #287acb) 80%, #4b9fe8));
  color: #fff; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer;
  font-size: 13px; font-weight: 700; box-shadow: 0 8px 20px rgba(34, 105, 179, 0.22); transition: 0.2s;
}
.verify-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 25px rgba(34, 105, 179, 0.28); filter: brightness(1.05); }
.verify-btn:disabled { cursor: wait; opacity: 0.7; }
.verify-btn-arrow { position: absolute; right: 17px; font-size: 11px; }
.verify-loading-spinner { width: 15px; height: 15px; border: 2px solid rgba(255, 255, 255, 0.35); border-top-color: #fff; border-radius: 50%; animation: verify-spin 0.7s linear infinite; }

@keyframes verify-spin { to { transform: rotate(360deg); } }

.verify-resend { display: flex; align-items: center; justify-content: space-between; margin-top: 21px; color: #8b99a8; font-size: 11px; }
.verify-resend p { margin: 0; }
.verify-resend-action { display: flex; align-items: center; gap: 9px; }
.verify-resend-btn {
  padding: 0; border: 0; background: transparent; color: var(--primary, #397bc0);
  font-size: 11px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 4px;
}
.verify-resend-btn:hover:not(:disabled) { text-decoration: underline; }
.verify-resend-btn:disabled { color: #a5b0bb; cursor: not-allowed; text-decoration: none; }
.verify-countdown { color: #8b99a8; font-size: 12px; font-weight: 700; }

.verify-change-email { text-align: center; margin-top: 22px; color: #8b99a8; font-size: 11px; }
.verify-change-email button { padding: 0; border: 0; background: transparent; color: var(--primary, #397bc0); font-size: 11px; font-weight: 700; cursor: pointer; }
.verify-change-email button:hover { text-decoration: underline; }

.verify-page button:focus-visible, .verify-page input:focus-visible { outline: 2px solid rgba(45, 117, 187, 0.5); outline-offset: 3px; }

@media (max-width: 900px) {
  body { overflow: auto; }
  .verify-page { height: auto; min-height: 100vh; padding: 35px 25px; }
  .verify-brand { top: 25px; left: 25px; }
  .verify-container { height: auto; max-width: 520px; display: flex; flex-direction: column; gap: 35px; }
  .verify-brand-panel { padding: 0; text-align: center; }
  .verify-brand-content { padding-top: 55px; }
  .verify-brand-message { margin: 0 auto; transform: none; }
  .verify-brand-message h1 { font-size: 42px; letter-spacing: -2px; }
  .verify-brand-message p { margin: auto; }
  .verify-form-panel { width: 100%; transform: none; }
  .verify-form-card { max-width: 520px; }
  .verify-dots { display: none; }
}

@media (max-width: 520px) {
  .verify-page { padding: 25px 18px; align-items: flex-start; background-image: none; }
  .verify-page::before, .verify-page::after, .verify-blob, .verify-dots { display: none; }
  .verify-brand { display: none; }
  .verify-container { width: 100%; min-height: 100vh; justify-content: center; gap: 30px; }
  .verify-brand-panel { display: none; }
  .verify-form-panel { min-height: 100vh; transform: none; }
  .verify-form-card { max-width: none; padding: 32px 20px; border-radius: 20px; box-shadow: 0 18px 45px rgba(3, 24, 52, 0.22); }
  .verify-mobile-brand { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 25px; }
  .verify-mobile-logo { width: 42px; height: 42px; border-radius: 12px; background: #eaf3fd; display: flex; align-items: center; justify-content: center; }
  .verify-mobile-logo img { width: 29px; height: 29px; }
  .verify-mobile-brand span { color: #1f4e82; font-size: 23px; font-weight: 800; }
  .verify-form-header h2 { font-size: 25px; }
  .verify-form-header p { font-size: 11px; }
  .verify-otp-inputs { gap: 6px; }
  .verify-otp-input { height: 48px; border-radius: 10px; font-size: 17px; }
  .verify-btn { height: 48px; }
}

@media (prefers-reduced-motion: reduce) {
  .verify-page * { animation: none !important; transition: none !important; }
}
`;

const PENDING_REGISTRATION_KEY = "hidocs-pending-registration";
const OTP_LENGTH = 6;

function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const [registrationData] = useState(() => {
    if (location.state?.email) {
      return {
        email: location.state.email,
        username: location.state.username || "",
        password: location.state.password || "",
        role: location.state.role || "user",
      };
    }

    try {
      const saved = sessionStorage.getItem(PENDING_REGISTRATION_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore invalid json
    }

    return null;
  });

  const email = registrationData?.email || "";
  const username = registrationData?.username || "";
  const password = registrationData?.password || "";
  const role = registrationData?.role || "user";

  const [otpValues, setOtpValues] = useState(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const countdownKey = `hidocs-otp-countdown-${(email || "default").trim().toLowerCase()}`;

  const [resendCountdown, setResendCountdown] = useState(() => {
    const savedExpiry = sessionStorage.getItem(countdownKey);
    if (!savedExpiry) return 0;
    const remainingSeconds = Math.ceil((Number(savedExpiry) - Date.now()) / 1000);
    return remainingSeconds > 0 ? remainingSeconds : 0;
  });

  const inputRefs = useRef([]);

  useEffect(() => {
    if (registrationData) {
      sessionStorage.setItem(PENDING_REGISTRATION_KEY, JSON.stringify(registrationData));
    }
  }, [registrationData]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendCountdown <= 0) {
      sessionStorage.removeItem(countdownKey);
      return;
    }

    const timer = window.setInterval(() => {
      setResendCountdown((previous) => {
        if (previous <= 1) {
          sessionStorage.removeItem(countdownKey);
          return 0;
        }
        return previous - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendCountdown, countdownKey]);

  const maskEmail = (emailValue) => {
    if (!emailValue) return "email terdaftar";
    const [usernamePart, domainPart] = emailValue.split("@");
    if (!usernamePart || !domainPart) return emailValue;
    const visiblePart = usernamePart.length <= 2 ? usernamePart.charAt(0) : usernamePart.slice(0, 2);
    const hiddenLength = Math.max(usernamePart.length - visiblePart.length, 3);
    return `${visiblePart}${"*".repeat(hiddenLength)}@${domainPart}`;
  };

  const formatCountdown = (totalSeconds) => {
    const safeSeconds = Math.max(0, totalSeconds);
    const minutes = Math.floor(safeSeconds / 60).toString().padStart(2, "0");
    const seconds = (safeSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const otpCode = otpValues.join("");

  const handleOtpChange = (index, event) => {
    const value = event.target.value.replace(/[^a-zA-Z0-9]/g, "").slice(-1).toUpperCase();
    const updatedOtp = [...otpValues];
    updatedOtp[index] = value;

    setOtpValues(updatedOtp);
    setError("");
    setSuccessMessage("");
    setResendMessage("");

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }
    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      event.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (event) => {
    event.preventDefault();
    const pastedValue = event.clipboardData
      .getData("text")
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, OTP_LENGTH)
      .toUpperCase();

    if (!pastedValue) return;

    const updatedOtp = Array(OTP_LENGTH).fill("");
    pastedValue.split("").forEach((value, idx) => {
      updatedOtp[idx] = value;
    });

    setOtpValues(updatedOtp);
    setError("");
    setSuccessMessage("");
    setResendMessage("");

    const lastInputIndex = Math.min(pastedValue.length, OTP_LENGTH) - 1;
    inputRefs.current[lastInputIndex]?.focus();
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    if (isVerifying) return;

    setError("");
    setSuccessMessage("");
    setResendMessage("");

    if (!registrationData?.email) {
      setError("Data registrasi tidak ditemukan. Silakan lakukan pendaftaran ulang.");
      return;
    }

    if (otpCode.length !== OTP_LENGTH) {
      setError("Silakan masukkan 6 digit kode OTP.");
      return;
    }

    setIsVerifying(true);

    try {
      const response = await verifyOtp({
        email: registrationData.email,
        otp_code: otpCode,
      });

      const data = response?.data?.data || {};
      const token = data.token;
      const verifiedUser = data.user || {};

      if (token) {
        localStorage.setItem("token", token);
      }

      const verifiedUserToSave = {
        ...verifiedUser,
        id: verifiedUser.id || registrationData.email,
        name: verifiedUser.name || registrationData.username || "HiDocs User",
        username: verifiedUser.username || registrationData.username || "HiDocs User",
        email: registrationData.email,
        role: verifiedUser.role || "user",
      };

      localStorage.setItem("user", JSON.stringify(verifiedUserToSave));
      localStorage.setItem("isLoggedIn", "true");

      sessionStorage.removeItem(countdownKey);
      sessionStorage.removeItem(PENDING_REGISTRATION_KEY);

      setSuccessMessage("Email berhasil diverifikasi! Mengalihkan ke pemilihan peran...");

      window.setTimeout(() => {
        setIsVerifying(false);
        navigate("/choose-role", { replace: true });
      }, 700);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Kode OTP salah atau telah kadaluarsa."
      );
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCountdown > 0 || !registrationData?.email || isVerifying) return;

    setOtpValues(Array(OTP_LENGTH).fill(""));
    setError("");
    setSuccessMessage("");
    setResendMessage("");

    try {
      await resendOtp({ email: registrationData.email });
      setResendMessage("Kode OTP baru telah dikirimkan ke email Anda.");
      const newExpiry = Date.now() + 180000;
      sessionStorage.setItem(countdownKey, String(newExpiry));
      setResendCountdown(180);
      window.setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Gagal mengirim ulang kode OTP.");
    }
  };

  const handleBackToRegister = () => {
    if (isVerifying) return;
    navigate("/register", {
      state: { email, username, password, role, fromOtp: true },
    });
  };

  return (
    <>
      <style>{styles}</style>

      <div className="verify-page">
        <span className="verify-blob one" />
        <span className="verify-blob two" />
        <span className="verify-blob three" />

        <div className="verify-dots">
          {Array.from({ length: 15 }).map((_, index) => (
            <span key={index} />
          ))}
        </div>

        <div className="verify-brand">
          <div className="verify-logo-wrapper">
            <img src={logo} alt="HiDocs Logo" className="verify-logo" />
          </div>
          <span>HiDocs!</span>
        </div>

        <main className="verify-container">
          <section className="verify-brand-panel">
            <div className="verify-brand-content">
              <div className="verify-brand-message">
                <h1>Satu langkah lagi untuk memulai.</h1>
                <p>
                  Verifikasi alamat email Anda untuk mengaktifkan akun HiDocs dan melanjutkan.
                </p>
              </div>
            </div>
          </section>

          <section className="verify-form-panel">
            <div className="verify-form-card">
              <div className="verify-mobile-brand">
                <div className="verify-mobile-logo">
                  <img src={logo} alt="HiDocs Logo" />
                </div>
                <span>HiDocs!</span>
              </div>

              <div className="verify-form-header">
                <h2>Verifikasi Email Anda</h2>
                <p>
                  Kami telah mengirimkan <strong>OTP</strong> ke{" "}
                  <strong className="verify-email">{maskEmail(email)}</strong>
                </p>
              </div>

              <form className="verify-form" onSubmit={handleVerifyOtp}>
                <div>
                  <label className="verify-form-label">Masukkan 6 Digit Kode OTP</label>
                  <div className="verify-otp-inputs" onPaste={handleOtpPaste}>
                    {otpValues.map((value, index) => (
                      <input
                        key={index}
                        ref={(element) => {
                          inputRefs.current[index] = element;
                        }}
                        className="verify-otp-input"
                        type="text"
                        inputMode="text"
                        autoComplete={index === 0 ? "one-time-code" : "off"}
                        maxLength={1}
                        value={value}
                        onChange={(event) => handleOtpChange(index, event)}
                        onKeyDown={(event) => handleOtpKeyDown(index, event)}
                        disabled={isVerifying || Boolean(successMessage) || !registrationData}
                        aria-label={`OTP digit ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="verify-message error" role="alert">
                    <span className="verify-message-error-icon">!</span>
                    <span>{error}</span>
                  </div>
                )}

                {resendMessage && (
                  <div className="verify-message success" role="status">
                    <FaCheckCircle />
                    <span>{resendMessage}</span>
                  </div>
                )}

                {successMessage && (
                  <div className="verify-message success" role="status">
                    <FaCheckCircle />
                    <span>{successMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="verify-btn"
                  disabled={isVerifying || Boolean(successMessage) || !registrationData}
                >
                  {isVerifying ? (
                    <>
                      <span className="verify-loading-spinner" />
                      <span>Memverifikasi...</span>
                    </>
                  ) : (
                    <>
                      <FaShieldAlt />
                      <span>Verifikasi Akun</span>
                      <FaArrowRight className="verify-btn-arrow" />
                    </>
                  )}
                </button>
              </form>

              <div className="verify-resend">
                <p>Tidak menerima kode?</p>
                <div className="verify-resend-action">
                  <button
                    type="button"
                    className="verify-resend-btn"
                    onClick={handleResendOtp}
                    disabled={resendCountdown > 0 || !registrationData || isVerifying}
                  >
                    {resendCountdown > 0 ? (
                      "Kirim Ulang"
                    ) : (
                      <>
                        <FaRedoAlt />
                        <span>Kirim Ulang OTP</span>
                      </>
                    )}
                  </button>
                  {resendCountdown > 0 && (
                    <span className="verify-countdown">
                      {formatCountdown(resendCountdown)}
                    </span>
                  )}
                </div>
              </div>

              <div className="verify-change-email">
                <button
                  type="button"
                  onClick={handleBackToRegister}
                  disabled={isVerifying}
                >
                  Ubah alamat email
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

export default VerifyOtp;