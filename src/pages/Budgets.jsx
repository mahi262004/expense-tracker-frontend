import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
  getTags,
  getTransactions,
} from "../api";

function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [tags, setTags] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [tag, setTag] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/signin");
      return;
    }
    loadBudgets();
    loadTags();
    loadTransactions();
  }, []);

  const loadBudgets = () => {
    getBudgets(token)
      .then((res) => setBudgets(res.data))
      .catch((err) => console.log(err));
  };

  const loadTags = () => {
    getTags(token)
      .then((res) => setTags(res.data))
      .catch((err) => console.log(err));
  };

  const loadTransactions = () => {
    getTransactions(token)
      .then((res) => setTransactions(res.data))
      .catch((err) => console.log(err));
  };

  const resetForm = () => {
    setTag("");
    setAmount("");
    setSelectedMonth("");
    setSelectedYear("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!tag || !selectedMonth || !selectedYear) {
      setError("Please select a tag, month, and year");
      return;
    }

    const monthDate = new Date(`${selectedYear}-${selectedMonth}-01`);
    const payload = { tag, amount: Number(amount), month: monthDate };

    try {
      if (editingId) {
        await updateBudget(editingId, payload, token);
      } else {
        await createBudget(payload, token);
      }
      resetForm();
      loadBudgets();
    } catch (err) {
      setError(
        editingId
          ? "Failed to update budget"
          : "Failed to add budget. (You may already have a budget for this tag/month)"
      );
    }
  };

  const handleEditClick = (b) => {
    setEditingId(b._id);
    setTag(b.tag?._id || b.tag);
    setAmount(b.amount);
    const d = new Date(b.month);
    setSelectedMonth(String(d.getMonth() + 1).padStart(2, "0"));
    setSelectedYear(String(d.getFullYear()));
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this budget? This cannot be undone.");
    if (!confirmed) return;

    try {
      await deleteBudget(id, token);
      loadBudgets();
    } catch (err) {
      setError("Failed to delete budget");
    }
  };

  
  const getSpentForBudget = (budgetTagId, budgetMonth) => {
    const budgetMonthStr = new Date(budgetMonth).toISOString().slice(0, 7); 

    return transactions
      .filter((t) => {
        const tTagId = t.tag?._id || t.tag;
        const tMonthStr = new Date(t.date).toISOString().slice(0, 7);
        return (
          tTagId === budgetTagId &&
          tMonthStr === budgetMonthStr &&
          t.type === "expense"
        );
      })
      .reduce((sum, t) => sum + t.value, 0);
  };

  return (
    <div>
      <h1>Budgets</h1>

      <form onSubmit={handleSubmit}>
        <select value={tag} onChange={(e) => setTag(e.target.value)} required>
          <option value="">Select tag</option>
          {tags.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Budget amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          required
        >
          <option value="">Month</option>
          <option value="01">January</option>
          <option value="02">February</option>
          <option value="03">March</option>
          <option value="04">April</option>
          <option value="05">May</option>
          <option value="06">June</option>
          <option value="07">July</option>
          <option value="08">August</option>
          <option value="09">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          required
        >
          <option value="">Year</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
          <option value="2027">2027</option>
        </select>

        <button type="submit">{editingId ? "Update Budget" : "Set Budget"}</button>
        {editingId && (
          <button type="button" onClick={handleCancelEdit}>
            Cancel
          </button>
        )}
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {tags.length === 0 && (
        <p>
          You have no tags yet. Go to the <a href="/tags">Tags</a> page first.
        </p>
      )}

      <h2>Your Budgets</h2>
      {budgets.length === 0 ? (
        <p>No budgets set yet</p>
      ) : (
        budgets.map((b) => {
          const spent = getSpentForBudget(b.tag?._id || b.tag, b.month);
          const remaining = b.amount - spent;
          const percentUsed = Math.min((spent / b.amount) * 100, 100);

          return (
            <div key={b._id} style={{ marginBottom: "12px" }}>
              <strong>{b.tag?.name || "Unknown tag"}</strong> —{" "}
              {new Date(b.month).toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
              <div>
                Budget: ₹{b.amount} | Spent: ₹{spent} | Remaining: ₹{remaining}
              </div>
              <div
                style={{
                  background: "#eee",
                  height: "10px",
                  width: "300px",
                  borderRadius: "4px",
                }}
              >
                <div
                  style={{
                    background: remaining < 0 ? "red" : "green",
                    height: "10px",
                    width: `${percentUsed}%`,
                    borderRadius: "4px",
                  }}
                ></div>
              </div>
              {remaining < 0 && (
                <p style={{ color: "red" }}>Over budget by ₹{Math.abs(remaining)}!</p>
              )}
              <button onClick={() => handleEditClick(b)}>Edit</button>
              <button onClick={() => handleDelete(b._id)} style={{ marginLeft: "4px" }}>
                Delete
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}

export default Budgets;