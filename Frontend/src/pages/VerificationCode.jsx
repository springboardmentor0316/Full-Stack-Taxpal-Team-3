import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/verificationcode.css";

function VerificationCode() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(Array(6).fill(""));

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) return alert("Enter full code");
    // later: verify API
    navigate("/reset-password");
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
          We've Sent A 6-Digit Code To Your Email.
          <br />
          Please Enter The Code Below To Continue
        </p>

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

          <button type="submit">Verify Code</button>

          <p className="resend">
            didn't receive the code ?{" "}
            <span>Resend</span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default VerificationCode;
