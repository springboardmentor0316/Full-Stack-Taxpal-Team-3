import { useEffect, useState } from "react";
import ExpenseModal from "../components/ExpenseModal";
import Sidebar from "../components/Sidebar";
import "../styles/incomeModal.css"; // reuse same styles
import { FaEdit, FaTrash } from "react-icons/fa";

function Expenses() {
  const [openExpenseModal, setOpenExpenseModal] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // 🔹 fetch expenses from backend
  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "http://localhost:4000/api/transactions/expense",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok) setExpenses(data);
    } catch (err) {
      console.error("Failed to fetch expenses");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // 🔹 totals
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const avgExpense = expenses.length
    ? Math.round(totalExpense / expenses.length)
    : 0;

  // 🔹 SAFE filter logic
  const filteredExpenses = expenses.filter((item) => {
    const description = item.description || "";
    const category = item.category || "";

    const matchesSearch =
      description.toLowerCase().includes(search.toLowerCase()) ||
      category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="income-page">
        {/* HEADER */}
        <div className="income-header">
          <div>
            <h1>Expenses</h1>
            <p className="subtitle">Track and manage your expenses</p>
          </div>

          <button
            className="add-income-btn"
            onClick={() => setOpenExpenseModal(true)}
          >
            + Add Expense
          </button>
        </div>

        {/* SUMMARY */}
        <div className="income-summary">
          <div className="summary-card red">
            <span>Total Expense</span>
            <b>₹{totalExpense.toLocaleString()}</b>
          </div>

          <div className="summary-card">
            <span>Average Expense</span>
            <b>₹{avgExpense.toLocaleString()}</b>
          </div>

          <div className="summary-card">
            <span>Transactions</span>
            <b>{expenses.length}</b>
          </div>
        </div>

        {/* SEARCH + FILTER */}
        <div className="income-filters">
          <input
            type="text"
            placeholder="Search expense..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            {[...new Set(expenses.map((e) => e.category))].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* TABLE */}
        <div className="income-table-card">
          <table className="income-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th className="right">Amount</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty">
                    No expenses added yet
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((item) => (
                  <tr key={item._id}>
                    <td>{new Date(item.date).toLocaleDateString()}</td>
                    <td className="bold">{item.description}</td>

                    <td>
                      <span className="pill">{item.category}</span>
                    </td>

                    <td className="amount right red">
                      -₹{item.amount.toLocaleString()}
                    </td>

                    <td className="actions-col">
                      <button className="icon-btn edit">
                        <FaEdit />
                      </button>
                      <button className="icon-btn delete">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MODAL */}
        {openExpenseModal && (
          <ExpenseModal
            isOpen={openExpenseModal}
            onClose={() => setOpenExpenseModal(false)}
            onSuccess={fetchExpenses}
          />
        )}
      </main>
    </div>
  );
}

export default Expenses;