import {
  FaHome,
  FaMoneyBillWave,
  FaReceipt,
  FaChartPie,
  FaCog,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <div>
        <h2 className="logo">TaxPal</h2>
        <p className="tagline">Financial Manager</p>

        <nav className="menu">
          <button onClick={() => navigate("/dashboard")}>
            <FaHome /> Dashboard
          </button>

          <button onClick={() => navigate("/income")}>
            <FaMoneyBillWave /> Income
          </button>

          <button onClick={() => navigate("/expenses")}>
            <FaReceipt /> Expenses
          </button>

          <button onClick={() => navigate("/budgets")}>
            <FaChartPie /> Budgets
          </button>

          <button onClick={() => navigate("/reports")}>
            <FaReceipt /> Reports
          </button>

          <button onClick={() => navigate("/settings/categories")}>
            <FaCog /> Settings
          </button>
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="profile">
          <FaUserCircle size={36} />
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
  );
}

export default Sidebar;
