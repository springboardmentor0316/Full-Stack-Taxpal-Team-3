import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit2, FiX, FiPlus, FiUser, FiTag, FiBell, FiLock, FiSettings } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import "../styles/categories.css";

function makeId() {
  return `c_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

const DEFAULT_EXPENSE_CATEGORIES = [
  { id: "e1", name: "Business Expenses", color: "#e74c3c" },
  { id: "e2", name: "Office Rent", color: "#2d7ff9" },
  { id: "e3", name: "Software Subscriptions", color: "#7c4dff" },
  { id: "e4", name: "Professional Development", color: "#2fb3a3" },
  { id: "e5", name: "Marketing", color: "#f39c12" },
  { id: "e6", name: "Travel", color: "#e056fd" },
  { id: "e7", name: "Meals & Entertainment", color: "#4b7bec" },
  { id: "e8", name: "Utilities", color: "#ff4757" },
];

const DEFAULT_INCOME_CATEGORIES = [
  { id: "i1", name: "Salary", color: "#2fb3a3" },
  { id: "i2", name: "Freelance", color: "#2d7ff9" },
  { id: "i3", name: "Investments", color: "#7c4dff" },
];

function Categories() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("expense");
  const [expenseCategories, setExpenseCategories] = useState(
    DEFAULT_EXPENSE_CATEGORIES
  );
  const [incomeCategories, setIncomeCategories] = useState(
    DEFAULT_INCOME_CATEGORIES
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", color: "#2d7ff9" });
  const [formError, setFormError] = useState("");

  const current = useMemo(() => {
    return activeTab === "expense" ? expenseCategories : incomeCategories;
  }, [activeTab, expenseCategories, incomeCategories]);

  const setCurrent = (updater) => {
    if (activeTab === "expense") setExpenseCategories(updater);
    else setIncomeCategories(updater);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const userName = "Infosys admin";
  const userEmail = "infosys.admin@example.com";
  const userInitials = "IA";

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", color: "#2d7ff9" });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setForm({ name: cat.name || "", color: cat.color || "#2d7ff9" });
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditing(null);
    setFormError("");
  };

  const onChange = (key) => (e) => {
    if (formError) setFormError("");
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const name = String(form.name || "").trim();
    if (!name) {
      setFormError("Please enter a category name.");
      return;
    }

    const normalized = name.toLowerCase();
    const exists = current.some((c) => c.id !== editing?.id && c.name.toLowerCase() === normalized);
    if (exists) {
      setFormError("This category already exists.");
      return;
    }

    if (editing) {
      setCurrent((prev) =>
        prev.map((c) =>
          c.id === editing.id ? { ...c, name, color: form.color } : c
        )
      );
    } else {
      setCurrent((prev) => [{ id: makeId(), name, color: form.color }, ...prev]);
    }

    setIsModalOpen(false);
  };

  const removeCategory = (id) => {
    setCurrent((prev) => prev.filter((c) => c.id !== id));
  };
  useEffect(() => {
    const savedExpense = localStorage.getItem("expenseCategories");
    const savedIncome = localStorage.getItem("incomeCategories");

    if (savedExpense) setExpenseCategories(JSON.parse(savedExpense));
    if (savedIncome) setIncomeCategories(JSON.parse(savedIncome));
  }, []);

  useEffect(() => {
    localStorage.setItem("expenseCategories", JSON.stringify(expenseCategories));
  }, [expenseCategories]);

  useEffect(() => {
    localStorage.setItem("incomeCategories", JSON.stringify(incomeCategories));
  }, [incomeCategories]);

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
          <section className="settings-menu">
            <button className="settings-menu-item" type="button">
              <FiUser /> Profile
            </button>
            <button className="settings-menu-item active" type="button">
              <FiTag /> Categories
            </button>
            <button className="settings-menu-item" type="button">
              <FiBell /> Notifications
            </button>
            <button className="settings-menu-item" type="button">
              <FiLock /> Security
            </button>
          </section>

          <section className="settings-panel">
            <div className="settings-panel-head">
              <h2>Category Management</h2>

              <div className="settings-tabs" role="tablist" aria-label="Category type">
                <button
                  className={`settings-tab ${activeTab === "expense" ? "active" : ""}`}
                  onClick={() => setActiveTab("expense")}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "expense"}
                >
                  Expense Categories
                </button>
                <button
                  className={`settings-tab ${activeTab === "income" ? "active" : ""}`}
                  onClick={() => setActiveTab("income")}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "income"}
                >
                  Income Categories
                </button>
              </div>
            </div>

            <div className="settings-list">
              {current.map((cat) => (
                <div className="settings-row" key={cat.id}>
                  <div className="settings-row-left">
                    <span
                      className="settings-dot"
                      style={{ background: cat.color }}
                      aria-hidden="true"
                    />
                    <span className="settings-row-name">{cat.name}</span>
                  </div>

                  <div className="settings-row-actions">
                    <button
                      className="settings-icon"
                      onClick={() => openEdit(cat)}
                      type="button"
                      aria-label={`Edit ${cat.name}`}
                      title="Edit"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className="settings-icon danger"
                      onClick={() => removeCategory(cat.id)}
                      type="button"
                      aria-label={`Delete ${cat.name}`}
                      title="Delete"
                    >
                      <FiX />
                    </button>
                  </div>
                </div>
              ))}

              {current.length === 0 ? (
                <div className="settings-empty">No categories yet.</div>
              ) : null}
            </div>

            <div className="settings-footer">
              <button className="settings-add" onClick={openCreate} type="button">
                <FiPlus /> + Add New Category
              </button>
            </div>
          </section>
        </div>

        {isModalOpen ? (
          <div className="settings-modal-backdrop" onMouseDown={closeModal}>
            <div
              className="settings-modal"
              onMouseDown={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={editing ? "Edit category" : "Add new category"}
            >
              <div className="settings-modal-head">
                <h3>{editing ? "Edit Category" : "Add New Category"}</h3>
                <button className="settings-x" onClick={closeModal} aria-label="Close">
                  ×
                </button>
              </div>

              <form className="settings-form" onSubmit={onSubmit}>
                <label className="settings-field">
                  <span>Name</span>
                  <input
                    value={form.name}
                    onChange={onChange("name")}
                    placeholder="e.g., Office Rent"
                    autoFocus
                  />
                </label>

                <label className="settings-field">
                  <span>Color</span>
                  <input type="color" value={form.color} onChange={onChange("color")} />
                </label>

                <div className="settings-form-actions">
                  {formError ? <div className="settings-form-error">{formError}</div> : null}
                  <button type="button" className="settings-secondary" onClick={closeModal}>
                    Cancel
                  </button>
                  <button type="submit" className="settings-primary">
                    {editing ? "Save" : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : null}
      </main>
    </div>
    
  );
}

export default Categories;