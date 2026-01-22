import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/verificationcode.css";

function VerificationCode() {
  const navigate = useNavigate();
  const location = useLocation();

  const mode = location.state?.mode || "login";
  const email = location.state?.email || localStorage.getItem("pendingLoginEmail") || "";

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // auto-focus next box
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const code = otp.join("");
    if (code.length !== 6) return alert("Enter full code");

    if (mode !== "login") {
      setError("Unsupported verification mode");
      return;
    }

    if (!email) {
      setError("Missing email. Please login again.");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/users/verify-login-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "OTP verification failed");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      if (data.userId) {
        localStorage.setItem("userId", data.userId);
      }
      localStorage.removeItem("pendingLoginEmail");

      setSuccess("Verified! Logging you in...");
      setTimeout(() => navigate("/dashboard"), 500);
    } catch (err) {
      setError("Server error. Please start backend.");
    }
  };

  const handleResend = async () => {
    setError("");
    setSuccess("");

    if (!email) {
      setError("Missing email. Please login again.");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/users/resend-login-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to resend OTP");
        return;
      }

      // For dev, backend may return otp
      if (data.otp) {
        setSuccess(`OTP resent (dev): ${data.otp}`);
      } else {
        setSuccess("OTP resent. Please check your email.");
      }
    } catch (err) {
      setError("Server error. Please start backend.");
    }
  };

  return (
    <div className="main">
      {/* LEFT PANEL */}
      <div className="left-panel">
        <h1>
          Verify Your Account
          <span className="highlight-text">
            <br />
            Enter the 6-digit OTP to continue
          </span>
        </h1>

        <div className="illustration">
          <img src="/assets/forgot.png" alt="verification" />
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="right-panel">
        <h2>Verification Code</h2>

        <p className="description">
          We've Sent A 6-Digit Code To Your Email.
          <br />
          Please Enter The Code Below To Continue
        </p>

        {email && (
          <p className="description" style={{ marginTop: "8px" }}>
            Verifying: <strong>{email}</strong>
          </p>
        )}


        <form onSubmit={handleSubmit}>
          <div className="otp-container">
  {otp.map((digit, index) => (
    <input
      key={index}
      id={`otp-${index}`}
      type="text"
      inputMode="numeric"
      autoComplete="one-time-code"
      maxLength="1"
      value={digit}
      onChange={(e) =>
        handleChange(e.target.value, index)
      }
      onFocus={(e) => e.target.select()}
    />
  ))}
</div>

          {error && <p style={{ color: "red", marginTop: "12px" }}>{error}</p>}
          {success && <p style={{ color: "green", marginTop: "12px" }}>{success}</p>}

          <button type="submit">Verify Code</button>

          <p className="resend">
            didn't receive the code ?{" "}
            <span style={{ cursor: "pointer" }} onClick={handleResend}>Resend</span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default VerificationCode;
