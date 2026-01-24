import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/verificationcode.css";

function VerifyOtp() {
  const navigate = useNavigate();
  const { state } = useLocation(); // contains email

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState("");

  // handle OTP box change
  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");

    if (!state?.email) {
      setError("Session expired. Please try again.");
      return;
    }

    const code = otp.join("");
    if (code.length !== 6) {
      setError("Please enter the 6-digit OTP");
      return;
    }

    try {
      const res = await fetch(
        "http://127.0.0.1:4000/api/users/verify-reset-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: state.email,
            otp: code,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid OTP");
        return;
      }

      // ✅ OTP verified
      navigate("/reset-password", { state: { email: state.email } });
    } catch (err) {
      setError("Server error. Please try again.");
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
            No Worries We’ll Send You And Verification To Reset
            Your Password
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
          We've sent a 6-digit code to your email.
          <br />
          Please enter the code below to continue.
        </p>

        <form onSubmit={handleVerify}>
          <div className="otp-container">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) =>
                  handleChange(e.target.value, index)
                }
                onFocus={(e) => e.target.select()}
              />
            ))}
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit">Verify Code</button>

          <p className="resend">
            Didn't receive the code? <span>Resend</span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default VerifyOtp;
