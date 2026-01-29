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
  );
}

export default Sidebar;
