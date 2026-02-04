import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import SettingsMenu from "../components/SettingsMenu";
import "../styles/categories.css";

const STORAGE_KEY = "taxpal_profile_v1";

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function Profile() {
  const email = useMemo(() => localStorage.getItem("email") || "", []);

  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState("");

  const [form, setForm] = useState({
    fullName: localStorage.getItem("name") || "",
    phone: "",
    currency: "₹",
    timezone: "Asia/Kolkata",
    pictureDataUrl: "",
  });

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const stored = raw ? safeParse(raw) : null;
    if (!stored) return;

    setForm((prev) => ({
      ...prev,
      phone: stored.phone ?? prev.phone,
      currency: stored.currency ?? prev.currency,
      timezone: stored.timezone ?? prev.timezone,
      pictureDataUrl: stored.pictureDataUrl ?? prev.pictureDataUrl,
    }));
  }, []);

  const onChange = (key) => (e) => {
    setStatus("");
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, pictureDataUrl: String(reader.result || "") }));
      setStatus("");
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const fullName = form.fullName.trim();
    if (!fullName) {
      setStatus("Full Name is required.");
      return;
    }

    localStorage.setItem("name", fullName);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        phone: form.phone,
        currency: form.currency,
        timezone: form.timezone,
        pictureDataUrl: form.pictureDataUrl,
      })
    );

    setIsEditing(false);
    setStatus("Changes saved.");

    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div className="dashboard settings-shell">
      <Sidebar />

      <main className="content settings-content">
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
              <h2>Profile</h2>
            </div>

            <div className="settings-section">
              <div className="settings-profile-top">
                <div className="settings-profile-left">
                  <div className="settings-avatar-lg">
                    {form.pictureDataUrl ? (
                      <img src={form.pictureDataUrl} alt="Profile" />
                    ) : (
                      <span>{(form.fullName || "U").slice(0, 1).toUpperCase()}</span>
                    )}
                  </div>

                  <div className="settings-note settings-note-inline">
                    Hi DHONTHULA SAIRAM, you can update your profile details below.
                  </div>
                </div>
              </div>

              <div className="settings-form-grid">
                <label className="settings-field">
                  <span>Full Name</span>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={onChange("fullName")}
                    disabled={!isEditing}
                    placeholder="Your name"
                  />
                </label>

                <label className="settings-field">
                  <span>Email (read-only)</span>
                  <input type="text" value={email} disabled placeholder="your@email.com" />
                </label>

                <label className="settings-field">
                  <span>Phone Number</span>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={onChange("phone")}
                    disabled={!isEditing}
                    placeholder="e.g. +91 98765 43210"
                  />
                </label>

                <label className="settings-field">
                  <span>Currency Preference</span>
                  <select
                    className="settings-select"
                    value={form.currency}
                    onChange={onChange("currency")}
                    disabled={!isEditing}
                  >
                    <option value="₹">₹ (INR)</option>
                    <option value="$">$ (USD)</option>
                  </select>
                </label>

                <label className="settings-field">
                  <span>Timezone</span>
                  <select
                    className="settings-select"
                    value={form.timezone}
                    onChange={onChange("timezone")}
                    disabled={!isEditing}
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">America/New_York</option>
                    <option value="Europe/London">Europe/London</option>
                    <option value="Asia/Singapore">Asia/Singapore</option>
                  </select>
                </label>

                <label className="settings-field">
                  <span>Profile Picture (optional)</span>
                  <input type="file" accept="image/*" onChange={handleUpload} disabled={!isEditing} />
                </label>
              </div>

              {status ? <div className="settings-status">{status}</div> : null}

              <div className="settings-page-actions">
                <button
                  type="button"
                  className="settings-secondary"
                  onClick={() => {
                    setIsEditing((v) => !v);
                    setStatus("");
                  }}
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>

                <button
                  type="button"
                  className="settings-primary"
                  onClick={handleSave}
                  disabled={!isEditing}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Profile;
