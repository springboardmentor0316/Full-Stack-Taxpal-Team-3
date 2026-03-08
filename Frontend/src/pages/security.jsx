import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import SettingsMenu from "../components/SettingsMenu";
import "../styles/categories.css";
import { FiLogOut } from "react-icons/fi";

const STORAGE_KEY = "taxpal_security_prefs_v1";

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function Security() {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [toast, setToast] = useState(null);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [sessions, setSessions] = useState([
    { id: "s1", device: "Chrome on Windows", location: "India", lastActive: "Active now" },
    { id: "s2", device: "Android App", location: "India", lastActive: "2 days ago" },
    { id: "s3", device: "Edge on Laptop", location: "India", lastActive: "7 days ago" },
  ]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const stored = raw ? safeParse(raw) : null;
    if (stored && typeof stored === "object") {
      setTwoFactorEnabled(Boolean(stored.twoFactorEnabled));
    }
  }, []);

  const savePrefs = (nextTwoFactor) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ twoFactorEnabled: nextTwoFactor }));
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 2200);
  };

  const handleToggle2fa = () => {
    setError("");
    setTwoFactorEnabled((prev) => {
      const next = !prev;
      savePrefs(next);
      showToast(next ? "Two-factor enabled (UI only)." : "Two-factor disabled (UI only).", "info");
      return next;
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setError("");
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setError("");

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setError("Please fill in all password fields.");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    // UI-only: no backend call
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    showToast("Password change saved (UI only).", "success");
  };

  const handleLogoutSession = (sessionId) => {
    const ok = window.confirm("Logout this session? (UI-only)");
    if (!ok) return;

    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    showToast("Session logged out (simulated).", "success");
  };

  return (
    <div className="dashboard settings-shell">
      <Sidebar />

      <main className="content settings-content settings-security-page">
        {toast ? (
          <div className="settings-toast-wrap" role="status" aria-live="polite">
            <div className={`settings-toast ${toast.type}`}>{toast.message}</div>
          </div>
        ) : null}
        <div className="settings-header">
          <div>
            <h1 className="settings-title">Settings</h1>
            <p className="subtitle">Manage your account settings and preferences</p>
          </div>
        </div>

        <div className="settings-body">
          <SettingsMenu />

          <section className="settings-panel">
            <div className="settings-panel-head">
              <h2>Security</h2>
            </div>

            <div className="settings-section">
              <div className="settings-subsection">
                <div className="settings-subtitle">Change Password</div>
                <form className="settings-security-form" onSubmit={handleChangePassword}>
                  <label className="settings-field">
                    <span>Current Password</span>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                    />
                  </label>

                  <div className="settings-password-grid">
                    <label className="settings-field">
                      <span>New Password</span>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Minimum 8 characters"
                      />
                    </label>

                    <label className="settings-field">
                      <span>Confirm New Password</span>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Repeat new password"
                      />
                    </label>
                  </div>

                  <div className="settings-section-actions">
                    <button type="submit" className="settings-primary">
                      Save Password
                    </button>
                  </div>
                </form>
              </div>

              <div className="settings-subsection">
                <div className="settings-subtitle">Two-Factor Authentication</div>
                <div className="settings-toggle-row" style={{ padding: 0, border: "none" }}>
                  <div>
                    <div className="settings-toggle-title">Enable 2FA</div>
                    <div className="settings-toggle-desc">Extra protection for your account (UI-only).</div>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" checked={twoFactorEnabled} onChange={handleToggle2fa} />
                    <span className="slider" />
                  </label>
                </div>
              </div>

              <div className="settings-subsection">
                <div className="settings-subtitle">Active Sessions</div>
                <div className="settings-session-list">
                  {sessions.map((s) => (
                    <div className="settings-session" key={s.id}>
                      <div>
                        <div className="settings-session-device">{s.device}</div>
                        <div className="settings-session-meta">
                          {s.location} • {s.lastActive}
                        </div>
                      </div>
                      <div className="settings-session-actions">
                        <div className="settings-session-pill">Session</div>
                        <button
                          type="button"
                          className="settings-session-logout"
                          title="Logout session"
                          onClick={() => handleLogoutSession(s.id)}
                        >
                          <FiLogOut />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {error ? <div className="settings-error">{error}</div> : null}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Security;
