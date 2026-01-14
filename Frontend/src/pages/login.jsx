import "../styles/login.css"; // or "../App.css" if you prefer
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setSuccess("Login successful!");
  };

  return (
    <div className="main">
      {/* LEFT PANEL */}
      <div className="left-panel">
        <h1>
          TaxPal{" "}
          <span className="highlight">
            Personal Finance & <br />Tax Estimator For Freelancers
          </span>
        </h1>

        <div className="illustration">
          <img src="/assets/illustration1.png" alt="illustration" />
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="right-panel">
        <h2>LOGIN HERE!</h2>

        <form className="form" onSubmit={handleSubmit}>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="password-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <p
            style={{
              textAlign: "right",
              fontSize: "13px",
              color: "#4b2cff",
              cursor: "pointer",
              marginTop: "-8px",
              marginBottom: "15px",
            }}
            onClick={() => navigate("/forgot-password")}
          >
            Forgot password?
          </p>

          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}

          <button type="submit">Login</button>

          <p className="login">
            Don’t have an account?{" "}
            <span onClick={() => navigate("/signup")}>
              Create Account
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
