import { useEffect, useState } from "react";
import "../styles/expenseModal.css";

function ExpenseModal({ isOpen, onClose, onSuccess }) {
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    date: today,
    notes: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setFormData({
        description: "",
        amount: "",
        category: "",
        date: today,
        notes: "",
      });
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.description || !formData.amount || !formData.category) {
      setError("Please fill Description, Amount and Category");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:4000/api/transactions/expense",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            description: formData.description,
            amount: Number(formData.amount),
            category: formData.category,
            date: formData.date,
            notes: formData.notes,
          }),
        }
      );

      if (!res.ok) {
        setError("Failed to save expense");
        return;
      }

      onSuccess(); // 🔥 reload expense list
      onClose();
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalBox" onClick={(e) => e.stopPropagation()}>
        <div className="modalHeader">
          <div>
            <h2>Record New Expense</h2>
            <p>Add details about your expense to track your spending better.</p>
          </div>
          <button className="closeBtn" onClick={onClose}>✕</button>
        </div>

        <form className="modalForm" onSubmit={handleSubmit}>
          <h3>Add Expense</h3>

          <div className="twoCol">
            <div className="field">
              <label>Description</label>
              <input
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Amount</label>
              <input
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="twoCol">
            <div className="field">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select a category</option>
                <option value="Food">Food</option>
                <option value="Rent">Rent</option>
                <option value="Travel">Travel</option>
                <option value="Utilities">Utilities</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="field">
              <label>Date</label>
              <input
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="field">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
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

export default ExpenseModal;
