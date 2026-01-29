dashboard.jsx import "../styles/dashboard.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ExpenseModal from "../components/ExpenseModal";
import IncomeModal from "../components/IncomeModal"; // ✅ ADD THIS
import { NavLink } from "react-router-dom";
import SpendingChart from "../components/SpendingChart";

import {
  FaHome,
  FaMoneyBillWave,
  FaReceipt,
  FaCalculator,
  FaChartBar,
  FaUserCircle,
  FaSignOutAlt,
  FaBell,
  FaSearch,
  FaMoon,
  FaSun,
  FaCog,
} from "react-icons/fa";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => navigate("/");

  const [openExpenseModal, setOpenExpenseModal] = useState(false);
  const [openIncomeModal, setOpenIncomeModal] = useState(false); // ✅ ADD THIS
  /* ---------------- THEME ---------------- */
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme(theme === "light" ? "dark" : "light");

  /* ---------------- DATA ---------------- */
  const barData = [
    { month: "Aug", income: 400000, expense: 180000 },
    { month: "Sep", income: 420000, expense: 190000 },
    { month: "Oct", income: 450000, expense: 200000 },
    { month: "Nov", income: 470000, expense: 205000 },
    { month: "Dec", income: 480000, expense: 210000 },
  ];

  const pieData = [
    { name: "Rent", value: 12000 },
    { name: "Internet", value: 1200 },
    { name: "Utilities", value: 3500 },
    { name: "Software", value: 5000 },
  ];

  const COLORS = ["#2563eb", "#1e40af", "#3b82f6", "#60a5fa"];

  const transactions = [
    { date: "12 Jan 2026", title: "Freelance Payment", amount: 45000, type: "income" },
    { date: "10 Jan 2026", title: "Office Rent", amount: -12000, type: "expense" },
    { date: "08 Jan 2026", title: "Internet Bill", amount: -1200, type: "expense" },
    { date: "05 Jan 2026", title: "Consulting Fee", amount: 35000, type: "income" },
  ];
const [expenses, setExpenses] = useState([]);

useEffect(() => {
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

  fetchExpenses();
}, []);

  return (
    <div className="dashboard">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div>
          <h2 className="logo">TaxPal</h2>
          <p className="tagline">Financial Manager</p>

  <nav className="menu">
  <span onClick={() => navigate("/dashboard")}>
    <FaHome /> Dashboard
  </span>

  <span onClick={() => navigate("/transactions")}>
    <FaReceipt /> Transactions
  </span>

  <span onClick={() => navigate("/budgets")}>
    <FaReceipt /> Budgets
  </span>

    
  <span onClick={() => navigate("/taxestimator")}>
    <FaMoneyBillWave /> Tax Estimator
  </span>

  <span onClick={() => navigate("/reports")}>
    <FaReceipt /> Reports
  </span>

  <span onClick={() => navigate("/settings")}>
    <FaCog /> Settings
  </span>
</nav>


        </div>

        <div className="sidebar-footer">
          <div className="profile">
            <FaUserCircle />
            <div>
              <p className="name">Manasvi</p>
              <p className="email">manasvi@gmail.com</p>
            </div>
          </div>

          <button className="logout" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="content">
       {/* TOP HEADER */}
<div className="top-header">
  {/* LEFT */}
  <div className="header-left">
    <h2 className="page-title">Overview</h2>
  </div>

  {/* CENTER */}
  <div className="header-center">
  <div className="search-wrapper">           {/* ← new wrapper */}
    <FaSearch className="search-icon" />
    <input
      type="text"
      placeholder="Search for something"
      className="search-input"              
    />
  </div>
</div>

  {/* RIGHT */}
  <div className="header-right">
    <button className="icon-btn">
      <FaBell />
    </button>

    <button className="icon-btn" onClick={toggleTheme}>
      {theme === "light" ? <FaMoon /> : <FaSun />}
    </button>
  </div>
</div>

        {/* WELCOME */}
        <h1 className="welcome">Welcome back 👋</h1>
        <p className="subtitle">Here’s an overview of your financial activity</p>

        {/* CARDS */}
        <div className="cards">
          <div className="card">
            <FaMoneyBillWave className="card-icon" />
            <h3>Total Income</h3>
            <p className="amount income">₹4,80,000</p>
            <span className="trend up">▲ 2.5%</span>
          </div>

          <div className="card">
            <FaReceipt className="card-icon" />
            <h3>Total Expenses</h3>
            <p className="amount expense">₹2,10,000</p>
            <span className="trend down">▼ 5%</span>
          </div>

          <div className="card">
            <FaCalculator className="card-icon" />
            <h3>Estimated Tax</h3>
            <p className="amount">₹56,000</p>
          </div>

          <div className="card">
            <FaChartBar className="card-icon" />
            <h3>Savings</h3>
            <p className="amount income">₹2,14,000</p>
          </div>
        </div>

        {/* CHARTS */}
        <div className="charts-row">
         

  {/* LEFT: BAR CHART */}
  <div className="chart-card">
    <h3>Income vs Expenses</h3>
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={barData}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="income" fill="#2563eb" radius={[6, 6, 0, 0]} />
        <Bar dataKey="expense" fill="#93c5fd" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>

  {/* RIGHT: SPENDING PIE */}
  <SpendingChart expenses={expenses} />
</div>


        {/* TRANSACTIONS */}
        <div className="transactions">
  <div className="transactions-header">
    <h3 className="section-title">Recent Transactions</h3>
    <span className="view-all">View All</span>
  </div>

  <table className="transactions-table">
    <thead>
      <tr>
        <th>Date</th>
        <th>Description</th>
        <th>Category</th>
        <th>Amount</th>
        <th>Type</th>
      </tr>
    </thead>

    <tbody>
      {transactions.map((item, index) => (
        <tr key={index}>
          <td>{item.date}</td>
          <td>{item.title}</td>
          <td>{item.category || "Consulting"}</td>
          <td
            className={`amount ${
              item.amount > 0 ? "income" : "expense"
            }`}
          >
            {item.amount > 0 ? "+" : "-"}₹
            {Math.abs(item.amount).toLocaleString()}
          </td>
          <td>
            <span
              className={`type-badge ${
                item.amount > 0 ? "income" : "expense"
              }`}
            >
              {item.amount > 0 ? "Income" : "Expense"}
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
      </main>

        {/* ✅ EXPENSE MODAL */}
      <ExpenseModal
        isOpen={openExpenseModal}
        onClose={() => setOpenExpenseModal(false)}
        onSave={(data) => console.log("Expense Saved:", data)}
      />

      {/* ✅ INCOME MODAL */}
      <IncomeModal
        isOpen={openIncomeModal}
        onClose={() => setOpenIncomeModal(false)}
        onSave={(data) => console.log("Income Saved:", data)}
      />
    </div>
  );
}

export default Dashboard;
