import { useNavigate } from "react-router-dom";
import { FiSettings, FiX } from "react-icons/fi";
import "../styles/dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const userName = "Infosys admin";
  const userEmail = "infosys.admin@example.com";
  const userInitials = "IA";
  
  const logout = () => {
      localStorage.removeItem("token")
      localStorage.removeItem("userId")
      navigate("/login")
    }

  return (
    <div className="dashboard">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2 className="logo">TaxPal</h2>
        <nav>
          <a className="active">Dashboard</a>
          <a>Income</a>
          <a>Expenses</a>
          <a onClick={() => navigate("/budgets")}>Budgets</a>
          <a>Tax Estimator</a>
          <a>Reports</a>
          <a>Profile</a>
        </nav>

        <div className="settings-sidebar-footer">
          <div className="settings-user">
            <div className="settings-avatar" aria-hidden="true">
              {userInitials}
            </div>
            <div className="settings-user-meta">
              <div className="settings-user-name">{userName}</div>
              <div className="settings-user-email">{userEmail}</div>
            </div>
          </div>

          <div className="settings-footer-links">
            <button
              className="settings-footer-link"
              type="button"
              onClick={() => navigate("/settings/categories")}
            >
              <FiSettings /> Settings
            </button>
            <button className="settings-footer-link" type="button" onClick={logout}>
              <FiX /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="content">
        <h1>Welcome back 👋</h1>
        <p className="subtitle">
          Here’s an overview of your financial activity
        </p>

        {/* STATS CARDS */}
        <div className="cards">
          <div className="card">
            <h3>Total Income</h3>
            <p className="amount">₹4,80,000</p>
          </div>

          <div className="card">
            <h3>Total Expenses</h3>
            <p className="amount red">₹2,10,000</p>
          </div>

          <div className="card">
            <h3>Estimated Tax</h3>
            <p className="amount">₹56,000</p>
          </div>

          <div className="card">
            <h3>Savings</h3>
            <p className="amount green">₹2,14,000</p>
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="section">
          <h2>Recent Activity</h2>

          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>12 Jan 2026</td>
                <td>Freelance Payment</td>
                <td className="green">+ ₹45,000</td>
              </tr>
              <tr>
                <td>10 Jan 2026</td>
                <td>Office Rent</td>
                <td className="red">- ₹12,000</td>
              </tr>
              <tr>
                <td>08 Jan 2026</td>
                <td>Internet Bill</td>
                <td className="red">- ₹1,200</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;