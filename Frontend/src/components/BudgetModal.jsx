import { useEffect, useState } from "react";
import "../styles/expenseModal.css";

function BudgetModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    month: "",
    description: "",
  });

  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);

  /* ================= FETCH EXPENSE CATEGORIES ================= */
  const fetchExpenseCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "http://localhost:4000/api/categories?type=expense",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok) setCategories(data);
    } catch (err) {
      console.error("Failed to fetch budget categories");
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    fetchExpenseCategories();

    setFormData(
      initialData || {
        category: "",
        amount: "",
        month: "",
        description: "",
      }
    );

    setError("");
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.category || !formData.amount || !formData.month) {
      setError("Category, Amount and Month are required");
      return;
    }

    onSave({
      ...formData,
      amount: Number(formData.amount),
    });

    onClose();
  };

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalBox" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="modalHeader">
          <div>
            <h2>{initialData ? "Edit Budget" : "Create Budget"}</h2>
            <p>Set a monthly budget to track your spending.</p>
          </div>
          <button className="closeBtn" onClick={onClose}>✕</button>
        </div>

        {/* FORM */}
        <form className="modalForm" onSubmit={handleSubmit}>
          <h3>Budget Details</h3>

          <div className="twoCol">
            <div className="field">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Budget Amount</label>
              <input
                type="number"
                name="amount"
                placeholder="₹ 0"
                value={formData.amount}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="twoCol">
            <div className="field">
              <label>Month</label>
              <input
                type="month"
                name="month"
                value={formData.month}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="field">
            <label>Description (optional)</label>
            <textarea
              name="description"
              placeholder="Add notes for this budget"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {error && <p className="errorText">{error}</p>}

          <div className="modalActions">
            <button type="button" className="cancelBtn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="saveBtn">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BudgetModal;
