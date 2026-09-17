import { registerUser } from "../api/authApi";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaUser,
  FaUserPlus
} from "react-icons/fa";
import background from "../assets/images/background.png";
import logo from "../assets/images/logo.png";

const PENDING_REGISTRATION_KEY = "hidocs-pending-registration";

const styles = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

*{box-sizing:border-box}
html,body,#root{width:100%;height:100%;margin:0}
body{font-family:"Inter",sans-serif;background:#0f3d75;overflow:hidden}
button,input{font:inherit}

.register-page{position:relative;width:100%;height:100vh;padding:45px 7%;display:flex;align-items:center;justify-content:center;overflow:hidden;background:#0f3d75 url(${background}) center/cover}
.register-page:before{content:"";position:absolute;inset:0;background:linear-gradient(120deg,rgba(7,35,72,.97),rgba(15,66,121,.91) 55%,rgba(30,105,174,.84))}
.register-page:after{content:"";position:absolute;width:650px;height:650px;right:-300px;top:-300px;border-radius:50%;border:1px solid rgba(255,255,255,.1);box-shadow:0 0 0 70px rgba(255,255,255,.025),0 0 0 140px rgba(255,255,255,.018)}

.register-blob{position:absolute;border-radius:50%;pointer-events:none}
.register-blob.one{width:390px;height:390px;left:-270px;bottom:-240px;background:rgba(49,132,220,.2)}
.register-blob.two{width:190px;height:190px;right:8%;bottom:-125px;background:rgba(72,156,235,.12)}
.register-blob.three{width:90px;height:90px;left:18%;top:10%;background:rgba(255,255,255,.055)}

.register-dots{position:absolute;right:13%;bottom:18%;display:grid;grid-template-columns:repeat(5,5px);gap:9px;opacity:.25}
.register-dots span{width:4px;height:4px;border-radius:50%;background:#fff}

.register-brand{position:absolute;z-index:4;top:35px;left:7%;display:flex;align-items:center;gap:13px;color:#fff}
.register-logo-wrapper{width:48px;height:48px;border-radius:14px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.17);backdrop-filter:blur(10px);box-shadow:0 8px 25px rgba(0,0,0,.12)}
.register-logo{width:32px;height:32px;object-fit:contain}
.register-brand>span{font-size:25px;font-weight:800;letter-spacing:-1px}

.register-container{position:relative;z-index:2;width:100%;max-width:1180px;display:grid;grid-template-columns:minmax(0,1.05fr) minmax(380px,.72fr);align-items:center;gap:55px}

.register-brand-panel{position:relative;color:#fff;padding:0 0 20px}
.register-brand-content{position:relative;z-index:2;max-width:560px}
.register-brand-message{margin-top:0;max-width:500px;transform:translateY(-8px)}
.register-brand-message h1{margin:0 0 18px;font-size:clamp(42px,4.2vw,64px);line-height:1.04;letter-spacing:-3px;font-weight:800;color:#fff}
.register-brand-message p{margin:0;max-width:400px;color:rgba(255,255,255,.67);font-size:14px;line-height:1.8;font-weight:400}

.register-form-panel{position:relative;display:flex;align-items:center;justify-content:flex-start;transform:translateX(-18px)}
.register-form-panel:before{content:"";position:absolute;width:360px;height:360px;right:-150px;top:-170px;border-radius:50%;background:rgba(111,183,240,.12);filter:blur(2px)}

.register-form-card{position:relative;z-index:2;width:100%;max-width:430px;padding:42px 43px;border:1px solid rgba(255,255,255,.8);border-radius:24px;background:rgba(255,255,255,.98);box-shadow:0 25px 65px rgba(3,24,52,.3)}

.register-mobile-brand{display:none}

.register-form-header{margin-bottom:28px}
.register-form-header h2{margin:0 0 8px;color:#193858;font-size:30px;line-height:1.2;font-weight:800;letter-spacing:-1.2px}
.register-form-header p{margin:0;color:#8795a5;font-size:12px;line-height:1.7;font-weight:400}

.register-form{display:flex;flex-direction:column;gap:18px}
.register-form-group label{display:block;margin-bottom:7px;color:#405872;font-size:11px;font-weight:700}

.register-input-wrapper{height:50px;padding:0 14px;display:flex;align-items:center;gap:10px;border:1px solid #dbe4ed;border-radius:12px;background:#f8fafc;transition:.2s}
.register-input-wrapper:focus-within{border-color:#4b91d8;background:#fff;box-shadow:0 0 0 4px rgba(74,141,212,.08)}

.register-input-icon{color:#91a1b2;font-size:14px;flex-shrink:0}

.register-input-wrapper input{width:100%;height:100%;border:0;outline:none;background:transparent;color:#30475f;font-size:12px;font-weight:500}
.register-input-wrapper input::placeholder{color:#a2afbc;font-weight:400}
.register-input-wrapper input:disabled{cursor:not-allowed;opacity:.65}

.register-eye-btn{width:29px;height:29px;flex-shrink:0;border:0;border-radius:8px;background:transparent;color:#8a9aaa;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:12px;outline:none}
.register-eye-btn:hover{background:#edf3f8;color:#397bc0}

.register-error-message{min-height:40px;padding:9px 11px;border:1px solid #f1cdcd;border-radius:10px;background:#fff2f2;color:#d64f4f;display:flex;align-items:center;gap:8px;font-size:10px;font-weight:600}
.register-error-icon{width:19px;height:19px;flex-shrink:0;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#e45c5c;color:#fff;font-size:10px;font-weight:800}

.register-btn{position:relative;width:100%;height:50px;margin-top:2px;border:0;border-radius:12px;background:linear-gradient(135deg,#164b87,#287acb);color:#fff;display:flex;align-items:center;justify-content:center;gap:8px;cursor:pointer;font-size:12px;font-weight:700;box-shadow:0 8px 20px rgba(34,105,179,.22);transition:.2s;outline:none}
.register-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 12px 25px rgba(34,105,179,.28)}
.register-btn:disabled{cursor:wait;opacity:.7}
.register-btn-arrow{position:absolute;right:17px;font-size:10px}

.register-loading-spinner{width:15px;height:15px;border:2px solid rgba(255,255,255,.35);border-top-color:#fff;border-radius:50%;animation:register-spin .7s linear infinite}
@keyframes register-spin{to{transform:rotate(360deg)}}

.register-login{text-align:center;margin-top:23px;color:#8b99a8;font-size:10px}
.register-login a{color:#397bc0;font-weight:700;text-decoration:none;outline:none}
.register-login a:hover{text-decoration:underline}

.register-page input:focus{outline:none}
.register-page button:focus{outline:none}
.register-page a:focus{outline:none}

@media(max-width:900px){
body{overflow:auto}
.register-page{height:auto;min-height:100vh;padding:35px 25px}
.register-brand{top:25px;left:25px}
.register-container{height:auto;max-width:520px;display:flex;flex-direction:column;gap:35px}
.register-brand-panel{padding:0;text-align:center}
.register-brand-content{padding-top:55px}
.register-brand-message{margin:0 auto;transform:none}
.register-brand-message h1{font-size:42px;letter-spacing:-2px}
.register-brand-message p{margin:auto}
.register-form-panel{width:100%;transform:none}
.register-form-card{max-width:520px}
.register-dots{display:none}
}

@media(max-width:520px){
.register-page{padding:25px 18px;align-items:flex-start;background-image:none}
.register-page:before,.register-page:after,.register-blob,.register-dots{display:none}
.register-brand{display:none}
.register-container{width:100%;min-height:100vh;justify-content:center;gap:30px}
.register-brand-panel{display:none}
.register-form-panel{min-height:100vh;transform:none}
.register-form-card{max-width:none;padding:34px 24px;border-radius:20px;box-shadow:0 18px 45px rgba(3,24,52,.22)}
.register-mobile-brand{display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:30px}
.register-mobile-logo{width:42px;height:42px;border-radius:12px;background:#eaf3fd;display:flex;align-items:center;justify-content:center}
.register-mobile-logo img{width:29px;height:29px}
.register-mobile-brand span{color:#1f4e82;font-size:23px;font-weight:800}
.register-form-header h2{font-size:27px}
.register-form-header p{font-size:11px}
.register-input-wrapper,.register-btn{height:48px}
}

@media(prefers-reduced-motion:reduce){
.register-page *{animation:none!important;transition:none!important}
}
`;

function Register() {
  const navigate = useNavigate();
  const location = useLocation();

  const savedData =
    location.state?.registrationData ||
    location.state ||
    {};

  const [email, setEmail] = useState(
    savedData.email || ""
  );

  const [username, setUsername] = useState(
    savedData.username || ""
  );

  const [password, setPassword] = useState(
    savedData.password || ""
  );

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();

    if (isLoading) return;

    setError("");

    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim();

    if (!cleanEmail || !cleanUsername || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (cleanUsername.length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }

    if (cleanUsername.length > 30) {
      setError("Username must not exceed 30 characters.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    const registrationData = {
      email: cleanEmail,
      username: cleanUsername,
      password,
      role: "User"
    };

    try {
      await registerUser({
        name: cleanUsername,
        email: cleanEmail,
        password
      });

      sessionStorage.setItem(
        PENDING_REGISTRATION_KEY,
        JSON.stringify(registrationData)
      );

      sessionStorage.removeItem(
        `hidocs-otp-countdown-${cleanEmail}`
      );

      navigate("/verify-otp", {
        state: {
          ...registrationData,
          registrationData
        }
      });
    } catch (registerError) {
      console.error(
        "Register error:",
        registerError
      );

      setError(
        registerError.response?.data?.message ||
          registerError.response?.data?.error ||
          "Registration failed. Please try again."
      );

      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>

      <div className="register-page">
        <span className="register-blob one" />
        <span className="register-blob two" />
        <span className="register-blob three" />

        <div className="register-dots">
          {Array.from({ length: 15 }).map((_, index) => (
            <span key={index} />
          ))}
        </div>

        <div className="register-brand">
          <div className="register-logo-wrapper">
            <img
              src={logo}
              alt="HiDocs Logo"
              className="register-logo"
            />
          </div>

          <span>HiDocs!</span>
        </div>

        <main className="register-container">
          <section className="register-brand-panel">
            <div className="register-brand-content">
              <div className="register-brand-message">
                <h1>
                  Create your account and get started.
                </h1>

                <p>
                  Join HiDocs and create, manage, and organize
                  your forms with a simple and smarter experience.
                </p>
              </div>
            </div>
          </section>

          <section className="register-form-panel">
            <div className="register-form-card">
              <div className="register-mobile-brand">
                <div className="register-mobile-logo">
                  <img
                    src={logo}
                    alt="HiDocs Logo"
                  />
                </div>

                <span>HiDocs!</span>
              </div>

              <div className="register-form-header">
                <h2>Create your account</h2>

                <p>
                  Register your HiDocs account to continue.
                </p>
              </div>

              <form
                className="register-form"
                onSubmit={handleRegister}
              >
                <div className="register-form-group">
                  <label htmlFor="register-email">
                    Email Address
                  </label>

                  <div className="register-input-wrapper">
                    <FaEnvelope className="register-input-icon" />

                    <input
                      id="register-email"
                      type="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setError("");
                      }}
                      placeholder="Enter your email"
                      autoComplete="email"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="register-form-group">
                  <label htmlFor="register-username">
                    Username
                  </label>

                  <div className="register-input-wrapper">
                    <FaUser className="register-input-icon" />

                    <input
                      id="register-username"
                      type="text"
                      value={username}
                      onChange={(event) => {
                        setUsername(event.target.value);
                        setError("");
                      }}
                      placeholder="Choose a username"
                      autoComplete="username"
                      minLength={3}
                      maxLength={30}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="register-form-group">
                  <label htmlFor="register-password">
                    Password
                  </label>

                  <div className="register-input-wrapper">
                    <FaLock className="register-input-icon" />

                    <input
                      id="register-password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        setError("");
                      }}
                      placeholder="Enter your password"
                      autoComplete="new-password"
                      minLength={6}
                      disabled={isLoading}
                    />

                    <button
                      type="button"
                      className="register-eye-btn"
                      onClick={() =>
                        setShowPassword(
                          (value) => !value
                        )
                      }
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <FaEye />
                      ) : (
                        <FaEyeSlash />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div
                    className="register-error-message"
                    role="alert"
                  >
                    <span className="register-error-icon">
                      !
                    </span>

                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="register-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="register-loading-spinner" />

                      <span>
                        Preparing Verification...
                      </span>
                    </>
                  ) : (
                    <>
                      <FaUserPlus />

                      <span>
                        Create Account
                      </span>

                      <FaArrowRight className="register-btn-arrow" />
                    </>
                  )}
                </button>
              </form>

              <div className="register-login">
                Already have an account?{" "}
                <Link to="/login">
                  Sign in
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

export default Register;