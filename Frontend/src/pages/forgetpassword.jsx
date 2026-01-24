import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/forgetpassword.css";

function ForgetPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
  
    if (!email) {
      setError("Email is required");
      return;
    }
  
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
  
    try {
      const res = await fetch(
        "http://127.0.0.1:4000/api/users/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
  
      const data = await res.json();
  
      if (!res.ok) {
        setError(data.message || "Something went wrong");
        return;
      }
  
      // ✅ OTP sent
      setSuccess("OTP sent to your email");
  
      // ✅ go to Verify OTP page (NOT reset password)
      setTimeout(() => {
        navigate("/verify-otp", { state: { email } });
      }, 800);
  
    } catch (err) {
      setError("Server error. Please start backend.");
    }
  };
  

  return (
    <div className="main">
      {/* LEFT PANEL */}
      <div className="left-panel">
        <h1>
          Forgot Your Password ?
          <span className="highlight-text">
            <br />
            No Worries We’ll Send You And Verification To Reset Your Password
          </span>
        </h1>

        <div className="illustration">
          <img src="/assets/forgot.png" alt="forgot password" />
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="right-panel">
        <h2>Forgot Password</h2>

        <p className="description">
          Enter Your Email ID We Will Send You A Verification Code To Reset Your
          Password
        </p>

        <form className="form" onSubmit={handleSubmit}>
          <div className="email-box">
            <span className="mail-icon">✉</span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <button type="submit">Send Verification Code</button>

          <p className="login-text">
            remembered your password?{" "}
            <span onClick={() => navigate("/")}>Login</span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default ForgetPassword;