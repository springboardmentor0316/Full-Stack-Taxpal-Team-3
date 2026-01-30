import { useEffect, useState } from "react";
import "../styles/expenseModal.css";
const CATEGORY_OPTIONS = [
  "Housing",
  "Groceries",
  "Transport",
  "Utilities",
  "Dining",
  "Shopping",
  "Healthcare",
  "Entertainment",
  "Savings",
  "Other",
];

function ExpenseModal({
  isOpen,
  onClose,
  onSuccess,
  initialData = null,
  readOnly = false,
}) {
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    date: today,
    notes: "",
  });

  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);

  /* ================= FETCH BUDGET CATEGORIES ================= */
  const fetchBudgetCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/budgets", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        const uniqueCategories = [
          ...new Set(data.map((b) => b.category)),
        ];
        setCategories(uniqueCategories);
      }
    } catch (err) {
      console.error("Failed to fetch budget categories");
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchBudgetCategories();

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
        : "http://localhost:4000/api/transactions/expense";

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
        setError(
          isEditing ? "Failed to update expense" : "Failed to save expense"
        );
        return;
      }

      onSuccess();
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
            <h2>
              {readOnly
                ? "Expense Details"
                : initialData
                ? "Edit Expense"
                : "Record New Expense"}
            </h2>
            <p>
              {readOnly
                ? "Review your expense transaction details."
                : initialData
                ? "Update details about your expense transaction."
                : "Add details about your expense to track your spending better."}
            </p>
          </div>
          <button className="closeBtn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form className="modalForm" onSubmit={handleSubmit}>
          <h3>
            {readOnly ? "Expense" : initialData ? "Edit Expense" : "Add Expense"}
          </h3>

          <div className="twoCol">
            <div className="field">
              <label>Description</label>
              <input
                name="description"
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
    <option value="">Select category</option>
    {CATEGORY_OPTIONS.map((cat) => (
      <option key={cat} value={cat}>
        {cat}
      </option>
    ))}
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
            <label>Notes</label>
            <textarea
              name="notes"
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

export default ExpenseModal;
