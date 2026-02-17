import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import IncomeModal from "../components/IncomeModal";
import ExpenseModal from "../components/ExpenseModal";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../styles/transactions.css";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [openIncomeModal, setOpenIncomeModal] = useState(false);
  const [openExpenseModal, setOpenExpenseModal] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTransaction, setActiveTransaction] = useState(null);

  /* ================= FETCH ================= */
  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setTransactions(data);
    } catch (err) {
      console.error("Failed to fetch transactions");
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  /* ================= TOTALS ================= */
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  /* ================= EDIT ================= */
  const openEdit = (t) => {
    setActiveTransaction(t);
  };

  const closeActive = () => {
    setActiveTransaction(null);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (t) => {
    const ok = window.confirm("Delete this transaction?");
    if (!ok) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:4000/api/transactions/${t._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) fetchTransactions();
    } catch (err) {
      console.error("Delete failed");
    }
  };

  /* ================= FILTER ================= */
  const filtered = transactions.filter(
    (t) =>
      t.description?.toLowerCase().includes(search.toLowerCase()) ||
      t.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="income-page">
        {/* HEADER */}
        <div className="income-header">
          <div>
            <h1>Transactions</h1>
            <p className="subtitle">
              Record and manage all your income & expenses
            </p>
          </div>

          <div className="header-actions">
            <button
              className="add-income-btn income"
              onClick={() => setOpenIncomeModal(true)}
            >
              + Record Income
            </button>

            <button
              className="add-income-btn expense"
              onClick={() => setOpenExpenseModal(true)}
            >
              + Record Expense
            </button>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="transaction-summary-bar">
          <div className="summary-item income">
            <span>Total Income</span>
            <b>₹{totalIncome.toLocaleString()}</b>
          </div>

          <div className="summary-item expense">
            <span>Total Expense</span>
            <b>₹{totalExpense.toLocaleString()}</b>
          </div>
        </div>

        {/* SEARCH */}
        <div className="income-filters">
          <input
            className="search-input"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* TABLE */}
        <div className="income-table-card">
          <table className="income-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Type</th>
                <th className="right">Amount</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty">
                    No transactions yet
                  </td>
                </tr>
              ) : (
                filtered.map((t) => (
                  <tr key={t._id}>
                    <td>{new Date(t.date).toLocaleDateString()}</td>
                    <td className="bold">{t.description}</td>
                    <td>
                      <span className="pill">{t.category}</span>
                    </td>
                    <td>
                      <span className={`type-pill ${t.type}`}>
                        {t.type}
                      </span>
                    </td>
                    <td className={`right amount ${t.type}`}>
                      {t.type === "income" ? "+" : "-"}₹
                      {t.amount.toLocaleString()}
                    </td>
                    <td className="actions-col">
                      <button
                        className="action-btn edit"
                        onClick={() => openEdit(t)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDelete(t)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* CREATE MODALS */}
        {openIncomeModal && (
          <IncomeModal
            isOpen
            onClose={() => setOpenIncomeModal(false)}
            onSuccess={fetchTransactions}
          />
        )}

        {openExpenseModal && (
          <ExpenseModal
            isOpen
            onClose={() => setOpenExpenseModal(false)}
            onSuccess={fetchTransactions}
          />
        )}

        {/* EDIT MODALS */}
        {activeTransaction?.type === "income" && (
          <IncomeModal
            isOpen
            initialData={activeTransaction}
            onClose={closeActive}
            onSuccess={fetchTransactions}
          />
        )}

        {activeTransaction?.type === "expense" && (
          <ExpenseModal
            isOpen
            initialData={activeTransaction}
            onClose={closeActive}
            onSuccess={fetchTransactions}
          />
        )}
      </main>
    </div>
  );
}

export default Transactions;
