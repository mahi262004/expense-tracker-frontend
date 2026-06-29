import { useEffect, useState } from "react";
import { createBudget, updateBudget, getTags } from "../api";
import "../styles/dashboard.css";

const MONTHS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

function AddBudgetModal({ onClose, onSaved, budgetItem }) {
  const isEditing = Boolean(budgetItem);

  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState(budgetItem?.tag?._id || budgetItem?.tag || "");
  const [amount, setAmount] = useState(budgetItem?.amount || "");
  const [selectedMonth, setSelectedMonth] = useState(
    budgetItem
      ? String(new Date(budgetItem.month).getMonth() + 1).padStart(2, "0")
      : ""
  );
  const [selectedYear, setSelectedYear] = useState(
    budgetItem ? String(new Date(budgetItem.month).getFullYear()) : ""
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    getTags(token)
      .then((res) => setTags(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");

    if (!tag || !selectedMonth || !selectedYear) {
      setError("Please select a tag, month, and year");
      return;
    }

    const monthDate = new Date(`${selectedYear}-${selectedMonth}-01`);
    const payload = { tag, amount: Number(amount), month: monthDate };

    setSaving(true);
    try {
      if (isEditing) {
        await updateBudget(budgetItem._id, payload, token);
      } else {
        await createBudget(payload, token);
      }
      onSaved();
    } catch (err) {
      setError(
        isEditing
          ? "Failed to update budget"
          : "Failed to add budget. You may already have one for this tag/month."
      );
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditing ? "Edit budget" : "Set budget"}
          </h2>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close"
            type="button"
          >
            <i className="ti ti-x" aria-hidden="true"></i>
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div className="modal-field">
            <label className="modal-label">Tag</label>
            <select
              className="modal-input"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              required
            >
              <option value="">Select tag</option>
              {tags.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-field">
            <label className="modal-label">Amount</label>
            <input
              className="modal-input"
              type="number"
              placeholder="2000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="modal-field-row">
            <div className="modal-field">
              <label className="modal-label">Month</label>
              <select
                className="modal-input"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                required
              >
                <option value="">Month</option>
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="modal-field">
              <label className="modal-label">Year</label>
              <select
                className="modal-input"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                required
              >
                <option value="">Year</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
              </select>
            </div>
          </div>

          {error && <div className="modal-error">{error}</div>}

          <button className="modal-save-btn" type="submit" disabled={saving}>
            {saving ? "Saving..." : isEditing ? "Update budget" : "Set budget"}
          </button>
        </form>

        {tags.length === 0 && (
          <p className="modal-hint">
            You have no tags yet, create one on the Tags page first.
          </p>
        )}
      </div>
    </div>
  );
}

export default AddBudgetModal;