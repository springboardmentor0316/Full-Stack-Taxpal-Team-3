import { useEffect, useState } from "react";
import IncomeModal from "../components/IncomeModal";
import Sidebar from "../components/Sidebar";
import "../styles/incomeModal.css";
import { FaEdit, FaTrash } from "react-icons/fa";

function Income() {
  const [openIncomeModal, setOpenIncomeModal] = useState(false);
  const [incomes, setIncomes] = useState([]);
 const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  

  // ✅ SAFE FILTER LOGIC
  const filteredIncomes = incomes.filter((item) => {
    const description = item.description || "";
    const category = item.category || "";

    const matchesSearch =
      description.toLowerCase().includes(search.toLowerCase()) ||
      category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || category === categoryFilter;

    return matchesSearch && matchesCategory;
  });
  const fetchIncome = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/transactions/income", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setIncomes(data);
    } catch (err) {
      console.error("Failed to fetch income");
    }
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
  const avgIncome = incomes.length
    ? Math.round(totalIncome / incomes.length)
    : 0;

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="income-page">
        {/* HEADER */}
        <div className="income-header">
          <div>
            <h1>Income</h1>
            <p className="subtitle">Track and manage your income sources</p>
          </div>

          <button
            className="add-income-btn"
            onClick={() => setOpenIncomeModal(true)}
          >
            + Add Income
          </button>
        </div>

        {/* SUMMARY */}
        <div className="income-summary">
          <div className="summary-card green">
            <span>Total Income</span>
            <b>₹{totalIncome.toLocaleString()}</b>
          </div>

          <div className="summary-card">
            <span>Average Income</span>
            <b>₹{avgIncome.toLocaleString()}</b>
          </div>

          <div className="summary-card">
            <span>Transactions</span>
            <b>{incomes.length}</b>
          </div>
        </div>
{/* SEARCH + FILTER */}
<div className="income-filters">
  <input
    type="text"
    placeholder="Search income..."
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
    {[...new Set(incomes.map((i) => i.category))].map((cat) => (
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
              {filteredIncomes.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty">
                    No income added yet
                  </td>
                </tr>
              ) : (
                filteredIncomes.map((item) => (
                  <tr key={item._id}>
  <td>{new Date(item.date).toLocaleDateString()}</td>

  <td className="bold">{item.description}</td>

  <td>
    <span className="pill">
      {item.category}
    </span>
  </td>

  <td className="amount right">
    +₹{item.amount.toLocaleString()}
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
        {openIncomeModal && (
          <IncomeModal
            isOpen={openIncomeModal}
            onClose={() => setOpenIncomeModal(false)}
            onSuccess={fetchIncome}
          />
        )}
      </main>
    </div>
  );
}

export default Income;
