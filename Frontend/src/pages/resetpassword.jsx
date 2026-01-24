import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/resetpassword.css";

function ResetPassword() {
  const navigate = useNavigate();
  const { state } = useLocation(); // ✅ email passed from VerifyOtp
  const email = state?.email;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Session expired. Please start forgot password again.");
      return;
    }

    if (!password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(
        "http://127.0.0.1:4000/api/users/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Reset password failed");
        return;
      }

      setSuccess("Password reset successfully!");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      setError("Server error. Please start backend.");
    }
  };

  return (
    <div className="main">
      {/* LEFT PANEL */}
      <div className="left-panel">
        <h1>
          Reset Your Password
          <span className="highlight-text">
            <br />
            Create a new password to access your account
          </span>
        </h1>

        <div className="illustration">
          <img src="/assets/forgot.png" alt="reset password" />
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="right-panel">
        <h2>Reset Password</h2>

        <p className="description">
          Please enter your new password and confirm it below
        </p>

        <form className="form" onSubmit={handleSubmit}>
          <div className="password-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="password-box">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span className="eye-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <button type="submit">Reset Password</button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
