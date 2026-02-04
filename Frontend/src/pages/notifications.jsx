import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import SettingsMenu from "../components/SettingsMenu";
import "../styles/categories.css";

const STORAGE_KEY = "taxpal_notification_prefs_v1";

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function Notifications() {
  const [status, setStatus] = useState("");
  const [prefs, setPrefs] = useState({
    emailNotifications: true,
    budgetExceededAlert: true,
    monthlyExpenseSummary: false,
    taxReminderAlerts: true,
  });

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const stored = raw ? safeParse(raw) : null;
    if (stored && typeof stored === "object") {
      setPrefs((prev) => ({ ...prev, ...stored }));
    }
  }, []);

  const toggle = (key) => {
    setStatus("");
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    setStatus("Preferences saved.");
  };

  return (
    <div className="dashboard settings-shell">
      <Sidebar />

      <main className="content settings-content settings-notifications-page">
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
              <h2>Notifications</h2>
            </div>

            <div className="settings-section">
              <div className="settings-help">
                UI-only toggles for ESG-friendly alerts and reminders.
              </div>

              <div className="settings-toggle-list">
                <div className="settings-toggle-row">
                  <div>
                    <div className="settings-toggle-title">Email Notifications</div>
                    <div className="settings-toggle-desc">Receive important updates via email.</div>
                  </div>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={prefs.emailNotifications}
                      onChange={() => toggle("emailNotifications")}
                    />
                    <span className="slider" />
                  </label>
                </div>

                <div className="settings-toggle-row">
                  <div>
                    <div className="settings-toggle-title">Budget Exceeded Alert</div>
                    <div className="settings-toggle-desc">Get notified when spending crosses budget.</div>
                  </div>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={prefs.budgetExceededAlert}
                      onChange={() => toggle("budgetExceededAlert")}
                    />
                    <span className="slider" />
                  </label>
                </div>

                <div className="settings-toggle-row">
                  <div>
                    <div className="settings-toggle-title">Monthly Expense Summary</div>
                    <div className="settings-toggle-desc">A monthly snapshot of your expenses and trends.</div>
                  </div>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={prefs.monthlyExpenseSummary}
                      onChange={() => toggle("monthlyExpenseSummary")}
                    />
                    <span className="slider" />
                  </label>
                </div>

                <div className="settings-toggle-row">
                  <div>
                    <div className="settings-toggle-title">Tax Reminder Alerts</div>
                    <div className="settings-toggle-desc">Timely reminders for tax-related actions.</div>
                  </div>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={prefs.taxReminderAlerts}
                      onChange={() => toggle("taxReminderAlerts")}
                    />
                    <span className="slider" />
                  </label>
                </div>
              </div>

              <div className="settings-section-actions">
                <button type="button" className="settings-primary" onClick={handleSave}>
                  Save Preferences
                </button>
              </div>

              {status ? <div className="settings-status">{status}</div> : null}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Notifications;
