import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTags,
} from "../api";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [tags, setTags] = useState([]);
  const [transactionName, setTransactionName] = useState("");
  const [value, setValue] = useState("");
  const [type, setType] = useState("expense");
  const [tag, setTag] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null); // null = adding new, otherwise editing this id
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/signin");
      return;
    }
    loadTransactions();
    loadTags();
  }, []);

  const loadTransactions = () => {
    getTransactions(token)
      .then((res) => setTransactions(res.data))
      .catch((err) => console.log(err));
  };

  const loadTags = () => {
    getTags(token)
      .then((res) => setTags(res.data))
      .catch((err) => console.log(err));
  };

  const resetForm = () => {
    setTransactionName("");
    setValue("");
    setType("expense");
    setTag("");
    setDate("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!tag) {
      setError("Please select a tag");
      return;
    }

    const payload = {
      transactionName,
      value: Number(value),
      type,
      tag,
      date,
    };

    try {
      if (editingId) {
        
        await updateTransaction(editingId, payload, token);
      } else {
        
        await createTransaction(payload, token);
      }
      resetForm();
      loadTransactions();
    } catch (err) {
      setError(editingId ? "Failed to update transaction" : "Failed to add transaction");
    }
  };

  const handleEditClick = (t) => {
    setEditingId(t._id);
    setTransactionName(t.transactionName);
    setValue(t.value);
    setType(t.type);
    setTag(t.tag?._id || t.tag);
    
    setDate(new Date(t.date).toISOString().slice(0, 10));
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this transaction? This cannot be undone.");
    if (!confirmed) return;

    try {
      await deleteTransaction(id, token);
      loadTransactions();
    } catch (err) {
      setError("Failed to delete transaction");
    }
  };

  return (
    <div>
      <h1>Transactions</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Transaction name"
          value={transactionName}
          onChange={(e) => setTransactionName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <select value={tag} onChange={(e) => setTag(e.target.value)} required>
          <option value="">Select tag</option>
          {tags.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <button type="submit">{editingId ? "Update Transaction" : "Add Transaction"}</button>
        {editingId && (
          <button type="button" onClick={handleCancelEdit}>
            Cancel
          </button>
        )}
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {tags.length === 0 && (
        <p>
          You have no tags yet. Go to the <a href="/tags">Tags</a> page to
          create one before adding transactions.
        </p>
      )}

      <h2>All Transactions</h2>
      {transactions.length === 0 ? (
        <p>No transactions yet</p>
      ) : (
        transactions.map((t) => (
          <div key={t._id} style={{ marginBottom: "6px" }}>
            <span>{t.transactionName}</span>
            <span> | {t.tag?.name || "no tag"}</span>
            <span> | {t.type === "income" ? "+" : "-"}₹{t.value}</span>
            <span> | {new Date(t.date).toLocaleDateString()}</span>
            <button onClick={() => handleEditClick(t)} style={{ marginLeft: "10px" }}>
              Edit
            </button>
            <button onClick={() => handleDelete(t._id)} style={{ marginLeft: "4px" }}>
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Transactions;