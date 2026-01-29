import { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/taxestimator.css";

const INDIA_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const INDIA_UNION_TERRITORIES = [
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

const COUNTRIES = [
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Singapore",
  "United Arab Emirates",
  "Japan",
];

function TaxEstimator() {
  const [activeTab, setActiveTab] = useState("calculator"); // 'calculator' | 'calendar'
  const [form, setForm] = useState({
    country: "India",
    state: "",
    status: "Single",
    quarter: "Q1",
    income: "",
    business: "",
    retirement: "",
    insurance: "",
    homeOffice: "",
  });

  const [result, setResult] = useState(null);

  const calendarItems = useMemo(
    () => [
      {
        id: "jan-reminder",
        type: "reminder",
        title: "Reminder: Estimated Tax Payment Due Soon",
        date: "2026-01-18",
        description:
          "Your upcoming estimated tax payment is due on Jan 25, 2026. Review your income and deductions and prepare to file on time.",
      },
      {
        id: "jan-payment",
        type: "payment",
        title: "Estimated Tax Payment Due",
        date: "2026-01-25",
        description:
          "Payment due date for your current estimated tax period. Ensure you have sufficient funds and retain confirmation for your records.",
      },
    ],
    []
  );

  const groupedCalendar = useMemo(() => {
    const groups = new Map();
    for (const item of calendarItems) {
      const d = new Date(item.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const monthLabel = d.toLocaleString(undefined, {
        month: "long",
        year: "numeric",
      });

      if (!groups.has(key)) {
        groups.set(key, { key, label: monthLabel, items: [] });
      }
      groups.get(key).items.push(item);
    }

    return Array.from(groups.values()).sort((a, b) => a.key.localeCompare(b.key));
  }, [calendarItems]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "country" ? { state: "" } : null),
    }));
  };

  const handleCalculate = () => {
    const income = Number(form.income || 0);
    const deductions =
      Number(form.business || 0) +
      Number(form.retirement || 0) +
      Number(form.insurance || 0) +
      Number(form.homeOffice || 0);

    const taxableIncome = Math.max(income - deductions, 0);

    // Simple estimated tax logic (example: 15%)
    const estimatedTax = taxableIncome * 0.15;

    setResult({
      income,
      deductions,
      taxableIncome,
      estimatedTax,
    });
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="page-content">
        {/* HEADER */}
        <div className="tax-header">
          <div>
            <h1>{activeTab === "calendar" ? "Tax Calendar" : "Tax Estimator"}</h1>
            <p className="subtitle">
              {activeTab === "calendar"
                ? "Keep track of quarterly tax reminders"
                : "Calculate your estimated tax obligations"}
            </p>
          </div>

          <div className="tax-tabs" role="tablist" aria-label="Tax tools">
            <button
              type="button"
              className={`tax-tab ${activeTab === "calculator" ? "active" : ""}`}
              onClick={() => setActiveTab("calculator")}
              role="tab"
              aria-selected={activeTab === "calculator"}
            >
              Calculator
            </button>
            <button
              type="button"
              className={`tax-tab ${activeTab === "calendar" ? "active" : ""}`}
              onClick={() => setActiveTab("calendar")}
              role="tab"
              aria-selected={activeTab === "calendar"}
            >
              Calendar
            </button>
          </div>
        </div>

        <div className="tax-grid">
          {activeTab === "calculator" ? (
            <div className="tax-card">
              <h3>Quarterly Tax Calculator</h3>

              <div className="tax-row">
                <div className="tax-field">
                  <label>Country / Region</label>
                  <select
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                  >
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="tax-field">
                  <label>State / Union Territory</label>
                  {form.country === "India" ? (
                    <select
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <optgroup label="States">
                        {INDIA_STATES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Union Territories">
                        {INDIA_UNION_TERRITORIES.map((ut) => (
                          <option key={ut} value={ut}>
                            {ut}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  ) : (
                    <input
                      name="state"
                      placeholder="Enter state"
                      value={form.state}
                      onChange={handleChange}
                    />
                  )}
                </div>
              </div>

              <div className="tax-row">
                <div className="tax-field">
                  <label>Filing Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option>Single</option>
                  </select>
                </div>

                <div className="tax-field">
                  <label>Quarter</label>
                  <select
                    name="quarter"
                    value={form.quarter}
                    onChange={handleChange}
                  >
                    <option>Q1</option>
                    <option>Q2</option>
                    <option>Q3</option>
                    <option>Q4</option>
                  </select>
                </div>
              </div>

              <h3>Income</h3>

              <div className="tax-field">
                <label>Gross Income for Quarter</label>
                <input
                  type="number"
                  name="income"
                  placeholder="₹ 0"
                  value={form.income}
                  onChange={handleChange}
                />
              </div>

              <h3>Deductions</h3>

              <div className="tax-row">
                <div className="tax-field">
                  <label>Business Expenses</label>
                  <input
                    type="number"
                    name="business"
                    placeholder="₹ 0"
                    value={form.business}
                    onChange={handleChange}
                  />
                </div>

                <div className="tax-field">
                  <label>Retirement Contributions</label>
                  <input
                    type="number"
                    name="retirement"
                    placeholder="₹ 0"
                    value={form.retirement}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="tax-row">
                <div className="tax-field">
                  <label>Health Insurance Premiums</label>
                  <input
                    type="number"
                    name="insurance"
                    placeholder="₹ 0"
                    value={form.insurance}
                    onChange={handleChange}
                  />
                </div>

                <div className="tax-field">
                  <label>Home Office Deduction</label>
                  <input
                    type="number"
                    name="homeOffice"
                    placeholder="₹ 0"
                    value={form.homeOffice}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button className="tax-primary-btn" onClick={handleCalculate}>
                Calculate Estimated Tax
              </button>
            </div>
          ) : (
            <div className="tax-card">
              <h3>Tax Calendar</h3>

              <div className="tax-calendar">
                {groupedCalendar.map((group) => (
                  <div className="tax-calendar-section" key={group.key}>
                    <h4 className="tax-calendar-month">{group.label}</h4>
                    <div className="tax-calendar-list">
                      {group.items.map((item) => (
                        <div className="tax-calendar-item" key={item.id}>
                          <div className="tax-calendar-left">
                            <div className="tax-calendar-title">{item.title}</div>
                            <div className="tax-calendar-date">
                              {new Date(item.date).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </div>
                            <div className="tax-calendar-desc">{item.description}</div>
                          </div>

                          <span className={`tax-badge ${item.type}`}>
                            {item.type === "payment" ? "Payment" : "Reminder"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="tax-card tax-summary-card">
            <h3>Tax Summary</h3>

            {result ? (
              <>
                <div className="tax-row">
                  <div>
                    <p className="muted">Gross Income</p>
                    <b>₹ {result.income.toLocaleString()}</b>
                  </div>

                  <div>
                    <p className="muted">Total Deductions</p>
                    <b>₹ {result.deductions.toLocaleString()}</b>
                  </div>
                </div>

                <div className="tax-row">
                  <div>
                    <p className="muted">Taxable Income</p>
                    <b>₹ {result.taxableIncome.toLocaleString()}</b>
                  </div>

                  <div>
                    <p className="muted">Estimated Tax (15%)</p>
                    <b style={{ color: "#e74c3c" }}>
                      ₹ {result.estimatedTax.toLocaleString()}
                    </b>
                  </div>
                </div>
              </>
            ) : (
              <div className="tax-summary-empty">
                <div className="tax-summary-icon" aria-hidden="true" />
                <p className="muted">
                  Enter your income and deduction details to calculate your estimated quarterly tax.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default TaxEstimator;