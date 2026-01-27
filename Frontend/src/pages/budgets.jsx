import { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import BudgetModal from "../components/BudgetModal";
import "../styles/budgets.css";

function formatCurrencyINR(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function getStatus(remaining, amount) {
  if (remaining < 0) return { label: "Over", tone: "danger" };
  if (remaining <= amount * 0.25) return { label: "Warning", tone: "warning" };
  return { label: "Good", tone: "success" };
}

function Budgets() {
  const [budgets, setBudgets] = useState([
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
  ]);

  const [openBudgetModal, setOpenBudgetModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  /* ===== TOTALS ===== */
  const totals = useMemo(() => {
    const totalBudget = budgets.reduce((s, b) => s + b.amount, 0);
    const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
    return {
      totalBudget,
      totalSpent,
      remaining: totalBudget - totalSpent,
    };
  }, [budgets]);

  const overallStatus = getStatus(
    totals.remaining,
    totals.totalBudget
  ).label;

  /* ===== SAVE ===== */
  const handleSave = (data) => {
    if (editingBudget) {
      setBudgets((prev) =>
        prev.map((b) =>
          b.id === editingBudget.id ? { ...b, ...data } : b
        )
      );
    } else {
      setBudgets((prev) => [
        {
          id: Date.now().toString(),
          spent: 0,
          ...data,
        },
        ...prev,
      ]);
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="page-content">
        {/* ===== HEADER ===== */}
        <div className="budget-header">
          <div>
            <h1>Budgets</h1>
            <p className="subtitle">Set budgets and track spending</p>
          </div>

          <button
            className="add-budget-btn"
            onClick={() => {
              setEditingBudget(null);
              setOpenBudgetModal(true);
            }}
          >
            + Create Budget
          </button>
        </div>

        {/* ===== SUMMARY ===== */}
        <div className="budget-summary-cards">
          <div className="summary-card">
            <span>Total Budget</span>
            <b>{formatCurrencyINR(totals.totalBudget)}</b>
          </div>

          <div className="summary-card">
            <span>Spent</span>
            <b className="red">{formatCurrencyINR(totals.totalSpent)}</b>
          </div>

          <div className="summary-card">
            <span>Remaining</span>
            <b className={totals.remaining >= 0 ? "green" : "red"}>
              {formatCurrencyINR(totals.remaining)}
            </b>
          </div>

          <div className="summary-card">
            <span>Status</span>
            <b>{overallStatus}</b>
          </div>
        </div>

        {/* ===== TABLE ===== */}
        <div className="budget-table-card">
          <table className="budget-table">
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
              {budgets.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty">
                    No budgets created yet
                  </td>
                </tr>
              ) : (
                budgets.map((b) => {
                  const remaining = b.amount - b.spent;
                  const status = getStatus(remaining, b.amount);

                  return (
                    <tr key={b.id}>
                      <td>
                        <b>{b.category}</b>
                        <div className="muted">{b.month}</div>
                      </td>
                      <td>{formatCurrencyINR(b.amount)}</td>
                      <td className="red">
                        {formatCurrencyINR(b.spent)}
                      </td>
                      <td className={remaining >= 0 ? "green" : "red"}>
                        {formatCurrencyINR(remaining)}
                      </td>
                      <td>
                        <span className={`pill ${status.tone}`}>
                          {status.label}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            setEditingBudget(b);
                            setOpenBudgetModal(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="danger"
                          onClick={() =>
                            setBudgets((prev) =>
                              prev.filter((x) => x.id !== b.id)
                            )
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* ===== MODAL ===== */}
      <BudgetModal
        isOpen={openBudgetModal}
        onClose={() => setOpenBudgetModal(false)}
        initialData={editingBudget}
        onSave={handleSave}
      />
    </div>
  );
}

export default Budgets;
