import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import BudgetModal from "../components/BudgetModal";
import { FaEdit, FaTrash } from "react-icons/fa";
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
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [openBudgetModal, setOpenBudgetModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  /* ================= FETCH BUDGETS ================= */
  const fetchBudgets = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:4000/api/budgets", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) setBudgets(data);
  };

  /* ================= FETCH EXPENSES ================= */
  const fetchExpenses = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      "http://localhost:4000/api/transactions/expense",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    if (res.ok) setExpenses(data);
  };

  useEffect(() => {
    fetchBudgets();
    fetchExpenses();
  }, []);

  /* ================= CALCULATE SPENT ================= */
  const calculateSpentForBudget = (budget) => {
    return expenses
      .filter((e) => {
        const expenseMonth = e.date?.slice(0, 7);
        return (
          e.category?.trim().toLowerCase() ===
          budget.category?.trim().toLowerCase() &&
          expenseMonth === budget.month
        );
      })
      .reduce((sum, e) => sum + e.amount, 0);
  };

  /* ================= TOTALS ================= */
  const totals = useMemo(() => {
    const totalBudget = budgets.reduce((s, b) => s + b.amount, 0);
    const totalSpent = budgets.reduce(
      (s, b) => s + calculateSpentForBudget(b),
      0
    );

    return {
      totalBudget,
      totalSpent,
      remaining: totalBudget - totalSpent,
    };
  }, [budgets, expenses]);

  const overallStatus = getStatus(
    totals.remaining,
    totals.totalBudget
  ).label;

  /* ================= SAVE ================= */
  const handleSave = async (data) => {
    const token = localStorage.getItem("token");

    if (editingBudget) {
      await fetch(
        `http://localhost:4000/api/budgets/${editingBudget._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );
    } else {
      await fetch("http://localhost:4000/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
    }

    setOpenBudgetModal(false);
    setEditingBudget(null);
    fetchBudgets();
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:4000/api/budgets/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchBudgets();
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="page-content">
        {/* HEADER */}
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

        {/* SUMMARY */}
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

        {/* TABLE */}
        <div className="budget-table-card">
          <table className="budget-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Budget</th>
                <th>Spent</th>
                <th>Remaining</th>
                <th>Status</th>
                <th className="budget-actions-cell">Actions</th>
              </tr>
            </thead>

            <tbody>
              {budgets.map((b) => {
                const spent = calculateSpentForBudget(b);
                const remaining = b.amount - spent;
                const status = getStatus(remaining, b.amount);

                return (
                  <tr key={b._id}>
                    <td>
                      <b>{b.category}</b>
                      <div className="muted">{b.month}</div>
                    </td>
                    <td>{formatCurrencyINR(b.amount)}</td>
                    <td className="red">{formatCurrencyINR(spent)}</td>
                    <td className={remaining >= 0 ? "green" : "red"}>
                      {formatCurrencyINR(remaining)}
                    </td>
                    <td>
                      <span className={`pill ${status.tone}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="budget-actions-cell">
                      <button
                        className="action-btn edit"
                        onClick={() => {
                          setEditingBudget(b);
                          setOpenBudgetModal(true);
                        }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDelete(b._id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>

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
