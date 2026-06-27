import { useEffect, useState } from "react";
import { createTransaction, getTags } from "../api";
import "../styles/dashboard.css";

function AddExpenseModal({ onClose, onSaved }) {
  const [tags, setTags] = useState([]);
  const [transactionName, setTransactionName] = useState("");
  const [value, setValue] = useState("");
  const [type, setType] = useState("expense");
  const [tag, setTag] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
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

    if (!tag) {
      setError("Please select a tag");
      return;
    }

    setSaving(true);
    try {
      await createTransaction(
        { transactionName, value: Number(value), type, tag, date },
        token
      );
      onSaved();
    } catch (err) {
      setError("Failed to add expense. Try again.");
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Add expense</h2>
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
            <label className="modal-label">Name</label>
            <input
              className="modal-input"
              type="text"
              placeholder="Coffee with Sara"
              value={transactionName}
              onChange={(e) => setTransactionName(e.target.value)}
              required
            />
          </div>

          <div className="modal-field-row">
            <div className="modal-field">
              <label className="modal-label">Amount</label>
              <input
                className="modal-input"
                type="number"
                placeholder="180"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
              />
            </div>
            <div className="modal-field">
              <label className="modal-label">Type</label>
              <select
                className="modal-input"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>

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
            <label className="modal-label">Date</label>
            <input
              className="modal-input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {error && <div className="modal-error">{error}</div>}

          <button className="modal-save-btn" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save expense"}
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

export default AddExpenseModal;