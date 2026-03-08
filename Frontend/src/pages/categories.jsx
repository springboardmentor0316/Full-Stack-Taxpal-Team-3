import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import SettingsMenu from "../components/SettingsMenu";
import { FiPlus, FiX } from "react-icons/fi";
import "../styles/categories.css";

const COLORS = [
  "#2d7ff9", // Blue
  "#16a34a", // Green
  "#dc2626", // Red
  "#f59e0b", // Amber
  "#7c3aed", // Violet
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#f97316", // Orange
  "#64748b", // Slate
];

function Categories() {
  const [activeTab, setActiveTab] = useState("expense");
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    color: COLORS[Math.floor(Math.random() * COLORS.length)]
  });
  const [formError, setFormError] = useState("");

  const token = localStorage.getItem("token");

  /* ================= FETCH CATEGORIES ================= */
  const fetchCategories = async () => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/categories?type=${activeTab}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok) setCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [activeTab]);

  /* ================= ADD CATEGORY ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = form.name.trim();

    if (!name) {
      setFormError("Please enter a category name.");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          color: form.color,
          type: activeTab,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        setFormError(err.message || "Failed to add category");
        return;
      }

      setForm({
        name: "",
        color: COLORS[Math.floor(Math.random() * COLORS.length)]
      });
      setFormError("");
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      setFormError("Server error");
    }
  };

  /* ================= DELETE CATEGORY ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await fetch(`http://localhost:4000/api/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCategories();
    } catch (err) {
      console.error("Failed to delete category");
    }
  };

  return (
    <div className="dashboard settings-shell">
      <Sidebar />

      <main className="content settings-content">
        {/* HEADER */}
        <div className="settings-header">
          <div>
            <h1 className="settings-title">Settings</h1>
            <p className="subtitle">
              Manage your account settings and preferences
            </p>
          </div>
        </div>

        <div className="settings-body">
          <SettingsMenu />

          {/* RIGHT PANEL */}
          <section className="settings-panel">
            <div className="settings-panel-head">
              <h2>Category Management</h2>

              <div className="settings-tabs">
                <button
                  className={`settings-tab ${activeTab === "expense" ? "active" : ""
                    }`}
                  onClick={() => setActiveTab("expense")}
                >
                  Expense Categories
                </button>
                <button
                  className={`settings-tab ${activeTab === "income" ? "active" : ""
                    }`}
                  onClick={() => setActiveTab("income")}
                >
                  Income Categories
                </button>
              </div>
            </div>

            {/* CATEGORY LIST */}
            <div className="settings-list">
              {categories.length === 0 ? (
                <div className="settings-empty">No categories yet.</div>
              ) : (
                categories.map((cat) => (
                  <div className="settings-row" key={cat._id}>
                    <div className="settings-row-left">
                      <span
                        className="settings-dot"
                        style={{ background: cat.color || "#2d7ff9" }}
                      />
                      <span className="settings-row-name">{cat.name}</span>
                    </div>

                    <div className="settings-row-actions">
                      <button
                        className="settings-icon danger"
                        onClick={() => handleDelete(cat._id)}
                        title="Delete"
                      >
                        <FiX />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="settings-footer">
              <button
                className="settings-add"
                onClick={() => setIsModalOpen(true)}
              >
                <FiPlus /> Add New Category
              </button>
            </div>
          </section>
        </div>

        {/* MODAL */}
        {isModalOpen && (
          <div
            className="settings-modal-backdrop"
            onMouseDown={() => setIsModalOpen(false)}
          >
            <div
              className="settings-modal"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="settings-modal-head">
                <h3>Add New Category</h3>
                <button
                  className="settings-x"
                  onClick={() => setIsModalOpen(false)}
                >
                  ×
                </button>
              </div>

              <form className="settings-form" onSubmit={handleSubmit}>
                <label className="settings-field">
                  <span>Name</span>
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    placeholder="e.g. Utilities"
                    autoFocus
                  />
                </label>

                <div className="settings-field">
                  <span>Color</span>
                  <div className="color-presets">
                    {COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        className={`color-preset-btn ${form.color === c ? "active" : ""
                          }`}
                        style={{ background: c }}
                        onClick={() => setForm({ ...form, color: c })}
                        title={c}
                      />
                    ))}
                    <div className="color-picker-wrapper">
                      <input
                        type="color"
                        className="color-picker-input"
                        value={COLORS.includes(form.color) ? "#ffffff" : form.color}
                        onChange={(e) =>
                          setForm({ ...form, color: e.target.value })
                        }
                        title="Custom Color"
                      />
                    </div>
                  </div>
                </div>

                {formError && (
                  <div className="settings-form-error">{formError}</div>
                )}

                <div className="settings-form-actions">
                  <button
                    type="button"
                    className="settings-secondary"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="settings-primary">
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Categories;
