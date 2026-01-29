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
  const [activeMode, setActiveMode] = useState("edit");
const totalIncome = transactions
  .filter(t => t.type === "income")
  .reduce((sum, t) => sum + t.amount, 0);

const totalExpense = transactions
  .filter(t => t.type === "expense")
  .reduce((sum, t) => sum + t.amount, 0);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "http://localhost:4000/api/transactions",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok) setTransactions(data);
    } catch (err) {
      console.error("Failed to fetch transactions");
    }
  };

  const openEdit = (t) => {
    setActiveTransaction(t);
    setActiveMode("edit");
  };

  const closeActive = () => {
    setActiveTransaction(null);
    setActiveMode("edit");
  };

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

      if (!res.ok) {
        console.error("Failed to delete transaction");
        return;
      }

      fetchTransactions();
    } catch (err) {
      console.error("Failed to delete transaction");
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filtered = transactions.filter((t) =>
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
{/* QUICK SUMMARY */}
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
                        className="icon-btn edit"
                        type="button"
                        onClick={() => openEdit(t)}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="icon-btn delete"
                        type="button"
                        onClick={() => handleDelete(t)}
                        title="Delete"
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

        {/* MODALS */}
        {openIncomeModal && (
          <IncomeModal
           isOpen={openIncomeModal}
            onClose={() => setOpenIncomeModal(false)}
            onSuccess={fetchTransactions}
          />
        )}

       {openExpenseModal && (
  <ExpenseModal
    isOpen={openExpenseModal}
    onClose={() => setOpenExpenseModal(false)}
    onSuccess={fetchTransactions}
  />
)}

        {activeTransaction?.type === "income" && (
          <IncomeModal
            isOpen={Boolean(activeTransaction)}
            onClose={closeActive}
            onSuccess={fetchTransactions}
            initialData={activeTransaction}
            readOnly={activeMode === "view"}
          />
        )}

        {activeTransaction?.type === "expense" && (
          <ExpenseModal
            isOpen={Boolean(activeTransaction)}
            onClose={closeActive}
            onSuccess={fetchTransactions}
            initialData={activeTransaction}
            readOnly={activeMode === "view"}
          />
        )}

      </main>
    </div>
  );
}

export default Transactions;
