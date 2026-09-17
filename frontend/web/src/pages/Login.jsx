import { loginUser } from "../api/authApi";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaArrowRight, FaCheckCircle, FaEnvelope, FaEye, FaEyeSlash, FaLock, FaSignInAlt } from "react-icons/fa";
import background from "../assets/images/background.png";
import logo from "../assets/images/logo.png";

const styles = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

*{box-sizing:border-box}
html,body,#root{width:100%;height:100%;margin:0}
body{font-family:"Inter",sans-serif;background:#0f3d75;overflow:hidden}
button,input{font:inherit}

.login-page{position:relative;width:100%;height:100vh;padding:45px 7%;display:flex;align-items:center;justify-content:center;overflow:hidden;background:#0f3d75 url(${background}) center/cover}
.login-page:before{content:"";position:absolute;inset:0;background:linear-gradient(120deg,rgba(7,35,72,.97),rgba(15,66,121,.91) 55%,rgba(30,105,174,.84))}
.login-page:after{content:"";position:absolute;width:650px;height:650px;right:-300px;top:-300px;border-radius:50%;border:1px solid rgba(255,255,255,.1);box-shadow:0 0 0 70px rgba(255,255,255,.025),0 0 0 140px rgba(255,255,255,.018)}

.login-blob{position:absolute;border-radius:50%;pointer-events:none}
.login-blob.one{width:390px;height:390px;left:-270px;bottom:-240px;background:rgba(49,132,220,.2)}
.login-blob.two{width:190px;height:190px;right:8%;bottom:-125px;background:rgba(72,156,235,.12)}
.login-blob.three{width:90px;height:90px;left:18%;top:10%;background:rgba(255,255,255,.055)}

.login-dots{position:absolute;right:13%;bottom:18%;display:grid;grid-template-columns:repeat(5,5px);gap:9px;opacity:.25}
.login-dots span{width:4px;height:4px;border-radius:50%;background:#fff}

.login-brand{position:absolute;z-index:4;top:35px;left:7%;display:flex;align-items:center;gap:13px;color:#fff}
.login-logo-wrapper{width:48px;height:48px;border-radius:14px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.17);backdrop-filter:blur(10px);box-shadow:0 8px 25px rgba(0,0,0,.12)}
.login-logo{width:32px;height:32px;object-fit:contain}
.login-brand>span{font-size:25px;font-weight:800;letter-spacing:-1px}

.login-container{position:relative;z-index:2;width:100%;max-width:1180px;display:grid;grid-template-columns:minmax(0,1.05fr) minmax(380px,.72fr);align-items:center;gap:55px}

.login-brand-panel{position:relative;color:#fff;padding:0 0 20px}
.login-brand-content{position:relative;z-index:2;max-width:560px}
.login-brand-message{margin-top:0;max-width:500px;transform:translateY(-8px)}
.login-brand-message h1{margin:0 0 18px;font-size:clamp(42px,4.2vw,64px);line-height:1.04;letter-spacing:-3px;font-weight:800;color:#fff}
.login-brand-message h1::first-line{letter-spacing:-3.5px}
.login-brand-message p{margin:0;max-width:400px;color:rgba(255,255,255,.67);font-size:14px;line-height:1.8;font-weight:400}

.login-form-panel{position:relative;display:flex;align-items:center;justify-content:flex-start;transform:translateX(-18px)}
.login-form-panel:before{content:"";position:absolute;width:360px;height:360px;right:-150px;top:-170px;border-radius:50%;background:rgba(111,183,240,.12);filter:blur(2px)}

.login-form-card{position:relative;z-index:2;width:100%;max-width:430px;padding:42px 43px;border:1px solid rgba(255,255,255,.8);border-radius:24px;background:rgba(255,255,255,.98);box-shadow:0 25px 65px rgba(3,24,52,.3)}

.login-mobile-brand{display:none}

.login-form-header{margin-bottom:28px}
.login-form-header h2{margin:0 0 8px;color:#193858;font-size:30px;line-height:1.2;font-weight:800;letter-spacing:-1.2px}
.login-form-header p{margin:0;color:#8795a5;font-size:12px;line-height:1.7;font-weight:400}

.login-form{display:flex;flex-direction:column;gap:18px}
.login-form-group label{display:block;margin-bottom:7px;color:#405872;font-size:11px;font-weight:700}

.login-input-wrapper{height:50px;padding:0 14px;display:flex;align-items:center;gap:10px;border:1px solid #dbe4ed;border-radius:12px;background:#f8fafc;transition:.2s}
.login-input-wrapper:focus-within{border-color:#4b91d8;background:#fff;box-shadow:0 0 0 4px rgba(74,141,212,.08)}

.login-input-icon{color:#91a1b2;font-size:14px;flex-shrink:0}

.login-input-wrapper input{width:100%;height:100%;border:0;outline:none;background:transparent;color:#30475f;font-size:12px;font-weight:500}
.login-input-wrapper input::placeholder{color:#a2afbc;font-weight:400}
.login-input-wrapper input:disabled{cursor:not-allowed;opacity:.65}

.login-eye-btn{width:29px;height:29px;flex-shrink:0;border:0;border-radius:8px;background:transparent;color:#8a9aaa;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:12px;outline:none}
.login-eye-btn:hover{background:#edf3f8;color:#397bc0}

.login-success-message,.login-error-message{min-height:40px;padding:9px 11px;border-radius:10px;display:flex;align-items:center;gap:8px;font-size:10px;font-weight:600}

.login-success-message{border:1px solid #c9ead9;background:#eefaf4;color:#258b63}
.login-success-message svg{font-size:15px}

.login-error-message{border:1px solid #f1cdcd;background:#fff2f2;color:#d64f4f}
.login-error-icon{width:19px;height:19px;flex-shrink:0;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#e45c5c;color:#fff;font-size:10px;font-weight:800}

.login-btn{position:relative;width:100%;height:50px;margin-top:2px;border:0;border-radius:12px;background:linear-gradient(135deg,#164b87,#287acb);color:#fff;display:flex;align-items:center;justify-content:center;gap:8px;cursor:pointer;font-size:12px;font-weight:700;box-shadow:0 8px 20px rgba(34,105,179,.22);transition:.2s;outline:none}
.login-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 12px 25px rgba(34,105,179,.28)}
.login-btn:disabled{cursor:wait;opacity:.7}

.login-btn-arrow{position:absolute;right:17px;font-size:10px}

.login-loading-spinner{width:15px;height:15px;border:2px solid rgba(255,255,255,.35);border-top-color:#fff;border-radius:50%;animation:login-spin .7s linear infinite}

@keyframes login-spin{
  to{transform:rotate(360deg)}
}

.login-register{text-align:center;margin-top:23px;color:#8b99a8;font-size:10px}
.login-register a{color:#397bc0;font-weight:700;text-decoration:none;outline:none}
.login-register a:hover{text-decoration:underline}

.login-page input:focus{outline:none}
.login-page button:focus{outline:none}
.login-page a:focus{outline:none}

@media(max-width:900px){
body{overflow:auto}
.login-page{height:auto;min-height:100vh;padding:35px 25px}
.login-brand{top:25px;left:25px}
.login-container{height:auto;max-width:520px;display:flex;flex-direction:column;gap:35px}
.login-brand-panel{padding:0;text-align:center}
.login-brand-content{padding-top:55px}
.login-brand-message{margin:0 auto;transform:none}
.login-brand-message h1{font-size:42px;letter-spacing:-2px}
.login-brand-message p{margin:auto}
.login-form-panel{width:100%;transform:none}
.login-form-card{max-width:520px}
.login-dots{display:none}
}

@media(max-width:520px){
.login-page{padding:25px 18px;align-items:flex-start;background-image:none}
.login-page:before,.login-page:after,.login-blob,.login-dots{display:none}
.login-brand{display:none}
.login-container{width:100%;min-height:100vh;justify-content:center;gap:30px}
.login-brand-panel{display:none}
.login-form-panel{min-height:100vh;transform:none}
.login-form-card{max-width:none;padding:34px 24px;border-radius:20px;box-shadow:0 18px 45px rgba(3,24,52,.22)}
.login-mobile-brand{display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:30px}
.login-mobile-logo{width:42px;height:42px;border-radius:12px;background:#eaf3fd;display:flex;align-items:center;justify-content:center}
.login-mobile-logo img{width:29px;height:29px}
.login-mobile-brand span{color:#1f4e82;font-size:23px;font-weight:800}
.login-form-header h2{font-size:27px}
.login-form-header p{font-size:11px}
.login-input-wrapper,.login-btn{height:48px}
}

@media(prefers-reduced-motion:reduce){
.login-page *{animation:none!important;transition:none!important}
}
`;

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const verifiedAccount = location.state?.verifiedAccount || null;
  const verificationSuccess = location.state?.verificationSuccess || false;

  const [email,setEmail] = useState(verifiedAccount?.email || "");
  const [password,setPassword] = useState("");
  const [showPassword,setShowPassword] = useState(false);
  const [error,setError] = useState("");
  const [successMessage,setSuccessMessage] = useState(
    verificationSuccess ? "Email berhasil diverifikasi. Silakan login." : ""
  );
  const [isLoading,setIsLoading] = useState(false);

  useEffect(() => {
    if (!verificationSuccess) return;

    const timer = window.setTimeout(() => setSuccessMessage(""),5000);

    return () => window.clearTimeout(timer);
  },[verificationSuccess]);

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");
    setSuccessMessage("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) return setError("Email harus diisi.");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return setError("Format email tidak valid.");
    }

    if (!password) return setError("Password harus diisi.");

    setIsLoading(true);

    try {
      const response = await loginUser({
        email:cleanEmail,
        password
      });

      const apiUser = response.data.data.user;
      const token = response.data.data.token;
      const cleanUserEmail = String(apiUser?.email || "").trim().toLowerCase();

      const cleanUsername = String(
        apiUser?.username ||
        apiUser?.name ||
        cleanUserEmail.split("@")[0] ||
        "User"
      ).trim();

      const user = {
        ...apiUser,
        id:apiUser?.id || cleanUserEmail || `${cleanUsername}-${Date.now()}`,
        username:cleanUsername,
        name:apiUser?.name || cleanUsername,
        email:cleanUserEmail,
        role:apiUser?.role || "User"
      };

      ["user","hidocs_user","currentUser","loggedInUser","isLoggedIn"].forEach((key) => {
        localStorage.removeItem(key);
      });

      localStorage.setItem("token",token);
      localStorage.setItem("user",JSON.stringify(user));
      localStorage.setItem("isLoggedIn","true");
      localStorage.setItem(
        "hidocs_active_user_identity",
        String(user.email || user.id || user.username).trim().toLowerCase()
      );

      window.dispatchEvent(
        new CustomEvent("hidocs-user-changed",{
          detail:{
            user,
            userIdentity:user.email || user.id || user.username
          }
        })
      );

      navigate("/choose-role", { replace: true });
    } catch (loginError) {
      console.error("Login error:",loginError);
      setError(
        loginError.response?.data?.message ||
        "Email atau password salah."
      );
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>

      <div className="login-page">
        <span className="login-blob one"/>
        <span className="login-blob two"/>
        <span className="login-blob three"/>

        <div className="login-dots">
          {Array.from({length:15}).map((_,i)=><span key={i}/>)}
        </div>

        <div className="login-brand">
          <div className="login-logo-wrapper">
            <img src={logo} alt="HiDocs Logo" className="login-logo"/>
          </div>
          <span>HiDocs!</span>
        </div>

        <main className="login-container">
          <section className="login-brand-panel">
            <div className="login-brand-content">
              <div className="login-brand-message">
                <h1>Everything you need, in one place.</h1>
                <p>Create, manage, and organize your forms with a simple and smarter experience.</p>
              </div>
            </div>
          </section>

          <section className="login-form-panel">
            <div className="login-form-card">
              <div className="login-mobile-brand">
                <div className="login-mobile-logo">
                  <img src={logo} alt="HiDocs Logo"/>
                </div>
                <span>HiDocs!</span>
              </div>

              <div className="login-form-header">
                <h2>Welcome back 👋</h2>
                <p>Sign in to your HiDocs account to continue.</p>
              </div>

              <form className="login-form" onSubmit={handleLogin}>
                <div className="login-form-group">
                  <label htmlFor="email">Email Address</label>

                  <div className="login-input-wrapper">
                    <FaEnvelope className="login-input-icon"/>

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e)=>{
                        setEmail(e.target.value);
                        setError("");
                      }}
                      placeholder="Enter your email"
                      autoComplete="email"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="login-form-group">
                  <label htmlFor="password">Password</label>

                  <div className="login-input-wrapper">
                    <FaLock className="login-input-icon"/>

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e)=>{
                        setPassword(e.target.value);
                        setError("");
                      }}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      disabled={isLoading}
                    />

                    <button
                      type="button"
                      className="login-eye-btn"
                      onClick={()=>setShowPassword((v)=>!v)}
                      disabled={isLoading}
                    >
                      {showPassword?<FaEye/>:<FaEyeSlash/>}
                    </button>
                  </div>
                </div>

                {successMessage && (
                  <div className="login-success-message">
                    <FaCheckCircle/>
                    <span>{successMessage}</span>
                  </div>
                )}

                {error && (
                  <div className="login-error-message">
                    <span className="login-error-icon">!</span>
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="login-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="login-loading-spinner"/>
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <FaSignInAlt/>
                      <span>Sign In</span>
                      <FaArrowRight className="login-btn-arrow"/>
                    </>
                  )}
                </button>
              </form>

              <div className="login-register">
                Don't have an account? <Link to="/register">Sign up</Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

export default Login;