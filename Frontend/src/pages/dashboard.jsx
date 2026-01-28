import "../styles/dashboard.css";
import { useNavigate, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import ExpenseModal from "../components/ExpenseModal";
import IncomeModal from "../components/IncomeModal";
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
} from "recharts";

function Dashboard() {
  const navigate = useNavigate();
  const handleLogout = () => navigate("/");

  const [openExpenseModal, setOpenExpenseModal] = useState(false);
  const [openIncomeModal, setOpenIncomeModal] = useState(false);

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme(theme === "light" ? "dark" : "light");

  const barData = [
    { month: "Aug", income: 400000, expense: 180000 },
    { month: "Sep", income: 420000, expense: 190000 },
    { month: "Oct", income: 450000, expense: 200000 },
    { month: "Nov", income: 470000, expense: 205000 },
    { month: "Dec", income: 480000, expense: 210000 },
  ];

  const transactions = [
    { date: "12 Jan 2026", title: "Freelance Payment", amount: 45000 },
    { date: "10 Jan 2026", title: "Office Rent", amount: -12000 },
    { date: "08 Jan 2026", title: "Internet Bill", amount: -1200 },
    { date: "05 Jan 2026", title: "Consulting Fee", amount: 35000 },
  ];

  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "http://localhost:4000/api/transactions/expense",
        { headers: { Authorization: `Bearer ${token}` } }
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
            <NavLink to="/dashboard" className="menu-link">
              <FaHome /> Dashboard
            </NavLink>
            <NavLink to="/income" className="menu-link">
              <FaMoneyBillWave /> Income
            </NavLink>
            <NavLink to="/expenses" className="menu-link">
              <FaReceipt /> Expenses
            </NavLink>
            <NavLink to="/budgets" className="menu-link">
              <FaReceipt /> Budgets
            </NavLink>
            <NavLink to="/reports" className="menu-link">
              <FaReceipt /> Reports
            </NavLink>
            <NavLink to="/settings" className="menu-link">
              <FaCog /> Settings
            </NavLink>
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
        {/* HEADER */}
        <div className="top-header">
          <h2 className="page-title">Overview</h2>

          <div className="header-center">
            <div className="search-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search for something"
                className="search-input"
              />
            </div>
          </div>

          <div className="header-right">
            <button className="icon-btn">
              <FaBell />
            </button>
            <button className="icon-btn" onClick={toggleTheme}>
              {theme === "light" ? <FaMoon /> : <FaSun />}
            </button>
          </div>
        </div>

        <h1 className="welcome">Welcome back 👋</h1>
        <p className="subtitle">Here’s an overview of your financial activity</p>

        {/* CARDS */}
        <div className="cards">
          <div className="card">
            <FaMoneyBillWave className="card-icon" />
            <h3>Total Income</h3>
            <p className="amount income">₹4,80,000</p>
          </div>
          <div className="card">
            <FaReceipt className="card-icon" />
            <h3>Total Expenses</h3>
            <p className="amount expense">₹2,10,000</p>
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
                  <td>Consulting</td>
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

      <ExpenseModal
        isOpen={openExpenseModal}
        onClose={() => setOpenExpenseModal(false)}
      />
      <IncomeModal
        isOpen={openIncomeModal}
        onClose={() => setOpenIncomeModal(false)}
      />
    </div>
  );
}

export default Dashboard;