import { useEffect, useState } from "react";
import "../styles/expenseModal.css";

function IncomeModal({ isOpen, onClose, onSuccess, initialData = null, readOnly = false }) {
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
      if (initialData) {
        const initialDate = initialData.date
          ? new Date(initialData.date).toISOString().split("T")[0]
          : today;

        setFormData({
          description: initialData.description || "",
          amount: initialData.amount ?? "",
          category: initialData.category || "",
          date: initialDate,
          notes: initialData.notes || "",
        });
      } else {
        setFormData({
          description: "",
          amount: "",
          category: "",
          date: today,
          notes: "",
        });
      }
      setError("");
    }
  }, [isOpen, initialData, today]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (readOnly) {
      onClose();
      return;
    }

    if (!formData.description || !formData.amount || !formData.category) {
      setError("Please fill Description, Amount and Category");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const isEditing = Boolean(initialData?._id);
      const url = isEditing
        ? `http://localhost:4000/api/transactions/${initialData._id}`
        : "http://localhost:4000/api/transactions/income";

      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
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
      });

      if (!res.ok) {
        setError(isEditing ? "Failed to update income" : "Failed to save income");
        return;
      }

      onSuccess(); // 🔥 refresh income list
      onClose();   // close modal
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalBox" onClick={(e) => e.stopPropagation()}>
        <div className="modalHeader">
          <div>
            <h2>
              {readOnly
                ? "Income Details"
                : initialData
                  ? "Edit Income"
                  : "Record New Income"}
            </h2>
            <p>
              {readOnly
                ? "Review your income transaction details."
                : initialData
                  ? "Update details about your income transaction."
                  : "Add details about your income to track your finances better."}
            </p>
          </div>

          <button className="closeBtn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form className="modalForm" onSubmit={handleSubmit}>
          <h3>
            {readOnly ? "Income" : initialData ? "Edit Income" : "Add Income"}
          </h3>

          <div className="twoCol">
            <div className="field">
              <label>Description</label>
              <input
                name="description"
                placeholder="e.g. Freelance Payment"
                value={formData.description}
                onChange={handleChange}
                disabled={readOnly}
              />
            </div>

            <div className="field">
              <label>Amount</label>
              <input
                name="amount"
                type="number"
                placeholder="₹ 0"
                value={formData.amount}
                onChange={handleChange}
                disabled={readOnly}
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
                disabled={readOnly}
              >
                <option value="">Select a category</option>
                <option value="Salary">Salary</option>
                <option value="Freelance">Freelance</option>
                <option value="Business">Business</option>
                <option value="Investment">Investment</option>
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
                disabled={readOnly}
              />
            </div>
          </div>

          <div className="field">
            <label>Notes (Optional)</label>
            <textarea
              name="notes"
              placeholder="Add any additional details..."
              value={formData.notes}
              onChange={handleChange}
              disabled={readOnly}
            />
          </div>

          {error && <p className="errorText">{error}</p>}

          <div className="modalActions">
            <button type="button" className="cancelBtn" onClick={onClose}>
              {readOnly ? "Close" : "Cancel"}
            </button>
            {!readOnly && (
              <button type="submit" className="saveBtn">
                {initialData ? "Update" : "Save"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default IncomeModal;
