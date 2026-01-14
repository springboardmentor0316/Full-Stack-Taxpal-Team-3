import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/signup.css";


function Signup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
const [state, setState] = useState("");
const [incomeBracket, setIncomeBracket] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
if (
  !email ||
  !password ||
  !confirmPassword ||
  !country ||
  !state ||
  !incomeBracket
) {
  setError("All fields are required");
  return;
}


    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setSuccess("Account created successfully!");
  };

  return (
    <div className="main">
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

      <div className="right-panel">
        <h2>Create Account</h2>

        <form className="form" onSubmit={handleSubmit}>
          <div className="row">
            <input placeholder="First Name" />
            <input placeholder="Last Name" />
          </div>
<input
  placeholder="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

<input
  placeholder="Country"
  value={country}
  onChange={(e) => setCountry(e.target.value)}
/>

<input
  placeholder="State"
  value={state}
  onChange={(e) => setState(e.target.value)}
/>

{/* ✅ INCOME BRACKET */}
<select
  className="input-field"
  value={incomeBracket}
  onChange={(e) => setIncomeBracket(e.target.value)}
>
  <option value="">Select Income Bracket</option>
  <option value="below_3L">Below ₹3,00,000</option>
  <option value="3L_6L">₹3,00,000 – ₹6,00,000</option>
  <option value="6L_10L">₹6,00,000 – ₹10,00,000</option>
  <option value="above_10L">Above ₹10,00,000</option>
</select>

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

          <div className="password-box">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span
              className="eye-icon"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}

          <button type="submit">Create Account</button>

          <p className="login">
            Already have an account?{" "}
            <span onClick={() => navigate("/")}>Login</span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
