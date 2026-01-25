import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSettings, FiX } from "react-icons/fi";
import "../styles/dashboard.css";
import "../styles/budgets.css";

const CATEGORY_OPTIONS = [
  "Housing",
  "Groceries",
  "Transport",
  "Utilities",
  "Dining",
  "Shopping",
  "Healthcare",
  "Entertainment",
  "Savings",
  "Other",
];

function formatCurrencyINR(value) {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(numberValue);
}

function getStatus(remaining, amount) {
  if (amount <= 0) return { label: "Draft", tone: "neutral" };
  if (remaining < 0) return { label: "Over", tone: "danger" };
  if (remaining <= amount * 0.25) return { label: "Warning", tone: "warning" };
  return { label: "Good", tone: "success" };
}

function Budgets() {
  const navigate = useNavigate();

  const userName = "Infosys admin";
  const userEmail = "infosys.admin@example.com";
  const userInitials = "IA";

  const [budgets, setBudgets] = useState(() => [
    {
      id: "b1",
      category: "Groceries",
      amount: 12000,
      spent: 4600,
      month: "2026-01",
      description: "Monthly groceries",
    },
    {
      id: "b2",
      category: "Transport",
      amount: 6000,
      spent: 2500,
      month: "2026-01",
      description: "Fuel + commute",
    },
    {
      id: "b3",
      category: "Dining",
      amount: 4000,
      spent: 3900,
      month: "2026-01",
      description: "Eating out",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    category: "",
    amount: "",
    month: "2026-01",
    description: "",
  });
  const [formError, setFormError] = useState("");

  const totals = useMemo(() => {
    const totalAmount = budgets.reduce((sum, b) => sum + Number(b.amount || 0), 0);
    const totalSpent = budgets.reduce((sum, b) => sum + Number(b.spent || 0), 0);
    const remaining = totalAmount - totalSpent;
    return { totalAmount, totalSpent, remaining };
  }, [budgets]);

  const overallStatus = useMemo(() => {
    const status = getStatus(totals.remaining, totals.totalAmount);
    return status.label;
  }, [totals]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ category: "", amount: "", month: "2026-01", description: "" });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEdit = (budget) => {
    setEditingId(budget.id);
    setForm({
      category: budget.category || "",
      amount: String(budget.amount ?? ""),
      month: budget.month || "2026-01",
      description: budget.description || "",
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setFormError("");
    setIsModalOpen(false);
  };

  const onChange = (key) => (e) => {
    if (formError) setFormError("");
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const amountNumber = Number.parseFloat(String(form.amount).trim());
    if (!form.category) {
      setFormError("Please select a category.");
      return;
    }
    if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
      setFormError("Please enter a valid budget amount greater than 0.");
      return;
    }

    if (editingId) {
      setBudgets((prev) =>
        prev.map((b) =>
          b.id === editingId
            ? {
                ...b,
                category: form.category,
                amount: amountNumber,
                month: form.month,
                description: form.description,
              }
            : b
        )
      );
    } else {
      const newBudget = {
        id: `b_${Date.now()}`,
        category: form.category,
        amount: amountNumber,
        spent: 0,
        month: form.month,
        description: form.description,
      };
      setBudgets((prev) => [newBudget, ...prev]);
    }

    setIsModalOpen(false);
  };

  const removeBudget = (id) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="dashboard budget-shell">
      <aside className="sidebar">
        <h2 className="logo">TaxPal</h2>
        <nav>
          <a onClick={() => navigate("/dashboard")}>Dashboard</a>
          <a>Transactions</a>
          <a className="active">Budgets</a>
          <a>Tax Estimator</a>
          <a>Reports</a>
          <a>Profile</a>
        </nav>

        <div className="settings-sidebar-footer">
          <div className="settings-user">
            <div className="settings-avatar" aria-hidden="true">
              {userInitials}
            </div>
            <div className="settings-user-meta">
              <div className="settings-user-name">{userName}</div>
              <div className="settings-user-email">{userEmail}</div>
            </div>
          </div>

          <div className="settings-footer-links">
            <button
              className="settings-footer-link"
              type="button"
              onClick={() => navigate("/settings/categories")}
            >
              <FiSettings /> Settings
            </button>
            <button className="settings-footer-link" type="button" onClick={logout}>
              <FiX /> Logout
            </button>
          </div>
        </div>
      </aside>

      <main className="content budget-content">
        <div className="budget-topbar">
          <div>
            <h1 className="budget-title">Budgets</h1>
            <p className="subtitle">Set budgets and track spending</p>
          </div>

          <div className="budget-health">
            <div className="budget-health-label">Budget Health</div>
            <div className="budget-health-value">{overallStatus}</div>
          </div>
        </div>

        <div className="budget-actions">
          <button className="budget-primary" onClick={openCreate}>
            Create New Budget
          </button>
          <div className="budget-summary">
            <div>
              <div className="budget-summary-label">Total Budget</div>
              <div className="budget-summary-value">
                {formatCurrencyINR(totals.totalAmount)}
              </div>
            </div>
            <div>
              <div className="budget-summary-label">Spent</div>
              <div className="budget-summary-value red">
                {formatCurrencyINR(totals.totalSpent)}
              </div>
            </div>
            <div>
              <div className="budget-summary-label">Remaining</div>
              <div
                className={`budget-summary-value ${
                  totals.remaining >= 0 ? "green" : "red"
                }`}
              >
                {formatCurrencyINR(totals.remaining)}
              </div>
            </div>
          </div>
        </div>

        <div className="section budget-table">
          <div className="budget-table-head">
            <h2>Budgets</h2>
          </div>

          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Budget</th>
                <th>Spent</th>
                <th>Remaining</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {budgets.map((b) => {
                const remaining = Number(b.amount || 0) - Number(b.spent || 0);
                const status = getStatus(remaining, Number(b.amount || 0));
                return (
                  <tr key={b.id}>
                    <td>
                      <div className="budget-cell-title">{b.category}</div>
                      <div className="budget-cell-sub">{b.month}</div>
                    </td>
                    <td>{formatCurrencyINR(b.amount)}</td>
                    <td className="red">{formatCurrencyINR(b.spent)}</td>
                    <td className={remaining >= 0 ? "green" : "red"}>
                      {formatCurrencyINR(remaining)}
                    </td>
                    <td>
                      <span className={`budget-pill ${status.tone}`}>
                        {status.label}
                      </span>
                    </td>
                    <td>
                      <div className="budget-row-actions">
                        <button
                          className="budget-secondary"
                          onClick={() => openEdit(b)}
                        >
                          Edit
                        </button>
                        <button
                          className="budget-danger"
                          onClick={() => removeBudget(b.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {budgets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="budget-empty">
                    No budgets yet. Create one to get started.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        {isModalOpen ? (
          <div className="budget-modal-backdrop" onMouseDown={closeModal}>
            <div
              className="budget-modal"
              onMouseDown={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={editingId ? "Edit budget" : "Create new budget"}
            >
              <div className="budget-modal-head">
                <h2>{editingId ? "Edit Budget" : "Create New Budget"}</h2>
                <button className="budget-x" onClick={closeModal} aria-label="Close">
                  ×
                </button>
              </div>

              <form onSubmit={onSubmit} className="budget-form">
                <div className="budget-grid">
                  <label className="budget-field">
                    <span>Category</span>
                    <select value={form.category} onChange={onChange("category")}>
                      <option value="">Select a category</option>
                      {CATEGORY_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="budget-field">
                    <span>Budget Amount</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="0"
                      value={form.amount}
                      onChange={onChange("amount")}
                    />
                  </label>

                  <label className="budget-field">
                    <span>Month</span>
                    <input
                      type="month"
                      value={form.month}
                      onChange={onChange("month")}
                    />
                  </label>

                  <label className="budget-field budget-full">
                    <span>Description (Optional)</span>
                    <textarea
                      placeholder="Add any additional details..."
                      value={form.description}
                      onChange={onChange("description")}
                      rows={3}
                    />
                  </label>
                </div>

                <div className="budget-form-actions">
                  {formError ? <div className="budget-form-error">{formError}</div> : null}
                  <button type="button" className="budget-secondary" onClick={closeModal}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="budget-primary"
                  >
                    {editingId ? "Save Changes" : "Create Budget"}
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

export default Budgets;
