import {
FaHome,
FaMoneyBillWave,
FaReceipt,
FaChartPie,
FaCog,
FaSignOutAlt,
FaUserCircle,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
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

{/* 🔥 TEXT LINKS (same as Dashboard) */}  
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
        <FaChartPie /> Budgets  
      </NavLink>  

      <NavLink to="/reports" className="menu-link">  
        <FaReceipt /> Reports  
      </NavLink>  

      <NavLink to="/settings/categories" className="menu-link">  
        <FaCog /> Settings  
      </NavLink>  
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