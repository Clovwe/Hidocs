import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaCheck,
  FaShieldAlt,
  FaUser,
  FaWpforms,
} from "react-icons/fa";
import api from "../api/axiosInstance";
import background from "../assets/images/background.png";
import logo from "../assets/images/logo.png";

const getCurrentUser = () => {
  try {
    for (const key of ["user", "hidocs_user", "currentUser", "loggedInUser"]) {
      const s = localStorage.getItem(key);
      if (!s) continue;
      const p = JSON.parse(s);
      if (p && typeof p === "object") {
        return {
          id: p.id || "",
          name: p.name || p.username || "HiDocs User",
          username: p.username || p.name || "HiDocs User",
          email: String(p.email || "").trim().toLowerCase(),
          role: String(p.role || "user").trim().toLowerCase(),
        };
      }
    }
  } catch {
    // ignore
  }
  return {
    id: "",
    name: "HiDocs User",
    username: "HiDocs User",
    email: "",
    role: "user",
  };
};

const styles = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

* { box-sizing: border-box; }
html, body, #root {
  width: 100%;
  height: 100%;
  margin: 0;
  overflow: hidden;
}
body {
  font-family: "Inter", sans-serif;
  background: var(--hp-pri-dk, #0f3d75);
  overflow: hidden;
}
button, input { font: inherit; }

.choose-role-page {
  --primary: var(--hp-pri, #2168b4);
  --primary-hover: var(--hp-pri-hover, #1a5695);
  position: relative;
  width: 100%;
  height: 100vh;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--hp-pri-dk, #0f3d75) url(${background}) center/cover;
}

.choose-role-page::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    125deg,
    rgba(7, 35, 72, 0.96) 0%,
    color-mix(in srgb, var(--primary) 55%, rgba(7, 35, 72, 0.95)) 50%,
    color-mix(in srgb, var(--primary) 70%, rgba(30, 105, 174, 0.88)) 100%
  );
}

.choose-role-page::after {
  content: "";
  position: absolute;
  width: 700px;
  height: 700px;
  right: -260px;
  top: -260px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 0 0 80px rgba(255, 255, 255, 0.02),
    0 0 0 160px rgba(255, 255, 255, 0.015);
  pointer-events: none;
}

.choose-role-blobs {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.choose-role-blob {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.choose-role-blob.one {
  width: 420px;
  height: 420px;
  left: -220px;
  bottom: -200px;
  background: rgba(49, 132, 220, 0.22);
}

.choose-role-blob.two {
  width: 220px;
  height: 220px;
  right: 6%;
  bottom: -110px;
  background: rgba(72, 156, 235, 0.14);
}

.choose-role-topbar {
  position: absolute;
  top: 22px;
  left: 36px;
  right: 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 10;
}

.choose-role-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #ffffff;
  text-decoration: none;
}

.choose-role-logo-box {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.choose-role-logo-box img {
  width: 27px;
  height: 27px;
  object-fit: contain;
}

.choose-role-brand span {
  font-size: 23px;
  font-weight: 800;
  letter-spacing: -0.8px;
  color: #ffffff;
}

.choose-role-card {
  position: relative;
  z-index: 4;
  width: 100%;
  max-width: 680px;
  padding: 30px 38px;
  border: 1px solid rgba(255, 255, 255, 0.85);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 30px 80px rgba(2, 20, 48, 0.32);
  margin-top: 20px;
  animation: crFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.choose-role-header {
  text-align: center;
  margin-bottom: 20px;
}

.choose-role-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--hp-pri-lt, #eef5fd);
  color: var(--primary, #2168b4);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  padding: 4px 12px;
  border-radius: 20px;
  margin-bottom: 10px;
  border: 1px solid color-mix(
    in srgb,
    var(--primary, #2168b4) 20%,
    transparent
  );
}

.choose-role-header h1 {
  margin: 0 0 6px;
  color: #172a3e;
  font-size: 27px;
  font-weight: 800;
  letter-spacing: -1px;
}

.choose-role-header p {
  margin: 0 auto;
  max-width: 480px;
  color: #64748b;
  font-size: 13px;
  line-height: 1.5;
}

/* 2 Cards Grid */
.choose-role-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-bottom: 18px;
}

.role-select-box {
  position: relative;
  border: 2px solid #e2e8f0;
  border-radius: 20px;
  background: #ffffff;
  padding: 20px 18px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 11px;
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  text-align: left;
}

.role-select-box:hover {
  border-color: #cbd5e1;
  transform: translateY(-3px);
  box-shadow: 0 10px 24px rgba(15, 30, 50, 0.06);
}

.role-select-box.active {
  border-color: var(--primary, #2168b4);
  background: color-mix(
    in srgb,
    var(--primary, #2168b4) 5%,
    #ffffff
  );
  box-shadow: 0 12px 30px rgba(33, 104, 180, 0.14);
}

.role-select-top {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.role-icon-container {
  width: 50px;
  height: 50px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  transition: transform 0.2s ease;
}

.role-select-box.active .role-icon-container {
  transform: scale(1.08);
}

.role-icon-container.creator {
  background: color-mix(
    in srgb,
    var(--primary, #2168b4) 14%,
    #eef5fd
  );
  color: var(--primary, #2168b4);
}

.role-icon-container.user {
  background: #ecfdf5;
  color: #059669;
}

.role-radio-check {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: #ffffff;
  transition: all 0.2s ease;
}

.role-select-box.active .role-radio-check {
  background: var(--primary, #2168b4);
  border-color: var(--primary, #2168b4);
}

.role-info h3 {
  margin: 0 0 3px;
  color: #1e293b;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.3px;
}

.role-tagline {
  display: inline-block;
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 2px 8px;
  border-radius: 6px;
  margin-bottom: 8px;
}

.role-tagline.creator {
  background: color-mix(
    in srgb,
    var(--primary, #2168b4) 12%,
    #eef5fd
  );
  color: var(--primary, #2168b4);
}

.role-tagline.user {
  background: #d1fae5;
  color: #047857;
}

.role-info p {
  margin: 0 0 12px;
  color: #64748b;
  font-size: 12px;
  line-height: 1.5;
}

.role-features-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
}

.role-feature-item {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 11.5px;
  color: #334155;
  font-weight: 500;
}

.role-feature-item svg {
  color: #16a34a;
  font-size: 11px;
  flex-shrink: 0;
}

/* Action button */
.choose-role-action-btn {
  width: 100%;
  height: 50px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(
    135deg,
    var(--primary, #2168b4) 0%,
    color-mix(
      in srgb,
      var(--primary, #2168b4) 75%,
      #4b9fe8
    ) 100%
  );
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(33, 104, 180, 0.28);
  transition: all 0.2s ease;
}

.choose-role-action-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(33, 104, 180, 0.35);
  filter: brightness(1.06);
}

.choose-role-action-btn:disabled {
  opacity: 0.7;
  cursor: wait;
}

.choose-role-footer {
  text-align: center;
  margin-top: 18px;
  color: #8b99a8;
  font-size: 12px;
}

.choose-role-footer span {
  color: #64748b;
}

@keyframes crFadeIn {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(12px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (max-width: 680px) {
  .choose-role-page {
    padding: 16px;
  }

  .choose-role-card {
    padding: 26px 18px;
    border-radius: 22px;
    margin-top: 20px;
  }

  .choose-role-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .choose-role-topbar {
    top: 16px;
    left: 20px;
    right: 20px;
  }

  .choose-role-header h1 {
    font-size: 24px;
  }

  .role-select-box {
    padding: 16px;
  }
}
`;

export default function ChooseRole() {
  const navigate = useNavigate();

  const [user] = useState(() => getCurrentUser());

  const [selectedRole, setSelectedRole] = useState(() => {
    return user.role === "admin" ? "creator" : "user";
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirmRole = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    const targetRole = selectedRole === "creator" ? "admin" : "user";
    const userName = user.name || user.username || "HiDocs User";
    const userEmail = user.email || "";

    try {
      await api.put("/users/me", {
        name: userName,
        role: targetRole,
      });
    } catch (err) {
      console.warn("Update role backend warning:", err);
    }

    const updatedUser = {
      ...user,
      name: userName,
      username: userName,
      email: userEmail,
      role: targetRole,
    };

    [
      "user",
      "hidocs_user",
      "currentUser",
      "loggedInUser",
      "isLoggedIn",
    ].forEach((key) => {
      localStorage.removeItem(key);
    });

    localStorage.setItem("user", JSON.stringify(updatedUser));
    localStorage.setItem("isLoggedIn", "true");

    localStorage.setItem(
      "hidocs_active_user_identity",
      String(
        updatedUser.email ||
          updatedUser.id ||
          updatedUser.username
      )
        .trim()
        .toLowerCase()
    );

    window.dispatchEvent(
      new CustomEvent("hidocs-user-changed", {
        detail: {
          user: updatedUser,
          userIdentity:
            updatedUser.email ||
            updatedUser.id ||
            updatedUser.username,
        },
      })
    );

    if (targetRole === "admin") {
      navigate("/admin", { replace: true });
    } else {
      navigate("/dashboard", { replace: true });
    }
  };

  return (
    <div className="choose-role-page">
      <style>{styles}</style>

      <div className="choose-role-blobs">
        <span className="choose-role-blob one" />
        <span className="choose-role-blob two" />
      </div>

      <header className="choose-role-topbar">
        <div className="choose-role-brand">
          <div className="choose-role-logo-box">
            <img src={logo} alt="HiDocs Logo" />
          </div>
          <span>HiDocs!</span>
        </div>
      </header>

      <main className="choose-role-card">
        <div className="choose-role-header">
          <h1>Halo, {user.name || user.username}! 👋</h1>

          <p>
            Pilih peran yang ingin Anda gunakan di platform HiDocs.
            Anda dapat berganti peran kapan saja melalui halaman Profil.
          </p>
        </div>

        <div className="choose-role-grid">
          <div
            className={`role-select-box${
              selectedRole === "creator" ? " active" : ""
            }`}
            onClick={() => setSelectedRole("creator")}
          >
            <div className="role-select-top">
              <div className="role-icon-container creator">
                <FaWpforms />
              </div>

              <div className="role-radio-check">
                {selectedRole === "creator" && <FaCheck />}
              </div>
            </div>

            <div className="role-info">
              <h3>Creator</h3>

              <span className="role-tagline creator">
                Pembuat Form & Kuis
              </span>

              <p>
                Rancang formulir digital interaktif, impor dokumen Word
                (.docx), dan pantau analitik skor responden.
              </p>

              <div className="role-features-list">
                <div className="role-feature-item">
                  <FaCheck />
                  <span>Form Builder Interaktif</span>
                </div>

                <div className="role-feature-item">
                  <FaCheck />
                  <span>Import Soal Word (.docx)</span>
                </div>

                <div className="role-feature-item">
                  <FaCheck />
                  <span>QR Code & Link Publik</span>
                </div>

                <div className="role-feature-item">
                  <FaCheck />
                  <span>Analitik Nilai & Respons</span>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`role-select-box${
              selectedRole === "user" ? " active" : ""
            }`}
            onClick={() => setSelectedRole("user")}
          >
            <div className="role-select-top">
              <div className="role-icon-container user">
                <FaUser />
              </div>

              <div className="role-radio-check">
                {selectedRole === "user" && <FaCheck />}
              </div>
            </div>

            <div className="role-info">
              <h3>User</h3>

              <span className="role-tagline user">
                Responden
              </span>

              <p>
                Akses dan isi formulir online dengan mudah melalui
                tautan atau QR Code, serta lihat hasil pengisian form.
              </p>

              <div className="role-features-list">
                <div className="role-feature-item">
                  <FaCheck />
                  <span>Akses Form via Link & QR</span>
                </div>

                <div className="role-feature-item">
                  <FaCheck />
                  <span>Kerjakan Kuis Online</span>
                </div>

                <div className="role-feature-item">
                  <FaCheck />
                  <span>Riwayat Pengisian Form</span>
                </div>

                <div className="role-feature-item">
                  <FaCheck />
                  <span>Tinjau Skor & Hasil</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="choose-role-action-btn"
          onClick={handleConfirmRole}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span>Menyiapkan Dasbor...</span>
          ) : (
            <>
              <span>
                Masuk sebagai{" "}
                {selectedRole === "creator"
                  ? "Creator (Admin)"
                  : "User (Responden)"}
              </span>
              <FaArrowRight />
            </>
          )}
        </button>
      </main>
    </div>
  );
}